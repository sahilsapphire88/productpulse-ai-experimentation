# Experimentation Framework — ExperimentLab

## Before Experiment

1. **Problem** — What user problem are we solving?
2. **Hypothesis** — "We believe that [feature] for [target users] will increase [metric] from [baseline] to [target] because [reason]." (AI-generated, clearly labelled)
3. **Metrics** — Primary, secondary, and guardrail metrics defined upfront.
4. **Target users** — Who is in the experiment?
5. **Success criteria** — What lift, significance, and economics are required to ship?

## During Experiment

Monitor:
- Primary metric (conversion, activation, retention, revenue, engagement)
- Secondary metrics (CTR, session duration, feature adoption, error rate, cost/user)
- Guardrails (churn, complaints, latency, infrastructure cost)

Do not peek and stop early without adjusting for multiple comparisons.

## After Experiment

Analyze:
- **Lift** — absolute and relative (computed from data)
- **Evidence** — p-value, confidence interval, sample size
- **Business impact** — incremental revenue, incremental AI cost, net value, ROI
- **Cost** — cost per conversion, cost per activated user

## Decision

**Ship / Iterate / Kill**

- **SHIP:** Significant meaningful lift + positive economics + no guardrail failures.
- **ITERATE:** Promising signal but evidence or economics insufficient.
- **KILL:** No significant improvement or negative economics or guardrail failure.

All decisions include transparent reasoning.
