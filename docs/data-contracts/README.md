# Data Contracts — AR Collections Agent
## Working Capital War Room (WCE Prototype)

> **Audience:** Developers, data engineers, SAP integration specialists  
> **Scope:** Data feeds consumed by the AR Collections Agent — scoped to the Delta Retail overdue collection scenario and supporting AR portfolio  
> **Reference date:** 07 April 2026 (all sample data is as-of this date)
>
> **Naming convention:** `fact_` prefix = transactional/event data (large volume, time-series); `dim_` prefix = reference/master data (small volume, slowly changing)

---

## Fact Tables

| File | Description | Primary SAP Source Table(s) | Refresh Cadence |
|------|-------------|----------------------------|-----------------|
| `fact_ar_open_items.csv` | All open (uncleared) AR line items | `BSID`, `BSEG` | Every 15 min (delta extract) |
| `fact_payment_history.csv` | Cleared AR items — 24-month payment behaviour | `BSAD`, `BSEG` | Daily @ 06:00 |
| `fact_collections_activity.csv` | SAP FSCM collection items, contacts & follow-ups | `UDMCASE`, `UDMCASEATTR`, `UDMNOTES` | Real-time (event webhook) |
| `fact_dunning_records.csv` | Dunning notices issued per customer/invoice | `MHNK`, `MHND` | Daily @ 06:30 |
| `fact_external_signals.csv` | External intelligence signals (treasury, D&B, credit) | External APIs (SEC EDGAR, Bloomberg, D&B) | Daily @ 06:00 |

## Dimension Tables

| File | Description | Primary SAP Source Table(s) | Refresh Cadence |
|------|-------------|----------------------------|-----------------|
| `dim_customer.csv` | Customer name, relationship manager, account status | `KNA1`, `KNB1` | Daily @ 06:00 |
| `dim_credit_profile.csv` | Credit limits, risk categories, blocks | `KNKK` | Daily @ 06:00 |
| `dim_payment_terms.csv` | SAP payment term codes and net-day rules | `T052`, `T052U` | On change (config) |
| `dim_dunning_procedure.csv` | Dunning procedure levels, days thresholds, actions | `T047`, `T047S` | On change (config) |
| `dim_sap_status_codes.csv` | All status/code lookup values: FSCM, Dispute, Dunning, Approval | SAP customising tables | On change (config) |
| `dim_user_directory.csv` | Agent-relevant users: SAP IDs, Teams AAD IDs, authority ceilings | `USR02`, Azure AD | Daily @ 06:00 |

---

## SAP Extraction Parameters

| Parameter | Value |
|-----------|-------|
| Client (MANDT) | `100` |
| Company Code (BUKRS) | `1000` |
| Currency (WAERS) | `USD` |
| Date format in CSVs | `YYYY-MM-DD` (SAP internal: `YYYYMMDD`) |
| Customer number format | 10-digit zero-padded (e.g., `0000004821`) |
| Amount fields | `DECIMAL(15,2)`, no thousand separators (e.g., `950000.00`) |
| Extraction method | SAP RFC/BAPI → BTP Integration Suite → Data Lake → Agent REST API |

---

## Data Types Schema

| Type Label | Format | Example | Used For |
|------------|--------|---------|----------|
| `DECIMAL(15,2)` | Numeric, 2 d.p. | `950000.00` | All monetary amounts (WRBTR, KLIMK, etc.) |
| `DATE` | `YYYY-MM-DD` | `2026-01-25` | All date fields (DUE_DATE_CALC, CLEARING_DATE, etc.) |
| `INTEGER` | Whole number | `72` | Days counts (OVERDUE_DAYS_CALC, DAYS_LATE, DUNNING_LEVEL) |
| `VARCHAR(10)` | String max 10 chars | `0000004821` | SAP key fields (KUNNR, BELNR, BUZEI) |
| `VARCHAR(50)` | String max 50 chars | `INV-78421` | Reference numbers, case refs |
| `VARCHAR(255)` | String max 255 chars | `Delta Retail Group` | Names, descriptions, notes |
| `BOOLEAN` | `Y` / `N` | `Y` | Flags (ON_TIME_FLAG, BREACH_FLAG, AGENT_EXECUTED) |
| `PERCENTAGE` | `DECIMAL(5,2)` | `63.33` | Utilisation and rate fields (pct, not fraction) |

