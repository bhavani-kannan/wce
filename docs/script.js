/* =============================================================
   Working Capital War Room — Script
   ============================================================= */

// ── Tab switching ─────────────────────────────────────────────
function switchTab(tab, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    if (btn) btn.classList.add('active');
}

// ── Decision response library ─────────────────────────────────
const RESPONSES = {
    'delta-retail': {
        partial: {
            cfo:   'Collect $1.08M now from Delta Retail. @RaviKumar owns the Day 7 follow-up on the remaining $720K.',
            agent: '<strong>Executed at 07:44 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-green">①</span> <strong>Collections workflow triggered</strong> in <a href="#" class="trace-link" data-tooltip="SAP Collections Management&#10;Customer: Delta Retail&#10;SAP Customer ID: CUST-004821&#10;Workflow: WF-COL-PARTIAL&#10;Invoices in scope: INV-78421, INV-78435 (partial)&#10;Collection amount: $1,080,000&#10;Status set to: IN_COLLECTION&#10;Triggered by: Agent at 07:44">SAP Collections</a> (Customer ID: CUST-004821) &mdash; INV-78421 + INV-78435 partial flagged as <em>IN_COLLECTION</em>. Remaining INV-78435 balance ($720K) placed in <em>PENDING_FOLLOWUP</em> queue, assigned to @RaviKumar with deadline 13 Apr 07:44.<br><br>' +
                   '<span class="text-blue">②</span> <strong>Teams message sent to @RaviKumar</strong> &mdash; <em>"Delta Retail: CFO has approved $1.08M partial collection. INV-78421 and partial INV-78435 now in collection. You own the $720K follow-up by Day 7 (13 Apr). SAP ref: CUST-004821. Ping me if they don\'t confirm by Day 5."</em> Delivery confirmed 07:44.<br><br>' +
                   '<span class="text-blue">③</span> <strong>Authority check completed:</strong> <a href="#" class="trace-link" data-tooltip="Policy: AR-03 &mdash; Direct Collection Authority&#10;Owner: @RaviKumar&#10;Ceiling: $1,500,000&#10;$1.08M is within limit — no escalation required&#10;Policy document: SharePoint/Finance/Policies/AR-03.pdf">Policy AR-03</a> confirmed $1.08M is within @RaviKumar\'s $1.5M direct authority. No approval routing needed.<br><br>' +
                   '<span class="text-orange">④</span> <strong>Legal hold case opened</strong> in <a href="#" class="trace-link" data-tooltip="Legal Case Management System&#10;Ref: LH-2024-0091&#10;Case type: Pre-litigation Hold&#10;Invoices: INV-78421, INV-78435&#10;Status: DORMANT&#10;Auto-escalation trigger: No payment confirmation by Day 8 (14 Apr)&#10;Owner: @LegalTeam">Legal CMS (Ref LH-2024-0091)</a> &mdash; status DORMANT. Monitoring service inbox <em>ar-collections@company.com</em> for payment confirmation. If none by Day 8, case auto-advances to @LegalTeam for pre-litigation review.'
        },
        full: {
            cfo:   'Full $1.8M demand from Delta Retail. 5 business days to pay — legal brief prepared for Day 6.',
            agent: '<strong>Executed at 07:44 &mdash; 5 steps completed:</strong><br><br>' +
                   '<span class="text-red">①</span> <strong>CFO approval requested</strong> via <a href="#" class="trace-link" data-tooltip="Approval Workflow System&#10;Ref: APP-2024-0091&#10;Policy: AR-05 — Escalated Collection&#10;Requires: CFO sign-off for formal demand &gt;$1.5M&#10;Sent to: @SeniorCFO on Teams&#10;Status: PENDING — SLA 30 mins">Approval Workflow APP-2024-0091</a> &mdash; Teams notification sent to @SeniorCFO at 07:44. Policy AR-05: CFO sign-off required before external demand letters are issued above $1.5M.<br><br>' +
                   '<span class="text-red">②</span> <strong>Demand letter draft staged</strong> by @LegalTeam in <a href="#" class="trace-link" data-tooltip="Legal Document Management&#10;Ref: DL-2024-0031&#10;Type: Formal Payment Demand&#10;Customer: Delta Retail&#10;Invoices: INV-78421 ($950K) + INV-78435 ($850K)&#10;Total demanded: $1,800,000&#10;Interest clause: Yes (per contract cl. 8.4)&#10;Status: DRAFT — awaiting CFO approval APP-2024-0091&#10;Will be sent by: @LegalTeam via tracked post + email">Legal DMS (Ref DL-2024-0031)</a> &mdash; formal demand letter covering INV-78421 and INV-78435, including interest accrual per contract clause 8.4. Will be dispatched by @LegalTeam only after APP-2024-0091 is approved by @SeniorCFO.<br><br>' +
                   '<span class="text-blue">③</span> <strong>Teams message sent to @SarahAndrews</strong> (Account Manager) &mdash; <em>"Heads up: Delta Retail escalated to formal demand track pending CFO sign-off. Please do not contact them commercially until @RaviKumar gives the all-clear. Legal hold ref DL-2024-0031 is staged."</em><br><br>' +
                   '<span class="text-orange">④</span> <strong>Chase schedule set in CRM:</strong> <a href="#" class="trace-link" data-tooltip="CRM Task Schedule&#10;Customer: Delta Retail (CRM-ID: CR-004821)&#10;Task 1: Day 3 — automated chase reminder to @RaviKumar&#10;Task 2: Day 4 — second reminder to @RaviKumar + @SeniorCFO&#10;Task 3: Day 5 — CFO review meeting (09:00 calendar hold placed)&#10;Task 4: Day 6 — Legal brief auto-forwarded to @LegalTeam if no payment commitment">CRM-ID CR-004821</a> &mdash; 3 automated reminder tasks + Day 5 CFO calendar hold created. @SeniorCFO\'s PA notified of Day 5 09:00 hold.<br><br>' +
                   '<span class="text-red">⑤</span> <strong>SAP AR status reserved:</strong> <a href="#" class="trace-link" data-tooltip="SAP AR Module&#10;Customer: Delta Retail (CUST-004821)&#10;INV-78421 + INV-78435 status: ESCALATED_DEMAND&#10;CreditFlag: REVIEW&#10;Block on further credit extension: Y&#10;Set by: Agent at 07:44&#10;Pending: CFO approval APP-2024-0091 before external despatch">CUST-004821</a> flagged <em>ESCALATED_DEMAND</em> in SAP. Credit extension blocked until resolution confirmed.'
        }
    },
    'orbis-tech': {
        hold: {
            cfo:   'Orbis Tech on credit hold now. Block all 3 shipments. @RaviKumar dials Sarah Chen daily at 09:00.',
            agent: '<strong>Executed at 07:44 &mdash; 5 steps completed:</strong><br><br>' +
                   '<span class="text-red">①</span> <strong>Credit hold activated in SAP</strong> &mdash; <a href="#" class="trace-link" data-tooltip="SAP Customer Master&#10;Customer: Orbis Tech&#10;SAP Customer ID: CUST-007392&#10;Field updated: CustomerCreditBlock = TRUE&#10;Previous value: FALSE&#10;Changed by: Agent at 07:44&#10;Effect: All new sales orders rejected at order-entry. Existing unshipped orders blocked at WM pick stage.&#10;Ref: CH-2024-0018">CUST-007392 / CustomerCreditBlock = TRUE</a> (Ref CH-2024-0018). No new orders can progress past order-entry until @RaviKumar or CFO sets CustomerCreditBlock = FALSE.<br><br>' +
                   '<span class="text-red">②</span> <strong>3 shipments blocked in WMS:</strong> <a href="#" class="trace-link" data-tooltip="Warehouse Management System&#10;SO-9821 ($820K) — Status: PICK_HOLD&#10;SO-9834 ($730K) — Status: PICK_HOLD&#10;SO-9847 ($550K) — Status: PICK_HOLD&#10;Hold reason code: CREDIT_BLOCK_CH-2024-0018&#10;Applied at: 07:44&#10;Exposure frozen at: $2.1M">SO-9821 / SO-9834 / SO-9847</a> set to PICK_HOLD in WMS. Teams notification sent to @LogisticsTeam channel at 07:44 &mdash; <em>"Orbis Tech: 3 orders blocked pending credit hold CH-2024-0018. Do not despatch without clearance from @RaviKumar."</em><br><br>' +
                   '<span class="text-orange">③</span> <strong>Teams message sent to @SarahAndrews</strong> (Account Manager) &mdash; <em>"Orbis Tech has been placed on credit hold (CH-2024-0018) by CFO instruction. Please call Sarah Chen (Head of Finance, Orbis Tech) today and inform her the hold is live. Stress that $1.3M on INV-76890 must be settled or we need a written commitment before the hold can lift. Log the call outcome back here."</em><br><br>' +
                   '<span class="text-blue">④</span> <strong>Daily follow-up task created in CRM:</strong> <a href="#" class="trace-link" data-tooltip="CRM Task — Orbis Tech (CR-007392)&#10;Task type: COLLECTIONS_DAILY_CALL&#10;Assigned to: @RaviKumar&#10;Recurs: 09:00 daily&#10;Trigger to close: Written payment commitment logged in CRM&#10;Escalates to: @SeniorCFO if no commitment by Day 3">CR-007392</a> &mdash; @RaviKumar receives a 09:00 daily Teams reminder until a written payment commitment is recorded in CRM. First prompt fires at 09:00 today.<br><br>' +
                   '<span class="text-red">⑤</span> <strong>Legal brief queued in Legal CMS:</strong> <a href="#" class="trace-link" data-tooltip="Legal Case Management&#10;Ref: LE-2024-0022&#10;Type: Pre-litigation Brief&#10;Customer: Orbis Tech (CUST-007392)&#10;Invoice: INV-76890 ($1.3M)&#10;Status: STAGED&#10;Auto-activates: Day 3 (9 Apr 07:00) if CRM shows no written payment commitment&#10;Owner on activation: @LegalTeam">LE-2024-0022</a> &mdash; status STAGED. @LegalTeam pinged on Teams to confirm awareness. Auto-advances to ACTIVE at 07:00 Day 3 if no commitment is in CRM.'
        },
        escalate: {
            cfo:   'CFO personal outreach to Michael Tan at Orbis Tech. 3-day window. Credit hold auto-fires Day 3 if no response.',
            agent: '<strong>Executed at 07:44 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-orange">①</span> <strong>Teams message sent to @SeniorCFO</strong> &mdash; <em>"Action needed: Please reach out directly to Michael Tan, CFO at Orbis Tech (m.tan@orbistech.com), regarding INV-76890 ($1.3M, 62 days overdue). This is a final goodwill step before credit hold CH-2024-0018 fires on Day 3. I have drafted a short message for you to send from your email — see SharePoint/Drafts/OT-CFO-Outreach-6Apr.docx. Please confirm once sent."</em> Calendar reminder set for @SeniorCFO at 08:30 today.<br><br>' +
                   '<span class="text-red">②</span> <strong>Shipment entry block applied in SAP:</strong> <a href="#" class="trace-link" data-tooltip="SAP Sales Order Entry&#10;Customer: Orbis Tech (CUST-007392)&#10;Field: OrderEntryBlock = SOFT_HOLD&#10;Orders affected: SO-9821, SO-9834, SO-9847&#10;Effect: Orders cannot advance beyond Order Confirmed state&#10;Removes when: Written payment commitment logged in CRM by @RaviKumar">CUST-007392 / OrderEntryBlock = SOFT_HOLD</a> &mdash; @LogisticsTeam notified via Teams. Existing orders frozen; no new orders accepted. Exposure capped at $2.1M.<br><br>' +
                   '<span class="text-orange">③</span> <strong>Credit hold CH-2024-0018 staged in SAP</strong> with <a href="#" class="trace-link" data-tooltip="Approval Workflow&#10;Ref: APP-2024-0092&#10;Pre-approved by: @SeniorCFO at 07:44&#10;Trigger condition: No written payment commitment in CRM by Day 3 (09 Apr 07:00)&#10;On trigger: CustomerCreditBlock = TRUE auto-set, @LegalTeam notified, LE-2024-0022 activated">auto-activation rule APP-2024-0092</a>: if CRM shows no written commitment from Orbis Tech by 07:00 Day 3, CustomerCreditBlock flips to TRUE without further human input.<br><br>' +
                   '<span class="text-blue">④</span> <strong>Monitoring active on service inbox</strong> <em>ar-escalations@company.com</em>: any inbound email from <em>@orbistech.com</em> domain flagged in real time to @RaviKumar and @SeniorCFO via Teams alert. CRM task <a href="#" class="trace-link" data-tooltip="CRM Task — Orbis Tech (CR-007392)&#10;Task: CFO_ESCALATION_REVIEW&#10;Day 3 (09 Apr) 09:00 — @SeniorCFO reviews outcome&#10;@SarahAndrews to submit contact log by 08:30 Day 3">CR-007392</a> scheduled for Day 3 09:00 CFO review.'
        }
    },
    'pinnacle-foods': {
        split: {
            cfo:   'Collect $620K now — undisputed invoices. $280K dispute tracked separately via POD. @DispatchTeam owns it by Day 7.',
            agent: '<strong>Executed at 07:45 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-green">①</span> <strong>Collections workflow triggered in SAP</strong> for <a href="#" class="trace-link" data-tooltip="SAP Collections Management&#10;Customer: Pinnacle Foods (CUST-009104)&#10;INV-79080 ($300K) — Status: IN_COLLECTION&#10;INV-79145 ($320K) — Status: IN_COLLECTION&#10;INV-79210 ($280K) — Status: DISPUTE_HOLD (excluded from collection)&#10;Workflow: WF-COL-SPLIT&#10;Assigned to: @RaviKumar">CUST-009104</a> &mdash; INV-79080 and INV-79145 set to IN_COLLECTION. INV-79210 set to DISPUTE_HOLD and ring-fenced in <a href="#" class="trace-link" data-tooltip="Dispute Management Module&#10;Ref: DSP-2024-0041&#10;Invoice: INV-79210 ($280K)&#10;Dispute type: QUANTITY_SHORTFALL&#10;Claimed by: Pinnacle Foods&#10;Owner: @DispatchTeam&#10;Resolution target: 13 Apr (Day 7)">DSP-2024-0041</a>. The two collection tracks are independent — dispute does not affect $620K timeline.<br><br>' +
                   '<span class="text-blue">②</span> <strong>Teams message sent to @RaviKumar</strong> &mdash; <em>"Pinnacle Foods: CFO approved split collection. INV-79080 + INV-79145 ($620K) are in SAP as IN_COLLECTION. Please call Linda Wu (AP Manager, Pinnacle Foods) today to confirm payment timing. INV-79210 is in Dispute Hold — do not chase that one until @DispatchTeam closes POD-2024-0119."</em><br><br>' +
                   '<span class="text-orange">③</span> <strong>POD task raised in Dispatch system</strong> &mdash; <a href="#" class="trace-link" data-tooltip="Dispatch & Logistics System&#10;POD Request Ref: POD-2024-0119&#10;Despatch Note: DN-4421&#10;Bill of Lading: BL-7832&#10;Shipment date: 25 Mar 2026&#10;Units expected: 840&#10;Assigned to: @AmitShah (Warehouse Manager)&#10;Status: OPEN&#10;Deadline: 07 Apr 07:45&#10;On completion: Agent auto-updates DSP-2024-0041 in dispute tracker">POD-2024-0119</a> assigned to @AmitShah. Teams ping sent to @DispatchTeam channel: <em>"Urgent: POD needed for DN-4421 / BL-7832 to Pinnacle Foods (25 Mar). Needed by 07:45 tomorrow. Dispute DSP-2024-0041 cannot close without this."</em><br><br>' +
                   '<span class="text-blue">④</span> <strong>Dispute tracker updated</strong> and monitoring active: Agent polling <a href="#" class="trace-link" data-tooltip="Dispute Tracker&#10;DSP-2024-0041 — Pinnacle Foods / INV-79210&#10;Owner: @DispatchTeam&#10;Status: AWAITING_POD&#10;Next review: 07 Apr 07:45&#10;Escalation: @RaviKumar if POD not received by deadline">DSP-2024-0041</a> every 4 hours. @RaviKumar receives daily digest at 08:00 until resolved.'
        },
        full: {
            cfo:   'Counter-claim on full $900K. POD evidence compiled. @LegalTeam drafts dispute letter — @RaviKumar reviews before despatch.',
            agent: '<strong>Executed at 07:45 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-green">①</span> <strong>POD evidence package assembled</strong> from <a href="#" class="trace-link" data-tooltip="Dispatch & Logistics System&#10;Despatch Note: DN-4421 — 840 units, full load&#10;Bill of Lading: BL-7832 — signed by haulier&#10;Warehouse timestamp: 25 Mar 2026 14:32 — all units loaded&#10;Source system: Dispatch & Logistics (DL-module)&#10;PDF bundle compiled: POD-PKG-2024-0031.pdf&#10;Forwarded to: @LegalTeam SharePoint folder">Despatch System</a> &mdash; DN-4421, BL-7832, and warehouse loading timestamp (25 Mar 14:32) compiled into POD-PKG-2024-0031.pdf and placed in @LegalTeam\'s SharePoint case folder.<br><br>' +
                   '<span class="text-red">②</span> <strong>Teams message sent to @LegalTeam</strong> &mdash; <em>"Please draft a formal counter-claim letter (Ref CC-2024-0031) against Pinnacle Foods for Invoice 79210 ($280K), part of total demand $900K. POD evidence is in your SharePoint folder (POD-PKG-2024-0031.pdf). @RaviKumar will review the draft before it is sent externally. Target: draft ready by 12:00 today."</em><br><br>' +
                   '<span class="text-orange">③</span> <strong>SAP AR updated:</strong> <a href="#" class="trace-link" data-tooltip="SAP AR Module&#10;Customer: Pinnacle Foods (CUST-009104)&#10;INV-79080 — Status: IN_COLLECTION&#10;INV-79145 — Status: IN_COLLECTION&#10;INV-79210 — Status: COUNTER_CLAIM&#10;CreditFlag: REVIEW&#10;Dispute Module Ref: DSP-2024-0041&#10;Updated by: Agent 07:45">CUST-009104</a> &mdash; all 3 invoices updated. INV-79210 set to COUNTER_CLAIM; CreditFlag set to REVIEW. CRM task <a href="#" class="trace-link" data-tooltip="CRM Task CR-009104&#10;Task: DISPUTE_FOLLOWUP&#10;Day 3 — @RaviKumar checks draft with @LegalTeam&#10;Day 7 — @RaviKumar reviews Pinnacle response&#10;Day 8 — escalation to @SeniorCFO if unresolved">CR-009104</a> opened with Day 3 review and Day 7 escalation milestones.<br><br>' +
                   '<span class="text-blue">④</span> <strong>Cash forecast updated:</strong> $900K moved to <em>Counter-Dispute Probable</em> tier in the 7-day position model. Treasury dashboard will show updated Day 10 Probable column within 5 minutes.'
        }
    },
    'summit-discount': {
        capture: {
            cfo:   'Pay Summit Chemicals $1.872M by Day 3. $28.5K discount locked in. 27% annualised return.',
            agent: '<strong>Executed at 07:48 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-green">①</span> <strong>Payment instruction created in SAP AP:</strong> <a href="#" class="trace-link" data-tooltip="SAP AP Module&#10;Payment Instruction Ref: PI-2024-0471&#10;Vendor: Summit Chemicals (VEND-003318)&#10;Invoice: INV-8810&#10;Gross amount: $1,900,000&#10;Early pay discount applied: $28,500 (1.5%)&#10;Net payment: $1,872,000&#10;Payment date: 08 Apr 2026 (Day 3)&#10;Discount window closes: 11 Apr 2026&#10;Status: PENDING_APPROVAL&#10;Routed to: @APManager via SAP workflow">PI-2024-0471</a> &mdash; $1,872,000 to Summit Chemicals (VEND-003318), payment date Day 3 (8 Apr). Status PENDING_APPROVAL. Teams notification sent to @APManager: <em>"Summit Chemicals early-pay PI-2024-0471 is waiting for your approval in SAP. Discount window closes 11 Apr — please approve today."</em><br><br>' +
                   '<span class="text-green">②</span> <strong>Discount adjustment posted:</strong> <a href="#" class="trace-link" data-tooltip="SAP AP Ledger&#10;Adjustment Ref: ADJ-2024-0088&#10;Type: Early Payment Discount&#10;Amount: $28,500 (credit)&#10;GL Account: AP-DISC-2026&#10;Cost Centre: Treasury&#10;Period: Apr 2026&#10;Status: POSTED">ADJ-2024-0088</a> &mdash; $28,500 saving posted to GL Account AP-DISC-2026. Teams message sent to @FinanceTeam: <em>"Early-pay discount $28.5K posted for Summit Chemicals (ADJ-2024-0088). Please include in Apr month-end accrual run."</em><br><br>' +
                   '<span class="text-blue">③</span> <strong>Liquidity check run:</strong> Treasury position model queried at 07:47 &mdash; post-payment balance $40.4M, which is $2.4M above the $38M floor. Scenario cleared. Check result stored in <a href="#" class="trace-link" data-tooltip="Treasury Liquidity Log&#10;Run at: 07:47&#10;Pre-payment balance: $42.3M&#10;Payment: $1,872,000&#10;Post-payment: $40,428,000&#10;Floor: $38,000,000&#10;Headroom: $2,428,000&#10;Status: CLEARED">Liquidity Log at 07:47</a>.<br><br>' +
                   '<span class="text-blue">④</span> <strong>Vendor master updated in SAP:</strong> <a href="#" class="trace-link" data-tooltip="SAP Vendor Master&#10;Vendor: Summit Chemicals (VEND-003318)&#10;Field: EarlyPayPreference = REQUEST_ON_ALL_INVOICES_GT_500K&#10;Note added: Vendor receptive to 1.5/10 discount offers. Last confirmed: 06 Apr 2026.&#10;Updated by: Agent 07:48">VEND-003318 / EarlyPayPreference updated</a>. @APManager will see this flag on every future Summit Chemicals invoice above $500K.'
        },
        pass: {
            cfo:   'Standard payment Day 32. $28.5K opportunity logged. @APManager to request same offer on next invoice.',
            agent: '<strong>Executed at 07:48 &mdash; 3 steps completed:</strong><br><br>' +
                   '<span class="text-gray">①</span> <strong>Standard payment confirmed in SAP AP:</strong> <a href="#" class="trace-link" data-tooltip="SAP AP Module&#10;Payment Instruction Ref: PI-2024-0472&#10;Vendor: Summit Chemicals (VEND-003318)&#10;Invoice: INV-8810&#10;Amount: $1,900,000 (full, no discount)&#10;Payment date: 07 May 2026 (Day 32)&#10;Status: SCHEDULED">PI-2024-0472</a> &mdash; $1,900,000 scheduled for 7 May 2026. No ledger changes required today.<br><br>' +
                   '<span class="text-blue">②</span> <strong>Opportunity logged in AP Register:</strong> <a href="#" class="trace-link" data-tooltip="AP Opportunity Register&#10;Ref: OPP-2024-0031&#10;Amount foregone: $28,500&#10;Reason: Cash position decision — CFO passed this cycle&#10;Reminder: 2 May 2026 (Day 25) — @APManager to request 1.5/10 offer on next Summit Chemicals invoice&#10;Recurring flag: YES">OPP-2024-0031</a> &mdash; $28,500 missed saving recorded. Day 25 reminder (2 May) set for @APManager in CRM to request the offer on the next invoice cycle.<br><br>' +
                   '<span class="text-gray">③</span> <strong>Teams message sent to @APManager</strong> &mdash; <em>"Summit Chemicals discount passed this cycle by CFO decision. $1.9M full payment due Day 32 (PI-2024-0472 scheduled). Reminder set for Day 25 to ask for the same offer on their next invoice. Opportunity ref: OPP-2024-0031."</em>'
        }
    }
};

