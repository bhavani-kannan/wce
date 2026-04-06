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
            agent: '<strong>Executed at 07:44 &mdash; 4 steps completed:</strong><br><br><span class="text-green">①</span> <strong>Demand email sent</strong> to James Fowler, AP Manager, Delta Retail (james.fowler@deltaretail.com) &mdash; Subject: <em>"Payment Required: INV-78421 &amp; INV-78435 &mdash; $1,080,000 &mdash; Immediate Settlement"</em>. CC: @RaviKumar (AR Lead), @CFOOffice. Read receipt requested.<br><br><span class="text-blue">②</span> <strong>AR ledger updated:</strong> INV-78421 ($950K) + INV-78435 partial ($130K) &rarr; <em>Collection In Progress</em>. Remaining INV-78435 balance ($720K) queued under @RaviKumar &mdash; follow-up deadline Day 7 (13 Apr).<br><br><span class="text-blue">③</span> <strong>Authority confirmed:</strong> $1.08M is within @RaviKumar\'s $1.5M direct collection authority (Policy AR-03). No senior sign-off required for this track.<br><br><span class="text-orange">④</span> <strong>Legal hold pre-filed:</strong> Ref LH-2024-0091 prepared by @LegalTeam. Dormant for now &mdash; auto-escalates on Day 8 if no payment confirmation received from Delta Retail.'
        },
        full: {
            cfo:   'Full $1.8M demand from Delta Retail. CFO-to-CFO letter. 5 business days — legal activates on Day 6.',
            agent: '<strong>Executed at 07:44 &mdash; 4 steps completed:</strong><br><br><span class="text-red">①</span> <strong>Formal demand letter issued</strong> (Ref DL-2024-0031) to Craig Morrison, CFO, Delta Retail (c.morrison@deltaretail.com) &mdash; Subject: <em>"Formal Payment Demand: INV-78421 &amp; INV-78435 &mdash; $1,800,000 &mdash; 5 Business Day Deadline"</em>. Sent via email + registered post simultaneously. CC: @SeniorCFO, @LegalTeam, @RaviKumar.<br><br><span class="text-blue">②</span> <strong>Senior approval logged:</strong> @SeniorCFO authorised escalation under Policy AR-05 at 07:44. Ref APP-2024-0091 on file. No further manual approvals needed on this path.<br><br><span class="text-orange">③</span> <strong>Response deadline set:</strong> Day 5 (12 Apr). Automated chase emails scheduled for Days 3 and 4 if no reply. @SeniorCFO calendar hold set for Day 5 at 09:00 for resolution review.<br><br><span class="text-red">④</span> <strong>Legal notice prepared:</strong> Ref LN-2024-0091 by @LegalTeam &mdash; covers INV-78421 and INV-78435 in full, with interest accrual clause. Auto-activates Day 6 if no written payment commitment received from Craig Morrison.'
        }
    },
    'orbis-tech': {
        hold: {
            cfo:   'Orbis Tech on credit hold now. Block all 3 pending shipments. @RaviKumar calls Sarah Chen daily at 09:00.',
            agent: '<strong>Executed at 07:44 &mdash; 5 steps completed:</strong><br><br><span class="text-red">①</span> <strong>Credit hold activated in ERP</strong> &mdash; Ref CH-2024-0018 at 07:44. Account locked: no new orders can be processed or released until @RaviKumar or CFO removes the hold.<br><br><span class="text-red">②</span> <strong>3 pending shipments blocked:</strong> SO-9821 ($820K), SO-9834 ($730K), SO-9847 ($550K) placed on despatch hold. @LogisticsTeam notified via Slack at 07:44. Exposure frozen at $2.1M &mdash; no further growth possible.<br><br><span class="text-orange">③</span> <strong>Formal hold notice sent</strong> to Sarah Chen, Head of Finance, Orbis Tech (sarah.chen@orbistech.com) &mdash; Subject: <em>"Credit Hold Notice: Ref CH-2024-0018 &mdash; INV-76890 &mdash; $1.3M Overdue"</em>. CC: @SarahAndrews (Account Manager), @LegalTeam.<br><br><span class="text-blue">④</span> <strong>Daily follow-up scheduled:</strong> @RaviKumar to call Sarah Chen at 09:00 each day until written payment commitment is received. First call: today 09:00.<br><br><span class="text-red">⑤</span> <strong>Legal escalation prepared:</strong> Ref LE-2024-0022 &mdash; auto-activates at 07:00 Day 3 if no written payment commitment is on file by then.'
        },
        escalate: {
            cfo:   'CFO-to-CFO message sent to Michael Tan at Orbis Tech. 3-day window. Credit hold auto-fires Day 3 if silent.',
            agent: '<strong>Executed at 07:44 &mdash; 4 steps completed:</strong><br><br><span class="text-orange">①</span> <strong>Direct CFO message sent</strong> to Michael Tan, CFO, Orbis Tech (m.tan@orbistech.com) &mdash; Subject: <em>"Personal Request: INV-76890 &mdash; $1.3M &mdash; Resolution Required by 9 Apr 2026"</em>. Priority flag set, delivery receipt on. CC: @SarahAndrews (Account Manager), @SeniorCFO.<br><br><span class="text-red">②</span> <strong>Shipment entry block applied:</strong> SO-9821, SO-9834, SO-9847 flagged at order entry level &mdash; will not advance to pick or despatch until a written payment commitment from Michael Tan is on file. @LogisticsTeam confirmed hold applied at 07:44.<br><br><span class="text-orange">③</span> <strong>Credit hold staged and pre-approved:</strong> Ref CH-2024-0018 authorised by @SeniorCFO. Standing by &mdash; auto-activates at 07:00 Day 3 if Michael Tan has not sent a written payment commitment by then.<br><br><span class="text-blue">④</span> <strong>CFO diary hold set:</strong> 15-min resolution review for @SeniorCFO at 09:00 Day 3. @SarahAndrews to submit latest contact status by 08:30 Day 3.'
        }
    },
    'pinnacle-foods': {
        split: {
            cfo:   'Collect $620K now from Pinnacle Foods — undisputed. $280K dispute via POD. @DispatchTeam owns it by Day 7.',
            agent: '<strong>Executed at 07:45 &mdash; 4 steps completed:</strong><br><br><span class="text-green">①</span> <strong>Collection instruction raised</strong> for INV-79080 ($300K) + INV-79145 ($320K). AR status &rarr; <em>Collection In Progress</em>. Email sent to Linda Wu, AP Manager, Pinnacle Foods (l.wu@pinnaclefoods.com) &mdash; Subject: <em>"Payment Request: INV-79080 &amp; INV-79145 &mdash; $620,000 &mdash; No Dispute, Immediate Settlement"</em>. CC: @RaviKumar.<br><br><span class="text-blue">②</span> <strong>Dispute ring-fenced:</strong> INV-79210 ($280K) moved to Dispute Sub-Account (Ref DSP-2024-0041). Will not be chased until POD outcome is confirmed. No impact on $620K collection timeline.<br><br><span class="text-orange">③</span> <strong>POD request raised</strong> to @DispatchTeam &mdash; Ref POD-2024-0119, covering Despatch Note DN-4421 and Bill of Lading BL-7832. Deadline: tomorrow 07:45. If delivery confirmed, counter-claim CC-xxxx issues same day. If shortfall proven, credit note raised and $280K written off.<br><br><span class="text-blue">④</span> <strong>Dispute tracker updated:</strong> Owner @DispatchTeam, resolution target Day 7 (13 Apr). @RaviKumar receives automated daily status update until closed.'
        },
        full: {
            cfo:   'Full $900K counter-claim filed against Pinnacle Foods. POD evidence attached. 7 days to respond.',
            agent: '<strong>Executed at 07:45 &mdash; 4 steps completed:</strong><br><br><span class="text-green">①</span> <strong>POD evidence compiled:</strong> Despatch Note DN-4421 (840 units, full load confirmed), Bill of Lading BL-7832, and warehouse loading timestamp for 25 Mar 2026 pulled from despatch system. @DispatchTeam confirmed all 840 units signed off at our dock before departure.<br><br><span class="text-red">②</span> <strong>Formal counter-claim submitted</strong> (Ref CC-2024-0031) to Linda Wu, AP Manager, Pinnacle Foods (l.wu@pinnaclefoods.com) &mdash; Subject: <em>"Counter-claim: INV-79210 &mdash; Full $900K Demanded &mdash; Proof of Delivery Enclosed"</em>. CC: @LegalTeam, @RaviKumar. DN-4421 and BL-7832 attached to email.<br><br><span class="text-orange">③</span> <strong>Response deadline set:</strong> Day 7 (13 Apr). @RaviKumar follows up Day 3. If no satisfactory response by Day 7, @LegalTeam escalates directly to their CFO and initiates formal dispute proceedings.<br><br><span class="text-blue">④</span> <strong>Cash forecast updated:</strong> All 3 invoices (79080, 79145, 79210) moved to <em>Full Collection &mdash; Counter-Dispute</em> in AR ledger. $900K reflected in Day 10 Probable column of the treasury position.'
        }
    },
    'summit-discount': {
        capture: {
            cfo:   'Pay Summit Chemicals $1.872M by Day 3. $28.5K discount locked. 27% annualised return confirmed.',
            agent: '<strong>Executed at 07:48 &mdash; 4 steps completed:</strong><br><br><span class="text-green">①</span> <strong>Payment instruction raised in AP system:</strong> $1,872,000 to Summit Chemicals &mdash; Ref PI-2024-0471. Payment date: Day 3 (8 Apr 2026), within the 10-day discount window. Routed to @APManager for approval &mdash; standard 2-hour SLA. Remittance advice sent to accounts@summitchemicals.com.<br><br><span class="text-green">②</span> <strong>Discount posted to AP ledger:</strong> $28,500 saving recorded against this AP line &mdash; Ref ADJ-2024-0088, finance code AP-DISC-2026. @FinanceTeam notified for month-end accrual update.<br><br><span class="text-blue">③</span> <strong>Liquidity confirmed:</strong> Post-payment cash position $40.4M &mdash; $2.4M above the $38M floor. Treasury signed off at 07:47. No borrowing headroom impact.<br><br><span class="text-blue">④</span> <strong>Vendor profile updated:</strong> Summit Chemicals flagged &mdash; <em>"Request 1.5/10 early-pay offer on every invoice &gt; $500K"</em>. @APManager to pursue on next invoice cycle.'
        },
        pass: {
            cfo:   'Standard payment on Day 32. $28.5K logged as a missed opportunity. @APManager to request same offer next cycle.',
            agent: '<strong>Executed at 07:48 &mdash; 3 steps completed:</strong><br><br><span class="text-gray">①</span> <strong>Standard payment scheduled:</strong> $1,900,000 to Summit Chemicals on Day 32 (7 May 2026) &mdash; Ref PI-2024-0472. AP ledger unchanged. Cash position unaffected today.<br><br><span class="text-blue">②</span> <strong>Opportunity logged:</strong> $28,500 discount recorded in AP Opportunity Register (Ref OPP-2024-0031). Reminder set for Day 25 (2 May) &mdash; @APManager to request the same 1.5/10 offer from Summit Chemicals before the next invoice is issued.<br><br><span class="text-gray">③</span> <strong>Vendor note added:</strong> Summit Chemicals profile updated &mdash; <em>"Offer early-pay discount on all invoices &gt; $500K"</em>. @APManager confirmed Summit Chemicals account contact is receptive to repeat discount arrangements.'
        }
    }
};

