# AI-002 — Delta Retail Collection Playbook
## Customer-Specific Instruction Set v1.0

> **Inject this file** when `KUNNR = 0000004821` (Delta Retail Group) is identified as CRITICAL in the AI-001 priority scoring run.  
> **Dependencies:** AI-001 core rules apply in full. This playbook adds Delta-retail-specific context, signals, decision options, and action sequences.

---

## 1. Customer Profile Summary

| Field | Value |
|-------|-------|
| Customer Name | Delta Retail Group |
| SAP Customer ID | `CUST-004821` (KUNNR: `0000004821`) |
| Company Code | `1000` |
| Annual Revenue (our company) | $12,000,000 |
| Payment Terms | Z030 (Net 30 days) |
| Credit Limit | $3,000,000 |
| Risk Category | B (Medium Risk) |
| Relationship Manager | @SarahAndrews |
| Collections Owner | @RaviKumar |
| Collections Email | ar-collections@company.com |
| Customer AP Contact | ap@deltaretailgroup.com |
| Parent Entity | Delta Retail Holdings Inc |
| Contract Notice Period (Legal) | 30 days before legal referral |
| Policy Reference | AR-03 (direct authority ≤ $1.5M), AR-05 (formal demand > $1.5M; CFO required) |

---

## 2. Current Case — As of 07 April 2026

### Open Invoices

| Invoice | SAP BELNR | Amount | Invoice Date | Due Date | Days Overdue | Dispute |
|---------|-----------|--------|-------------|----------|-------------|---------|
| INV-78421 | 1900078421 | $950,000 | 2025-12-26 | 2026-01-25 | 72 | None |
| INV-78435 | 1900078435 | $850,000 | 2025-12-03 | 2026-01-02 | 95 | None |
| **Total** | | **$1,800,000** | | | **95d worst** | **Clean** |

No disputes are on record for either invoice. Delta Retail's AP team has not contested the invoices.

### Current Dunning Status

| Invoice | Dunning Level | Dunning Notice Date | SAP Run Ref |
|---------|--------------|---------------------|-------------|
| INV-78421 | **Level 3** (Final Notice / Demand) | 2026-03-22 | F150-2026-0058 |
| INV-78435 | **Level 3** (Final Notice / Demand) | 2026-03-05 | F150-2026-0047 |

Both invoices are at the highest dunning level before legal referral.

### Collection Contact History

| Date | Method | Sent By | Response |
|------|--------|---------|---------|
| 2026-03-15 | Email (automated dunning) | Agent / @RaviKumar | No response |
| 2026-03-22 | Email (dunning level 3) | @RaviKumar | No response |
| 2026-03-28 | Email (direct chase) | @RaviKumar | No response |
| 2026-04-01 | Email (final pre-escalation) | @RaviKumar | No response |

4 contact attempts. 0 responses. No dispute raised. No payment made.

---

## 3. Intelligence Signals

The following signals were gathered by the agent at 06:00 on 2026-04-07 and **must be surfaced to the CFO** in the decision card:

| Signal | Source | Value | Implication |
|--------|--------|-------|-------------|
| Parent entity cash position | Treasury Filing (external, `fact_external_signals` EXT-2026-0041) | $42,000,000 | Parent entity is liquid — ability to pay is not in doubt |
| Other vendor payments | Network payment data (external, `fact_external_signals` EXT-2026-0042) | 6 vendors paid in last 5 days | Delta is selectively deprioritising our invoices |
| Annual revenue at stake | `dim_customer` `ANNUAL_REVENUE_USD_EXT` | $12,000,000 | Formal escalation risks 6% of company revenue |
| Dunning level | `fact_dunning_records` | Level 3 | Highest pre-legal level — no further dunning headroom |
| Days to next legal trigger | AI-001 escalation matrix | 0 days | 90+ day threshold crossed on INV-78435 (95d) |
| No dispute on record | `fact_collections_activity` `DISPUTE_REF` | Blank | No legal basis for non-payment; clean invoice |

---

## 4. Decision Options

Present exactly these three options to the CFO. Do not invent alternatives.

---

### Option A — Collect $1.08M Now (Recommended)

**CFO decision label:** "Collect $1.08M now"  
**Rationale:** Collects the maximum amount achievable within @RaviKumar's Policy AR-03 authority ($1.5M ceiling) without requiring CFO sign-off routing. Fastest cash path. Remaining $720K tracked with a hard 7-day follow-up by @RaviKumar. Preserves the $12M annual relationship.

