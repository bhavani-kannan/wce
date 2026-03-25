---
name: ap_cash_aggregation
description: Aggregate payables cash preservation data into portfolio-level working capital view
version: 1.0
type: executable-skill
domain: payables
input:
  - ap-cash-preservation-classification-output
  - financial-context-output
output: ap-cash-aggregation-output
status: locked
---

# AP CASH AGGREGATION SKILL

## purpose
Aggregate payables line-level data into portfolio-level metrics for working capital interpretation.

This skill produces:
- total payables exposure
- overdue payables exposure
- payment state distribution
- issue type distribution
- vendor concentration

This skill must not:
- recompute classification logic
- assign payment actions
- compute DPO

## inputs

required_datasets:
- ap-cash-preservation-classification-output
- financial-context-output

## execution_steps

- step: validate_inputs
  action:
    - verify classification dataset exists
    - verify financial-context-output exists
    - verify cogs present and greater than zero
  on_failure:
    - action: terminate
      error_code: INVALID_INPUT

- step: extract_cogs
  action:
    - cogs = financial-context-output.financial_anchors.cogs

- step: compute_total_open_payables
  action:
    - total_open_payables = sum(amount_local across all records)

- step: compute_overdue_payables
  action:
    - total_overdue_payables = sum(amount_local where due_state = OVERDUE)

- step: compute_overdue_ratio
  action:
    - IF total_open_payables > 0
        overdue_percent_of_open_payables = total_overdue_payables / total_open_payables
      ELSE
        overdue_percent_of_open_payables = 0

- step: compute_payables_to_cogs_ratio
  action:
    - payables_percent_of_cogs = total_open_payables / cogs

- step: compute_payment_profile
  action:
    - not_due = sum(amount_local where payment_state = NOT_DUE)
    - optimal_payment_window = sum(amount_local where payment_state = OPTIMAL_PAYMENT_WINDOW)
    - delayed = sum(amount_local where payment_state = DELAYED)
    - critical_delay = sum(amount_local where payment_state = CRITICAL_DELAY)

- step: compute_issue_summary
  action:
    - adjustment_or_credit = sum(amount_local where issue_type = ADJUSTMENT_OR_CREDIT)
    - on_time = sum(amount_local where issue_type = ON_TIME)
    - early_stage_delay = sum(amount_local where issue_type = EARLY_STAGE_DELAY)
    - structural_delay = sum(amount_local where issue_type = STRUCTURAL_DELAY)
    - concentration_risk = sum(amount_local where issue_type = CONCENTRATION_RISK)
    - critical_delay_issue = sum(amount_local where issue_type = CRITICAL_DELAY)
    - unclassified = sum(amount_local where issue_type = UNCLASSIFIED)

- step: compute_vendor_concentration
  action:
    - group by vendor_id
    - compute total payables per vendor
    - sort descending by total payables
    - select top 5 vendors
    - top_5_vendor_open_payables = sum(amount_local for top 5 vendors)
    - IF total_open_payables > 0
        top_5_vendor_percent_of_open_payables = top_5_vendor_open_payables / total_open_payables
      ELSE
        top_5_vendor_percent_of_open_payables = 0

- step: compute_confidence
  action:
    - score = 1.0
    - IF total_open_payables = 0
        score = score - 0.3
    - IF cogs <= 0
        score = score - 0.5
    - IF number of records < 5
        score = score - 0.2
    - IF score < 0
        score = 0

- step: assemble_output
  action:
    - summary.total_open_payables = total_open_payables
    - summary.total_overdue_payables = total_overdue_payables
    - summary.overdue_percent_of_open_payables = overdue_percent_of_open_payables
    - summary.payables_percent_of_cogs = payables_percent_of_cogs
    - payment_profile.not_due = not_due
    - payment_profile.optimal_payment_window = optimal_payment_window
    - payment_profile.delayed = delayed
    - payment_profile.critical_delay = critical_delay
    - issue_summary.adjustment_or_credit = adjustment_or_credit
    - issue_summary.on_time = on_time
    - issue_summary.early_stage_delay = early_stage_delay
    - issue_summary.structural_delay = structural_delay
    - issue_summary.concentration_risk = concentration_risk
    - issue_summary.critical_delay = critical_delay_issue
    - issue_summary.unclassified = unclassified
    - vendor_concentration.top_5_vendor_open_payables = top_5_vendor_open_payables
    - vendor_concentration.top_5_vendor_percent_of_open_payables = top_5_vendor_percent_of_open_payables
    - confidence.score = score

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
    "adjustment_or_credit": 0.0,
    "on_time": 0.0,
    "early_stage_delay": 0.0,
    "structural_delay": 0.0,
    "concentration_risk": 0.0,
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
- rule: no_reclassification description: must not recompute payment_state, issue_type, or working_capital_impact
- rule: no_dpo_computation description: do not compute DPO
- rule: no_action_assignment description: do not assign payment actions
- rule: financial_context_mandatory description: cogs must come from financial-context-output

## dependencies
### required_inputs:
- ap-cash-preservation-classification-output
- financial-context-output
### provides_outputs:
- ap-cash-aggregation-output
### consumed_by:
- skills/payables/SKILL.md
- skills/working-capital/SKILL.md

## failure_modes
- code: MISSING_CLASSIFICATION_DATA condition: classification dataset missing action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial context missing action: terminate
- code: INVALID_COGS condition: cogs invalid or zero action: terminate
- code: EMPTY_DATASET condition: no records available action: return_empty_output

## notes
- this skill converts payables line-level intelligence into portfolio summary
- this skill is the final step within payables domain
- enterprise working capital synthesis is handled separately
