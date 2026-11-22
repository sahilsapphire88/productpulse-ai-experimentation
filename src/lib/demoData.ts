import { SeededRNG } from './rng';
import type { ExperimentUser, GeneratedDataset } from '../types';

export interface GenerateDatasetParams {
  seed: string;
  controlUsers: number;
  treatmentUsers: number;
  baselineConversion: number;
  liftRel: number;
  revenuePerConversion: number;
  aiCostPerUser: number;
  durationDays: number;
}

export function generateDataset(
  params: GenerateDatasetParams
): GeneratedDataset {
  const rng = new SeededRNG(params.seed);
  const users: ExperimentUser[] = [];

  const makeUser = (variantId: string, isTreatment: boolean): ExperimentUser => {
    const baseConv = params.baselineConversion;
    const convRate = isTreatment
      ? Math.min(0.99, baseConv * (1 + params.liftRel))
      : baseConv;
    const converted = rng.bool(convRate);
    const revenue = converted ? rng.range(30, 120) * (params.revenuePerConversion / 100) : 0;
    const retained = rng.bool(isTreatment ? 0.62 : 0.60);
    const sessionDuration = Math.max(30, rng.normal(isTreatment ? 280 : 240, 60));
    const featureAdopted = rng.bool(isTreatment ? 0.55 : 0.40);
    const errored = rng.bool(0.02);
    const latencyMs = Math.max(50, rng.normal(isTreatment ? 320 : 280, 40));
    const aiCost = isTreatment ? params.aiCostPerUser : 0;

    return {
      id: `user_${users.length + 1}`,
      variantId,
      converted,
      revenue,
      retained,
      sessionDuration,
      featureAdopted,
      errored,
      latencyMs,
      aiCost,
    };
  };

  for (let i = 0; i < params.controlUsers; i++) {
    users.push(makeUser('control', false));
  }
  for (let i = 0; i < params.treatmentUsers; i++) {
    users.push(makeUser('treatment', true));
  }

  return {
    seed: params.seed,
    users,
    controlUsers: params.controlUsers,
    treatmentUsers: params.treatmentUsers,
    label: 'SYNTHETIC / DEMO DATA',
  };
}
