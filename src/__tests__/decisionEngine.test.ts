import { describe, it, expect } from 'vitest';
import { makeDecision } from '../lib/decisionEngine';
import type { ExperimentResult, CostBreakdown, GuardrailChange } from '../types';

function result(liftRelative: number, pValue: number): ExperimentResult {
  return {
    control: { users: 10000, events: 1200, rate: 0.12, revenue: 0, avgSessionDuration: 0, adoptionRate: 0, errorRate: 0, avgLatencyMs: 0, avgAiCost: 0 },
    treatment: { users: 10000, events: 1480, rate: 0.148, revenue: 0, avgSessionDuration: 0, adoptionRate: 0, errorRate: 0, avgLatencyMs: 0, avgAiCost: 0 },
    lift: { absolute: 2.8, relative: liftRelative, treatmentRate: 0.148, controlRate: 0.12 },
    significance: { zScore: 2.0, pValue, isSignificant: pValue < 0.05, alpha: 0.05 },
    confidenceInterval: { lower: 0.005, upper: 0.035, level: 0.95 },
    sampleSize: { control: 10000, treatment: 10000 },
    durationDays: 14,
    guardrailChanges: [],
    generatedAt: new Date().toISOString(),
  };
}

function cost(roi: number | null): CostBreakdown {
  return {
    treatmentUsers: 10000,
    incrementalAiCost: 3500,
    incrementalRevenue: roi !== null ? 3500 * (roi + 1) : 0,
    netIncrementalValue: roi !== null ? 3500 * roi : 0,
    costPerConversion: null,
    costPerActivatedUser: null,
    roi,
    paybackPeriodDays: null,
  };
}

describe('decisionEngine', () => {
  it('SHIP when significant, meaningful lift, positive economics, no guardrail fail', () => {
    const r = makeDecision(result(0.233, 0.01), cost(2.0), []);
    expect(r.decision).toBe('SHIP');
    expect(r.confidence).toBeGreaterThan(0.8);
    expect(r.reasoning.length).toBeGreaterThan(0);
    expect(r.nextSteps.length).toBeGreaterThan(0);
  });

  it('KILL when not significant and negative economics', () => {
    const r = makeDecision(result(0.02, 0.5), cost(-0.5), []);
    expect(r.decision).toBe('KILL');
  });

  it('ITERATE when significant but negative economics', () => {
    const r = makeDecision(result(0.1, 0.01), cost(-0.2), []);
    expect(r.decision).toBe('ITERATE');
    expect(r.reasoning.some((x) => x.toLowerCase().includes('cost'))).toBe(true);
  });

  it('includes reasoning and nextSteps', () => {
    const r = makeDecision(result(0.233, 0.01), cost(2.0), []);
    expect(Array.isArray(r.reasoning)).toBe(true);
    expect(Array.isArray(r.nextSteps)).toBe(true);
    expect(r.basedOnSyntheticData).toBe(true);
  });
});