// ── Dispute action library ────────────────────────────────────
const DISPUTE_RESPONSES = {
    'pinnacle-pod': {
        msg: '<strong>Executed at 07:45 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-blue">①</span> <strong>POD task created</strong> in Dispatch system &mdash; <a href="#" class="trace-link" data-tooltip="Dispatch & Logistics System&#10;POD Request: POD-2024-0119&#10;Despatch Note: DN-4421&#10;Bill of Lading: BL-7832&#10;Shipment date: 25 Mar 2026&#10;Units: 840&#10;Assigned to: @AmitShah&#10;Deadline: 07 Apr 07:45&#10;Status: OPEN">POD-2024-0119 / DN-4421 / BL-7832</a> assigned to @AmitShah (Warehouse Manager). Deadline: 07:45 tomorrow.<br><br>' +
             '<span class="text-orange">②</span> <strong>Teams message sent to @DispatchTeam</strong> &mdash; <em>"Urgent: POD required for March 25 Pinnacle Foods delivery (DN-4421 / BL-7832). They are claiming an 18% shortfall on 840 units. Please pull the signed POD and loading records and upload to POD-2024-0119 by 07:45 tomorrow. This is blocking $280K in dispute DSP-2024-0041."</em><br><br>' +
             '<span class="text-blue">③</span> <strong>Monitoring active:</strong> Agent polling <a href="#" class="trace-link" data-tooltip="Dispute Tracker&#10;DSP-2024-0041 — Pinnacle Foods INV-79210&#10;Status: AWAITING_POD&#10;When POD-2024-0119 is closed, agent auto-notifies @RaviKumar and updates DSP-2024-0041 status">DSP-2024-0041</a> every 2 hours. @RaviKumar notified automatically when @AmitShah closes POD-2024-0119.'
    },
    'pinnacle-counterclaim': {
        msg: '<strong>Executed at 07:46 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-red">①</span> <strong>Teams message sent to @LegalTeam</strong> &mdash; <em>"Please draft counter-claim letter CC-2024-0031 against Pinnacle Foods for Invoice 79210 ($280K). POD evidence (DN-4421, BL-7832) is in your SharePoint case folder. @RaviKumar to review draft before external despatch. Target: draft by 12:00 today."</em><br><br>' +
             '<span class="text-red">②</span> <strong>Dispute status updated</strong> in <a href="#" class="trace-link" data-tooltip="Dispute Tracker&#10;Ref: DSP-2024-0041&#10;Invoice: INV-79210 ($280K)&#10;Previous status: AWAITING_POD&#10;New status: COUNTER_CLAIM_STAGED&#10;Owner: @LegalTeam&#10;External despatch: Pending @RaviKumar review">DSP-2024-0041</a> &mdash; status moved to COUNTER_CLAIM_STAGED. SAP <a href="#" class="trace-link" data-tooltip="SAP AR Module&#10;Customer: Pinnacle Foods (CUST-009104)&#10;INV-79210 Status: COUNTER_CLAIM&#10;CreditFlag: REVIEW">CUST-009104 / INV-79210</a> set to COUNTER_CLAIM.<br><br>' +
             '<span class="text-orange">③</span> <strong>CRM task created</strong> for @RaviKumar &mdash; <a href="#" class="trace-link" data-tooltip="CRM Task — Pinnacle Foods (CR-009104)&#10;Task: Review counter-claim draft from @LegalTeam&#10;Due: 06 Apr 14:00&#10;Escalates to: @SeniorCFO if not reviewed by 16:00">CR-009104</a> review by 14:00 today, with escalation to @SeniorCFO at 16:00 if outstanding.'
    },
    'pinnacle-creditnote': {
        msg: '<strong>Executed at 07:46 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-green">①</span> <strong>Credit note raised in SAP:</strong> <a href="#" class="trace-link" data-tooltip="SAP AR Module&#10;Credit Note: CN-2046&#10;Customer: Pinnacle Foods (CUST-009104)&#10;Against: INV-79210&#10;Amount: $280,000&#10;GL Account: AR-ADJUSTMENTS&#10;Status: POSTED&#10;Period: Apr 2026">CN-2046 / CUST-009104</a> &mdash; $280K posted to GL AR-ADJUSTMENTS. INV-79210 cleared from AR ledger. @FinanceTeam notified via Teams for month-end reconciliation.<br><br>' +
             '<span class="text-blue">②</span> <strong>Dispute DSP-2024-0041 closed</strong> in tracker &mdash; status set to RESOLVED. @RaviKumar notified. $620K collection on INV-79080 and INV-79145 continues on its current IN_COLLECTION timeline without impact.<br><br>' +
             '<span class="text-gray">③</span> <strong>Teams message sent to @RaviKumar</strong> &mdash; <em>"Pinnacle Foods INV-79210 written off via CN-2046. DSP-2024-0041 closed. The $620K on INV-79080 and INV-79145 is still in collection — no change there. Cash forecast updated."</em>'
    },
    'corelogistics-rejection': {
        msg: '<strong>Executed at 07:48 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-red">①</span> <strong>Teams message sent to @APManager</strong> &mdash; <em>"Core Logistics invoice INV-8821 is $42K over PO PO-7743 ($808K vs. $850K). No authorised change order on file. Please formally reject it in the AP inbox and request a corrected invoice by Day 5 (11 Apr). I have logged this as dispute AP-DSP-2024-0018 in the AP system."</em><br><br>' +
             '<span class="text-red">②</span> <strong>AP dispute record opened:</strong> <a href="#" class="trace-link" data-tooltip="SAP AP Dispute Module&#10;Ref: AP-DSP-2024-0018&#10;Vendor: Core Logistics (VEND-001147)&#10;Invoice: INV-8821 ($850K)&#10;PO: PO-7743 ($808K)&#10;Discrepancy: $42,000 — no change order&#10;Status: REJECTED_PENDING_CORRECTION&#10;Payment block set on INV-8821&#10;Corrected invoice deadline: 11 Apr 2026">AP-DSP-2024-0018</a> &mdash; INV-8821 payment block applied in SAP (VEND-001147 / PaymentBlock = DISPUTE). Will not release until corrected invoice received and @APManager removes the block.<br><br>' +
             '<span class="text-blue">③</span> <strong>Teams message sent to @ProcurementHead</strong> &mdash; <em>"Heads up: Core Logistics INV-8821 overcharged by $42K vs. PO-7743. @APManager is requesting a corrected invoice. If it doesn\'t arrive by Day 5, you may need to call their account manager. Ref AP-DSP-2024-0018."</em>'
    },
    'corelogistics-release': {
        msg: '<strong>Executed at 07:49 &mdash; 4 steps:</strong><br><br>' +
             '<span class="text-orange">①</span> <strong>CFO approval requested</strong> via <a href="#" class="trace-link" data-tooltip="Approval Workflow&#10;Ref: APP-2024-0093&#10;Policy: AP-07 — Disputed Invoice Release&#10;Requires: CFO sign-off for payment on disputed AP above $25K&#10;Sent to: @SeniorCFO on Teams&#10;SLA: 2 hours">APP-2024-0093</a> &mdash; Teams message to @SeniorCFO: <em>"Please approve payment of $808,000 (PO value) to Core Logistics for INV-8821, releasing at our contracted amount and formally contesting the $42K balance. Policy AP-07 requires your sign-off on disputed AP above $25K. Ref APP-2024-0093."</em><br><br>' +
             '<span class="text-orange">②</span> <strong>Payment instruction staged in SAP</strong> for <a href="#" class="trace-link" data-tooltip="SAP AP Module&#10;Payment Instruction: PI-2024-0473&#10;Vendor: Core Logistics (VEND-001147)&#10;Invoice: INV-8821&#10;Payment amount: $808,000 (PO value)&#10;Contested: $42,000&#10;Status: STAGED — awaiting APP-2024-0093&#10;Payment date: Day 12 (18 Apr)">PI-2024-0473</a> &mdash; $808,000 to Core Logistics, status STAGED pending CFO approval. Will not release to payment run until APP-2024-0093 is approved.<br><br>' +
             '<span class="text-red">③</span> <strong>Teams message sent to @APManager</strong> &mdash; <em>"Once @SeniorCFO approves APP-2024-0093, please send Core Logistics a remittance note stating $808K has been paid at PO value and $42K is formally contested. Keep it factual — reference PO-7743 and the absence of a change order."</em><br><br>' +
             '<span class="text-blue">④</span> <strong>Dispute AP-DSP-2024-0018 updated</strong> to PAYMENT_RELEASED_PARTIAL. Monitoring <em>ap-invoices@company.com</em> service inbox for any response from Core Logistics regarding the $42K.'
    },
    'corelogistics-escalate': {
        msg: '<strong>Executed at 07:49 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-orange">①</span> <strong>Teams message sent to @ProcurementHead</strong> &mdash; <em>"Escalation needed: Core Logistics INV-8821 is $42K over PO-7743 ($808K contracted, $850K invoiced). No change order exists. @APManager has rejected the invoice and requested a correction by Day 5 (11 Apr). Please call their account manager today and make clear we will not pay above PO value. Log your conversation outcome in Dispute AP-DSP-2024-0018."</em> Calendar hold set for @ProcurementHead at 09:00 today.<br><br>' +
             '<span class="text-blue">②</span> <strong>Dispute AP-DSP-2024-0018 updated</strong> in <a href="#" class="trace-link" data-tooltip="SAP AP Dispute Module&#10;Ref: AP-DSP-2024-0018&#10;Status: ESCALATED_TO_PROCUREMENT&#10;Owner: @ProcurementHead&#10;Previous owner: @APManager&#10;Deadline: 11 Apr 2026 (Day 5)&#10;Escalation chain: @APManager → @ProcurementHead → @SeniorCFO">AP-DSP-2024-0018</a> &mdash; status changed to ESCALATED_TO_PROCUREMENT. Owner updated to @ProcurementHead.<br><br>' +
             '<span class="text-blue">③</span> <strong>CRM task created</strong> for @ProcurementHead &mdash; <a href="#" class="trace-link" data-tooltip="CRM Task&#10;Vendor: Core Logistics (CR-001147)&#10;Task: DISPUTE_PROCREMENT_CALL&#10;Due: 06 Apr 12:00&#10;Escalates to @SeniorCFO if no update logged by Day 5 EOD">CR-001147</a> &mdash; outcome of call to be logged by Day 5 EOD. If no update, auto-escalates to @SeniorCFO.'
    }
};

