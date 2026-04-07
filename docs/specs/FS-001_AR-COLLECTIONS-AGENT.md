# FS-001 — AR Collections Agent: Feature Specification
## Working Capital War Room (WCE Prototype)

**Version:** 1.0  
**Status:** Ready for Development  
**Author:** BA / Product Owner  
**Date:** 07 April 2026  
**Prototype Reference:** `index.html` → Tab: Receivables (AR)

---

## 1. Problem Statement

The company carries $6.2M in overdue AR (39% of total AR, above the 25% acceptable threshold). Collecting teams lack a daily prioritised view of which customers to act on and in what order. CFOs are presented with raw AR reports rather than decision-ready briefings. SAP FSCM, CRM, Teams, and Legal CMS actions that should follow a collection decision take hours or days to execute — and are often missed.

The **AR Collections Agent** closes this gap by:
1. Automatically prioritising overdue customers each morning
2. Briefing the CFO with pre-reasoned options and signals
3. Executing the confirmed action sequence across all relevant systems in seconds
4. Monitoring outcomes and escalating when conditions change

---

## 2. Scope

**In scope (this release):**
- AR Collections Agent briefing and decision support
- Delta Retail $1.8M collection case (primary scenario, see AI-002)
- Orbis Tech $1.3M credit hold decision
- Pinnacle Foods $900K disputed invoice resolution
- Nexwave Retail $800K monitoring
- Brightline Corp $300K first-overdue tracking
- Integration: SAP FSCM, SAP AR (F150, FD32, FB75), SAP SD (VD05, VL02N), Microsoft Teams, CRM, Legal CMS

**Out of scope (future releases):**
- Automated customer-facing outreach (email generation directly to customers)
- Full SAP ERP write-back without human confirmation (keep human-in-the-loop)
- AP collections (covered separately)
- Inventory / DIO optimisation

---

## 3. User Stories

### Epic AR-01: Daily Collections Briefing

---

**US-AR-001 — Morning AR Snapshot**  
*As a CFO, I want to open the War Room each morning and see a prioritised summary of overdue AR so I can allocate my decision-making time to the highest-risk accounts.*

**Acceptance Criteria:**
- [ ] Agent runs at 07:00 daily and produces an AR snapshot by 07:15
- [ ] Snapshot shows: total open AR, overdue AR by aging bucket (0-30, 31-60, 61-90, 90+), count of invoices in each bucket
- [ ] Overdue customers are ranked by priority score (AI-001 Section 3 formula)
- [ ] CRITICAL customers (score ≥ 80) are highlighted with a visual indicator (red border / badge)
- [ ] Snapshot includes: current DSO, target DSO, gap, and total cash opportunity this week
- [ ] Data is sourced from `fact_ar_open_items` and `dim_customer`

---

**US-AR-002 — Priority Customer Decision Card**  
*As a CFO, for each CRITICAL AR customer, I want to see a structured decision card with signals, history, and pre-reasoned options so I can make an informed decision in under 2 minutes.*

**Acceptance Criteria:**
- [ ] Decision card is displayed for each CRITICAL customer in priority order
- [ ] Card includes: customer name, total overdue amount, worst overdue days, invoice list with individual amounts and due dates
- [ ] Card includes: 3–5 intelligence signals with their source (treasury filing date, data feed name)
- [ ] Card includes: payment history summary (avg days late, number of breaches in last 12 months)
- [ ] Card includes: exactly 3 options: [Recommended action], [Alternative action], [Request info]
- [ ] Agent's recommended option is highlighted and includes a 1–2 sentence rationale
- [ ] Card includes: projected cash impact on the 7-day position if the recommended option is actioned today
- [ ] Relationship risk (annual account value) is surfaced on cards where annual revenue > $5M

---

**US-AR-003 — Agent Recommendation Confidence**  
*As a CFO, I want to understand the confidence level behind the agent's recommendation so I know whether to accept it or override it.*

**Acceptance Criteria:**
- [ ] Each recommendation includes the top 3 signals driving it (with source labels)
- [ ] If external intelligence data (`_EXT` fields) is older than 24 hours, agent displays a data freshness warning: "Signal based on data from [date]"
- [ ] Agent does not present a recommendation if fewer than 2 data signals are available — it shows "Insufficient data — recommend requesting info"

---

### Epic AR-02: Decision Execution

---

**US-AR-004 — Partial Collection Execution (Delta Retail — Option A)**  
*As a CFO, after confirming "Collect $1.08M now" for Delta Retail, I want the agent to execute all required SAP, CRM, Teams, and Legal actions automatically so I don't need to coordinate 4 different systems manually.*