---

## Field Name Conventions

| Convention | Meaning | Example |
|------------|---------|---------|
| Uppercase, no prefix | Direct SAP field name | `KUNNR`, `BELNR`, `WRBTR` |
| `_CALC` suffix | Derived/computed by extraction layer | `OVERDUE_DAYS_CALC`, `DUE_DATE_CALC` |
| `_EXT` suffix | Sourced outside SAP (external intelligence) | `SIGNAL_VALUE` in `fact_external_signals` |
| `_AGENT` suffix | Written back by the Collections Agent at runtime | `COLLECTION_PRIORITY_AGENT` |

---

## Primary Keys & Join Relationships

```
dim_customer ─────────────── KUNNR ──┬── fact_ar_open_items
                                      ├── fact_payment_history
                                      ├── fact_collections_activity
                                      ├── fact_dunning_records
                                      ├── fact_external_signals
                                      └── dim_credit_profile

dim_payment_terms ─────── ZTERM ────── fact_ar_open_items (ZTERM field)

dim_dunning_procedure ─── DUNN_PROC ── fact_dunning_records (DUNNING_PROCEDURE field)

dim_sap_status_codes ─────────────── Look up by DOMAIN + CODE_VALUE
                                      (e.g. DOMAIN='FSCM_COLLECTION', CODE_VALUE='02')

dim_user_directory ───── USER_ALIAS ── fact_collections_activity (COLLECTIONS_OWNER)
                       SAP_USER_ID ─── Referenced in BAPI calls as COLLECTOR param
                     TEAMS_AAD_OBJ_ID ─ Referenced in Graph API @mention calls
```

Primary join key across all fact tables: **`KUNNR`** (Customer Account Number)  
Secondary join key for invoice-level operations: **`XBLNR`** (External Invoice Reference, e.g., `INV-78421`)

---

## Agent-Computed Fields

These fields are derived at agent runtime from source CSV fields. They are **not stored in source CSVs** — the agent computes them in-memory each session.

| Computed Field | Formula | Source Fields | Written To |
|----------------|---------|--------------|------------|
| `CONTACT_ATTEMPTS_NO_RESPONSE` | `CONTACT_ATTEMPTS − RESPONSES_RECEIVED` | `fact_collections_activity` | Used in priority score only |
| `PRIORITY_SCORE` | See AI-001 Section 3 formula | Multiple tables | `COLLECTION_PRIORITY_AGENT` in `fact_collections_activity` |
| `AVG_DAYS_LATE` | `AVG(DAYS_LATE)` over last 24 months | `fact_payment_history` | Decision card signal |
| `BREACH_COUNT_24M` | `COUNT` where `BREACH_FLAG = Y` | `fact_payment_history` | Decision card signal |
| `ON_TIME_RATE_PCT` | `COUNT(ON_TIME_FLAG=Y) / COUNT(*) × 100` | `fact_payment_history` | Decision card signal |

---

## Agent Write-Back Rules

> **Important:** The CSV files in this folder define the **schema and seed data** for development and testing. The agent's runtime write-back target is the **operational database / API endpoint** (configured per deployment environment), not these CSV files.

| Field | Table | Agent Can Write? | Condition |
|-------|-------|-----------------|-----------|
| `COLLECTION_PRIORITY_AGENT` | `fact_collections_activity` | Yes | Written every session on priority score run |
| `CASE_STATUS` | `fact_collections_activity` | Yes | Only after human confirmation of decision |
| `AGENT_EXECUTED` | `fact_collections_activity` | Yes | Set to `Y` after action sequence completes |
| `AGENT_EXECUTION_TIME` | `fact_collections_activity` | Yes | ISO 8601 timestamp |
| `SAP_CASE_REF` | `fact_collections_activity` | Yes | After SAP FSCM collection item created |
| `LEGAL_HOLD_REF` | `fact_collections_activity` | Yes | After Legal CMS DORMANT case created |
| `NEXT_ACTION` / `NEXT_ACTION_DATE` | `fact_collections_activity` | Yes | Set per decision playbook |
| `CASE_STATUS` to `ACTIVE` | Legal CMS | **No** | @LegalTeam owns. Agent can only set `DORMANT` |
| `KLIMK` (credit limit) | `dim_credit_profile` | **Staged only** | Agent stages FD32 change; @RaviKumar/CFO confirms in VKM1 |

