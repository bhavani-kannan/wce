---
name: inventory_cash_aggregation
description: Aggregate inventory cash blockage data into portfolio-level working capital view
version: 1.0
type: executable-skill
domain: inventory
input:
  - inventory-aging-classification-output
  - financial-context-output
output: inventory-cash-aggregation-output
status: locked
---

# INVENTORY CASH AGGREGATION SKILL

## purpose
Aggregate inventory record-level data into portfolio-level metrics for working capital interpretation.

This skill produces:
- total inventory exposure
- movement state distribution
- issue type distribution
- material concentration
- inventory value relative to cogs

This skill must not:
- recompute classification logic
- assign inventory actions
- compute DIO

## inputs

required_datasets:
- inventory-aging-classification-output
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

- step: compute_total_inventory_value
  action:
    - total_inventory_value = sum(inventory_value_local across all records)

- step: compute_movement_profile
  action:
    - active_inventory_value = sum(inventory_value_local where movement_state = ACTIVE)
    - slow_inventory_value = sum(inventory_value_local where movement_state = SLOW)
    - non_moving_inventory_value = sum(inventory_value_local where movement_state = NON_MOVING)

- step: compute_inventory_to_cogs_ratio
  action:
    - inventory_percent_of_cogs = total_inventory_value / cogs

- step: compute_issue_summary
  action:
    - healthy = sum(inventory_value_local where issue_type = HEALTHY)
    - slow_moving = sum(inventory_value_local where issue_type = SLOW_MOVING)
    - non_moving = sum(inventory_value_local where issue_type = NON_MOVING)
    - concentration_risk = sum(inventory_value_local where issue_type = CONCENTRATION_RISK)
    - unclassified = sum(inventory_value_local where issue_type = UNCLASSIFIED)

- step: compute_material_concentration
  action:
    - group by material_id
    - compute total inventory value per material
    - sort descending by total inventory value
    - select top 10 materials
    - top_10_material_inventory_value = sum(inventory_value_local for top 10 materials)
    - IF total_inventory_value > 0
        top_10_material_percent_of_inventory_value = top_10_material_inventory_value / total_inventory_value
      ELSE
        top_10_material_percent_of_inventory_value = 0

- step: compute_confidence
  action:
    - score = 1.0
    - IF total_inventory_value = 0
        score = score - 0.3
    - IF cogs <= 0
        score = score - 0.5
    - IF number of records < 5
        score = score - 0.2
    - IF score < 0
        score = 0

- step: assemble_output
  action:
    - summary.total_inventory_value = total_inventory_value
    - summary.active_inventory_value = active_inventory_value
    - summary.slow_inventory_value = slow_inventory_value
    - summary.non_moving_inventory_value = non_moving_inventory_value
    - summary.inventory_percent_of_cogs = inventory_percent_of_cogs
    - movement_profile.active = active_inventory_value
    - movement_profile.slow = slow_inventory_value
    - movement_profile.non_moving = non_moving_inventory_value
    - issue_summary.healthy = healthy
    - issue_summary.slow_moving = slow_moving
    - issue_summary.non_moving = non_moving
    - issue_summary.concentration_risk = concentration_risk
    - issue_summary.unclassified = unclassified
    - material_concentration.top_10_material_inventory_value = top_10_material_inventory_value
    - material_concentration.top_10_material_percent_of_inventory_value = top_10_material_percent_of_inventory_value
    - confidence.score = score

## output_contract

```json
{
  "summary": {
    "total_inventory_value": 0.0,
    "active_inventory_value": 0.0,
    "slow_inventory_value": 0.0,
    "non_moving_inventory_value": 0.0,
    "inventory_percent_of_cogs": 0.0
  },
  "movement_profile": {
    "active": 0.0,
    "slow": 0.0,
    "non_moving": 0.0
  },
  "issue_summary": {
    "healthy": 0.0,
    "slow_moving": 0.0,
    "non_moving": 0.0,
    "concentration_risk": 0.0,
    "unclassified": 0.0
  },
  "material_concentration": {
    "top_10_material_inventory_value": 0.0,
    "top_10_material_percent_of_inventory_value": 0.0
  },
  "confidence": {
    "score": 0.0
  }
}
```

## constraints
- rule: no_reclassification description: must not recompute movement_state, issue_type, or working_capital_impact
- rule: no_dio_computation description: do not compute DIO
- rule: no_action_assignment description: do not assign liquidation, replenishment, or planning actions
- rule: financial_context_mandatory description: cogs must come from financial-context-output

## dependencies
### required_inputs:
- inventory-aging-classification-output
- financial-context-output
### provides_outputs:
- inventory-cash-aggregation-output
### consumed_by:
- skills/inventory/SKILL.md
- skills/working-capital/SKILL.md

## failure_modes
- code: MISSING_CLASSIFICATION_DATA condition: classification dataset missing action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial context missing action: terminate
- code: INVALID_COGS condition: cogs invalid or zero action: terminate
- code: EMPTY_DATASET condition: no records available action: return_empty_output

## notes
- this skill converts inventory record-level intelligence into portfolio summary
- this skill is the final step within inventory domain
- enterprise working capital synthesis is handled separately