**Acceptance Criteria:**
- [ ] Agent raises SAP FSCM collection items for INV-78421 (full) and partial INV-78435 via `UDM_SUPERVISOR` within 60 seconds of CFO confirmation
- [ ] INV-78435 remaining balance ($720K) is set as a Resubmission on 2026-04-13 on @RaviKumar's collector worklist
- [ ] Authority check runs against Policy AR-03 and result is logged: "$1.08M ≤ $1.5M — no escalation required"
- [ ] Teams message to @RaviKumar is sent within 60 seconds with: delta retail name, invoice refs, collected amount, resubmission date and amount
- [ ] Pre-litigation hold is opened in Legal CMS with status DORMANT and auto-escalation trigger at Day 8
- [ ] All 4 steps are displayed in the UI with SAP transaction references, status badges, and a single sync timestamp
- [ ] Decision buttons are disabled after CFO confirms (prevent double execution)
- [ ] Card border changes to green (good outcome) after execution

---

**US-AR-005 — Full Demand Execution (Delta Retail — Option B)**  
*As a CFO, after confirming "Demand full $1.8M" for Delta Retail, I want the agent to initiate the formal demand workflow with appropriate CFO approval routing.*

**Acceptance Criteria:**
- [ ] CFO approval workflow (APP-YYYY-XXXX) is created in SAP Business Workflow within 60 seconds
- [ ] Formal demand letter (DL-YYYY-XXXX) is staged in SharePoint with status STAGED — not despatched
- [ ] Teams message is sent to @SeniorCFO requesting approval
- [ ] Teams message is sent to @SarahAndrews (account manager) with commercial hold instruction
- [ ] CRM chase schedule (CR-004821) is created with Day 3, 4, 5, 6 tasks and @SeniorCFO calendar hold
- [ ] SAP dunning level 4 is applied via F150 and FD32 credit limit staged to $0 (awaiting human confirm in VKM1)
- [ ] All 5 steps are displayed in the UI with system references and PENDING status where approval is outstanding
- [ ] Agent does not despatch the demand letter before CFO approval workflow is completed

---

**US-AR-006 — Request Info / Query Flow**  
*As a CFO, I want to ask a question or tag a team member for more context before making a decision, without leaving the War Room.*

**Acceptance Criteria:**
- [ ] "Request info" button shows a free-text input field with a placeholder hint
- [ ] Query is sent as a Teams message to the tagged person (@mention supported)
- [ ] Query is logged in `fact_collections_activity` (NOTES field) with timestamp
- [ ] UI shows "QUERY SENT" response card with the text of the query
- [ ] No SAP actions are taken until a substantive decision (A or B) is made

---

### Epic AR-03: Monitoring & Escalation

---

**US-AR-007 — Payment Confirmation Monitoring**  
*As a collections owner, I want the agent to automatically detect when a customer has made payment and close the collection case without me needing to manually check.*

**Acceptance Criteria:**
- [ ] Agent polls ar-collections@company.com every 4 hours for inbound payment confirmations
- [ ] On receipt of email from customer's domain (e.g., `@deltaretailgroup.com`), agent cross-references the email against open collection cases in `fact_collections_activity`
- [ ] If payment confirmed: agent updates `fact_collections_activity` CASE_STATUS → CLOSED, notifies @RaviKumar via Teams, updates `fact_ar_open_items` AUGDT/AUGBL with clearing reference
- [ ] War Room KPI bar updates: Overdue AR balance reduces, DSO recalculates, Cash Position updates

---

**US-AR-008 — Auto-Escalation on Non-Payment**  
*As a collections owner, I want the agent to automatically escalate if payment is not received by the follow-up deadline so that cases don't get dropped.*

**Acceptance Criteria:**
- [ ] On Day 5 after Option A execution: if no payment confirmation in monitoring inbox and PROMISE_TO_PAY_DATE is not set → agent sends Teams alert to @RaviKumar: "Delta Retail has not confirmed payment. $720K resubmission is due on 13 Apr. Review required."
- [ ] On Day 8 after Option A execution: if no payment confirmation → agent changes Legal CMS hold status from DORMANT to notifying @LegalTeam (agent does NOT activate the case itself — it triggers a @LegalTeam Teams notification with the hold ref)
- [ ] On Day 3 after Option B execution: if no payment commitment in CRM → auto-escalation Teams message to @RaviKumar + @SeniorCFO
- [ ] All escalation events are logged in `fact_collections_activity` NOTES

---

**US-AR-009 — Workflow Status Refresh**  
*As a CFO, I want to refresh all displayed workflow statuses with a single click so I know the current state of all actions.*

**Acceptance Criteria:**
- [ ] Header "↻" button triggers re-poll of `fact_collections_activity` for all active collection cases
- [ ] `wf-sync-time` labels on all expanded execution cards update to the current time
- [ ] Last refresh time in the header updates
- [ ] Refresh completes within 5 seconds
- [ ] Button shows a spinning animation during refresh

