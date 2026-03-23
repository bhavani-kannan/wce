# INVENTORY OUTPUT EXAMPLE

## purpose
Show how inventory output should be presented in CFO-readable form without altering the structured contract.

## source_skill
skills/inventory/SKILL.md

## example_output

Total inventory value stands at INR 36.0 crore.

Inventory composition:
- Active inventory: INR 20.0 crore
- Slow-moving inventory: INR 9.0 crore
- Non-moving inventory: INR 7.0 crore

Inventory represents 43.6% of COGS, indicating a significant level of capital tied up in stock.

Movement profile indicates that INR 16.0 crore is either slow-moving or non-moving, representing potential inefficiency in inventory utilization.

Issue composition:
- Healthy inventory: INR 20.0 crore
- Slow-moving inventory: INR 9.0 crore
- Non-moving inventory: INR 7.0 crore
- Concentration risk: INR 4.0 crore
- Unclassified: INR 2.0 crore

Material concentration risk is elevated. Top 10 materials account for 58.0% of total inventory value.

Inventory assessment:
- High proportion of slow and non-moving inventory indicates capital blockage
- Concentration in limited materials increases obsolescence risk
- Inventory levels relative to COGS suggest potential overstocking
- Non-moving inventory represents immediate working capital drag

Confidence score: 0.89

## example_structured_reference

```json
{
  "summary": {
    "total_inventory_value": 360000000.0,
    "active_inventory_value": 200000000.0,
    "slow_inventory_value": 90000000.0,
    "non_moving_inventory_value": 70000000.0,
    "inventory_percent_of_cogs": 0.436
  },
  "movement_profile": {
    "active": 200000000.0,
    "slow": 90000000.0,
    "non_moving": 70000000.0
  },
  "issue_summary": {
    "healthy": 200000000.0,
    "slow_moving": 90000000.0,
    "non_moving": 70000000.0,
    "concentration_risk": 40000000.0,
    "unclassified": 20000000.0
  },
  "material_concentration": {
    "top_10_material_inventory_value": 208800000.0,
    "top_10_material_percent_of_inventory_value": 0.58
  },
  "confidence": {
    "score": 0.89
  }
}
```

## presentation_rules:
- start with total inventory value
- present movement profile immediately after
- anchor inventory to COGS
- highlight slow-moving and non-moving inventory explicitly
- present issue composition after movement profile
- highlight concentration risk clearly
- interpret in terms of capital blockage and operational efficiency
- keep statements tied to structured values only
- present confidence score at the end

## prohibited_output_patterns
- do not compute or mention DIO here
- do not assign liquidation or procurement actions
- do not introduce metrics not present in schema
- do not mix receivables or payables commentary
- do not provide operational instructions

## notes
- This file is a presentation example only.
- It translates structured inventory output into CFO-readable insights without changing underlying data.
