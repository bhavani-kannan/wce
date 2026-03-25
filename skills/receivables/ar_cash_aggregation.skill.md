---
name: ar_cash_aggregation
description: Aggregate receivables cash impact data into portfolio-level working capital view
version: 1.0
type: executable-skill
domain: receivables
input:
  - ar-cash-impact-classification-output
  - financial-context-output
output: ar-cash-aggregation-output
status: locked
---

# AR CASH AGGREGATION SKILL

## purpose
Aggregate receivables line-level data into portfolio-level metrics for working capital interpretation.

This skill produces:
- total receivables exposure
- overdue exposure
- cash state distribution
- issue type distribution
- customer concentration

This skill must not:
- recompute classification logic
- assign collection actions
- compute DSO

---

## inputs

required_datasets:
- ar-cash-impact-classification-output
- financial-context-output

---

## execution_steps

- step: validate_inputs
  action:
    - verify classification dataset exists
    - verify financial-context-output exists
    - verify revenue present and greater than zero
  on_failure:
    - action: terminate
      error_code: INVALID_INPUT

---

- step: extract_revenue
  action:
    - revenue = financial-context-output.financial_anchors.revenue

---

- step: compute_total_open_receivables
  action:
    - total_open_receivables = sum(amount_local across all records)

---

- step: compute_overdue_receivables
  action:
    - total_overdue_receivables = sum(amount_local where due_state = OVERDUE)

---

- step: compute_overdue_ratio
  action:
    - IF total_open_receivables > 0
        overdue_percent_of_open_receivables = total_overdue_receivables / total_open_receivables
      ELSE
        overdue_percent_of_open_receivables = 0

---

- step: compute_receivables_to_revenue_ratio
  action:
    - receivables_percent_of_revenue = total_open_receivables / revenue

---

- step: compute_cash_profile
  action:
    - not_due = sum(amount_local where cash_state = NOT_DUE)
    - immediate_recoverable = sum(amount_local where cash_state = IMMEDIATE_RECOVERABLE)
    - at_risk = sum(amount_local where cash_state = AT_RISK)
    - critical = sum(amount_local where cash_state = CRITICAL)

---

- step: compute_issue_summary
  action:
    - adjustment_or_credit = sum(amount_local where issue_type = ADJUSTMENT_OR_CREDIT)
    - dispute = sum(amount_local where issue_type = DISPUTE)
    - credit_issue = sum(amount_local where issue_type = CREDIT_ISSUE)
    - concentration_risk = sum(amount_local where issue_type = CONCENTRATION_RISK)
    - collection_delay = sum(amount_local where issue_type = COLLECTION_DELAY)
    - unclassified = sum(amount_local where issue_type = UNCLASSIFIED)

---

- step: compute_customer_concentration
  action:
    - group by customer_id
    - compute total receivables per customer
    - sort descending by total receivables
    - select top 5 customers

    - top_5_customer_open_receivables = sum(amount_local for top 5 customers)

    - IF total_open_receivables > 0
        top_5_customer_percent_of_open_receivables = top_5_customer_open_receivables / total_open_receivables
      ELSE
        top_5_customer_percent_of_open_receivables = 0

---

- step: compute_confidence
  action:
    - score = 1.0

    - IF total_open_receivables = 0
        score = score - 0.3

    - IF revenue <= 0
        score = score - 0.5

    - IF number of records < 5
        score = score - 0.2

    - IF score < 0
        score = 0

---

- step: assemble_output
  action:
    - summary.total_open_receivables = total_open_receivables
    - summary.total_overdue_receivables = total_overdue_receivables
    - summary.overdue_percent_of_open_receivables = overdue_percent_of_open_receivables
    - summary.receivables_percent_of_revenue = receivables_percent_of_revenue

    - cash_profile.not_due = not_due
    - cash_profile.immediate_recoverable = immediate_recoverable
    - cash_profile.at_risk = at_risk
    - cash_profile.critical = critical

    - issue_summary.adjustment_or_credit = adjustment_or_credit
    - issue_summary.dispute = dispute
    - issue_summary.credit_issue = credit_issue
    - issue_summary.concentration_risk = concentration_risk
    - issue_summary.collection_delay = collection_delay
    - issue_summary.unclassified = unclassified

    - customer_concentration.top_5_customer_open_receivables = top_5_customer_open_receivables
    - customer_concentration.top_5_customer_percent_of_open_receivables = top_5_customer_percent_of_open_receivables

    - confidence.score = score

---

## output_contract

```json
{
  "summary": {
    "total_open_receivables": 0.0,
    "total_overdue_receivables": 0.0,
    "overdue_percent_of_open_receivables": 0.0,
    "receivables_percent_of_revenue": 0.0
  },
  "cash_profile": {
    "not_due": 0.0,
    "immediate_recoverable": 0.0,
    "at_risk": 0.0,
    "critical": 0.0
  },
  "issue_summary": {
    "adjustment_or_credit": 0.0,
    "dispute": 0.0,
    "credit_issue": 0.0,
    "concentration_risk": 0.0,
    "collection_delay": 0.0,
    "unclassified": 0.0
  },
  "customer_concentration": {
    "top_5_customer_open_receivables": 0.0,
    "top_5_customer_percent_of_open_receivables": 0.0
  },
  "confidence": {
    "score": 0.0
  }
}
```

## constraints
- rule: no_reclassification description: must not recompute cash_state, issue_type, or working_capital_impact
- rule: no_dso_computation description: do not compute DSO
- rule: no_action_assignment description: do not assign collection actions
- rule: financial_context_mandatory description: revenue must come from financial-context-output

## dependencies
### required_inputs:
- ar-cash-impact-classification-output
- financial-context-output
### provides_outputs:
- ar-cash-aggregation-output
### consumed_by:
- skills/receivables/SKILL.md
- skills/working-capital/SKILL.md

## failure_modes
- code: MISSING_CLASSIFICATION_DATA condition: classification dataset missing action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial context missing action: terminate
- code: INVALID_REVENUE condition: revenue invalid or zero action: terminate
- code: EMPTY_DATASET condition: no records available action: return_empty_output

## notes
- this skill converts line-level intelligence into CFO-level summary
- this skill is the final step within receivables domain
- enterprise working capital synthesis is handled separately
