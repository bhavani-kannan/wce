---
name: payables
description: Orchestrate payables analysis using payables-ledger-gold and financial-context outputs
version: 1.0
type: executable-skill
domain: payables
input:
  - payables-ledger-gold
  - financial-context-output
output: payables-output
status: locked
---

# PAYABLES SKILL

## purpose
Coordinate payables analysis for working capital interpretation.

This skill orchestrates payables sub-skills and returns a domain-level payables output.

This skill must not perform line-item classification logic directly.

---

## inputs

required_datasets:
- payables-ledger-gold
- financial-context-output

---

## execution_steps

- step: validate_inputs
  action:
    - verify payables-ledger-gold exists
    - verify financial-context-output exists
    - verify payables-ledger-gold conforms to input contract
    - verify financial-context-output contains cogs
  on_failure:
    - action: terminate
      error_code: INVALID_PAYABLES_INPUT

---

- step: execute_overdue_identification
  action:
    - invoke skills/payables/ap_overdue_identification.skill.md
    - pass payables-ledger-gold
  output:
    - overdue_identification_output

---

- step: execute_cash_preservation_classification
  action:
    - invoke skills/payables/ap_cash_preservation_classification.skill.md
    - pass overdue_identification_output
    - pass financial-context-output
  output:
    - cash_preservation_classification_output

---

- step: execute_cash_aggregation
  action:
    - invoke skills/payables/ap_cash_aggregation.skill.md
    - pass cash_preservation_classification_output
    - pass financial-context-output
  output:
    - cash_aggregation_output

---

- step: assemble_domain_output
  action:
    - payables_output.summary = cash_aggregation_output.summary
    - payables_output.payment_profile = cash_aggregation_output.payment_profile
    - payables_output.issue_summary = cash_aggregation_output.issue_summary
    - payables_output.vendor_concentration = cash_aggregation_output.vendor_concentration
    - payables_output.confidence = cash_aggregation_output.confidence

---

## orchestration_rules

- rule: strict_sequence
  description: sub-skills must execute in defined order
  order:
    - ap_overdue_identification.skill.md
    - ap_cash_preservation_classification.skill.md
    - ap_cash_aggregation.skill.md

- rule: no_step_skipping
  description: aggregation must not run before classification and overdue identification

- rule: financial_context_required
  description: payables interpretation must not proceed without cogs anchor

---

## output_contract

```json
{
  "summary": {
    "total_open_payables": 0.0,
    "total_overdue_payables": 0.0,
    "overdue_percent_of_open_payables": 0.0,
    "payables_percent_of_cogs": 0.0
  },
  "payment_profile": {
    "not_due": 0.0,
    "optimal_payment_window": 0.0,
    "delayed": 0.0,
    "critical_delay": 0.0
  },
  "issue_summary": {
    "early_payment": 0.0,
    "on_time": 0.0,
    "delayed": 0.0,
    "critical_delay": 0.0,
    "unclassified": 0.0
  },
  "vendor_concentration": {
    "top_5_vendor_open_payables": 0.0,
    "top_5_vendor_percent_of_open_payables": 0.0
  },
  "confidence": {
    "score": 0.0
  }
}
```

## constraints
- rule: no_line_item_logic description: do not compute overdue days, payment state, or issue classification in this skill
- rule: no_dpo_computation description: do not compute DPO
- rule: no_payment_action_assignment description: do not assign payment actions or recommendations
- rule: no_cogs_inference description: cogs must only come from financial-context-output

## dependencies

### required_inputs:
- payables-ledger-gold
 financial-context-output

### required_subskills:
- skills/payables/ap_overdue_identification.skill.md
- skills/payables/ap_cash_preservation_classification.skill.md
- skills/payables/ap_cash_aggregation.skill.md

### provides_outputs:
- payables-output

### consumed_by:
- skills/working-capital/SKILL.md

## failure_modes
- code: MISSING_PAYABLES_DATASET condition: payables-ledger-gold not provided action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial-context-output not provided action: terminate
- code: MISSING_COGS_ANCHOR condition: cogs missing or invalid action: terminate
- code: SUBSKILL_FAILURE condition: any sub-skill fails action: terminate

## notes
- this skill is the domain controller for payables
- this skill produces payables domain output only
- enterprise working capital interpretation is handled separately