/**
 * Handles agent action on a dispute card.
 */
function resolveDispute(actionId) {
    const res = DISPUTE_RESPONSES[actionId];
    if (!res) return;

    const responseEl = document.getElementById('dispute-response-' + actionId);
    if (responseEl) {
        responseEl.innerHTML = `
            <div class="response-card" style="margin-top:8px;">
                <div style="font-size:11px;color:#6ee7b7;margin-bottom:4px;font-style:normal;font-weight:700;">AGENT EXECUTING</div>
                ${res.msg}
            </div>`;
    }
}

/**
 * Handles CFO decision selection on a card.
 */
function decide(decisionId, choice) {
    const res = RESPONSES[decisionId]?.[choice];
    if (!res) return;

    const responseEl = document.getElementById('response-' + decisionId);
    const card       = document.getElementById('decision-' + decisionId);

    if (responseEl) {
        responseEl.innerHTML = `
            <div class="response-card">
                <div style="font-size:11px;color:#6ee7b7;margin-bottom:4px;font-style:normal;font-weight:700;">CFO CONFIRMED</div>
                <span style="font-style:normal;">${res.cfo}</span>
            </div>
            <div class="agent-label mt-10">Agent &mdash; Actions Taken</div>
            <div class="card good" style="margin-bottom:0;font-size:13px;line-height:1.7;">
                ${res.agent}
            </div>`;
    }

    if (card) {
        card.querySelectorAll('button').forEach(btn => { btn.disabled = true; });
        card.style.borderLeftColor = '#22c55e';
    }
}