**Amount breakdown:**
- Total overdue: `SUM(fact_ar_open_items.WRBTR where KUNNR='0000004821')` = $1,800,000
- @RaviKumar ceiling: `dim_user_directory.MAX_COLLECTION_AUTHORITY_USD where USER_ALIAS='@RaviKumar'` = $1,500,000
- Amount to collect under AR-03: `MIN(1,500,000, 1,800,000)` = **$1,500,000**
- Allocation across invoices (pro-rata by amount):
  - INV-78421 ($950K): collect in full → `$950,000`
  - INV-78435 ($850K): collect partial → `$1,500,000 − $950,000` = **$550,000**
  - Remaining INV-78435 balance: `$850,000 − $550,000` = **$300,000** (resubmission target: 13 April 2026)

> **Note:** The prototype UI displays a simplified $1.08M / $720K split. The correct formula-driven split above is $1.5M collected ($950K + $550K) with $300K on resubmission. Use the formula-driven amounts in all SAP API calls. Align the UI label with $1.5M in the next UI revision.

**Execute the following action sequence (in order):**

**Step 1 — Raise SAP FSCM Collection Items**
- System: SAP FSCM, T-code: `UDM_SUPERVISOR`
- Action: Create collection item for INV-78421 (full, $950K) with status `02` (In Process)
- Action: Create collection item for INV-78435 partial with status `02` (In Process)
- Action: Set INV-78435 remaining balance ($720K) as Resubmission dated 2026-04-13 on @RaviKumar's collector worklist
- SAP status codes: `01`=Open, `02`=In Process, `03`=Promise to Pay, `04`=Dispute
- Case reference: derive from sequence at time of creation (e.g., UDM-2026-XXXX)

**Step 2 — Authority Check**
- Query: Policy AR-03 (SharePoint/Finance/Policies/AR-03.pdf)
- Confirm: $1.08M ≤ $1,500,000 (RaviKumar ceiling) → **No CFO approval routing required**
- Log result in audit trail

**Step 3 — Send Teams Message to @RaviKumar**
- Channel: #ar-collections
- Message template:
  > "Delta Retail: CFO has approved $1.08M partial collection. INV-78421 and partial INV-78435 now In Process in SAP Collections (CUST-004821, UDM_SUPERVISOR). You own the $720K Resubmission on 13 Apr. Ping me if they don't confirm by Day 5."

**Step 4 — Open Pre-Litigation Hold in Legal CMS**
- System: LegalCMS
- Case type: Pre-litigation Hold
- Case ref format: `LH-YYYY-XXXX` (generate at creation time)
- Status: **DORMANT** (must not be ACTIVE — @LegalTeam owns activation)
- Invoices in scope: INV-78421, INV-78435
- Auto-escalation rule: No payment confirmation at ar-collections@company.com by Day 8 → auto-notify @LegalTeam
- Monitoring: Agent polls ar-collections@company.com for Delta Retail payment confirmation emails

**Write-back to `fact_collections_activity`:**
- CASE_STATUS → `IN_PROCESS`
- AGENT_EXECUTED → `Y`
- AGENT_EXECUTION_TIME → current ISO timestamp
- SAP_CASE_REF → collection item IDs from UDM_SUPERVISOR
- LEGAL_HOLD_REF → Legal CMS case ref
- NEXT_ACTION → `MONITOR_PAYMENT`
- NEXT_ACTION_DATE → 2026-04-11 (Day 5)
- NEXT_ACTION_OWNER → @RaviKumar

---

### Option B — Demand Full $1.8M

**CFO decision label:** "Demand full $1.8M"  
**Rationale:** Maximum cash recovery. Appropriate if CFO has relationship intelligence suggesting the formal demand will accelerate payment rather than damage the account. Requires CFO sign-off (amount > $1.5M per Policy AR-05).

**Risks to surface:**
- Requires formal CFO approval workflow (typically 20–30 day process delay)
- Relationship risk on a $12M annual account
- Triggers contractual 30-day notice period before legal action can proceed

**Execute the following action sequence (in order):**

**Step 1 — Request CFO Approval via Approval Workflow**
- System: SAP Business Workflow (auto-creates WorkItem)
- Workflow ref format: `APP-YYYY-XXXX`
- Policy: AR-05 (formal demand above $1.5M)
- Send Teams message to @SeniorCFO:
  > "Action needed: APP-[ref] requires your approval before Delta Retail formal demand letter DL-[ref] is despatched. Total: $1.8M on INV-78421 + INV-78435. Please approve in SAP WorkItems."
- Status: `PENDING_APPROVAL` (do not proceed to Steps 2–5 until approval received)

**Step 2 — Stage Formal Demand Letter**
- System: Legal Document Management (SharePoint case folder)
- Doc ref format: `DL-YYYY-XXXX`
- Invoices: INV-78421 ($950K) + INV-78435 ($850K) = $1,800,000
- Include interest accrual clause per contract clause 8.4
- Status: **STAGED** — @LegalTeam despatches only after APP-[ref] is approved
- Do not release or send externally until approval is confirmed

