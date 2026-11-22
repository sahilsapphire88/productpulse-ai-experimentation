import type { CostBreakdown, ExperimentResult } from '../types';

export function computeCostBreakdown(
  result: ExperimentResult,
  treatmentUsers: number,
  aiCostPerUser: number,
  revenuePerConversion: number
): CostBreakdown {
  const incrementalConversions = Math.max(
    0,
    result.treatment.events - result.control.events
  );
  const incrementalRevenue = incrementalConversions * revenuePerConversion;
  const incrementalAiCost = treatmentUsers * aiCostPerUser;
  const net = incrementalRevenue - incrementalAiCost;
  const costPerConversion =
    incrementalConversions > 0 ? incrementalAiCost / incrementalConversions : null;
  const roi = incrementalAiCost > 0 ? net / incrementalAiCost : null;
  const paybackPeriodDays = null;

  return {
    treatmentUsers,
    incrementalAiCost,
    incrementalRevenue,
    netIncrementalValue: net,
    costPerConversion,
    costPerActivatedUser: costPerConversion,
    roi,
    paybackPeriodDays,
  };
}
