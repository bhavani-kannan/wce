# WORKING CAPITAL OUTPUT EXAMPLE

## purpose
Show how enterprise working capital output should be presented in CFO-readable form without altering the structured contract.

## source_skill
skills/working-capital/SKILL.md

## example_output

Working capital stands at INR 48.0 crore, comprising:
- Receivables: INR 40.0 crore
- Inventory: INR 36.0 crore
- Payables: INR 28.0 crore

Cash conversion metrics:
- DSO: 117 days
- DIO: 159 days
- DPO: 124 days
- Cash Conversion Cycle (CCC): 152 days

The business is operating with a long cash conversion cycle, indicating significant capital tied up across receivables and inventory.

Cash blockage view:
- Receivables at risk and critical: INR 8.0 crore
- Non-moving inventory: INR 7.0 crore
- Critically delayed payables: INR 2.0 crore

A total of INR 15.0 crore is currently under stress across the working capital cycle.

Concentration risk:
- Receivables concentration (top customers): 48.0%
- Payables concentration (top vendors): 52.0%
- Inventory concentration (top materials): 58.0%

Efficiency indicators:
- Receivables overdue ratio: 45.0%
- Payables delay ratio: 32.1%

Working capital assessment:
- Elevated DSO and DIO are primary drivers of working capital lock-up
- Inventory inefficiency and slow movement are contributing significantly to capital blockage
- Receivables risk exposure indicates potential cash flow volatility
- Payables delays provide short-term liquidity support but may impact supplier relationships if sustained
- Concentration across customers, vendors, and materials introduces structural risk

Confidence score: 0.89

## example_structured_reference

```json
{
  "working_capital": {
    "summary": {
      "working_capital_value": 480000000.0,
      "receivables": 400000000.0,
      "inventory": 360000000.0,
      "payables": 280000000.0
    },
    "cash_conversion": {
      "dso": 117.0,
      "dpo": 124.0,
      "dio": 159.0,
      "ccc": 152.0
    },
    "cash_blockage": {
      "receivables_at_risk": 80000000.0,
      "inventory_non_moving": 70000000.0,
      "payables_critical_delay": 20000000.0
    },
    "concentration": {
      "receivables": 0.48,
      "payables": 0.52,
      "inventory": 0.58
    },
    "efficiency": {
      "overdue_ratio": 0.45,
      "payable_delay_ratio": 0.321
    }
  },
  "confidence": {
    "score": 0.89
  }
}
```

## presentation_rules
- start with working capital composition
- present DSO, DIO, DPO, and CCC immediately after
- interpret CCC in terms of cash lock-up
- present cash blockage view before risks
- aggregate stress exposure clearly
- present concentration risk across all domains
- include efficiency indicators
- provide a structured CFO assessment
- keep statements tied to structured values only
- present confidence score at the end

## prohibited_output_patterns
- do not introduce metrics not present in schema
- do not assign operational actions
- do not mix with raw dataset commentary
- do not override domain-level outputs
- do not speculate beyond available data

## notes
- This file is a presentation example only.
- It translates structured enterprise working capital output into CFO-readable insights without changing underlying data.
