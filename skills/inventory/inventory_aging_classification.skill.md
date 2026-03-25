---
name: inventory_aging_classification
description: Classify inventory records by movement state, impact relative to cogs, issue type, and working capital relevance
version: 1.0
type: executable-skill
domain: inventory
input:
  - inventory-position-gold
  - financial-context-output
output: inventory-aging-classification-output
status: locked
---

# INVENTORY AGING CLASSIFICATION SKILL

## purpose
Classify inventory records based on:
- movement state
- impact relative to cogs
- issue type
- working capital impact

This skill transforms inventory position data into inventory working capital intelligence.

## inputs

required_datasets:
- inventory-position-gold
- financial-context-output

## execution_steps

- step: validate_inputs
  action:
    - verify inventory-position-gold exists
    - verify financial-context-output exists
    - verify cogs present and greater than zero
  on_failure:
    - action: terminate
      error_code: INVALID_INPUT

- step: extract_cogs_anchor
  action:
    - cogs = financial-context-output.financial_anchors.cogs

- step: compute_days_since_last_movement
  action:
    - FOR each record
        days_since_last_movement = evaluation_date - last_movement_date

- step: compute_cogs_ratio
  action:
    - FOR each record
        cogs_ratio = inventory_value_local / cogs

- step: assign_movement_state
  action:
    - FOR each record
        IF days_since_last_movement <= 30
          movement_state = ACTIVE
        IF days_since_last_movement > 30 AND days_since_last_movement <= 90
          movement_state = SLOW
        IF days_since_last_movement > 90
          movement_state = NON_MOVING

- step: assign_impact_scale
  action:
    - FOR each record
        IF cogs_ratio >= 0.01
          impact_scale = LARGE
        IF cogs_ratio >= 0.001 AND cogs_ratio < 0.01
          impact_scale = MEDIUM
        IF cogs_ratio < 0.001
          impact_scale = SMALL

- step: compute_material_aggregates
  action:
    - group records by material_id
    - compute for each material:
        material_total_inventory_value = sum(inventory_value_local)
        material_location_count = count(records)
        material_max_days_since_last_movement = max(days_since_last_movement)

- step: assign_issue_type
  action:
    - FOR each record
        IF movement_state = ACTIVE
          issue_type = HEALTHY
        ELSE IF movement_state = SLOW
          issue_type = SLOW_MOVING
        ELSE IF movement_state = NON_MOVING
          issue_type = NON_MOVING
        ELSE IF material_total_inventory_value >= 0.05 * cogs AND material_max_days_since_last_movement > 90
          issue_type = CONCENTRATION_RISK
        ELSE
          issue_type = UNCLASSIFIED

- step: assign_working_capital_impact
  action:
    - FOR each record
        IF issue_type = CONCENTRATION_RISK
          working_capital_impact = HIGH
        ELSE IF issue_type = NON_MOVING AND impact_scale IN (MEDIUM, LARGE)
          working_capital_impact = HIGH
        ELSE IF issue_type = SLOW_MOVING AND impact_scale = LARGE
          working_capital_impact = MEDIUM
        ELSE IF issue_type = HEALTHY
          working_capital_impact = LOW
        ELSE
          working_capital_impact = MINIMAL

- step: compute_cash_blocked
  action:
    - FOR each record
        cash_blocked = inventory_value_local

- step: compute_confidence
  action:
    - FOR each record
        score = 1.0
        IF last_movement_date IS NULL
          score = score - 0.5
        IF inventory_value_local IS NULL OR inventory_value_local = 0
          score = score - 0.3
        IF cogs <= 0
          score = score - 0.5
        IF score < 0
          score = 0

- step: assemble_output
  action:
    - FOR each record
        output includes:
          material_id
          location_id
          material_description
          quantity_on_hand
          inventory_value_local
          days_since_last_movement
          movement_state
          impact_scale
          issue_type
          working_capital_impact
          cash_blocked
          cogs_ratio
          confidence_score

## classification_rules

### movement_state
- ACTIVE
- SLOW
- NON_MOVING

### impact_scale
- SMALL
- MEDIUM
- LARGE

### issue_type
- HEALTHY
- SLOW_MOVING
- NON_MOVING
- CONCENTRATION_RISK
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
      "material_id": "string",
      "location_id": "string",
      "material_description": "string",
      "quantity_on_hand": 0.0,
      "inventory_value_local": 0.0,
      "days_since_last_movement": 0,
      "movement_state": "string",
      "impact_scale": "string",
      "issue_type": "string",
      "working_capital_impact": "string",
      "cash_blocked": 0.0,
      "cogs_ratio": 0.0,
      "confidence_score": 0.0
    }
  ]
}
```

## constraints
- rule: no_aggregation_output description: this skill must not produce portfolio-level summaries
- rule: no_inventory_actions description: do not assign liquidation, replenishment, or planning actions
- rule: financial_context_mandatory description: cogs must be sourced only from financial-context-output
- rule: no_cogs_inference description: cogs must not be inferred from inventory data

## dependencies
- required_inputs:
- inventory-position-gold
- financial-context-output

## provides_outputs:
- inventory-aging-classification-output

## consumed_by:
- skills/inventory/inventory_cash_aggregation.skill.md
- skills/inventory/SKILL.md

## failure_modes
- code: MISSING_INVENTORY_INPUT condition: inventory dataset missing action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial context missing action: terminate
- code: INVALID_COGS condition: cogs is zero or invalid action: terminate
- code: EMPTY_DATASET condition: no records available action: return_empty_output

## notes
- this skill introduces inventory working capital intelligence at record level
- this skill must not be bypassed before aggregation
- all downstream aggregation must rely on this output
