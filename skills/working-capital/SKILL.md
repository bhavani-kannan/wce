---
name: working-capital
description: Synthesize receivables, payables, and inventory outputs into enterprise working capital view
version: 1.0
type: executable-skill
domain: working-capital
input:
  - receivables-output
  - payables-output
  - inventory-output
  - financial-context-output
output: working-capital-output
status: locked
---

# WORKING CAPITAL SKILL

## purpose
Synthesize domain-level outputs into enterprise working capital intelligence.

This skill produces:
- working capital exposure
- cash conversion components
- cross-domain risk view
- cash release opportunity view

This skill is the only place where:
- DSO
- DPO
- DIO
- CCC

are computed.

## inputs

required_datasets:
- receivables-output
- payables-output
- inventory-output
- financial-context-output

## execution_steps

- step: validate_inputs
  action:
    - verify receivables-output exists
    - verify payables-output exists
    - verify inventory-output exists
    - verify financial-context-output exists
    - verify revenue and cogs present and greater than zero
  on_failure:
    - action: terminate
      error_code: INVALID_WORKING_CAPITAL_INPUT

- step: extract_financial_anchors
  action:
    - revenue = financial-context-output.financial_anchors.revenue
    - cogs = financial-context-output.financial_anchors.cogs

- step: extract_domain_values
  action:
    - receivables_total = receivables-output.summary.total_open_receivables
    - payables_total = payables-output.summary.total_open_payables
    - inventory_total = inventory-output.summary.total_inventory_value

- step: compute_dso
  action:
    - IF revenue > 0
        dso = (receivables_total / revenue) * 365
      ELSE
        dso = 0

- step: compute_dpo
  action:
    - IF cogs > 0
        dpo = (payables_total / cogs) * 365
      ELSE
        dpo = 0

- step: compute_dio
  action:
    - IF cogs > 0
        dio = (inventory_total / cogs) * 365
      ELSE
        dio = 0

- step: compute_cash_conversion_cycle
  action:
    - ccc = dso + dio - dpo

- step: compute_working_capital_exposure
  action:
    - working_capital_value = receivables_total + inventory_total - payables_total

- step: compute_cash_blockage_view
  action:
    - receivables_at_risk = receivables-output.cash_profile.at_risk + receivables-output.cash_profile.critical
    - inventory_non_moving = inventory-output.summary.non_moving_inventory_value
    - payables_critical_delay = payables-output.payment_profile.critical_delay

- step: compute_concentration_risk
  action:
    - receivables_concentration = receivables-output.customer_concentration.top_5_customer_percent_of_open_receivables
    - payables_concentration = payables-output.vendor_concentration.top_5_vendor_percent_of_open_payables
    - inventory_concentration = inventory-output.material_concentration.top_10_material_percent_of_inventory_value

- step: compute_efficiency_indicators
  action:
    - IF receivables_total > 0
        overdue_ratio = receivables-output.summary.total_overdue_receivables / receivables_total
      ELSE
        overdue_ratio = 0

    - IF payables_total > 0
        payable_delay_ratio = payables-output.summary.total_overdue_payables / payables_total
      ELSE
        payable_delay_ratio = 0

- step: compute_confidence
  action:
    - score = 1.0

    - IF revenue <= 0
        score = score - 0.4

    - IF cogs <= 0
        score = score - 0.4

    - IF receivables_total = 0 AND payables_total = 0 AND inventory_total = 0
        score = score - 0.2

    - IF score < 0
        score = 0

- step: assemble_output
  action:
    - working_capital.summary.working_capital_value = working_capital_value
    - working_capital.summary.receivables = receivables_total
    - working_capital.summary.inventory = inventory_total
    - working_capital.summary.payables = payables_total

    - working_capital.cash_conversion.dso = dso
    - working_capital.cash_conversion.dpo = dpo
    - working_capital.cash_conversion.dio = dio
    - working_capital.cash_conversion.ccc = ccc

    - working_capital.cash_blockage.receivables_at_risk = receivables_at_risk
    - working_capital.cash_blockage.inventory_non_moving = inventory_non_moving
    - working_capital.cash_blockage.payables_critical_delay = payables_critical_delay

    - working_capital.concentration.receivables = receivables_concentration
    - working_capital.concentration.payables = payables_concentration
    - working_capital.concentration.inventory = inventory_concentration

    - working_capital.efficiency.overdue_ratio = overdue_ratio
    - working_capital.efficiency.payable_delay_ratio = payable_delay_ratio

    - confidence.score = score

## output_contract

```json
{
  "working_capital": {
    "summary": {
      "working_capital_value": 0.0,
      "receivables": 0.0,
      "inventory": 0.0,
      "payables": 0.0
    },
    "cash_conversion": {
      "dso": 0.0,
      "dpo": 0.0,
      "dio": 0.0,
      "ccc": 0.0
    },
    "cash_blockage": {
      "receivables_at_risk": 0.0,
      "inventory_non_moving": 0.0,
      "payables_critical_delay": 0.0
    },
    "concentration": {
      "receivables": 0.0,
      "payables": 0.0,
      "inventory": 0.0
    },
    "efficiency": {
      "overdue_ratio": 0.0,
      "payable_delay_ratio": 0.0
    }
  },
  "confidence": {
    "score": 0.0
  }
}
```

## constraints
- rule: domain_outputs_only description: must consume only domain outputs, not raw datasets
- rule: only_skill_for_ccc description: dso, dpo, dio, and ccc must be computed only in this skill
- rule: no_line_item_logic description: do not perform any record-level classification
- rule: no_action_assignment description: do not assign operational actions

## dependencies
- required_inputs:
- receivables-output
- payables-output
- inventory-output
- financial-context-output

## provides_outputs:
- working-capital-output

## consumed_by:
- agents.md

## failure_modes
- code: MISSING_DOMAIN_OUTPUTS condition: any domain output missing action: terminate
- code: INVALID_FINANCIAL_ANCHORS condition: revenue or cogs invalid action: terminate
- code: EMPTY_SYSTEM condition: all domains zero action: return_empty_output

## notes
- this skill produces enterprise-level working capital intelligence
- this skill is the final computational layer
- interpretation and narrative can be handled by agent layer
