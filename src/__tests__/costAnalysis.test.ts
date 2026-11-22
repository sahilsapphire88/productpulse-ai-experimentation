import { describe, it, expect } from 'vitest';
import { computeCostBreakdown } from '../lib/costAnalysis';
import type { ExperimentResult } from '../types';

function result(controlEvents: number, treatmentEvents: number, users: number): ExperimentResult {
  return {
    control: { users, events: controlEvents, rate: controlEvents / users, revenue: 0, avgSessionDuration: 0, adoptionRate: 0, errorRate: 0, avgLatencyMs: 0, avgAiCost: 0 },
    treatment: { users, events: treatmentEvents, rate: treatmentEvents / users, revenue: 0, avgSessionDuration: 0, adoptionRate: 0, errorRate: 0, avgLatencyMs: 0, avgAiCost: 0 },
    lift: { absolute: 0, relative: 0, treatmentRate: treatmentEvents / users, controlRate: controlEvents / users },
    significance: { zScore: 0, pValue: 0, isSignificant: false, alpha: 0.05 },
    confidenceInterval: { lower: 0, upper: 0, level: 0.95 },
    sampleSize: { control: users, treatment: users },
    durationDays: 14,
    guardrailChanges: [],
    generatedAt: new Date().toISOString(),
  };
}

describe('costAnalysis', () => {
  it('computes incremental revenue, cost, net value, ROI', () => {
    const r = result(1200, 1480, 10000); // 280 incremental conversions
    const c = computeCostBreakdown(r, 10000, 0.03, 45);
    expect(c.incrementalRevenue).toBe(280 * 45);
    expect(c.incrementalAiCost).toBe(300);
    expect(c.netIncrementalValue).toBe(12300);
    expect(c.roi).toBeCloseTo(41, 1);
    expect(c.costPerConversion).toBeCloseTo(300 / 280, 2);
  });

  it('handles zero incremental conversions', () => {
    const r = result(1000, 1000, 10000);
    const c = computeCostBreakdown(r, 10000, 0.03, 45);
    expect(c.incrementalRevenue).toBe(0);
    expect(c.incrementalAiCost).toBe(300);
    expect(c.netIncrementalValue).toBe(-300);
    expect(c.costPerConversion).toBeNull();
    expect(c.roi).toBeCloseTo(-1, 2);
  });
});
