import type {
  CostBreakdown,
  Decision,
  DecisionRecord,
  ExperimentResult,
  GuardrailChange,
} from '../types';

const RELATIVE_LIFT_THRESHOLD = 0.05;
const MIN_CONFIDENCE = 0.8;

export function makeDecision(
  result: ExperimentResult,
  cost: CostBreakdown,
  guardrails: GuardrailChange[]
): DecisionRecord {
  const reasoning: string[] = [];
  const nextSteps: string[] = [];
  let decision: Decision = 'KILL';
  let confidence = 0.5;

  const sig = result.significance;
  const lift = result.lift;
  const guardrailFail = guardrails.some((g) => g.status === 'FAIL');
  const guardrailWarn = guardrails.some((g) => g.status === 'WARN');
  const economicsOk = cost.roi !== null && cost.roi > 1;
  const meaningfulLift = lift.relative >= RELATIVE_LIFT_THRESHOLD;

  if (sig.isSignificant && lift.relative < -RELATIVE_LIFT_THRESHOLD) {
    decision = 'KILL';
    confidence = 0.9;
    reasoning.push(
      `Treatment significantly reduced the primary metric by ${Math.abs(lift.relative * 100).toFixed(1)}% (p=${sig.pValue.toFixed(3)}).`
    );
    reasoning.push('Guardrail or primary-metric harm observed; do not ship.');
    nextSteps.push('Root-cause the negative signal before any retest.');
    nextSteps.push('Consider holding out this feature entirely.');
  } else if (!sig.isSignificant && lift.relative < RELATIVE_LIFT_THRESHOLD && !economicsOk) {
    decision = 'KILL';
    confidence = 0.65;
    reasoning.push(
      'No statistically significant improvement and the economics are negative (ROI ≤ 0).'
    );
    reasoning.push(
      `Incremental AI cost $${cost.incrementalAiCost.toFixed(0)} vs incremental revenue $${cost.incrementalRevenue.toFixed(0)}.`
    );
    nextSteps.push('Do not ship; archive as a failed experiment.');
    nextSteps.push('Revisit hypothesis or target segment.');
  } else if (sig.isSignificant && meaningfulLift && economicsOk && !guardrailFail) {
    decision = 'SHIP';
    confidence = 0.85;
    reasoning.push(
      `Statistically significant improvement: +${lift.absolute.toFixed(1)} pp (${(lift.relative * 100).toFixed(1)}% relative), p=${sig.pValue.toFixed(3)}.`
    );
    reasoning.push(
      `Positive economics: net incremental value $${cost.netIncrementalValue.toFixed(0)}, ROI ${(cost.roi ?? 0) * 100}%.`
    );
    if (!guardrailWarn) {
      reasoning.push('No guardrail violations detected.');
    }
    nextSteps.push('Prepare ship plan and rollout schedule.');
    nextSteps.push('Monitor primary metric and guardrails post-ship for 28 days.');
    nextSteps.push('Document the decision in the decision log.');
  } else {
    decision = 'ITERATE';
    confidence = 0.6;

    if (sig.isSignificant && meaningfulLift && !economicsOk) {
      reasoning.push(
        'Directionally positive and significant lift, but AI/inference cost erodes the business case.'
      );
      reasoning.push(
        `Net value $${cost.netIncrementalValue.toFixed(0)} — test a cheaper model or lower inference cost.`
      );
      nextSteps.push('Re-run what-if with a lower-cost inference model.');
      nextSteps.push('Optimize inference cost before reconsidering ship.');
    } else if (!sig.isSignificant && lift.relative > 0) {
      reasoning.push(
        'Signal is promising (positive lift) but evidence is not yet sufficient (p ≥ 0.05).'
      );
      reasoning.push(
        'Run longer or increase sample size; current power may be too low.'
      );
      nextSteps.push('Extend experiment duration or raise traffic allocation to treatment.');
      nextSteps.push('Re-analyze after collecting more data.');
    } else if (guardrailWarn || guardrailFail) {
      reasoning.push(
        'Lift may be positive, but guardrail(s) are at risk (latency / error rate / cost).'
      );
      nextSteps.push('Investigate guardrail driver before scaling.');
      nextSteps.push('Scope a fix, then retest.');
    } else {
      reasoning.push(
        'Insufficient evidence and unclear economics to justify shipping.'
      );
      nextSteps.push('Refine hypothesis, targeting, or metric definition.');
      nextSteps.push('Design a follow-up experiment.');
    }
  }

  return {
    decision,
    confidence,
    reasoning,
    nextSteps,
    generatedAt: new Date().toISOString(),
    basedOnSyntheticData: true,
  };
}
