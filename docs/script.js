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
                   '<span class="text-green">①</span> <strong>Collection items raised in SAP FSCM &mdash; Collections Management</strong> (<a href="#" class="trace-link" data-tooltip="SAP FSCM — Collections Management&#10;T-code: UDM_SUPERVISOR&#10;Customer: Delta Retail (CUST-004821)&#10;INV-78421 ($360K) — Collection Item status: In Process (02)&#10;INV-78435 partial ($360K) — Collection Item status: In Process (02)&#10;Remaining INV-78435 balance ($720K) — Resubmission set for 13 Apr&#10;Collector worklist: @RaviKumar&#10;SAP FSCM status codes: 01=Open, 02=In Process, 03=Promise to Pay, 04=Dispute">UDM_SUPERVISOR</a>) &mdash; INV-78421 + INV-78435 (partial) collection items created with status <span class="wf-status wf-active">In Process</span>. Remaining INV-78435 balance ($720K) entered as <span class="wf-status wf-staged">Resubmission &mdash; 13 Apr</span> on @RaviKumar\'s collector worklist (auto-resurfaces on due date).<br><br>' +
                   '<span class="text-blue">②</span> <strong>Teams message sent to @RaviKumar</strong> &mdash; <em>"Delta Retail: CFO has approved $1.08M partial collection. INV-78421 and partial INV-78435 now In Process in SAP Collections (CUST-004821, UDM_SUPERVISOR). You own the $720K Resubmission on 13 Apr. Ping me if they don\'t confirm by Day 5."</em> Delivery confirmed 07:44.<br><br>' +
                   '<span class="text-blue">③</span> <strong>Authority check completed:</strong> <a href="#" class="trace-link" data-tooltip="Policy: AR-03 — Direct Collection Authority&#10;Owner: @RaviKumar&#10;Ceiling: $1,500,000&#10;$1.08M is within limit — no escalation required&#10;Policy document: SharePoint/Finance/Policies/AR-03.pdf">Policy AR-03</a> confirmed $1.08M is within @RaviKumar\'s $1.5M direct authority. No CFO approval routing needed.<br><br>' +
                   '<span class="text-orange">④</span> <strong>Pre-litigation hold opened</strong> in <a href="#" class="trace-link" data-tooltip="Legal Case Management System&#10;Ref: LH-2024-0091&#10;Case type: Pre-litigation Hold&#10;Invoices: INV-78421, INV-78435&#10;Status: DORMANT&#10;Auto-escalation: No payment confirmation by Day 8 (14 Apr) → @LegalTeam notified&#10;Owner on activation: @LegalTeam">Legal CMS (LH-2024-0091)</a> &mdash; status <span class="wf-status wf-dormant">DORMANT</span>. Monitoring service inbox <em>ar-collections@company.com</em> for payment confirmation. Auto-advances to @LegalTeam for review if no payment by Day 8.'
        },
        full: {
            cfo:   'Full $1.8M demand from Delta Retail. 5 business days to pay — legal brief prepared for Day 6.',
            agent: '<strong>Executed at 07:44 &mdash; 5 steps completed:</strong><br><br>' +
                   '<span class="text-red">①</span> <strong>CFO approval requested</strong> via <a href="#" class="trace-link" data-tooltip="Internal Approval Workflow&#10;Ref: APP-2024-0091&#10;Policy: AR-05 — Escalated Collection&#10;Trigger: Formal demand above $1.5M requires CFO sign-off&#10;Sent to: @SeniorCFO via Teams at 07:44&#10;System: SAP Business Workflow (WorkItem auto-created)&#10;SLA: 30 mins">APP-2024-0091</a> &mdash; Teams message sent to @SeniorCFO at 07:44. Status: <span class="wf-status wf-pending">PENDING APPROVAL</span>. Policy AR-05: CFO must authorise formal demand letters above $1.5M before external despatch.<br><br>' +
                   '<span class="text-red">②</span> <strong>Demand letter DL-2024-0031 staged</strong> in @LegalTeam\'s <a href="#" class="trace-link" data-tooltip="Legal Document Management&#10;Ref: DL-2024-0031&#10;Type: Formal Payment Demand&#10;Customer: Delta Retail&#10;Invoices: INV-78421 ($950K) + INV-78435 ($850K)&#10;Total demanded: $1,800,000&#10;Interest clause: Yes (per contract cl. 8.4)&#10;Status: STAGED — awaiting APP-2024-0091 CFO approval&#10;Despatch by: @LegalTeam (tracked post + email) after approval only">SharePoint case folder</a> &mdash; covers INV-78421 and INV-78435 with interest accrual per contract clause 8.4. Status: <span class="wf-status wf-staged">STAGED</span>. Despatched by @LegalTeam only after @SeniorCFO approves APP-2024-0091.<br><br>' +
                   '<span class="text-blue">③</span> <strong>Teams message sent to @SarahAndrews</strong> (Account Manager) &mdash; <em>"Heads up: Delta Retail escalated to formal demand track pending CFO sign-off. Do not contact them commercially until @RaviKumar gives the all-clear. Legal hold ref DL-2024-0031 is staged."</em><br><br>' +
                   '<span class="text-orange">④</span> <strong>Chase schedule created in CRM:</strong> <a href="#" class="trace-link" data-tooltip="CRM Task Schedule&#10;Customer: Delta Retail (CRM-ID: CR-004821)&#10;Task 1: Day 3 — automated chase reminder to @RaviKumar&#10;Task 2: Day 4 — second reminder to @RaviKumar + @SeniorCFO&#10;Task 3: Day 5 — CFO review meeting (09:00 calendar hold placed)&#10;Task 4: Day 6 — Legal brief auto-forwarded if no payment commitment">CR-004821</a> &mdash; 3 automated reminder tasks + Day 5 CFO calendar hold. @SeniorCFO\'s PA notified of Day 5 09:00 hold.<br><br>' +
                   '<span class="text-red">⑤</span> <strong>SAP AR &mdash; Dunning Level 3 (Demand Notice) applied:</strong> <a href="#" class="trace-link" data-tooltip="SAP AR — Dunning (T-code: F150)&#10;Customer: Delta Retail (CUST-004821)&#10;Dunning Level: 3 (Demand Notice — highest before legal referral)&#10;Credit limit: set to $0 via FD32 (Credit Management — prev: net-30 terms)&#10;Effect: No further credit extension. New orders require manual CFO release.&#10;Pending: APP-2024-0091 before demand letter despatched externally">CUST-004821</a> &mdash; dunning level 3 applied via SAP T-code F150. Credit limit set to $0 via FD32. No further credit extension until resolved.'
        }
    },
    'orbis-tech': {
        hold: {
            cfo:   'Orbis Tech on credit hold now. Block all 3 shipments. @RaviKumar dials Sarah Chen daily at 09:00.',
            agent: '<strong>Executed at 07:44 &mdash; 5 steps completed:</strong><br><br>' +
                   '<span class="text-red">①</span> <strong>Credit limit set to $0 in SAP Credit Management</strong> &mdash; <a href="#" class="trace-link" data-tooltip="SAP Credit Management (T-code: FD32 — Change Customer Credit Data)&#10;Customer: Orbis Tech (CUST-007392)&#10;Credit Limit: $0 (was: $2,100,000)&#10;Changed by: Agent 07:44&#10;Effect: All new sales orders automatically blocked and routed to credit hold worklist (T-code: VKM1)&#10;Stop-credit ref: CH-2024-0018&#10;To release: @RaviKumar or CFO must manually release orders in VKM1 and reset limit via FD32">FD32 — CUST-007392</a> (Ref CH-2024-0018). <span class="wf-status wf-blocked">CREDIT HOLD ACTIVE</span>. All new SOs automatically blocked and routed to VKM1 credit worklist. @RaviKumar or CFO must release individually.<br><br>' +
                   '<span class="text-red">②</span> <strong>Delivery blocks applied on 3 outbound shipments:</strong> <a href="#" class="trace-link" data-tooltip="SAP SD — Outbound Delivery Block (T-code: VL02N)&#10;SO-9821 ($820K) — Delivery Block: Z1 (Credit Hold)&#10;SO-9834 ($730K) — Delivery Block: Z1 (Credit Hold)&#10;SO-9847 ($550K) — Delivery Block: Z1 (Credit Hold)&#10;Block code: Z1 applied at delivery header level&#10;Applied at: 07:44 via SAP VL02N&#10;Exposure frozen at: $2.1M&#10;Releases when: Credit hold CH-2024-0018 lifted by @RaviKumar">SO-9821 / SO-9834 / SO-9847</a> &mdash; outbound delivery block Z1 applied via SAP VL02N. Teams notification to @LogisticsTeam channel: <em>"Orbis Tech: 3 deliveries blocked (CH-2024-0018). Do not despatch without @RaviKumar clearance."</em><br><br>' +
                   '<span class="text-orange">③</span> <strong>Teams message sent to @SarahAndrews</strong> (Account Manager) &mdash; <em>"Orbis Tech placed on credit hold (CH-2024-0018) by CFO instruction. Please call Sarah Chen (Head of Finance, Orbis Tech) today — $1.3M on INV-76890 must be settled or we need a written commitment before the hold can lift. Log the call outcome back here."</em><br><br>' +
                   '<span class="text-blue">④</span> <strong>Daily follow-up task created in CRM:</strong> <a href="#" class="trace-link" data-tooltip="CRM Task — Orbis Tech (CR-007392)&#10;Task type: COLLECTIONS_DAILY_CALL&#10;Assigned to: @RaviKumar&#10;Recurs: 09:00 daily&#10;Trigger to close: Written payment commitment logged in CRM&#10;Escalates to: @SeniorCFO if no commitment by Day 3">CR-007392</a> &mdash; @RaviKumar receives 09:00 daily Teams reminder until written payment commitment is in CRM. First prompt fires at 09:00 today.<br><br>' +
                   '<span class="text-red">⑤</span> <strong>Pre-litigation brief queued in Legal CMS:</strong> <a href="#" class="trace-link" data-tooltip="Legal Case Management&#10;Ref: LE-2024-0022&#10;Type: Pre-litigation Brief&#10;Customer: Orbis Tech (CUST-007392)&#10;Invoice: INV-76890 ($1.3M)&#10;Status: STAGED&#10;Auto-activates: Day 3 (09 Apr, 07:00) — if no CRM written commitment exists&#10;On activation: @LegalTeam notified, formal pre-litigation process starts">LE-2024-0022</a> &mdash; status <span class="wf-status wf-staged">STAGED</span>. @LegalTeam pinged. Auto-advances to <span class="wf-status wf-active">ACTIVE</span> at 07:00 Day 3 if no written commitment recorded in CRM.'
        },
        escalate: {
            cfo:   'CFO personal outreach to Michael Tan at Orbis Tech. 3-day window. Credit hold auto-fires Day 3 if no response.',
            agent: '<strong>Executed at 07:44 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-orange">①</span> <strong>Teams message sent to @SeniorCFO</strong> &mdash; <em>"Action needed: Please reach out directly to Michael Tan, CFO at Orbis Tech (m.tan@orbistech.com), regarding INV-76890 ($1.3M, 62 days overdue). Final goodwill step before credit hold CH-2024-0018 auto-fires Day 3. Draft message staged at SharePoint/Drafts/OT-CFO-Outreach-6Apr.docx — please review and send from your own account."</em> Calendar reminder set for @SeniorCFO at 08:30 today.<br><br>' +
                   '<span class="text-red">②</span> <strong>Customer sales block applied via SAP</strong> (T-code: VD05) &mdash; <a href="#" class="trace-link" data-tooltip="SAP SD — Customer Block (T-code: VD05)&#10;Customer: Orbis Tech (CUST-007392)&#10;Block type: 01 — Sales Block (order creation disabled)&#10;Effect: All new sales orders rejected at entry. Existing SOs SO-9821/9834/9847 frozen at shipping stage.&#10;Removes when: @RaviKumar logs written payment commitment, CFO removes block via VD05">CUST-007392 — Sales Block (01) active</a>. @LogisticsTeam notified via Teams. Existing SOs frozen; no new orders accepted. Exposure capped at $2.1M.<br><br>' +
                   '<span class="text-orange">③</span> <strong>Credit hold CH-2024-0018 staged with conditional auto-activation:</strong> <a href="#" class="trace-link" data-tooltip="Conditional Approval Workflow&#10;Ref: APP-2024-0092&#10;Pre-authorised by: @SeniorCFO at 07:44&#10;Trigger: No written payment commitment in CRM by Day 3 (09 Apr 07:00)&#10;On trigger: FD32 credit limit set to $0, @LegalTeam notified, LE-2024-0022 activated&#10;System: SAP Business Workflow (conditional WorkItem)">APP-2024-0092</a> status: <span class="wf-status wf-staged">STAGED &mdash; CONDITIONAL</span>. If CRM shows no written commitment by 07:00 Day 3, FD32 credit limit is set to $0 automatically.<br><br>' +
                   '<span class="text-blue">④</span> <strong>Monitoring active on service inbox</strong> <em>ar-escalations@company.com</em>: inbound email from <em>@orbistech.com</em> domain triggers real-time Teams alert to @RaviKumar and @SeniorCFO. CRM task <a href="#" class="trace-link" data-tooltip="CRM Task — Orbis Tech (CR-007392)&#10;Task: CFO_ESCALATION_REVIEW&#10;Day 3 (09 Apr) 09:00 — @SeniorCFO reviews outcome&#10;@SarahAndrews to submit contact log by 08:30 Day 3">CR-007392</a> set for Day 3 09:00 CFO review.'
        }
    },
    'pinnacle-foods': {
        split: {
            cfo:   'Collect $620K now — undisputed invoices. $280K dispute tracked separately via POD. @DispatchTeam owns it by Day 7.',
            agent: '<strong>Executed at 07:45 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-green">①</span> <strong>Collection items raised in SAP FSCM &mdash; Collections Management</strong> (<a href="#" class="trace-link" data-tooltip="SAP FSCM — Collections Management&#10;T-code: UDM_SUPERVISOR&#10;Customer: Pinnacle Foods (CUST-009104)&#10;INV-79080 ($300K) — Collection Item status: In Process (02)&#10;INV-79145 ($320K) — Collection Item status: In Process (02)&#10;INV-79210 ($280K) — Excluded: Dispute Case opened in SAP FSCM DM (UDM_DISPUTE)&#10;Collector worklist: @RaviKumar">UDM_SUPERVISOR</a>) &mdash; INV-79080 and INV-79145 set to <span class="wf-status wf-active">In Process</span>. INV-79210 ring-fenced as a <a href="#" class="trace-link" data-tooltip="SAP FSCM — Dispute Management (T-code: UDM_DISPUTE)&#10;Dispute Case Ref: DSP-2024-0041&#10;Invoice: INV-79210 ($280K)&#10;Root Cause Code: Quantity Shortfall (SD-04)&#10;Clearance Lock: Applied (prevents auto-clearing in AR)&#10;Claimed by: Pinnacle Foods&#10;Owner: @DispatchTeam&#10;Resolution target: 13 Apr (Day 7)">Dispute Case (DSP-2024-0041)</a> in SAP FSCM Dispute Management &mdash; clearance lock applied. The two tracks are independent; dispute does not affect the $620K collection timeline.<br><br>' +
                   '<span class="text-blue">②</span> <strong>Teams message sent to @RaviKumar</strong> &mdash; <em>"Pinnacle Foods: CFO approved split collection. INV-79080 + INV-79145 ($620K) are In Process in SAP Collections (CUST-009104, UDM_SUPERVISOR). Please call Linda Wu (AP Manager, Pinnacle Foods) today to confirm payment timing. INV-79210 is in Dispute Case DSP-2024-0041 — do not chase that one until @DispatchTeam closes POD-2024-0119."</em><br><br>' +
                   '<span class="text-orange">③</span> <strong>POD task raised in Dispatch system</strong> &mdash; <a href="#" class="trace-link" data-tooltip="Dispatch & Logistics System&#10;POD Request Ref: POD-2024-0119&#10;Despatch Note: DN-4421&#10;Bill of Lading: BL-7832&#10;Shipment date: 25 Mar 2026&#10;Units expected: 840&#10;Assigned to: @AmitShah (Warehouse Manager)&#10;Status: OPEN&#10;Deadline: 07 Apr 07:45&#10;On completion: Agent updates DSP-2024-0041 in SAP FSCM">POD-2024-0119</a> assigned to @AmitShah. Teams ping to @DispatchTeam: <em>"Urgent: POD needed for DN-4421 / BL-7832 to Pinnacle Foods (25 Mar). Needed by 07:45 tomorrow. Dispute DSP-2024-0041 cannot close without this."</em><br><br>' +
                   '<span class="text-blue">④</span> <strong>Dispute Case DSP-2024-0041 set to In Process</strong> in <a href="#" class="trace-link" data-tooltip="SAP FSCM — Dispute Management (UDM_DISPUTE)&#10;Ref: DSP-2024-0041 — Pinnacle Foods / INV-79210&#10;Status: In Process (FSCM DM status: 02)&#10;POD evidence: Awaiting @AmitShah upload&#10;Auto-escalation: @RaviKumar if POD not received by 07 Apr 07:45">SAP FSCM Dispute Management</a>. Agent polling every 4 hours. @RaviKumar receives daily digest at 08:00 until resolved.'
        },
        full: {
            cfo:   'Counter-claim on full $900K. POD evidence compiled. @LegalTeam drafts dispute letter — @RaviKumar reviews before despatch.',
            agent: '<strong>Executed at 07:45 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-green">①</span> <strong>POD evidence package assembled</strong> from <a href="#" class="trace-link" data-tooltip="Dispatch & Logistics System&#10;Despatch Note: DN-4421 — 840 units, full load&#10;Bill of Lading: BL-7832 — signed by haulier&#10;Warehouse timestamp: 25 Mar 2026 14:32 — all units loaded&#10;PDF bundle compiled: POD-PKG-2024-0031.pdf&#10;Placed in: @LegalTeam SharePoint case folder">Despatch System</a> &mdash; DN-4421, BL-7832, and warehouse loading timestamp (25 Mar 14:32) compiled into POD-PKG-2024-0031.pdf and placed in @LegalTeam\'s SharePoint case folder.<br><br>' +
                   '<span class="text-red">②</span> <strong>Teams message sent to @LegalTeam</strong> &mdash; <em>"Please draft a formal counter-claim letter (Ref CC-2024-0031) against Pinnacle Foods for Invoice 79210 ($280K), part of total demand $900K. POD evidence is in your SharePoint folder (POD-PKG-2024-0031.pdf). @RaviKumar will review the draft before it is sent externally. Target: draft ready by 12:00 today."</em><br><br>' +
                   '<span class="text-orange">③</span> <strong>SAP FSCM Dispute Case DSP-2024-0041 updated</strong> in <a href="#" class="trace-link" data-tooltip="SAP FSCM — Dispute Management (UDM_DISPUTE)&#10;Customer: Pinnacle Foods (CUST-009104)&#10;INV-79080 — Collections: In Process (02)&#10;INV-79145 — Collections: In Process (02)&#10;INV-79210 — Dispute Case DSP-2024-0041: Root Cause Code = \'Counter-claim — Full Delivery Evidenced\'&#10;Clearance Lock: Active&#10;Updated by: Agent 07:45">UDM_DISPUTE / CUST-009104</a> &mdash; INV-79210 root cause updated to \'Counter-claim — Full Delivery Evidenced\'. Clearance lock maintained. CRM task <a href="#" class="trace-link" data-tooltip="CRM Task CR-009104&#10;Task: DISPUTE_FOLLOWUP&#10;Day 3 — @RaviKumar checks draft with @LegalTeam&#10;Day 7 — @RaviKumar reviews Pinnacle response&#10;Day 8 — escalation to @SeniorCFO if unresolved">CR-009104</a> opened with Day 3 review and Day 7 escalation milestones.<br><br>' +
                   '<span class="text-blue">④</span> <strong>Cash forecast updated:</strong> $900K moved to <em>Counter-Dispute Probable</em> tier in the 7-day position model. Treasury dashboard will reflect updated Day 10 Probable column within 5 minutes.'
        }
    },
    'summit-discount': {
        capture: {
            cfo:   'Pay Summit Chemicals $1.872M by Day 3. $28.5K discount locked in. 27% annualised return.',
            agent: '<strong>Executed at 07:48 &mdash; 4 steps completed:</strong><br><br>' +
                   '<span class="text-green">①</span> <strong>Payment proposal created in SAP AP</strong> (T-code: F110 &mdash; Automatic Payment Run) &mdash; <a href="#" class="trace-link" data-tooltip="SAP AP — Automatic Payment Run (T-code: F110)&#10;Payment Run Ref: PI-2024-0471&#10;Vendor: Summit Chemicals (VEND-003318)&#10;Invoice: INV-8810&#10;Gross amount: $1,900,000&#10;Early pay discount: $28,500 (1.5% per vendor payment terms ZTERM)&#10;Net payment: $1,872,000&#10;Payment date: 08 Apr 2026 (Day 3)&#10;Discount window closes: 11 Apr 2026&#10;Status: PENDING_APPROVAL — routed to @APManager for release in F110">PI-2024-0471</a> &mdash; $1,872,000 to VEND-003318 (Summit Chemicals), payment date Day 3 (8 Apr). Status: <span class="wf-status wf-pending">PENDING APPROVAL</span>. Teams message to @APManager: <em>"Summit Chemicals early-pay PI-2024-0471 awaiting your release in SAP F110. Discount window closes 11 Apr — please approve today."</em><br><br>' +
                   '<span class="text-green">②</span> <strong>Discount journal entry posted in SAP GL:</strong> <a href="#" class="trace-link" data-tooltip="SAP General Ledger&#10;Document Ref: ADJ-2024-0088&#10;Type: Early Payment Discount (credit entry)&#10;Amount: $28,500&#10;GL Account: AP-DISC-2026&#10;Cost Centre: Treasury&#10;Period: Apr 2026&#10;Status: POSTED">ADJ-2024-0088</a> &mdash; $28,500 credit posted to GL account AP-DISC-2026. Teams message to @FinanceTeam: <em>"Early-pay discount $28.5K posted (ADJ-2024-0088). Please include in Apr month-end accrual run."</em><br><br>' +
                   '<span class="text-blue">③</span> <strong>Liquidity check run:</strong> Treasury position model queried at 07:47 &mdash; post-payment balance $40.4M, $2.4M above the $38M floor. Check cleared. Result stored in <a href="#" class="trace-link" data-tooltip="Treasury Liquidity Log&#10;Run at: 07:47&#10;Pre-payment balance: $42.3M&#10;Payment: $1,872,000&#10;Post-payment: $40,428,000&#10;Floor: $38,000,000&#10;Headroom: $2,428,000&#10;Status: CLEARED">Liquidity Log at 07:47</a>.<br><br>' +
                   '<span class="text-blue">④</span> <strong>Vendor master note added in SAP</strong> (T-code: FK02 &mdash; Change Vendor) &mdash; <a href="#" class="trace-link" data-tooltip="SAP Vendor Master (T-code: FK02)&#10;Vendor: Summit Chemicals (VEND-003318)&#10;Update: Purchasing / Payment Terms notes&#10;Note added: \'Vendor receptive to 1.5/10 early-pay offers. Request discount on invoices >$500K. Last confirmed: 06 Apr 2026.\'&#10;Flag visible to: @APManager at invoice processing&#10;Updated by: Agent 07:48">VEND-003318 vendor master updated</a>. @APManager will see the early-pay note on every future Summit Chemicals invoice.'
        },
        pass: {
            cfo:   'Standard payment Day 32. $28.5K opportunity logged. @APManager to request same offer on next invoice.',
            agent: '<strong>Executed at 07:48 &mdash; 3 steps completed:</strong><br><br>' +
                   '<span class="text-gray">①</span> <strong>Standard payment scheduled in SAP AP</strong> (T-code: F110) &mdash; <a href="#" class="trace-link" data-tooltip="SAP AP — Automatic Payment Run (T-code: F110)&#10;Payment Run Ref: PI-2024-0472&#10;Vendor: Summit Chemicals (VEND-003318)&#10;Invoice: INV-8810&#10;Amount: $1,900,000 (full, no discount)&#10;Payment date: 07 May 2026 (Day 32 per standard payment terms)&#10;Status: SCHEDULED">PI-2024-0472</a> &mdash; $1,900,000 scheduled for 7 May 2026 per standard payment terms. <span class="wf-status wf-active">SCHEDULED</span>. No ledger changes required today.<br><br>' +
                   '<span class="text-blue">②</span> <strong>Opportunity logged in AP Register:</strong> <a href="#" class="trace-link" data-tooltip="AP Opportunity Register&#10;Ref: OPP-2024-0031&#10;Amount foregone: $28,500&#10;Reason: Cash position decision — CFO passed this cycle&#10;Reminder: 2 May 2026 (Day 25) — @APManager to request 1.5/10 offer on next Summit Chemicals invoice&#10;Recurring flag: YES">OPP-2024-0031</a> &mdash; $28,500 missed saving recorded. Day 25 reminder (2 May) set in CRM for @APManager to request the offer on the next invoice cycle.<br><br>' +
                   '<span class="text-gray">③</span> <strong>Teams message sent to @APManager</strong> &mdash; <em>"Summit Chemicals discount passed this cycle by CFO decision. $1.9M full payment due Day 32 (PI-2024-0472 in SAP F110 — scheduled). Reminder set for Day 25 to request same offer next cycle. Opportunity ref: OPP-2024-0031."</em>'
        }
    }
};