---

## 4. Integration Requirements

### 4.1 SAP Integration

| System | Method | Auth | SLA |
|--------|--------|------|-----|
| SAP FSCM (UDM) | SAP RFC / BAPI | OAuth 2.0 via BTP | < 10s |
| SAP AR (FBL5N, F150) | SAP OData V4 / BAPI | OAuth 2.0 via BTP | < 15s |
| SAP Credit Mgmt (FD32) | BAPI `BAPI_CUSTOMER_CREDITACCOUNT_SET` | OAuth 2.0 via BTP | < 10s |
| SAP SD (VD05, VL02N, VKM1) | SAP OData V4 | OAuth 2.0 via BTP | < 15s |
| SAP GL (FB75) | BAPI `BAPI_ACC_DOCUMENT_POST` | OAuth 2.0 via BTP | < 10s |
| SAP Business Workflow | BAPI `SWI_WORKITEM_CREATE` | OAuth 2.0 via BTP | < 15s |

All SAP integrations run through **SAP Business Technology Platform (BTP) Integration Suite**. The agent calls BTP iFlow endpoints; BTP handles the RFC/BAPI translation.

### 4.2 Microsoft Teams

- Integration via **Microsoft Graph API**
- Auth: Azure AD App Registration with `ChannelMessage.Send` and `Chat.ReadWrite` permissions
- All @mention messages must use Graph API `chatMessage` with AAD user IDs (not display names)
- Messages must include a structured body with: [ACTION_TYPE], [CUSTOMER], [AMOUNT], [OWNER], [DEADLINE], [SAP_REF]

### 4.3 CRM

- REST API: `POST /api/crm/tasks` and `PUT /api/crm/tasks/{id}`
- Auth: API key (stored in Azure Key Vault, not hardcoded)
- Task payload schema: `{ customer_id, task_type, title, body, assigned_to, due_date, escalation_owner, escalation_date }`

### 4.4 Legal CMS

- REST API: `POST /api/v1/cases` and `PATCH /api/v1/cases/{ref}/status`
- Auth: mTLS client certificate
- Case creation payload: `{ case_type, status, customer_ref, invoice_refs, total_amount, monitoring_inbox, auto_escalation_date, auto_escalation_recipient }`
- Agent can set: `status = DORMANT` only. Status transitions to ACTIVE/ESCALATED owned by @LegalTeam

### 4.5 Data Refresh

| Feed | Method | Frequency | Failure Handling |
|------|--------|-----------|-----------------|
| `fact_ar_open_items` | SAP OData delta query | Every 15 min | Stale data warning after 30 min; error after 1 hr |
| All other `fact_` and `dim_` tables | SAP BTP batch extract | Daily 06:00 | Retry 3× with 5-min backoff; alert @DataTeam on failure |
| `fact_external_signals` | External API calls (SEC EDGAR, Bloomberg, D&B) | Daily 06:00 | Alert @TreasuryAnalytics on failure; surface data-age warning if signal > 24h old |
| Email monitoring | Microsoft Graph mailbox poll | Every 4 hours | Alert @RaviKumar on poll failure |

---

## 5. Data Contract Mapping

| UI Element | Data Contract | Field |
|-----------|--------------|-------|
| AR aging buckets | `fact_ar_open_items` | AGING_BUCKET, WRBTR, KUNNR aggregated |
| Priority customer table | `fact_ar_open_items` + `fact_collections_activity` | KUNNR, WRBTR, OVERDUE_DAYS_CALC, CASE_STATUS |
| Decision card — invoice list | `fact_ar_open_items` | XBLNR, WRBTR, DUE_DATE_CALC, OVERDUE_DAYS_CALC |
| Decision card — signals (parent cash, vendor payments) | `fact_external_signals` | SIGNAL_TYPE, SIGNAL_VALUE, DATA_SOURCE, CONFIDENCE_LEVEL |
| Decision card — signals (pay history) | `fact_payment_history` | DAYS_LATE, BREACH_FLAG, ON_TIME_FLAG (24 months) |
| Decision card — dunning level | `fact_dunning_records` | DUNNING_LEVEL (max per KUNNR) |
| Decision card — credit status | `dim_credit_profile` | CREDIT_LIMIT_USD, CURRENT_EXPOSURE_USD, CREDIT_HOLD_ACTIVE |
| Agent recommendation | AI-001 (priority score) + AI-002 (playbook) | Computed |
| Post-execution workflow statuses | `fact_collections_activity` | CASE_STATUS, AGENT_EXECUTION_TIME, SAP_CASE_REF |
| KPI bar — Overdue AR | `fact_ar_open_items` | SUM(WRBTR) where OVERDUE_DAYS_CALC > 0 |
| KPI bar — DSO | `fact_ar_open_items` + revenue | (Open AR / Daily Revenue) |
| @mention routing (Teams messages) | `dim_user_directory` | TEAMS_AAD_OBJECT_ID, USER_ALIAS |
| Authority check (Option A/B split) | `dim_user_directory` | MAX_COLLECTION_AUTHORITY_USD |