// ── Dispute action library ────────────────────────────────────
const DISPUTE_RESPONSES = {
    'pinnacle-pod': {
        msg: 'POD request sent to Warehouse Manager @AmitShah at 07:45. Dispatch log records retrieved: full load of 840 units confirmed as loaded on 25 Mar 2026, Bill of Lading BL-7832. GRN from Pinnacle Foods has been requested. Expected response: 2–4 hours. @DispatchTeam has been looped in for follow-up.'
    },
    'pinnacle-counterclaim': {
        msg: 'Formal counter-claim submitted to Pinnacle Foods Accounts Payable. Letter sent via email and registered post, referencing Dispatch Note DN-4421 and Bill of Lading BL-7832 as proof of full delivery. Full $280K demanded. 7-day response window set. @LegalTeam copied. Status updated in dispute tracker.'
    },
    'pinnacle-creditnote': {
        msg: 'Credit note CN-2046 raised for $280K against Invoice 79210. Adjustment posted to AR ledger. Pinnacle Foods AP team notified. Dispute marked as resolved. Undisputed $620K collection on Invoices 79080 and 79145 continues on current timeline — no impact.'
    },
    'corelogistics-rejection': {
        msg: 'Formal rejection notice sent to Core Logistics at 07:48. Letter references PO PO-7743 signed at $808K versus invoiced amount of $850K, and confirms no authorised change order exists for the $42K difference. Corrected invoice requested by Day 5. @ProcurementHead copied. Payment held pending resolution.'
    },
    'corelogistics-release': {
        msg: 'Payment instruction raised for $808K (PO value). Attached formal dispute letter contesting the $42K overcharge. Routed for CFO approval — required on all disputed AP releases. Core Logistics notified that payment has been made at contracted value and the remaining $42K is formally contested. Dispute marked as open in AP ledger.'
    },
    'corelogistics-escalate': {
        msg: 'Escalation raised to Procurement Head @ProcurementHead. Slack message sent, calendar hold set for 09:00 today. Summary shared: PO PO-7743 at $808K, invoice at $850K, no change order on file, Day 5 is the corrected-invoice deadline. Core Logistics account manager has been contacted directly. Outcome to be fed back into AP dispute tracker.'
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
