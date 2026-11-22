import type { GeneratedHypothesis } from '../types';

export function generateHypothesis(experiment: {
  name: string;
  targetUsers: string;
  featureDescription: string;
  expectedBehavior: string;
  metrics?: Array<{ kind: string; name: string; baselineValue: number; targetValue?: number }>;
  additionalCostPerUser: number;
}): GeneratedHypothesis {
  const {
    name,
    targetUsers,
    featureDescription,
    expectedBehavior,
    metrics = [],
    additionalCostPerUser,
  } = experiment;

  const primary = metrics.find((m) => m.kind === 'PRIMARY');
  const baseline = primary?.baselineValue ?? 0.12;
  const target = primary?.targetValue ?? baseline * 1.15;
  const metricName = primary?.name ?? 'primary metric';

  return {
    label: 'AI-GENERATED HYPOTHESIS',
    primary: `We believe that ${name} for ${targetUsers} will increase ${metricName} from ${(baseline * 100).toFixed(0)}% to ${(target * 100).toFixed(0)}% because users will find personalized recommendations more relevant and act on them faster.`,
    secondary: [
      'Feature adoption will increase among low-engagement users.',
      'Session duration will rise as users browse more recommendations.',
      'Retention at 7 days will improve modestly.',
    ],
    assumptions: [
      'Recommendation quality is sufficient to influence behavior.',
      'Target users see the recommendations within their first session.',
      'AI inference latency will not degrade the experience.',
    ],
    risks: [
      'Inference cost per user may exceed incremental revenue.',
      'Recommendation fatigue could reduce engagement over time.',
      'Segment may be too small to detect statistically significant lift.',
    ],
    expectedBehavior:
      'Users with fewer than 3 sessions/week click a recommended item and convert at a higher rate than control.',
    failureModes: [
      'Low click-through on recommendations → no lift.',
      'High inference cost → negative ROI despite lift.',
      'Guardrail breach: latency > threshold increases bounce.',
    ],
  };
}