---

## 6. Non-Functional Requirements

| NFR | Requirement |
|-----|-------------|
| Performance | Agent session init (07:00 batch) must complete within 5 minutes. Individual action execution ≤ 60 seconds. |
| Availability | War Room UI: 99.5% uptime. SAP integration: degrades gracefully with stale-data warnings if SAP is unavailable. |
| Security | No customer data in browser localStorage. All API calls server-side. SAP credentials in Azure Key Vault. PII fields (customer contact emails) masked in UI logs. |
| Audit | Every agent action logged with: timestamp, user who confirmed, system ref, before/after state. Retained 7 years (financial record obligation). |
| Idempotency | Executing the same decision twice must not create duplicate SAP documents. Agent checks `fact_collections_activity` AGENT_EXECUTED flag before calling SAP APIs. |
| Human in the loop | No SAP write action executes without a CFO/owner button click. Agent prepares and stages; humans confirm. |
| Error handling | If any SAP API call fails, agent displays: action name, error code, suggested manual fallback (T-code and steps). It does not silently fail. |

---

## 7. Acceptance Test Scenarios

| Test ID | Scenario | Expected Result |
|---------|----------|----------------|
| AT-001 | Load War Room at 07:00 — `fact_ar_open_items` has Delta Retail $1.8M at 95d overdue | Delta Retail appears as CRITICAL P1 in AR tab decision cards |
| AT-002 | CFO clicks "Collect $1.08M now" for Delta Retail | 4 execution steps shown, all with SAP refs; decisions buttons disabled; card border turns green |
| AT-003 | CFO clicks "Demand full $1.8M" for Delta Retail | 5 execution steps shown; APP-YYYY-XXXX in PENDING state; DL-YYYY-XXXX in STAGED state |
| AT-004 | CFO types "@RaviKumar check status" and clicks Send | Teams message sent; "QUERY SENT" card shown; no SAP actions taken |
| AT-005 | `fact_ar_open_items` refreshes and Delta Retail invoices appear in BSAD (cleared) | Collection cases in `fact_collections_activity` auto-close; War Room KPI bar updates; @RaviKumar notified |
| AT-006 | Day 8 timer fires with no payment confirmation | Legal CMS hold notified to @LegalTeam; Teams alert sent; `fact_collections_activity` updated |
| AT-007 | CFO clicks ↻ refresh button | All wf-sync-time labels update to current time; last refresh time in header updates; completes < 5s |
| AT-008 | SAP FSCM API returns a 500 error during collection item creation | Error step shown in execution card with T-code UDM_SUPERVISOR fallback instructions; no silent failure |
| AT-009 | Delta Retail sends payment confirmation email to ar-collections@company.com | Agent detects email; `fact_collections_activity` updated; @RaviKumar notified; overdue AR balance reduces in KPI bar |
| AT-010 | Agent attempts to activate a Legal CMS case (status DORMANT → ACTIVE) | Action blocked; error shown: "Legal case activation is @LegalTeam's responsibility. Use Legal CMS directly." |

---

## 8. Open Questions

| # | Question | Owner | Target Date |
|---|----------|-------|-------------|
| OQ-01 | What is the exact SAP Business Workflow task type for AR-05 approval routing? Does it use `SWI_WORKITEM_CREATE` or a custom FSCM approval task? | @SAPArchitect | 2026-04-14 |
| OQ-02 | Does the Legal CMS support a DORMANT → ACTIVE auto-trigger based on a date condition, or does it require a manual API call on Day 8? | @LegalTeam | 2026-04-14 |
| OQ-03 | Is `ar-collections@company.com` monitored by Graph API mailbox polling (shared mailbox) or a dedicated integration inbox? | @ITIntegrations | 2026-04-14 |
| OQ-04 | What is the CRM system in use (Salesforce, Dynamics, custom)? Confirm REST API endpoint base URL and authentication method. | @CRMAdmin | 2026-04-11 |
| OQ-05 | For external intelligence signals (parent cash, network payments): what is the data provider, refresh SLA, and schema for the `_EXT` fields? | @TreasuryAnalytics | 2026-04-14 |
| OQ-06 | Confirm Policy AR-03 and AR-05 PDFs are accessible via SharePoint API or are they static references only? | @FinanceCompliance | 2026-04-14 |
