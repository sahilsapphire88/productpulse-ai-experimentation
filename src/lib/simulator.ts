import type {
  SimulatorInputs,
  SimulatorOutputs,
  DecisionRecord,
} from '../types';
import { twoProportionZTest, liftStats, toSignificance } from './math';
import { makeDecision } from './decisionEngine';
import { computeCostBreakdown } from './costAnalysis';

export function runSimulation(inputs: SimulatorInputs): SimulatorOutputs {
  const {
    baselineConversion,
    conversionRate,
    sampleSize,
    aiCostPerUser,
    trafficShareTreatment,
    revenuePerUser,
    durationDays,
  } = inputs;

  const controlUsers = Math.round(sampleSize * (1 - trafficShareTreatment));
  const treatmentUsers = Math.round(sampleSize * trafficShareTreatment);
  const controlConv = Math.round(controlUsers * baselineConversion);
  const treatmentConv = Math.round(treatmentUsers * conversionRate);

  const z = twoProportionZTest(controlConv, controlUsers, treatmentConv, treatmentUsers);
  const lift = liftStats(baselineConversion, conversionRate);

  const result = {
    control: { events: controlConv, users: controlUsers, rate: baselineConversion },
    treatment: { events: treatmentConv, users: treatmentUsers, rate: conversionRate },
    lift,
    significance: toSignificance(z),
  } as any;

  const cost = computeCostBreakdown(result, treatmentUsers, aiCostPerUser, revenuePerUser);
  const decision = makeDecision(result, cost, []);

  return {
    lift,
    significance: toSignificance(z),
    cost,
    decision,
    reasoning: decision.reasoning,
  };
}