**Step 3 — Notify @SarahAndrews (Account Manager)**
- Teams message:
  > "Heads up: Delta Retail escalated to formal demand track pending CFO sign-off. Do not contact them commercially until @RaviKumar gives the all-clear. Legal hold ref DL-[ref] is staged."

**Step 4 — Create CRM Chase Schedule**
- System: CRM
- Customer CRM ID: `CR-004821`
- Tasks:
  - Day 3: Automated chase reminder → @RaviKumar
  - Day 4: Second reminder → @RaviKumar + @SeniorCFO
  - Day 5: CFO review meeting — place 09:00 calendar hold on @SeniorCFO
  - Day 6: Auto-forward legal brief if no payment commitment
- Notify @SeniorCFO's PA of Day 5 09:00 calendar hold

**Step 5 — Apply Dunning Level 4 in SAP**
- T-code: `F150`
- Customer: CUST-004821
- Dunning level: 4 (Demand Notice — highest before legal referral)
- Set credit limit to $0 via FD32 (Credit Management)
  - Effect: No further credit extension; new orders require manual CFO release
- Note: FD32 change is staged by agent; @RaviKumar must confirm in production

**Write-back to `fact_collections_activity`:**
- CASE_STATUS → `ESCALATED_CFO`
- AGENT_EXECUTED → `Y`
- SAP_CASE_REF → APP-YYYY-XXXX, DL-YYYY-XXXX
- NEXT_ACTION → `AWAIT_CFO_APPROVAL`
- NEXT_ACTION_DATE → today + 1 business day
- NEXT_ACTION_OWNER → @SeniorCFO

---

### Option C — Request Further Information

**CFO decision label:** "Request info"  
**Rationale:** CFO wants more context before deciding (e.g., recent sales conversation, commercial sensitivity not visible to agent).

**Execute:**

1. Display a free-text input field labelled: "Tag someone — e.g. @RaviKumar check payment priority status at Delta Retail"
2. Route the query to the tagged person via Teams
3. Log the query in `fact_collections_activity` under NOTES
4. Set NEXT_ACTION → `AWAIT_QUERY_RESPONSE`, NEXT_ACTION_DATE → today + 2 hours
5. Do not raise any SAP items until a substantive decision (A or B) is made

---

## 5. KPI Impact Projection

Surface these impact numbers alongside the recommendation:

| KPI | Current | After Option A ($1.08M) | After Option B ($1.8M) |
|-----|---------|------------------------|------------------------|
| Cash Day 7 | $42.3M | +$1.08M → ~$43.4M | +$1.8M → ~$44.1M |
| Overdue AR | $6.2M | −$1.08M → $5.12M | −$1.8M → $4.4M |
| DSO | 48d | −1.2d → ~47d | −2.1d → ~46d |
| Delta relationship risk | — | Low (partial, within authority) | Medium–High (formal demand) |

These are estimates. Update with actuals from `fact_ar_open_items` refresh after execution.

---

## 6. Monitoring & Follow-up Rules

After execution of Option A or B, the agent must:

1. **Poll ar-collections@company.com** daily for payment confirmation from Delta Retail (any email from `@deltaretailgroup.com` domain)
2. **Check `fact_collections_activity` `PROMISE_TO_PAY_DATE`** — if no promise date is logged by Day 5 and no payment received, escalate to @RaviKumar
3. **Day 8 trigger (Option A only):** If no payment confirmation in email inbox → auto-notify @LegalTeam to review Legal hold `LH-YYYY-XXXX` for activation
4. **Day 6 trigger (Option B only):** If no payment commitment in CRM → auto-forward legal brief to @LegalTeam
5. **Monitor `fact_ar_open_items`** OVERDUE_DAYS_CALC on each daily refresh; if INV-78421 or INV-78435 are cleared (AUGDT and AUGBL populated in BSAD), close `fact_collections_activity` collection cases and surface a “Collection Resolved” notification in the War Room

---

## 7. Related References

| Reference | Description | Location |
|-----------|-------------|----------|
| AR-03 | Direct Collection Authority policy | SharePoint/Finance/Policies/AR-03.pdf |
| AR-05 | Escalated Collection Authority policy | SharePoint/Finance/Policies/AR-05.pdf |
| LH-2024-0091 | Pre-litigation hold case (created at execution) | Legal CMS |
| APP-YYYY-XXXX | CFO approval workflow ref (Option B only) | SAP Business Workflow / WorkItems |
| DL-YYYY-XXXX | Formal demand letter document (Option B only) | SharePoint/Legal/DemandLetters/ |
| `fact_collections_activity` | Collections activity log (write-back target) | `../data-contracts/fact_collections_activity.csv` |
| AI-001 | Core agent rules and authority matrix | `AI-001_AR-COLLECTIONS-CORE-AGENT.md` |
