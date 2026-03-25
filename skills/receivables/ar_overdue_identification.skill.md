---
name: ar_overdue_identification
description: Identify open receivables items, compute overdue days, and assign aging buckets
version: 1.0
type: executable-skill
domain: receivables
input: receivables-ledger-gold
output: ar-overdue-identification-output
status: locked
---

# AR OVERDUE IDENTIFICATION SKILL

## purpose
Identify receivables line items that are open, overdue, or not yet due.

This skill computes overdue days and assigns aging buckets at line-item level.

This skill must not:
- compute cash impact
- classify issue type
- assign collection actions
- aggregate customer or portfolio totals

---

## inputs

required_datasets:
- receivables-ledger-gold

---

## execution_steps

- step: validate_input
  action:
    - verify receivables-ledger-gold exists
    - verify dataset conforms to input contract
  on_failure:
    - action: terminate
      error_code: INVALID_RECEIVABLES_LEDGER_INPUT

---

- step: determine_item_status
  action:
    - FOR each row
        IF clearing_date IS NULL
          status = OPEN
        ELSE
          status = CLEARED

---

- step: filter_open_items
  action:
    - retain only rows where status = OPEN
  output:
    - open_items_dataset

---

- step: compute_overdue_days
  action:
    - FOR each row in open_items_dataset
        IF evaluation_date > due_date
          overdue_days = evaluation_date - due_date
        ELSE
          overdue_days = 0

---

- step: assign_due_state
  action:
    - FOR each row in open_items_dataset
        IF overdue_days = 0
          due_state = NOT_DUE
        ELSE
          due_state = OVERDUE

---

- step: assign_aging_bucket
  action:
    - FOR each row in open_items_dataset
        IF overdue_days = 0
          aging_bucket = NOT_DUE
        IF overdue_days >= 1 AND overdue_days <= 30
          aging_bucket = DUE_1_30
        IF overdue_days >= 31 AND overdue_days <= 60
          aging_bucket = DUE_31_60
        IF overdue_days >= 61 AND overdue_days <= 90
          aging_bucket = DUE_61_90
        IF overdue_days > 90
          aging_bucket = DUE_OVER_90

---

- step: compute_confidence
  action:
    - FOR each row in open_items_dataset
        confidence_score = 1.0

        IF due_date IS NULL
          confidence_score = confidence_score - 0.5

        IF evaluation_date IS NULL
          confidence_score = confidence_score - 0.5

        IF amount_local IS NULL
          confidence_score = confidence_score - 0.2

        IF confidence_score < 0
          confidence_score = 0

---

- step: assemble_output
  action:
    - FOR each row in open_items_dataset
        output record includes:
          customer_id
          document_id
          document_date
          baseline_date
          due_date
          evaluation_date
          amount_local
          currency_code
          payment_terms_code
          dispute_flag
          dispute_reason
          overdue_days
          due_state
          aging_bucket
          confidence_score

---

## aging_rules

- bucket: NOT_DUE
  condition: overdue_days = 0

- bucket: DUE_1_30
  condition: overdue_days >= 1 AND overdue_days <= 30

- bucket: DUE_31_60
  condition: overdue_days >= 31 AND overdue_days <= 60

- bucket: DUE_61_90
  condition: overdue_days >= 61 AND overdue_days <= 90

- bucket: DUE_OVER_90
  condition: overdue_days > 90

---

## output_contract

```json
{
  "records": [
    {
      "customer_id": "string",
      "document_id": "string",
      "document_date": "date",
      "baseline_date": "date",
      "due_date": "date",
      "evaluation_date": "date",
      "amount_local": 0.0,
      "currency_code": "string",
      "payment_terms_code": "string",
      "dispute_flag": false,
      "dispute_reason": "",
      "overdue_days": 0,
      "due_state": "NOT_DUE | OVERDUE",
      "aging_bucket": "NOT_DUE | DUE_1_30 | DUE_31_60 | DUE_61_90 | DUE_OVER_90",
      "confidence_score": 0.0
    }
  ]
}
```

## constraints
- rule: open_items_only description: only open items may be included in output
- rule: no_cash_impact_logic description: do not compute cash stuck, revenue ratio, or working capital impact
- rule: no_issue_classification description: do not assign dispute, concentration, credit issue, or collection delay categories beyond existing dispute input fields
- rule: no_aggregation description: do not aggregate totals by customer, bucket, or portfolio
- rule: no_action_assignment description: do not assign collection or escalation actions

## dependencies
### required_inputs:
- receivables-ledger-gold
### provides_outputs:
- ar-overdue-identification-output
### consumed_by:
- skills/receivables/ar_cash_impact_classification.skill.md
- skills/receivables/SKILL.md

## failure_modes
- code: MISSING_DATASET condition: receivables-ledger-gold not provided action: terminate
- code: INVALID_STRUCTURE condition: input dataset fails contract validation action: terminate
- code: NO_OPEN_ITEMS condition: no rows remain after filtering for open items action: return_empty_output
- code: INVALID_DATE_FIELDS condition: due_date or evaluation_date invalid action: terminate

## notes
- this skill is line-item only
- this skill is the only source of overdue_days and aging_bucket for receivables workflow
- downstream skills must consume this output and must not recompute aging independently
