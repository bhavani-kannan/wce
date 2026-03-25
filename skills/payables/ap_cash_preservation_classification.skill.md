---
name: ap_cash_preservation_classification
description: Classify payables line items by payment state, impact relative to cogs, issue type, and working capital relevance
version: 1.0
type: executable-skill
domain: payables
input:
  - ap-overdue-identification-output
  - financial-context-output
output: ap-cash-preservation-classification-output
status: locked
---

# AP CASH PRESERVATION CLASSIFICATION SKILL

## purpose
Classify payables line items based on:
- payment state
- impact relative to cogs
- issue type
- working capital impact

This skill transforms overdue payables data into payables working capital intelligence.

## inputs

required_datasets:
- ap-overdue-identification-output
- financial-context-output

## execution_steps

- step: validate_inputs
  action:
    - verify overdue dataset exists
    - verify financial-context-output exists
    - verify cogs present and greater than zero
  on_failure:
    - action: terminate
      error_code: INVALID_INPUT

- step: extract_cogs_anchor
  action:
    - cogs = financial-context-output.financial_anchors.cogs

- step: compute_cogs_ratio
  action:
    - FOR each record
        cogs_ratio = amount_local / cogs

- step: assign_payment_state
  action:
    - FOR each record
        IF overdue_days = 0
          payment_state = NOT_DUE
        IF overdue_days >= 1 AND overdue_days <= 30
          payment_state = OPTIMAL_PAYMENT_WINDOW
        IF overdue_days >= 31 AND overdue_days <= 90
          payment_state = DELAYED
        IF overdue_days > 90
          payment_state = CRITICAL_DELAY

- step: assign_impact_scale
  action:
    - FOR each record
        IF cogs_ratio >= 0.01
          impact_scale = LARGE
        IF cogs_ratio >= 0.001 AND cogs_ratio < 0.01
          impact_scale = MEDIUM
        IF cogs_ratio < 0.001
          impact_scale = SMALL

- step: compute_vendor_aggregates
  action:
    - group records by vendor_id
    - compute for each vendor:
        vendor_total_outstanding = sum(amount_local)
        vendor_open_item_count = count(records)
        vendor_avg_overdue_days = average(overdue_days)

- step: assign_issue_type
  action:
    - FOR each record
        IF amount_local < 0
          issue_type = ADJUSTMENT_OR_CREDIT
        ELSE IF overdue_days = 0
          issue_type = ON_TIME
        ELSE IF overdue_days >= 1 AND overdue_days <= 15
          issue_type = EARLY_STAGE_DELAY
        ELSE IF vendor_open_item_count >= 3 AND vendor_avg_overdue_days > 45
          issue_type = STRUCTURAL_DELAY
        ELSE IF vendor_total_outstanding >= 0.05 * cogs AND overdue_days > 60
          issue_type = CONCENTRATION_RISK
        ELSE IF overdue_days > 90
          issue_type = CRITICAL_DELAY
        ELSE
          issue_type = UNCLASSIFIED

- step: assign_working_capital_impact
  action:
    - FOR each record
        IF issue_type = CONCENTRATION_RISK AND payment_state IN (DELAYED, CRITICAL_DELAY)
          working_capital_impact = HIGH
        ELSE IF issue_type = STRUCTURAL_DELAY AND payment_state IN (DELAYED, CRITICAL_DELAY)
          working_capital_impact = MEDIUM
        ELSE IF issue_type = EARLY_STAGE_DELAY AND impact_scale = LARGE
          working_capital_impact = MEDIUM
        ELSE IF payment_state = OPTIMAL_PAYMENT_WINDOW
          working_capital_impact = LOW
        ELSE
          working_capital_impact = MINIMAL

- step: compute_cash_preservation_value
  action:
    - FOR each record
        cash_preservation_value = amount_local

- step: compute_confidence
  action:
    - FOR each record
        score = 1.0
        IF due_date IS NULL
          score = score - 0.4
        IF amount_local IS NULL OR amount_local = 0
          score = score - 0.3
        IF cogs <= 0
          score = score - 0.5
        IF score < 0
          score = 0

- step: assemble_output
  action:
    - FOR each record
        output includes:
          vendor_id
          document_id
          amount_local
          overdue_days
          aging_bucket
          payment_state
          impact_scale
          issue_type
          working_capital_impact
          cash_preservation_value
          cogs_ratio
          confidence_score

## classification_rules

### payment_state
- NOT_DUE
- OPTIMAL_PAYMENT_WINDOW
- DELAYED
- CRITICAL_DELAY

### impact_scale
- SMALL
- MEDIUM
- LARGE

### issue_type
- ADJUSTMENT_OR_CREDIT
- ON_TIME
- EARLY_STAGE_DELAY
- STRUCTURAL_DELAY
- CONCENTRATION_RISK
- CRITICAL_DELAY
- UNCLASSIFIED

### working_capital_impact
- MINIMAL
- LOW
- MEDIUM
- HIGH

## output_contract

```json
{
  "records": [
    {
      "vendor_id": "string",
      "document_id": "string",
      "amount_local": 0.0,
      "overdue_days": 0,
      "aging_bucket": "string",
      "payment_state": "string",
      "impact_scale": "string",
      "issue_type": "string",
      "working_capital_impact": "string",
      "cash_preservation_value": 0.0,
      "cogs_ratio": 0.0,
      "confidence_score": 0.0
    }
  ]
}
```

## constraints
- rule: no_aggregation_output description: this skill must not produce portfolio-level summaries
- rule: no_action_assignment description: do not assign payment actions or recommendations
- rule: financial_context_mandatory description: cogs must be sourced only from financial-context-output
- rule: no_cogs_inference description: cogs must not be inferred from payables data

## dependencies
### required_inputs:
- ap-overdue-identification-output
- financial-context-output
### provides_outputs:
- ap-cash-preservation-classification-output

## consumed_by:
- skills/payables/ap_cash_aggregation.skill.md
- skills/payables/SKILL.md

### failure_modes
- code: MISSING_OVERDUE_INPUT condition: overdue dataset missing action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial context missing action: terminate
- code: INVALID_COGS condition: cogs is zero or invalid action: terminate
- code: EMPTY_DATASET condition: no records available action: return_empty_output
## notes
- this skill introduces payables working capital intelligence at line level
- this skill must not be bypassed before aggregation
- all downstream aggregation must rely on this output
