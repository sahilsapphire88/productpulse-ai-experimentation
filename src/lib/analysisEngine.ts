import type {
  ExperimentResult,
  MetricAggregate,
  GuardrailChange,
  ExperimentUser,
} from '../types';
import { twoProportionZTest, liftStats, toSignificance } from './math';

export function aggregateUsers(users: ExperimentUser[]): MetricAggregate {
  const n = users.length;
  if (n === 0) return emptyAggregate();

  const converted = users.filter((u) => u.converted).length;
  const revenue = users.reduce((s, u) => s + u.revenue, 0);
  const retained = users.filter((u) => u.retained).length;
  const adopted = users.filter((u) => u.featureAdopted).length;
  const errors = users.filter((u) => u.errored).length;
  const avgDur = users.reduce((s, u) => s + u.sessionDuration, 0) / n;
  const avgLat = users.reduce((s, u) => s + u.latencyMs, 0) / n;
  const avgCost = users.reduce((s, u) => s + u.aiCost, 0) / n;

  return {
    users: n,
    events: converted,
    rate: converted / n,
    revenue,
    avgSessionDuration: avgDur,
    adoptionRate: adopted / n,
    errorRate: errors / n,
    avgLatencyMs: avgLat,
    avgAiCost: avgCost,
  };
}

function emptyAggregate(): MetricAggregate {
  return {
    users: 0,
    events: 0,
    rate: 0,
    revenue: 0,
    avgSessionDuration: 0,
    adoptionRate: 0,
    errorRate: 0,
    avgLatencyMs: 0,
    avgAiCost: 0,
  };
}

export function analyzeExperiment(
  controlUsers: ExperimentUser[],
  treatmentUsers: ExperimentUser[],
  durationDays: number,
  revenuePerConversion: number
): ExperimentResult {
  const control = aggregateUsers(controlUsers);
  const treatment = aggregateUsers(treatmentUsers);
  const z = twoProportionZTest(
    control.events,
    control.users,
    treatment.events,
    treatment.users
  );
  const lift = liftStats(control.rate, treatment.rate);
  const guardrails = computeGuardrails(control, treatment);

  return {
    control,
    treatment,
    lift,
    significance: toSignificance(z),
    confidenceInterval: z.ci,
    sampleSize: { control: control.users, treatment: treatment.users },
    durationDays,
    guardrailChanges: guardrails,
    generatedAt: new Date().toISOString(),
  };
}

function computeGuardrails(
  control: MetricAggregate,
  treatment: MetricAggregate
): GuardrailChange[] {
  return [
    {
      metric: 'Error rate',
      controlValue: control.errorRate * 100,
      treatmentValue: treatment.errorRate * 100,
      changePercent:
        control.errorRate === 0
          ? 0
          : ((treatment.errorRate - control.errorRate) / control.errorRate) * 100,
      status:
        treatment.errorRate <= control.errorRate * 1.5 ? 'PASS' : 'WARN',
    },
    {
      metric: 'Latency (ms)',
      controlValue: control.avgLatencyMs,
      treatmentValue: treatment.avgLatencyMs,
      changePercent:
        control.avgLatencyMs === 0
          ? 0
          : ((treatment.avgLatencyMs - control.avgLatencyMs) /
              control.avgLatencyMs) *
            100,
      status:
        treatment.avgLatencyMs <= control.avgLatencyMs * 1.25 ? 'PASS' : 'WARN',
    },
    {
      metric: 'Infra cost/user',
      controlValue: control.avgAiCost,
      treatmentValue: treatment.avgAiCost,
      changePercent:
        control.avgAiCost === 0
          ? 0
          : ((treatment.avgAiCost - control.avgAiCost) /
              Math.max(control.avgAiCost, 0.001)) *
            100,
      status: 'WARN',
    },
  ];
}
