---
name: financial-context
description: Extract and validate revenue, cogs, and financial anchors required for working capital analysis
version: 1.0
type: executable-skill
domain: financial-context
input: financial-context-gold
output: financial-context-output
status: locked
---

# FINANCIAL CONTEXT SKILL

## purpose
Establish financial anchors required for working capital analysis.

This skill computes and validates:
- revenue
- cogs
- gross margin
- growth context

This skill is mandatory before:
- receivables analysis
- payables analysis
- inventory analysis
- working capital synthesis

## inputs

required_datasets:
- financial-context-gold

## execution_steps

- step: validate_input
  action:
    - verify financial-context-gold exists
    - verify dataset conforms to input contract
  on_failure:
    - action: terminate
      error_code: INVALID_FINANCIAL_CONTEXT_INPUT

- step: extract_core_fields
  action:
    - revenue = financial-context-gold.revenue
    - cogs = financial-context-gold.cogs
    - prior_revenue = financial-context-gold.prior_revenue
    - prior_cogs = financial-context-gold.prior_cogs
    - current_period_end_date = financial-context-gold.current_period_end_date
    - prior_period_end_date = financial-context-gold.prior_period_end_date

- step: validate_financial_anchors
  action:
    - IF revenue IS NULL OR revenue <= 0
        raise error INVALID_REVENUE
    - IF cogs IS NULL OR cogs <= 0
        raise error INVALID_COGS

- step: compute_gross_margin
  action:
    - gross_margin = revenue - cogs

- step: compute_gross_margin_percent
  action:
    - IF revenue > 0
        gross_margin_percent = gross_margin / revenue
      ELSE
        gross_margin_percent = 0

- step: compute_growth_metrics
  action:
    - IF prior_revenue > 0
        revenue_growth_percent = (revenue - prior_revenue) / prior_revenue
      ELSE
        revenue_growth_percent = 0

    - IF prior_cogs > 0
        cogs_growth_percent = (cogs - prior_cogs) / prior_cogs
      ELSE
        cogs_growth_percent = 0

- step: generate_validation_flags
  action:
    - initialize validation_flags as empty list

    - IF gross_margin < 0
        add NEGATIVE_MARGIN to validation_flags

    - IF gross_margin_percent < 0 OR gross_margin_percent > 1
        add INVALID_MARGIN_PERCENT to validation_flags

    - IF revenue_growth_percent < -0.5 OR revenue_growth_percent > 1.0
        add EXTREME_REVENUE_GROWTH to validation_flags

    - IF cogs_growth_percent < -0.5 OR cogs_growth_percent > 1.0
        add EXTREME_COGS_GROWTH to validation_flags

- step: compute_confidence
  action:
    - score = 1.0

    - IF revenue <= 0
        score = score - 0.5

    - IF cogs <= 0
        score = score - 0.5

    - IF prior_revenue IS NULL
        score = score - 0.2

    - IF prior_cogs IS NULL
        score = score - 0.2

    - IF score < 0
        score = 0

- step: assemble_output
  action:
    - financial_anchors.revenue = revenue
    - financial_anchors.cogs = cogs
    - financial_anchors.gross_margin = gross_margin
    - financial_anchors.gross_margin_percent = gross_margin_percent

    - growth_context.revenue_growth_percent = revenue_growth_percent
    - growth_context.cogs_growth_percent = cogs_growth_percent

    - period_context.current_period_end_date = current_period_end_date
    - period_context.prior_period_end_date = prior_period_end_date

    - validation_flags = validation_flags

    - confidence.score = score

## output_contract

```json
{
  "financial_anchors": {
    "revenue": 0.0,
    "cogs": 0.0,
    "gross_margin": 0.0,
    "gross_margin_percent": 0.0
  },
  "growth_context": {
    "revenue_growth_percent": 0.0,
    "cogs_growth_percent": 0.0
  },
  "period_context": {
    "current_period_end_date": "string",
    "prior_period_end_date": "string"
  },
  "validation_flags": [],
  "confidence": {
    "score": 0.0
  }
}

## constraints:
- rule: mandatory_for_all_domains description: must run before receivables, payables, inventory, and working-capital skills
- rule: no_external_inference description: revenue and cogs must come only from financial-context-gold
- rule: no_working_capital_logic description: do not compute DSO, DPO, DIO, or CCC

##dependencies
#required_inputs:
- financial-context-gold
#provides_outputs:
- financial-context-output

##consumed_by:
- skills/receivables/SKILL.md
- skills/payables/SKILL.md
- skills/inventory/SKILL.md
- skills/working-capital/SKILL.md
- agents.md

failure_modes
- code: MISSING_INPUT condition: financial-context-gold not provided action: terminate
- code: INVALID_REVENUE condition: revenue is null or <= 0 action: terminate
- code: INVALID_COGS condition: cogs is null or <= 0 action: terminate
- code: INVALID_STRUCTURE condition: dataset does not match contract action: terminate

notes
- this skill defines financial anchors for the entire system
- all downstream skills depend on this output
- this skill must always execute first in any workflow
