# Product Decision Log — ExperimentLab

## Purpose

Demonstrate real PM documentation: every experiment automatically records date, experiment, hypothesis, result, decision, evidence, and follow-up action.

## Template

| Field | Description |
|-------|-------------|
| Date | ISO timestamp of decision |
| Experiment | Experiment name / ID |
| Hypothesis | The AI-generated or PM-written hypothesis |
| Result | Observed lift, p-value, sample size |
| Decision | SHIP / ITERATE / KILL |
| Evidence | p-value, confidence interval, ROI, guardrail status |
| Follow-up action | Recommended next steps |

## Example Entry (Illustrative)

| Date | Experiment | Hypothesis | Result | Decision | Evidence | Follow-up |
|------|-----------|------------|--------|----------|----------|-----------|
| 2026-11-20 | AI recommendations | We believe AI recommendations for low-engagement users will increase conversion from 12% to 15% | Control 12.0% → Treatment 14.8%, +23.3% rel, p=0.031 | ITERATE | p<0.05 but ROI=0.8 (cost > revenue) | Test lower-cost model before shipping |

> All entries above are **illustrative**. No real experiment data is recorded.

## Decision Log in App

The ExperimentLab decision log is accessible at `/history` and supports manual entry plus automatic recording when the decision engine runs.