---

## Relevant SAP Transactions

| T-code | Description | Related Table/File |
|--------|-------------|-------------------|
| `FBL5N` | Customer Line Item Display | `fact_ar_open_items`, `fact_payment_history` |
| `UDM_SUPERVISOR` | FSCM Collections — Supervisor Worklist | `fact_collections_activity` (table: `UDMCASE`, `UDMCASEATTR`) |
| `UDM_DISPUTE` | FSCM Dispute Management | `fact_collections_activity` (table: `UDMDISP`) |
| `F150` | Dunning Run | `fact_dunning_records` (tables: `MHNK`, `MHND`) |
| `FD32` | Change Customer Credit Data | `dim_credit_profile` (table: `KNKK`) |
| `FB75` | Enter Customer Credit Memo | Agent write-back (BAPI: `BAPI_ACC_DOCUMENT_POST`, doc type `DG`) |
| `VD05` | Block Customer (Sales) | Agent write-back |
| `VKM1` | Credit Hold Release Worklist | Human confirmation step after agent stages FD32 |

---

## Agent Session Load Sequence

1. **06:00** — BTP batch extracts refresh all `dim_` tables and `fact_` tables (except `fact_ar_open_items`)
2. **06:00** — `fact_external_signals` refreshed from external APIs (SEC EDGAR, Bloomberg, D&B)
3. **07:00** — Agent session starts. Loads all 11 data contracts into working memory
4. **07:00–07:15** — Priority scoring run. `COLLECTION_PRIORITY_AGENT` written for all active customers
5. **Real-time** — `fact_collections_activity` streams SAP FSCM event updates via BTP Event Mesh
6. **Every 15 min** — `fact_ar_open_items` delta extract via SAP OData

---

## Delta Retail Scenario Verification

Use this checklist to confirm the seed data fully supports the `KUNNR = 0000004821` scenario before beginning development.

| Requirement | Data File | Field / Check | Status |
|-------------|-----------|--------------|--------|
| Two open invoices totalling $1.8M | `fact_ar_open_items` | INV-78421 ($950K) + INV-78435 ($850K) | ✅ Present |
| INV-78435 is 95d overdue (>90 threshold) | `fact_ar_open_items` | `OVERDUE_DAYS_CALC = 95` | ✅ Present |
| Both invoices at Dunning Level 3 | `fact_dunning_records` | `DUNNING_LEVEL = 3` for both BELNRs | ✅ Present |
| 4 contact attempts, 0 responses | `fact_collections_activity` | `CONTACT_ATTEMPTS=4, RESPONSES_RECEIVED=0` | ✅ Present |
| Parent entity cash $42M signal | `fact_external_signals` | `EXT-2026-0041`, `SIGNAL_VALUE=42000000.00` | ✅ Present |
| 6 vendor payments in 5 days (selective deprioritisation) | `fact_external_signals` | `EXT-2026-0042`, `SIGNAL_VALUE=6` | ✅ Present |
| 24 months payment history — all breaches | `fact_payment_history` | 10 records, all `BREACH_FLAG=Y`, avg 71d late | ✅ Present |
| @RaviKumar authority ceiling $1.5M | `dim_user_directory` | `MAX_COLLECTION_AUTHORITY_USD=1500000.00` | ✅ Present |
| @RaviKumar AAD Object ID for Teams @mention | `dim_user_directory` | `TEAMS_AAD_OBJECT_ID` populated | ✅ Present |
| Option A split: $1.5M total within ceiling | `dim_user_directory` + `fact_ar_open_items` | `MIN(1500000, 1800000) = 1500000` | ✅ Derivable |
| Credit risk category B (medium) | `dim_credit_profile` | `RISK_CATEGORY = B` | ✅ Present |
| Payment terms Z030 (Net 30) | `dim_payment_terms` | `ZTERM = Z030, NET_DAYS = 30` | ✅ Present |
| ZAR01 Level 3 rules (final notice) | `dim_dunning_procedure` | Level 3 row for ZAR01 | ✅ Present |
