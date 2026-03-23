# PAYABLES OUTPUT EXAMPLE

## purpose
Show how payables output should be presented in CFO-readable form without altering the structured contract.

## source_skill
skills/payables/SKILL.md

## example_output

Total open payables stand at INR 28.0 crore, of which INR 9.0 crore is overdue. This implies that 32.1% of payables are overdue.

Payables represent 34.0% of COGS, indicating moderate leverage of supplier credit in funding operations.

Payment profile:
- Not due: INR 14.0 crore
- Optimal payment window: INR 8.0 crore
- Delayed: INR 4.0 crore
- Critical delay: INR 2.0 crore

A total of INR 6.0 crore is in delayed and critical categories, indicating potential strain in vendor relationships if not managed carefully.

Issue composition:
- On-time payments: INR 14.0 crore
- Early-stage delays: INR 3.0 crore
- Structural delays: INR 4.0 crore
- Concentration risk: INR 2.0 crore
- Critical delays: INR 2.0 crore
- Adjustments or credits: INR 1.0 crore
- Unclassified: INR 2.0 crore

Vendor concentration risk is moderate. Top 5 vendors account for 52.0% of total payables.

Payables assessment:
- Payment behavior shows partial reliance on delayed payments
- Structural delays may indicate liquidity pressure or weak payment discipline
- Concentration risk suggests dependency on a limited vendor base
- Critical delays could impact supplier continuity if sustained

Confidence score: 0.87

## example_structured_reference

```json
{
  "summary": {
    "total_open_payables": 280000000.0,
    "total_overdue_payables": 90000000.0,
    "overdue_percent_of_open_payables": 0.321,
    "payables_percent_of_cogs": 0.34
  },
  "payment_profile": {
    "not_due": 140000000.0,
    "optimal_payment_window": 80000000.0,
    "delayed": 40000000.0,
    "critical_delay": 20000000.0
  },
  "issue_summary": {
    "adjustment_or_credit": 10000000.0,
    "on_time": 140000000.0,
    "early_stage_delay": 30000000.0,
    "structural_delay": 40000000.0,
    "concentration_risk": 20000000.0,
    "critical_delay": 20000000.0,
    "unclassified": 20000000.0
  },
  "vendor_concentration": {
    "top_5_vendor_open_payables": 145600000.0,
    "top_5_vendor_percent_of_open_payables": 0.52
  },
  "confidence": {
    "score": 0.87
  }
}
```

## presentation_rules
- start with total payables and overdue position
- anchor payables to COGS
- present payment profile before issue breakdown
- highlight delayed and critical payment exposure
- present vendor concentration after issue summary
- interpret in terms of liquidity and supplier risk
- keep statements tied to structured values only
- present confidence score at the end

## prohibited_output_patterns
- do not compute or mention DPO here
- do not assign payment actions or strategies
- do not introduce metrics not present in schema
- do not mix receivables or inventory commentary
- do not provide operational instructions

## notes
- This file is a presentation example only.
- It translates structured payables output into CFO-readable insights without changing underlying data.
