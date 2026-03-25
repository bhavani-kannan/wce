---
name: ar_cash_impact_classification
description: Classify receivables line items by cash impact, issue type, and working capital relevance
version: 1.0
type: executable-skill
domain: receivables
input:
  - ar-overdue-identification-output
  - financial-context-output
output: ar-cash-impact-classification-output
status: locked
---

# AR CASH IMPACT CLASSIFICATION SKILL

## purpose
Classify receivables line items based on:

- cash state
- impact relative to revenue
- issue type
- working capital impact

This skill transforms overdue data into working capital intelligence.

---

## inputs

required_datasets:
- ar-overdue-identification-output
- financial-context-output

---

## execution_steps

- step: validate_inputs
  action:
    - verify overdue dataset exists
    - verify financial-context-output exists
    - verify revenue present and greater than zero
  on_failure:
    - action: terminate
      error_code: INVALID_INPUT

---

- step: extract_revenue_anchor
  action:
    - revenue = financial-context-output.financial_anchors.revenue

---

- step: compute_revenue_ratio
  action:
    - FOR each record
        revenue_ratio = amount_local / revenue

---

- step: assign_cash_state
  action:
    - FOR each record
        IF overdue_days = 0
          cash_state = NOT_DUE

        IF overdue_days >= 1 AND overdue_days <= 30
          cash_state = IMMEDIATE_RECOVERABLE

        IF overdue_days >= 31 AND overdue_days <= 90
          cash_state = AT_RISK

        IF overdue_days > 90
          cash_state = CRITICAL

---

- step: assign_impact_scale
  action:
    - FOR each record
        IF revenue_ratio >= 0.01
          impact_scale = LARGE

        IF revenue_ratio >= 0.001 AND revenue_ratio < 0.01
          impact_scale = MEDIUM

        IF revenue_ratio < 0.001
          impact_scale = SMALL

---

- step: compute_customer_aggregates
  action:
    - group records by customer_id
    - compute for each customer:
        customer_total_outstanding = sum(amount_local)
        customer_open_item_count = count(records)
        customer_avg_overdue_days = average(overdue_days)

---

- step: assign_issue_type
  action:
    - FOR each record

        IF amount_local < 0
          issue_type = ADJUSTMENT_OR_CREDIT

        ELSE IF dispute_flag = true
          issue_type = DISPUTE

        ELSE IF customer_open_item_count >= 3 AND customer_avg_overdue_days > 45
          issue_type = CREDIT_ISSUE

        ELSE IF customer_total_outstanding >= 0.05 * revenue AND overdue_days > 60
          issue_type = CONCENTRATION_RISK

        ELSE IF overdue_days >= 1 AND overdue_days <= 45
          issue_type = COLLECTION_DELAY

        ELSE
          issue_type = UNCLASSIFIED

---

- step: assign_working_capital_impact
  action:
    - FOR each record

        IF issue_type = DISPUTE
          working_capital_impact = HIGH

        ELSE IF issue_type = CONCENTRATION_RISK AND cash_state IN (AT_RISK, CRITICAL)
          working_capital_impact = HIGH

        ELSE IF issue_type = CREDIT_ISSUE AND cash_state IN (AT_RISK, CRITICAL)
          working_capital_impact = MEDIUM

        ELSE IF issue_type = COLLECTION_DELAY AND impact_scale = LARGE
          working_capital_impact = MEDIUM

        ELSE IF cash_state = IMMEDIATE_RECOVERABLE
          working_capital_impact = LOW

        ELSE
          working_capital_impact = MINIMAL

---

- step: compute_cash_stuck
  action:
    - FOR each record
        cash_stuck = amount_local

---

- step: compute_confidence
  action:
    - FOR each record

        score = 1.0

        IF due_date IS NULL
          score = score - 0.4

        IF amount_local IS NULL OR amount_local = 0
          score = score - 0.3

        IF revenue <= 0
          score = score - 0.5

        IF score < 0
          score = 0

---

- step: assemble_output
  action:
    - FOR each record
        output includes:
          customer_id
          document_id
          amount_local
          overdue_days
          aging_bucket
          cash_state
          impact_scale
          issue_type
          working_capital_impact
          cash_stuck
          revenue_ratio
          confidence_score

---

## classification_rules

### cash_state
- NOT_DUE
- IMMEDIATE_RECOVERABLE
- AT_RISK
- CRITICAL

### impact_scale
- SMALL
- MEDIUM
- LARGE

### issue_type
- ADJUSTMENT_OR_CREDIT
- DISPUTE
- CREDIT_ISSUE
- CONCENTRATION_RISK
- COLLECTION_DELAY
- UNCLASSIFIED

### working_capital_impact
- MINIMAL
- LOW
- MEDIUM
- HIGH

---

## output_contract

```json
{
  "records": [
    {
      "customer_id": "string",
      "document_id": "string",
      "amount_local": 0.0,
      "overdue_days": 0,
      "aging_bucket": "string",
      "cash_state": "string",
      "impact_scale": "string",
      "issue_type": "string",
      "working_capital_impact": "string",
      "cash_stuck": 0.0,
      "revenue_ratio": 0.0,
      "confidence_score": 0.0
    }
  ]
}

```

## constraints
- rule: no_aggregation_output description: this skill must not produce portfolio-level summaries
- rule: no_action_assignment description: do not assign collection or escalation actions
- rule: financial_context_mandatory description: revenue must be sourced only from financial-context-output
- rule: no_revenue_inference description: revenue must not be inferred from receivables data

##dependencies
###required_inputs:
- ar-overdue-identification-output
- financial-context-output
### provides_outputs:
- ar-cash-impact-classification-output
### consumed_by:
- skills/receivables/ar_cash_aggregation.skill.md
- skills/receivables/SKILL.md
  
## failure_modes
- code: MISSING_OVERDUE_INPUT condition: overdue dataset missing action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial context missing action: terminate
- code: INVALID_REVENUE condition: revenue is zero or invalid action: terminate
- code: EMPTY_DATASET condition: no records available action: return_empty_output

## notes
- this skill introduces working capital intelligence at line level
- this skill must not be bypassed before aggregation
- all downstream aggregation must rely on this output
