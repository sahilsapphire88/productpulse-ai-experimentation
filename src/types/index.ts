export type Decision = 'SHIP' | 'ITERATE' | 'KILL';
export type ExperimentType = 'AB_TEST' | 'FEATURE_FLAG' | 'HOLDOUT' | 'PRE_POST';
export type ExperimentStatus = 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'ARCHIVED';
export type MetricKind = 'PRIMARY' | 'SECONDARY' | 'GUARDRAIL';

export interface MetricConfig {
  kind: MetricKind;
  name: string;
  label: string;
  unit: 'percent' | 'currency' | 'count' | 'seconds' | 'ratio';
  baselineValue: number;
  targetValue?: number;
}

export interface Variant {
  id: string;
  name: string;
  trafficShare: number;
  description: string;
}

export interface Experiment {
  id: string;
  name: string;
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
  product: string;
  problem: string;
  targetUsers: string;
  featureDescription: string;
  expectedBehavior: string;
  experimentType: ExperimentType;
  variants: Variant[];
  durationDays: number;
  metrics: MetricConfig[];
  primaryMetric: string;
  additionalCostPerUser: number;
  revenuePerConversion: number;
  synthetic?: boolean;
  sampleSize?: number;
  results?: ExperimentResult;
  decision?: DecisionRecord;
}

export interface ExperimentUser {
  id: string;
  variantId: string;
  converted: boolean;
  revenue: number;
  retained: boolean;
  sessionDuration: number;
  featureAdopted: boolean;
  errored: boolean;
  latencyMs: number;
  aiCost: number;
}

export interface ExperimentResult {
  control: MetricAggregate;
  treatment: MetricAggregate;
  lift: LiftStats;
  significance: Significance;
  confidenceInterval: ConfidenceInterval;
  sampleSize: { control: number; treatment: number };
  durationDays: number;
  guardrailChanges: GuardrailChange[];
  generatedAt: string;
}

export interface MetricAggregate {
  users: number;
  events: number;
  rate: number;
  revenue: number;
  avgSessionDuration: number;
  adoptionRate: number;
  errorRate: number;
  avgLatencyMs: number;
  avgAiCost: number;
}

export interface LiftStats {
  absolute: number;
  relative: number;
  treatmentRate: number;
  controlRate: number;
}

export interface Significance {
  zScore: number;
  pValue: number;
  isSignificant: boolean;
  alpha: number;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  level: number;
}

export interface GuardrailChange {
  metric: string;
  controlValue: number;
  treatmentValue: number;
  changePercent: number;
  status: 'PASS' | 'WARN' | 'FAIL';
}

export interface CostBreakdown {
  treatmentUsers: number;
  incrementalAiCost: number;
  incrementalRevenue: number;
  netIncrementalValue: number;
  costPerConversion: number | null;
  costPerActivatedUser: number | null;
  roi: number | null;
  paybackPeriodDays: number | null;
}

export interface DecisionRecord {
  decision: Decision;
  confidence: number;
  reasoning: string[];
  nextSteps: string[];
  generatedAt: string;
  basedOnSyntheticData: boolean;
}

export interface SimulatorInputs {
  conversionRate: number;
  sampleSize: number;
  aiCostPerUser: number;
  trafficShareTreatment: number;
  durationDays: number;
  revenuePerUser: number;
  baselineConversion: number;
}

export interface SimulatorOutputs {
  lift: LiftStats;
  significance: Significance;
  cost: CostBreakdown;
  decision: DecisionRecord;
  reasoning: string[];
}

export interface GeneratedHypothesis {
  primary: string;
  secondary: string[];
  assumptions: string[];
  risks: string[];
  expectedBehavior: string;
  failureModes: string[];
  label: string;
}

export interface GeneratedDataset {
  seed: string;
  users: ExperimentUser[];
  controlUsers: number;
  treatmentUsers: number;
  label: string;
}

export interface DemoLabel {
  kind: 'SYNTHETIC' | 'AI_GENERATED' | 'ILLUSTRATIVE';
  text: string;
}
