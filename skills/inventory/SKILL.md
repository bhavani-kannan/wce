---
name: inventory
description: Orchestrate inventory analysis using inventory-position-gold and financial-context outputs
version: 1.0
type: executable-skill
domain: inventory
input:
  - inventory-position-gold
  - financial-context-output
output: inventory-output
status: locked
---

# INVENTORY SKILL

## purpose
Coordinate inventory analysis for working capital interpretation.

This skill orchestrates inventory sub-skills and returns a domain-level inventory output.

This skill must not perform material-level classification logic directly.

## inputs

required_datasets:
- inventory-position-gold
- financial-context-output

## execution_steps

- step: validate_inputs
  action:
    - verify inventory-position-gold exists
    - verify financial-context-output exists
    - verify inventory-position-gold conforms to input contract
    - verify financial-context-output contains cogs
  on_failure:
    - action: terminate
      error_code: INVALID_INVENTORY_INPUT

- step: execute_inventory_aging_classification
  action:
    - invoke skills/inventory/inventory_aging_classification.skill.md
    - pass inventory-position-gold
    - pass financial-context-output
  output:
    - inventory_aging_classification_output

- step: execute_inventory_cash_aggregation
  action:
    - invoke skills/inventory/inventory_cash_aggregation.skill.md
    - pass inventory_aging_classification_output
    - pass financial-context-output
  output:
    - inventory_cash_aggregation_output

- step: assemble_domain_output
  action:
    - inventory_output.summary = inventory_cash_aggregation_output.summary
    - inventory_output.movement_profile = inventory_cash_aggregation_output.movement_profile
    - inventory_output.issue_summary = inventory_cash_aggregation_output.issue_summary
    - inventory_output.material_concentration = inventory_cash_aggregation_output.material_concentration
    - inventory_output.confidence = inventory_cash_aggregation_output.confidence

## orchestration_rules

- rule: strict_sequence
  description: sub-skills must execute in defined order
  order:
    - inventory_aging_classification.skill.md
    - inventory_cash_aggregation.skill.md

- rule: no_step_skipping
  description: aggregation must not run before inventory aging classification

- rule: financial_context_required
  description: inventory interpretation must not proceed without cogs anchor

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
- rule: no_material_level_logic description: do not compute movement classification or issue classification in this skill
- rule: no_dio_computation description: do not compute DIO
- rule: no_inventory_action_assignment description: do not assign liquidation, procurement, or planning actions
- rule: no_cogs_inference description: cogs must only come from financial-context-output

## dependencies
- required_inputs:
- inventory-position-gold
- financial-context-output

## required_subskills:
- skills/inventory/inventory_aging_classification.skill.md
- skills/inventory/inventory_cash_aggregation.skill.md
- provides_outputs: inventory-output
- consumed_by: skills/working-capital/SKILL.md

## failure_modes
- code: MISSING_INVENTORY_DATASET condition: inventory-position-gold not provided action: terminate
- code: MISSING_FINANCIAL_CONTEXT condition: financial-context-output not provided action: terminate
- code: MISSING_COGS_ANCHOR condition: cogs missing or invalid action: terminate
- code: SUBSKILL_FAILURE condition: any sub-skill fails action: terminate

## notes
- this skill is the domain controller for inventory
- this skill produces inventory domain output only
- enterprise working capital interpretation is handled separately
