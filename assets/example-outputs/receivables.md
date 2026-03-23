# RECEIVABLES OUTPUT EXAMPLE

## purpose
Show how receivables output should be presented in CFO-readable form without altering the structured contract.

## source_skill
skills/receivables/SKILL.md

## example_output

Total open receivables stand at INR 40.0 crore, of which INR 18.0 crore is overdue. This implies that 45.0% of receivables are overdue.

Receivables represent 32.0% of revenue, indicating elevated working capital lock-up relative to business scale.

Cash recovery profile:
- Not due: INR 22.0 crore
- Immediate recoverable: INR 10.0 crore
- At risk: INR 5.0 crore
- Critical: INR 3.0 crore

A total of INR 8.0 crore falls into at-risk and critical categories, representing delayed or uncertain cash inflow.

Issue composition:
- Disputes: INR 6.0 crore
- Credit-related issues: INR 4.0 crore
- Collection delays: INR 5.0 crore
- Concentration risk: INR 3.0 crore
- Adjustments or credits: INR 1.0 crore
- Unclassified: INR 1.0 crore

Customer concentration risk is material. Top 5 customers account for 48.0% of total receivables.

Receivables assessment:
- High overdue proportion indicates pressure on collections efficiency
- Presence of disputes suggests resolution bottlenecks
- Concentration risk indicates dependency on a limited customer base
- At-risk and critical buckets highlight potential cash flow volatility

Confidence score: 0.88

## example_structured_reference

```json
{
  "summary": {
    "total_open_receivables": 400000000.0,
    "total_overdue_receivables": 180000000.0,
    "overdue_percent_of_open_receivables": 0.45,
    "receivables_percent_of_revenue": 0.32
  },
  "cash_profile": {
    "not_due": 220000000.0,
    "immediate_recoverable": 100000000.0,
    "at_risk": 50000000.0,
    "critical": 30000000.0
  },
  "issue_summary": {
    "adjustment_or_credit": 10000000.0,
    "dispute": 60000000.0,
    "credit_issue": 40000000.0,
    "concentration_risk": 30000000.0,
    "collection_delay": 50000000.0,
    "unclassified": 10000000.0
  },
  "customer_concentration": {
    "top_5_customer_open_receivables": 192000000.0,
    "top_5_customer_percent_of_open_receivables": 0.48
  },
  "confidence": {
    "score": 0.88
  }
}
```

## presentation_rules
- start with total receivables and overdue position
- always anchor receivables to revenue
- present cash profile before issue breakdown
- highlight at-risk and critical exposure explicitly
- present concentration after issue summary
- provide interpretation in terms of cash flow impact
- keep statements tied to structured values only
- present confidence score at the end

## prohibited_output_patterns
- do not compute or mention DSO here
- do not assign collection actions
- do not introduce metrics not present in schema
- do not mix payables or inventory commentary
- do not provide operational instructions

## notes
- This file is a presentation example only.
- It translates structured receivables output into CFO-readable insights without changing underlying data.