// ── Dispute action library ────────────────────────────────────
const DISPUTE_RESPONSES = {
    'pinnacle-pod': {
        msg: '<strong>Executed at 07:45 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-blue">①</span> <strong>POD task created</strong> in Dispatch system &mdash; <a href="#" class="trace-link" data-tooltip="Dispatch & Logistics System&#10;POD Request: POD-2024-0119&#10;Despatch Note: DN-4421&#10;Bill of Lading: BL-7832&#10;Shipment date: 25 Mar 2026&#10;Units: 840&#10;Assigned to: @AmitShah&#10;Deadline: 07 Apr 07:45&#10;Status: OPEN">POD-2024-0119 / DN-4421 / BL-7832</a> assigned to @AmitShah (Warehouse Manager). Deadline: 07:45 tomorrow.<br><br>' +
             '<span class="text-orange">②</span> <strong>Teams message sent to @DispatchTeam</strong> &mdash; <em>"Urgent: POD required for March 25 Pinnacle Foods delivery (DN-4421 / BL-7832). They are claiming an 18% shortfall on 840 units. Please pull the signed POD and loading records and upload to POD-2024-0119 by 07:45 tomorrow. This is blocking $280K in SAP Dispute Case DSP-2024-0041."</em><br><br>' +
             '<span class="text-blue">③</span> <strong>Monitoring active:</strong> Agent polling <a href="#" class="trace-link" data-tooltip="SAP FSCM — Dispute Management (UDM_DISPUTE)&#10;Dispute Case: DSP-2024-0041 — Pinnacle Foods / INV-79210&#10;Status: In Process (02)&#10;Awaiting: POD evidence from @AmitShah&#10;On POD-2024-0119 closure: agent auto-notifies @RaviKumar and updates DSP-2024-0041">SAP FSCM Dispute Case DSP-2024-0041</a> every 2 hours. @RaviKumar notified automatically when @AmitShah closes POD-2024-0119.'
    },
    'pinnacle-counterclaim': {
        msg: '<strong>Executed at 07:46 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-red">①</span> <strong>Teams message sent to @LegalTeam</strong> &mdash; <em>"Please draft counter-claim letter CC-2024-0031 against Pinnacle Foods for Invoice 79210 ($280K). POD evidence (DN-4421, BL-7832) is in your SharePoint case folder. @RaviKumar to review draft before external despatch. Target: draft by 12:00 today."</em><br><br>' +
             '<span class="text-red">②</span> <strong>SAP FSCM Dispute Case DSP-2024-0041 updated</strong> &mdash; <a href="#" class="trace-link" data-tooltip="SAP FSCM — Dispute Management (UDM_DISPUTE)&#10;Ref: DSP-2024-0041&#10;Invoice: INV-79210 ($280K)&#10;Root Cause Code: updated to \'Counter-claim — Full Delivery Evidenced\'&#10;Clearance Lock: Active (will not auto-clear)&#10;Dispute Activity: CC-2024-0031 staged in @LegalTeam folder">DSP-2024-0041</a> root cause updated. Clearance lock maintained on INV-79210. SAP AR <a href="#" class="trace-link" data-tooltip="SAP AR Module&#10;Customer: Pinnacle Foods (CUST-009104)&#10;INV-79210 — Dispute Case: DSP-2024-0041 (active)&#10;Clearance Lock: Y — will not auto-clear until dispute closed">CUST-009104 / INV-79210</a> remains dispute-locked.<br><br>' +
             '<span class="text-orange">③</span> <strong>CRM task created</strong> for @RaviKumar &mdash; <a href="#" class="trace-link" data-tooltip="CRM Task — Pinnacle Foods (CR-009104)&#10;Task: Review counter-claim draft from @LegalTeam&#10;Due: 06 Apr 14:00&#10;Escalates to: @SeniorCFO if not reviewed by 16:00">CR-009104</a> review by 14:00 today, with escalation to @SeniorCFO at 16:00 if outstanding.'
    },
    'pinnacle-creditnote': {
        msg: '<strong>Executed at 07:46 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-green">①</span> <strong>Credit memo raised in SAP AR</strong> (T-code: FB75) &mdash; <a href="#" class="trace-link" data-tooltip="SAP AR — Credit Memo (T-code: FB75)&#10;Credit Note Ref: CN-2046&#10;Customer: Pinnacle Foods (CUST-009104)&#10;Against: INV-79210&#10;Amount: $280,000&#10;GL Account: AR-ADJUSTMENTS&#10;Period: Apr 2026&#10;Status: POSTED — Dispute Case DSP-2024-0041 clearance lock removed on posting">CN-2046</a> &mdash; $280K credit memo posted via SAP T-code FB75. INV-79210 cleared from AR ledger. Dispute Case DSP-2024-0041 clearance lock removed. @FinanceTeam notified via Teams for month-end reconciliation.<br><br>' +
             '<span class="text-blue">②</span> <strong>SAP FSCM Dispute Case DSP-2024-0041 closed</strong> &mdash; status set to Closed (FSCM DM: status 05). INV-79210 fully cleared. @RaviKumar notified. Collection on INV-79080 and INV-79145 ($620K) continues on existing In Process timeline without impact.<br><br>' +
             '<span class="text-gray">③</span> <strong>Teams message sent to @RaviKumar</strong> &mdash; <em>"Pinnacle Foods INV-79210 written off via CN-2046 (SAP credit memo, FB75). SAP Dispute Case DSP-2024-0041 closed. The $620K on INV-79080 and INV-79145 is still In Process in SAP Collections — no change there. Cash forecast updated."</em>'
    },
    'corelogistics-rejection': {
        msg: '<strong>Executed at 07:48 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-red">①</span> <strong>Teams message sent to @APManager</strong> &mdash; <em>"Core Logistics invoice INV-8821 is $42K over PO PO-7743 ($808K vs. $850K). No authorised change order on file. Please formally reject it in the AP inbox and request a corrected invoice by Day 5 (11 Apr). I have logged this as Dispute AP-DSP-2024-0018 in SAP."</em><br><br>' +
             '<span class="text-red">②</span> <strong>Invoice payment block applied in SAP AP</strong> (T-code: FB02) &mdash; <a href="#" class="trace-link" data-tooltip="SAP AP — Invoice Payment Block (T-code: FB02)&#10;Ref: AP-DSP-2024-0018&#10;Vendor: Core Logistics (VEND-001147)&#10;Invoice: INV-8821 ($850K)&#10;PO: PO-7743 ($808K)&#10;Discrepancy: $42,000 — no change order&#10;Payment Block Indicator: R (Invoice Verification — Blocked)&#10;Applied by: Agent at 07:48&#10;Releases when: @APManager removes block via FB02 on receipt of corrected invoice">AP-DSP-2024-0018</a> &mdash; payment block indicator R (Invoice Verification Blocked) set on INV-8821. INV-8821 will not enter the SAP F110 payment run until @APManager removes the block.<br><br>' +
             '<span class="text-blue">③</span> <strong>Teams message sent to @ProcurementHead</strong> &mdash; <em>"Heads up: Core Logistics INV-8821 overcharged by $42K vs. PO-7743. @APManager is requesting a corrected invoice by Day 5. If it doesn\'t arrive, you may need to call their account manager. Ref AP-DSP-2024-0018."</em>'
    },
    'corelogistics-release': {
        msg: '<strong>Executed at 07:49 &mdash; 4 steps:</strong><br><br>' +
             '<span class="text-orange">①</span> <strong>CFO approval requested</strong> via <a href="#" class="trace-link" data-tooltip="Internal Approval Workflow&#10;Ref: APP-2024-0093&#10;Policy: AP-07 — Disputed Invoice Payment Release&#10;Requires: CFO sign-off for payment on disputed AP above $25K&#10;Sent to: @SeniorCFO via Teams at 07:49&#10;System: SAP Business Workflow (WorkItem created)&#10;SLA: 2 hours">APP-2024-0093</a> &mdash; Teams message to @SeniorCFO requesting release of $808K (PO value) to Core Logistics. Status: <span class="wf-status wf-pending">PENDING APPROVAL</span>. Policy AP-07: disputed AP above $25K requires CFO sign-off before payment run.<br><br>' +
             '<span class="text-orange">②</span> <strong>Payment proposal staged in SAP AP</strong> (T-code: F110) &mdash; <a href="#" class="trace-link" data-tooltip="SAP AP — Automatic Payment Run (T-code: F110)&#10;Payment Run Ref: PI-2024-0473&#10;Vendor: Core Logistics (VEND-001147)&#10;Invoice: INV-8821&#10;Payment amount: $808,000 (PO contracted value only)&#10;Contested balance: $42,000 (payment block R remains active)&#10;Status: STAGED — awaiting APP-2024-0093 CFO approval&#10;Scheduled payment date: Day 12 (18 Apr) once approved">PI-2024-0473</a> &mdash; $808,000 staged at PO value. Status: <span class="wf-status wf-staged">STAGED</span>. Will not enter the F110 payment run until APP-2024-0093 is approved by @SeniorCFO.<br><br>' +
             '<span class="text-red">③</span> <strong>Teams message sent to @APManager</strong> &mdash; <em>"Once @SeniorCFO approves APP-2024-0093, please send Core Logistics a remittance note: $808K paid at PO-7743 contracted value. $42K balance is formally contested — reference absence of change order."</em><br><br>' +
             '<span class="text-blue">④</span> <strong>AP Dispute AP-DSP-2024-0018 updated</strong> to PAYMENT_AUTHORISED_PARTIAL. Monitoring <em>ap-invoices@company.com</em> for any response from Core Logistics regarding the contested $42K.'
    },
    'corelogistics-escalate': {
        msg: '<strong>Executed at 07:49 &mdash; 3 steps:</strong><br><br>' +
             '<span class="text-orange">①</span> <strong>Teams message sent to @ProcurementHead</strong> &mdash; <em>"Escalation needed: Core Logistics INV-8821 is $42K over PO-7743 ($808K contracted, $850K invoiced). No change order exists. @APManager has rejected the invoice and requested a correction by Day 5 (11 Apr). Please call their account manager today and make clear we will not pay above PO value. Log your conversation outcome in Dispute AP-DSP-2024-0018."</em> Calendar hold set at 09:00 today.<br><br>' +
             '<span class="text-blue">②</span> <strong>AP Dispute AP-DSP-2024-0018 updated</strong> in <a href="#" class="trace-link" data-tooltip="SAP AP — Vendor Invoice Dispute&#10;Ref: AP-DSP-2024-0018&#10;Status: ESCALATED_TO_PROCUREMENT&#10;Owner updated: @ProcurementHead (was @APManager)&#10;Payment Block: R (still active on INV-8821 — will not release to F110)&#10;Deadline: 11 Apr 2026&#10;Escalation chain: @APManager → @ProcurementHead → @SeniorCFO">SAP AP</a> &mdash; status: ESCALATED_TO_PROCUREMENT. Owner updated to @ProcurementHead. Payment block R remains active on INV-8821.<br><br>' +
             '<span class="text-blue">③</span> <strong>CRM task created</strong> for @ProcurementHead &mdash; <a href="#" class="trace-link" data-tooltip="CRM Task&#10;Vendor: Core Logistics (CR-001147)&#10;Task: DISPUTE_PROCUREMENT_CALL&#10;Due: 06 Apr 12:00&#10;Escalates to @SeniorCFO if no update logged by Day 5 EOD">CR-001147</a> &mdash; call outcome to be logged by Day 5 EOD. Auto-escalates to @SeniorCFO if no update recorded.'
    }
};

