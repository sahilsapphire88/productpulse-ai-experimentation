import type {
  CostBreakdown,
  DecisionRecord,
  ExperimentResult,
} from '../types';

export interface AssistantQA {
  question: string;
  answer: (ctx: AssistantContext) => string;
}

export interface AssistantContext {
  result: ExperimentResult | null;
  cost: CostBreakdown | null;
  decision: DecisionRecord | null;
  experiment: {
    name: string;
    metrics: Array<{ kind: string; name: string; unit: string; baselineValue: number; targetValue?: number }>;
    additionalCostPerUser: number;
    revenuePerConversion: number;
  } | null;
}

export const ASSISTANT_QUESTIONS: AssistantQA[] = [
  {
    question: "Why shouldn't we ship this feature?",
    answer: (ctx) => {
      const { decision, cost, result } = ctx;
      const reasons: string[] = [];
      if (!decision) return 'No decision has been generated for this experiment yet.';
      if (decision.decision === 'KILL') {
        reasons.push('The decision engine recommends KILL based on current evidence.');
      }
      if (result && !result.significance.isSignificant) {
        reasons.push('Result is not statistically significant (p ≥ 0.05).');
      }
      if (cost && cost.roi !== null && cost.roi <= 1) {
        reasons.push(`ROI is ${(cost.roi * 100).toFixed(0)}% — incremental AI cost exceeds incremental revenue.`);
      }
      if (result && result.lift.relative < 0.05) {
        reasons.push(`Relative lift is only ${(result.lift.relative * 100).toFixed(1)}%, below the 5% meaningful threshold.`);
      }
      return reasons.length > 0 ? reasons.join(' ') : 'Based on current evidence, shipping is not yet justified.';
    },
  },
  {
    question: 'What is the biggest risk in this experiment?',
    answer: (ctx) => {
      const { cost, result } = ctx;
      if (cost && cost.roi !== null && cost.roi <= 1) {
        return 'Economic risk: AI inference cost per user exceeds incremental revenue, making the feature net-negative even if it lifts conversion.';
      }
      if (result && !result.significance.isSignificant) {
        return 'Evidence risk: the observed lift could be noise; the experiment lacks statistical power.';
      }
      return 'Implementation risk: inference cost and latency at scale have not been validated.';
    },
  },
  {
    question: 'Which metric should be the primary metric?',
    answer: (ctx) => {
      const { experiment } = ctx;
      if (!experiment) return 'No experiment configured.';
      const primary = experiment.metrics.find(
        (m: { kind: string; name: string; unit: string; baselineValue: number; targetValue?: number }) =>
          m.kind === 'PRIMARY'
      );
      return primary
        ? `Primary metric: ${primary.name} (${primary.unit}). It directly reflects the behavior this feature is designed to change.`
        : 'No primary metric defined; select one before running the analysis.';
    },
  },
  {
    question: 'What should we test next?',
    answer: (ctx) => {
      const { decision } = ctx;
      if (!decision) return 'Generate a decision first, then I can suggest next steps.';
      if (decision.decision === 'ITERATE') {
        return 'Test a lower-cost inference model or narrow targeting to high-propensity users, then re-run.';
      }
      if (decision.decision === 'KILL') {
        return 'Revisit the hypothesis and segment; consider a pre/post test on a small cohort.';
      }
      return 'Ship to 100% and instrument post-ship guardrail monitoring.';
    },
  },
  {
    question: 'What happens if inference cost increases 25%?',
    answer: (ctx) => {
      const { cost } = ctx;
      if (!cost) return 'No cost data available for this experiment.';
      const newCost = cost.incrementalAiCost * 1.25;
      const newNet = cost.incrementalRevenue - newCost;
      const newRoi = newCost > 0 ? newNet / newCost : null;
      const roiStr = newRoi !== null ? (newRoi * 100).toFixed(0) : 'N/A';
      return `At +25% inference cost, incremental AI cost rises to $${newCost.toFixed(0)}, net value to $${newNet.toFixed(0)}, ROI to ${roiStr}%. ${newRoi !== null && newRoi <= 1 ? 'The recommendation would likely shift from SHIP to ITERATE or KILL.' : 'The feature remains economically viable.'}`;
    },
  },
  {
    question: 'Why is the treatment better but still not worth shipping?',
    answer: (ctx) => {
      const { decision, cost, result } = ctx;
      const parts: string[] = [];
      if (result && !result.significance.isSignificant) {
        parts.push('The improvement is not statistically significant (could be random variation).');
      }
      if (cost && cost.roi !== null && cost.roi <= 1) {
        parts.push(
          `The economics are negative: incremental AI cost ($${cost.incrementalAiCost.toFixed(0)}) exceeds incremental revenue ($${cost.incrementalRevenue.toFixed(0)}).`
        );
      }
      return (
        parts.join(' ') ||
        'Treatment is better but does not clear the evidence or economic bar for shipping.'
      );
    },
  },
];

export function answerQuestion(question: string, ctx: AssistantContext): string {
  const q = ASSISTANT_QUESTIONS.find((item) => item.question === question);
  return q ? q.answer(ctx) : 'I can answer questions about this experiment\'s evidence, economics, and risks.';
}
