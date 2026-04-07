# Agent Instructions — AR Collections Agent
## Working Capital War Room (WCE Prototype)

> **Document type:** Agent Instruction Set  
> **Audience:** AI/ML engineers, integration developers, solution architects  
> **Related data contracts:** `fact_ar_open_items`, `fact_collections_activity`, `fact_payment_history`, `fact_dunning_records`, `fact_external_signals`, `dim_customer`, `dim_credit_profile`, `dim_user_directory`, and dimension lookups (see `../data-contracts/README.md`)

---

## Folder Contents

| File | Description |
|------|-------------|
| `AI-001_AR-COLLECTIONS-CORE-AGENT.md` | Core agent logic: role, inputs, decision rules, available actions, escalation matrix, output format |
| `AI-002_DELTA-RETAIL-PLAYBOOK.md` | Customer-specific playbook for Delta Retail $1.8M overdue collection case |

---

## How to Use These Files

1. **AI-001** is the system prompt / instruction set loaded at agent initialisation. It governs all AR collection cases.
2. **AI-002** (and future `AI-00X` files) are **case-specific playbooks** injected as context when the agent identifies a specific customer requiring a named decision. AI-001 calls AI-002 when `KUNNR = 0000004821` (Delta Retail) is flagged as `COLLECTION_PRIORITY_AGENT = CRITICAL`.
3. Both files are written for an LLM-based orchestration agent (e.g., GPT-4o, Claude 3.5, or SAP Joule), but the action execution steps map to concrete SAP API calls, CRM tasks, and Teams webhooks — these integration contracts are defined here and in the feature spec `../specs/FS-001_AR-COLLECTIONS-AGENT.md`.

---

## Instruction File Versioning

| File | Version | Author | Last Updated |
|------|---------|--------|--------------|
| AI-001 | v1.0 | BA/Product Owner | 2026-04-07 |
| AI-002 | v1.0 | BA/Product Owner | 2026-04-07 |

---

## Guardrails Summary

The agent operates under the following hard constraints (full detail in AI-001):

| Constraint | Rule |
|------------|------|
| No external communication | Agent cannot send emails/letters directly to customers. External-facing actions require human review. |
| Authority ceiling | Agent can initiate collection items up to $1.5M (Policy AR-03) without additional approval. Above $1.5M, route to CFO. |
| Legal hold | Agent can open Legal CMS holds in DORMANT status only. @LegalTeam owns activation. |
| Credit management | Agent can propose FD32 credit limit changes; @RaviKumar or CFO must confirm in VKM1/FD32. |
| Dunning | Agent can recommend dunning level; execution via F150 requires AP Manager confirmation. |
| Write-back | Agent writes status updates to `fact_collections_activity` only. It does not modify `fact_ar_open_items`, `dim_customer`, or other source tables directly. |