/**
 * Handles agent action on a dispute card.
 */
function resolveDispute(actionId) {
    const res = DISPUTE_RESPONSES[actionId];
    if (!res) return;

    const now = new Date();
    const syncTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

    const responseEl = document.getElementById('dispute-response-' + actionId);
    if (responseEl) {
        responseEl.innerHTML = `
            <div class="response-card" style="margin-top:8px;">
                <div style="font-size:11px;color:#6ee7b7;margin-bottom:4px;font-style:normal;font-weight:700;">AGENT EXECUTING</div>
                ${res.msg}
                <div class="wf-sync-note">Workflow statuses as of <span class="wf-sync-time">${syncTime}</span> &mdash; use &#x21BB; in header to refresh</div>
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

    const now = new Date();
    const syncTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

    if (responseEl) {
        responseEl.innerHTML = `
            <div class="response-card">
                <div style="font-size:11px;color:#6ee7b7;margin-bottom:4px;font-style:normal;font-weight:700;">CFO CONFIRMED</div>
                <span style="font-style:normal;">${res.cfo}</span>
            </div>
            <div class="agent-label mt-10">Agent &mdash; Actions Taken</div>
            <div class="card good" style="margin-bottom:0;font-size:13px;line-height:1.7;">
                ${res.agent}
                <div class="wf-sync-note">Workflow statuses as of <span class="wf-sync-time">${syncTime}</span> &mdash; use &#x21BB; in header to refresh</div>
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

// ── Workflow status refresh ───────────────────────────────────
function refreshWorkflowStatuses() {
    const btn = document.querySelector('.refresh-btn');
    if (!btn) return;
    btn.classList.add('spinning');
    const t  = new Date();
    const hm = t.getHours().toString().padStart(2,'0') + ':' + t.getMinutes().toString().padStart(2,'0');
    setTimeout(() => {
        btn.classList.remove('spinning');
        document.querySelectorAll('.wf-sync-time').forEach(el => { el.textContent = hm; });
        const lrt = document.getElementById('last-refresh-time');
        if (lrt) lrt.textContent = hm;
    }, 1500);
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
