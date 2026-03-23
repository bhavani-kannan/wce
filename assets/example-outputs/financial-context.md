# FINANCIAL CONTEXT OUTPUT EXAMPLE

## purpose
Show how financial-context output should be presented in business-readable form without changing the underlying structured contract.

## source_skill
skills/financial-context/SKILL.md

## example_output

Current period financial anchors show revenue of INR 125.0 crore and COGS of INR 82.5 crore.

Gross margin is INR 42.5 crore, which implies a gross margin percent of 34.0%.

Compared with the prior period, revenue growth is 8.7% and COGS growth is 6.1%.

Financial context assessment:
- Revenue base is valid for receivables interpretation
- COGS base is valid for payables and inventory interpretation
- Margin structure appears commercially reasonable
- No blocking financial-context issues identified

Confidence score: 0.90

## example_structured_reference

```json
{
  "financial_anchors": {
    "revenue": 1250000000.0,
    "cogs": 825000000.0,
    "gross_margin": 425000000.0,
    "gross_margin_percent": 0.34
  },
  "growth_context": {
    "revenue_growth_percent": 0.087,
    "cogs_growth_percent": 0.061
  },
  "period_context": {
    "current_period_end_date": "2026-03-31",
    "prior_period_end_date": "2025-12-31"
  },
  "validation_flags": [],
  "confidence": {
    "score": 0.9
  }
}
```

## presentation_rules
- present revenue and cogs first
- present gross margin next
- present growth context after anchors
- present validation issues only if flags exist
- present confidence score last
- do not add working capital interpretation here
- do not add DSO, DPO, DIO, or CCC here
- do not infer business problems beyond the financial-context output

## prohibited_output_patterns
- do not introduce metrics not present in the structured output
- do not describe collections, vendor terms, or inventory quality here
- do not narrate cash blockage from this output alone
- do not convert this into a full CFO working capital summary

## notes
- This file is a presentation example only.
- It does not replace the JSON schema. It shows how the structured output can be translated into business-readable language.
