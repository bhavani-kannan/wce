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
            cfo:   'Proceed with $1.08M partial collection from customer Delta Retail. Track remaining $720K separately with 7-day follow-up.',
            agent: 'Collection initiated for $1.08M from customer Delta Retail. Owner aligned. Senior escalation not required. Follow-up scheduled on remaining $720K — Day 7 deadline set. Legal hold prepared as fallback if no movement.'
        },
        full: {
            cfo:   'Push for full $1.8M from customer Delta Retail. Escalate to their CFO office immediately.',
            agent: 'Full $1.8M demand raised with customer Delta Retail. Escalated to their CFO via formal letter. 5-business-day response window set. Legal notice prepared as fallback. Senior approval obtained for escalation track.'
        }
    },
    'orbis-tech': {
        hold: {
            cfo:   'Place customer Orbis Tech on credit hold. Protect cash. Stop new shipment exposure.',
            agent: 'Credit hold activated for customer Orbis Tech. $2.1M pipeline shipments paused. Formal notice sent per contract terms. AR team on daily follow-up. Legal escalation letter prepared. Account manager briefed on relationship risk.'
        },
        escalate: {
            cfo:   'CFO-level escalation first. 3-day window. Credit hold on standby if no response.',
            agent: 'Direct CFO-to-CFO contact initiated with customer Orbis Tech. Demand letter sent. 3-day response window activated. Credit hold pre-approved and on standby. No new shipments sent until payment commitment received.'
        }
    },
    'pinnacle-foods': {
        split: {
            cfo:   'Collect undisputed $620K from customer Pinnacle Foods now. Resolve $280K dispute separately via POD process.',
            agent: 'Collection for $620K initiated from customer Pinnacle Foods (Invoices 79080, 79145). Dispute team assigned to Invoice 79210. Proof of delivery request sent to warehouse. Resolution target: 7 days. Remaining $280K tracked separately.'
        },
        full: {
            cfo:   'Counter-dispute filed. Demand full $900K from customer Pinnacle Foods — our delivery records are clean.',
            agent: 'Counter-dispute raised against customer Pinnacle Foods for Invoice 79210. POD documentation compiled from logistics and dispatch. Full $900K demand letter sent. Account manager escalated. Dispute resolution target: 10 days.'
        }
    },
    'summit-discount': {
        capture: {
            cfo:   'Capture the discount. Pay vendor Summit Chemicals $1.872M within 5 days. $28.5K saving locked in.',
            agent: 'Early payment of $1.872M to vendor Summit Chemicals scheduled for Day 3. Discount of $28.5K confirmed. Treasury cash runway verified — no liquidity risk. AP ledger updated. Vendor notified.'
        },
        pass: {
            cfo:   'Pass on discount this cycle. Maintain standard payment date for vendor Summit Chemicals.',
            agent: 'Standard payment cycle maintained. $1.9M to vendor Summit Chemicals cleared on Day 32. Discount opportunity logged for next billing cycle. Vendor relationship team will request same offer next invoice.'
        }
    }
};

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
                ${res.cfo}
            </div>
            <div class="agent-label mt-10">Agent response</div>
            <div class="card good" style="margin-bottom:0;">
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
                html:  `<strong>customer Delta Retail — Full $1.8M collected</strong><br>
                        CFO-level escalation triggered. Parent entity cash confirmed ($42M). Hard demand letter served.
                        Full $1.8M cleared in 4 business days. <span class="text-green">+$1.8M vs. base case.</span>`
            },
            {
                delay: 1700,
                type:  'good',
                time:  '07:45',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>customer Orbis Tech — Credit hold unlocked $1.3M</strong><br>
                        Credit hold notice sent. customer Orbis Tech responded within 24h with full payment commitment.
                        $1.3M cleared Day 3. Shipment pipeline re-opened Day 4. <span class="text-green">+$1.3M.</span>`
            },
            {
                delay: 2500,
                type:  'good',
                time:  '07:46',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>customer Pinnacle Foods — Full $900K resolved</strong><br>
                        POD confirmed full delivery. Counter-claim accepted by customer Pinnacle Foods.
                        Full $900K collected Day 6. Dispute closed. <span class="text-green">+$280K vs. base case.</span>`
            },
            {
                delay: 3300,
                type:  'good',
                time:  '07:47',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>vendor Summit Chemicals — $28.5K discount captured</strong><br>
                        $1.872M paid by Day 5 within discount window. $28.5K saving locked in.
                        Annualised return on early payment: <span class="text-green">27%</span>. AP ledger updated.`
            },
            {
                delay: 4100,
                type:  'good',
                time:  '07:48',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>customer Nexwave Retail — $800K confirmed Day 5</strong><br>
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
                html:  `<strong>customer Delta Retail — $1.08M partial collected</strong><br>
                        Within approval level. Cleared in 3–5 days. Remaining $720K tracked with 7-day follow-up deadline.`
            },
            {
                delay: 1700,
                type:  'good',
                time:  '07:45',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>customer Nexwave Retail — $800K Day 5</strong><br>
                        Customer committed. Payment expected on schedule.`
            },
            {
                delay: 2500,
                type:  'good',
                time:  '07:46',
                icon:  'icon-good',
                char:  '✓',
                html:  `<strong>vendor Axis Packaging — $1.1M deferred to Day 45</strong><br>
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
                html:  `<strong>customer Delta Retail — No payment</strong><br>
                        Escalation not pursued. $1.8M remains outstanding. <span class="text-red">Exposure grows to Day 102.</span>`
            },
            {
                delay: 1700,
                type:  'risk',
                time:  '07:45',
                icon:  'icon-agent',
                char:  '✗',
                html:  `<strong>customer Orbis Tech — No credit hold, shipments continue</strong><br>
                        $2.1M new shipments released without payment. Total exposure reaches <span class="text-red">$3.4M.</span>`
            },
            {
                delay: 2500,
                type:  'risk',
                time:  '07:46',
                icon:  'icon-agent',
                char:  '✗',
                html:  `<strong>vendor Summit Chemicals — Discount window missed</strong><br>
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
                        <strong class="text-red">Immediate CFO action required</strong> on customer Orbis Tech, customer Delta Retail, and discount window.`
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