function showQueryInput(id) {
    const box = document.getElementById('query-' + id);
    if (box) box.classList.remove('hidden');
}

function sendQuery(id) {
    const input      = document.getElementById('query-input-' + id);
    const responseEl = document.getElementById('response-' + id);
    const val        = (input?.value || '').trim();
    if (!val) return;

    if (responseEl) {
        responseEl.innerHTML = `
            <div class="response-card" style="color:#fde68a;">
                <div style="font-size:11px;color:#60a5fa;margin-bottom:4px;font-style:normal;font-weight:700;">QUERY SENT</div>
                "${val}"
            </div>
            <div class="agent-label mt-10">Agent</div>
            <div class="card info" style="margin-bottom:0;">
                Query routed. Owner notified. Update expected within 2 hours.
            </div>`;
    }

    const box = document.getElementById('query-' + id);
    if (box) box.classList.add('hidden');
    if (input) input.value = '';
}

// ── Scenario simulation ───────────────────────────────────────

const SCENARIO_DATA = {
    bull: {
        color:     '#22c55e',
        iconClass: 'icon-good',
        iconChar:  '▲',
        steps: [
            {
                delay: 0,
                type:  'info',
                time:  '07:43',
                icon:  'icon-agent',
                char:  '⚡',
                html:  `<strong>Bull Case Simulation — Running</strong><br>
                        All levers engaged. Modelling maximum working capital extraction this week.
                        Cash position tracked in real time as each action completes.`
            },
            {
                delay: 900,
                type:  'good',
                time:  '07:44',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Delta Retail &mdash; Full $1.8M collected</strong><br>
                        CFO-level escalation triggered. Parent entity cash confirmed ($42M). Hard demand letter served.
                        Full $1.8M cleared in 4 business days. <span class="text-green">+$1.8M vs. base case.</span>`
            },
            {
                delay: 1700,
                type:  'good',
                time:  '07:45',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Orbis Tech &mdash; Credit hold unlocked $1.3M</strong><br>
                        Credit hold notice sent. Orbis Tech responded within 24h with full payment commitment.
                        $1.3M cleared Day 3. Shipment pipeline re-opened Day 4. <span class="text-green">+$1.3M.</span>`
            },
            {
                delay: 2500,
                type:  'good',
                time:  '07:46',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Pinnacle Foods &mdash; Full $900K resolved</strong><br>
                        POD confirmed full delivery. Counter-claim accepted by Pinnacle Foods.
                        Full $900K collected Day 6. Dispute closed. <span class="text-green">+$280K vs. base case.</span>`
            },
            {
                delay: 3300,
                type:  'good',
                time:  '07:47',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Summit Chemicals &mdash; $28.5K discount captured</strong><br>
                        $1.872M paid by Day 5 within discount window. $28.5K saving locked in.
                        Annualised return on early payment: <span class="text-green">27%</span>. AP ledger updated.`
            },
            {
                delay: 4100,
                type:  'good',
                time:  '07:48',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Nexwave Retail &mdash; $800K confirmed Day 5</strong><br>
                        Customer self-pay confirmed. No additional outreach needed. Cash cleared on schedule.`
            },
            {
                delay: 4900,
                type:  'kpi',
                time:  '07:49',
                icon:  'icon-kpi',
                char:  '◈',
                html:  `<strong>Working Capital KPI Impact — Bull Case</strong>
                        <div class="kpi-delta">
                            <div class="kpi-chip">
                                <div class="chip-label">Cash Day 7</div>
                                <div class="chip-before">$42.3M</div>
                                <div class="chip-after text-green">$50.4M</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">DSO</div>
                                <div class="chip-before">48d</div>
                                <div class="chip-after text-green">42d</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">CCC</div>
                                <div class="chip-before">34d</div>
                                <div class="chip-after text-green">28d</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">Overdue AR</div>
                                <div class="chip-before">$6.2M</div>
                                <div class="chip-after text-green">$0.9M</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">WC Saved</div>
                                <div class="chip-before">&mdash;</div>
                                <div class="chip-after text-green">+$8.1M</div>
                            </div>
                        </div>`
            },
            {
                delay: 5700,
                type:  'info',
                time:  '07:50',
                icon:  'icon-agent',
                char:  '⚡',
                html:  `<strong>Bull Case Complete.</strong> All 5 collection actions executed. All KPIs above target.
                        Liquidity floor: $38M. Achieved: $50.4M — <span class="text-green">$12.4M above floor.</span>
                        Recommend presenting this trajectory at board briefing. DPO at 41d — 4 days of headroom remaining for further AP optimisation next cycle.`
            }
        ]
    },

    base: {
        color:     '#3b82f6',
        iconClass: 'icon-agent',
        iconChar:  '→',
        steps: [
            {
                delay: 0,
                type:  'info',
                time:  '07:43',
                icon:  'icon-agent',
                char:  '⚡',
                html:  `<strong>Base Case Simulation — Running</strong><br>
                        Standard levers applied. Modelling most likely outcome given current team capacity and approval levels.`
            },
            {
                delay: 900,
                type:  'good',
                time:  '07:44',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Delta Retail &mdash; $1.08M partial collected</strong><br>
                        Within approval level. Cleared in 3–5 days. Remaining $720K tracked with 7-day follow-up deadline.`
            },
            {
                delay: 1700,
                type:  'good',
                time:  '07:45',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Nexwave Retail &mdash; $800K Day 5</strong><br>
                        Customer committed. Payment expected on schedule.`
            },
            {
                delay: 2500,
                type:  'good',
                time:  '07:46',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>Axis Packaging &mdash; $1.1M deferred to Day 45</strong><br>
                        Safe deferral within contract terms. No supply impact. Cash preserved for 7 additional days.`
            },
            {
                delay: 3300,
                type:  'kpi',
                time:  '07:47',
                icon:  'icon-kpi',
                char:  '◈',
                html:  `<strong>Working Capital KPI Impact — Base Case</strong>
                        <div class="kpi-delta">
                            <div class="kpi-chip">
                                <div class="chip-label">Cash Day 7</div>
                                <div class="chip-before">$42.3M</div>
                                <div class="chip-after text-blue">$47.3M</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">DSO</div>
                                <div class="chip-before">48d</div>
                                <div class="chip-after text-blue">45d</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">CCC</div>
                                <div class="chip-before">34d</div>
                                <div class="chip-after text-blue">31d</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">Overdue AR</div>
                                <div class="chip-before">$6.2M</div>
                                <div class="chip-after text-blue">$3.3M</div>
                            </div>
                        </div>`
            },
            {
                delay: 4100,
                type:  'info',
                time:  '07:48',
                icon:  'icon-agent',
                char:  '⚡',
                html:  `<strong>Base Case Complete.</strong> $5.0M net improvement in 7 days. Above liquidity floor.
                        Remaining $3.3M overdue AR to chase in next cycle. Consider bull case escalations if cash position needs to accelerate.`
            }
        ]
    },

    bear: {
        color:     '#ef4444',
        iconClass: 'icon-agent',
        iconChar:  '↓',
        steps: [
            {
                delay: 0,
                type:  'info',
                time:  '07:43',
                icon:  'icon-agent',
                char:  '⚠',
                html:  `<strong>Bear Case Simulation — Running</strong><br>
                        Downside scenario. No new AR collections. All AP on standard schedule. Disputes unresolved. Modelling deterioration.`
            },
            {
                delay: 900,
                type:  'risk',
                time:  '07:44',
                icon:  'icon-agent',
                char:  '✗',
                html:  `<strong>Delta Retail &mdash; No payment</strong><br>
                        Escalation not pursued. $1.8M remains outstanding. <span class="text-red">Exposure grows to Day 102.</span>`
            },
            {
                delay: 1700,
                type:  'risk',
                time:  '07:45',
                icon:  'icon-agent',
                char:  '✗',
                html:  `<strong>Orbis Tech &mdash; No credit hold, shipments continue</strong><br>
                        $2.1M new shipments released without payment. Total exposure reaches <span class="text-red">$3.4M.</span>`
            },
            {
                delay: 2500,
                type:  'risk',
                time:  '07:46',
                icon:  'icon-agent',
                char:  '✗',
                html:  `<strong>Summit Chemicals &mdash; Discount window missed</strong><br>
                        $28.5K saving forfeited. Full $1.9M payment due Day 32. Opportunity cost: $28.5K.`
            },
            {
                delay: 3300,
                type:  'kpi',
                time:  '07:47',
                icon:  'icon-kpi',
                char:  '◈',
                html:  `<strong>Working Capital KPI Impact — Bear Case</strong>
                        <div class="kpi-delta">
                            <div class="kpi-chip">
                                <div class="chip-label">Cash Day 7</div>
                                <div class="chip-before">$42.3M</div>
                                <div class="chip-after text-red">$41.8M</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">DSO</div>
                                <div class="chip-before">48d</div>
                                <div class="chip-after text-red">54d</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">CCC</div>
                                <div class="chip-before">34d</div>
                                <div class="chip-after text-red">38d</div>
                            </div>
                            <div class="kpi-chip">
                                <div class="chip-label">Overdue AR</div>
                                <div class="chip-before">$6.2M</div>
                                <div class="chip-after text-red">$8.8M</div>
                            </div>
                        </div>`
            },
            {
                delay: 4100,
                type:  'info',
                time:  '07:48',
                icon:  'icon-agent',
                char:  '⚠',
                html:  `<strong>Bear Case Alert.</strong> Cash barely moves. $8.8M overdue AR by Day 7.
                        CCC deteriorates to 38d — 13 days above target. Liquidity floor: $38M. Current: $41.8M — <span class="text-orange">only $3.8M buffer.</span>
                        <strong class="text-red">Immediate CFO action required</strong> on Orbis Tech, Delta Retail, and discount window.`
            }
        ]
    }
};

