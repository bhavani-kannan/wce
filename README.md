# WORKING CAPITAL INTELLIGENCE AGENT

## overview

This project implements a working capital intelligence system using an agent + skill-based architecture.

The system analyzes:
- receivables
- payables
- inventory

and synthesizes them into:
- working capital position
- cash conversion cycle
- cash blockage view
- concentration risk
- efficiency indicators

This is not a reporting system.

This is a deterministic computation engine designed for:
- CFO-level analysis
- agent orchestration
- structured data pipelines

---

## system architecture

The system is structured into three layers:

### 1. agent layer
- `agents.md`
- routes requests
- enforces execution order
- ensures dependencies are met

### 2. skill layer
- domain-specific computation
- deterministic logic
- no ambiguity

domains:
- financial-context
- receivables
- payables
- inventory
- working-capital

### 3. data + presentation layer
- schemas define input/output contracts
- sample CSVs enable testing
- example outputs show CFO-readable interpretation

---

## execution flow

### full working capital flow

1. financial context
   - extracts revenue and cogs

2. receivables
   - overdue identification
   - cash impact classification
   - aggregation

3. payables
   - overdue identification
   - payment behavior classification
   - aggregation

4. inventory
   - movement classification
   - aggregation

5. working capital
   - computes:
     - DSO
     - DPO
     - DIO
     - CCC
   - synthesizes enterprise view

---

## input requirements

All inputs must conform to schemas under `/schemas`.

### required datasets

- `financial-context-gold`
- `receivables-ledger-gold`
- `payables-ledger-gold`
- `inventory-position-gold`

### sample data

Available under `/data`:

- receivables_sample.csv
- payables_sample.csv
- inventory_sample.csv
- financial_context_sample.csv

These can be used for:
- testing
- validation
- development setup

---

## key design principles

### 1. deterministic computation
- no probabilistic outputs
- no free-text dependencies
- all logic is rule-based

### 2. strict separation of concerns

| layer | responsibility |
|------|---------------|
| skill | compute |
| agent | orchestrate |
| example outputs | present |

---

### 3. financial anchoring

- receivables depend on revenue
- payables depend on cogs
- inventory depends on cogs
- working capital depends on all domains

---

### 4. no metric leakage

- DSO, DPO, DIO, CCC only computed in working-capital skill
- domain skills do not compute enterprise metrics
- agent does not compute anything

---

## outputs

### structured outputs
- machine-readable
- used for chaining between skills

### example outputs
- CFO-readable
- located under `/assets/example-outputs`
- for presentation layer only

---

## how to use

### step 1
load input datasets (CSV or JSON) matching schemas

### step 2
select request type:

- financial_context_review
- receivables_review
- payables_review
- inventory_review
- full_working_capital_review

### step 3
invoke agent (`agents.md`)

### step 4
agent routes execution through required skills

### step 5
consume output

---

## example use case

input:
- receivables ledger
- payables ledger
- inventory position
- financial context

request:
- full_working_capital_review

output:
- working capital summary
- cash conversion cycle
- risk indicators
- efficiency metrics

---

## limitations (v1)

- assumes single currency
- assumes clean gold-layer input
- no FX handling
- no time-series analysis
- no forecasting

---

## future enhancements

- multi-period trend analysis
- currency normalization
- scenario simulation
- action recommendation layer
- integration with SAP APIs

---

## intended users

- CFO and finance leadership
- finance transformation teams
- data engineering teams
- AI agent developers

---

## summary

This system provides a structured, scalable, and deterministic way to analyze working capital.

It is designed to move from:
- reporting
to
- decision-grade financial intelligence
