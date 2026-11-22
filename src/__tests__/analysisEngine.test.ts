import { describe, it, expect } from 'vitest';
import { analyzeExperiment, aggregateUsers } from '../lib/analysisEngine';
import type { ExperimentUser } from '../types';

function makeUsers(count: number, converted: number): ExperimentUser[] {
  const users: ExperimentUser[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: `u${i}`,
      variantId: 'control',
      converted: i < converted,
      revenue: i < converted ? 50 : 0,
      retained: i < converted,
      sessionDuration: 240,
      featureAdopted: i < converted,
      errored: false,
      latencyMs: 280,
      aiCost: 0,
    });
  }
  return users;
}

describe('analysisEngine', () => {
  describe('aggregateUsers', () => {
    it('computes conversion rate', () => {
      const users = makeUsers(1000, 120);
      const agg = aggregateUsers(users);
      expect(agg.users).toBe(1000);
      expect(agg.events).toBe(120);
      expect(agg.rate).toBe(0.12);
    });
    it('handles empty array', () => {
      const agg = aggregateUsers([]);
      expect(agg.users).toBe(0);
      expect(agg.rate).toBe(0);
    });
  });

  describe('analyzeExperiment', () => {
    it('computes lift and significance from data', () => {
      const control = makeUsers(10000, 1200); // 12%
      const treatment = makeUsers(10000, 1480); // 14.8%
      const result = analyzeExperiment(control, treatment, 14, 45);

      expect(result.control.rate).toBeCloseTo(0.12, 3);
      expect(result.treatment.rate).toBeCloseTo(0.148, 3);
      expect(result.lift.absolute).toBeCloseTo(2.8, 1);
      expect(result.lift.relative).toBeCloseTo(0.233, 2);
      expect(result.significance.isSignificant).toBe(true);
      expect(result.confidenceInterval.lower).toBeLessThan(result.confidenceInterval.upper);
      expect(result.sampleSize.control).toBe(10000);
      expect(result.sampleSize.treatment).toBe(10000);
      expect(result.durationDays).toBe(14);
    });
    it('includes guardrail changes', () => {
      const control = makeUsers(1000, 100);
      const treatment = makeUsers(1000, 120);
      const result = analyzeExperiment(control, treatment, 14, 45);
      expect(result.guardrailChanges.length).toBeGreaterThan(0);
      expect(result.guardrailChanges.some((g) => g.metric === 'Error rate')).toBe(true);
    });
  });
});
