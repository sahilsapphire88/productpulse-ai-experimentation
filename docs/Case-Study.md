# Case Study — AI-Generated Personalized Recommendations

> **SYNTHETIC / DEMO DATA** — All figures in this case study are synthetic / demo data. No real customers, real experiments, or real results are represented.

## Scenario

**Feature:** AI-generated personalized recommendations  
**Target users:** Users with fewer than 3 sessions/week  
**Baseline conversion:** 12%  
**Expected conversion:** 15%  
**Additional AI cost:** $0.03/user  
**Experiment duration:** 14 days  
**Sample size:** 10,000 per variant

## Hypothesis (AI-Generated)

We believe that AI-generated personalized recommendations for users with fewer than 3 sessions/week will increase conversion from 12% to 15% because users will find personalized recommendations more relevant and act on them faster.

## Results (from Synthetic Dataset)

| Metric | Control | Treatment | Change |
|--------|---------|-----------|--------|
| Conversion rate | 12.0% | 14.8% | +2.8 pp (+23.3% rel) |
| p-value | — | — | 0.031 |
| Significant | — | — | Yes |

## Cost Analysis

| Item | Value |
|------|-------|
| Incremental revenue | +$12,000/month (illustrative) |
| Incremental AI cost | +$3,500/month (illustrative) |
| Net incremental value | +$8,500/month |
| ROI | ~243% |

## Decision

**ITERATE**

Treatment increased conversion by 23.3% with statistical significance, but the AI inference cost increased by 19%. The recommendation is to test a lower-cost inference model before shipping to 100%.

## What-If Scenario

**What if AI inference cost increases by 30%?**

- New incremental AI cost: +$4,550/month
- New net value: +$7,450/month
- New ROI: ~164%
- Decision: Still ITERATE — test cheaper model before shipping.

## Lessons

1. Statistical significance ≠ business value. Always check cost.
2. AI features need cost analysis alongside lift.
3. Guardrail monitoring (latency, error rate) is essential before scaling.
4. All demo data is clearly labelled to avoid misrepresentation.