let scenarioRunning = false;

function runScenario(name) {
    // Allow re-run if clicking a different scenario, or reset and re-run same
    scenarioRunning = false;
    scenarioRunning = true;

    const data      = SCENARIO_DATA[name];
    const container = document.getElementById('scenario-stream-container');

    // Highlight selected card
    ['bull', 'base', 'bear'].forEach(sc => {
        const card = document.getElementById('scenario-card-' + sc);
        if (!card) return;
        card.style.border     = sc === name ? `2px solid ${data.color}` : '1px solid #1f2937';
        card.style.background = sc === name ? '#111827' : '#0d1520';
    });

    // Build stream shell
    container.innerHTML = `
        <div class="scenario-stream">
            <div class="agent-label" style="margin-bottom:10px;">
                Agent — ${name.charAt(0).toUpperCase() + name.slice(1)} Case Live Simulation
            </div>
            <div id="stream-steps"></div>
        </div>`;

    const stepsEl = document.getElementById('stream-steps');
    let stepIndex = 0;

    function showNextStep() {
        if (stepIndex >= data.steps.length) {
            scenarioRunning = false;
            return;
        }
        const step = data.steps[stepIndex];
        stepIndex++;

        // Show typing indicator first
        const typingEl = document.createElement('div');
        typingEl.className = 'stream-msg';
        typingEl.style.animationDelay = '0ms';
        typingEl.innerHTML = `
            <div class="stream-icon ${step.icon}">${step.char}</div>
            <div class="stream-body ${step.type}">
                <div class="stream-typing">
                    <span></span><span></span><span></span>
                </div>
            </div>`;
        stepsEl.appendChild(typingEl);
        stepsEl.scrollIntoView({ behavior: 'smooth', block: 'end' });

        // Replace with real content after short delay
        setTimeout(() => {
            typingEl.querySelector('.stream-body').innerHTML = `
                <div class="stream-time">${step.time}</div>
                ${step.html}`;
            stepsEl.scrollIntoView({ behavior: 'smooth', block: 'end' });

            // Schedule next step
            const nextStep = data.steps[stepIndex];
            const gap = nextStep
                ? (nextStep.delay - step.delay)
                : 0;
            setTimeout(showNextStep, gap || 800);
        }, 700);
    }

    // Kick off
    const firstDelay = data.steps[0]?.delay ?? 0;
    setTimeout(showNextStep, firstDelay);
}

// Initialise
document.addEventListener('DOMContentLoaded', () => {
    // pre-highlight base scenario card
    const baseCard = document.getElementById('scenario-card-base');
    if (baseCard) {
        baseCard.style.border     = '2px solid #3b82f6';
        baseCard.style.background = '#111827';
    }
});
