import { describe, it, expect } from 'vitest';
import { generateDataset } from '../lib/demoData';
import type { ExperimentUser } from '../types';

describe('demoData', () => {
  it('generates deterministic data with same seed', () => {
    const a = generateDataset({
      seed: 'test-seed',
      controlUsers: 100,
      treatmentUsers: 100,
      baselineConversion: 0.12,
      liftRel: 0.2,
      revenuePerConversion: 45,
      aiCostPerUser: 0.03,
      durationDays: 14,
    });
    const b = generateDataset({
      seed: 'test-seed',
      controlUsers: 100,
      treatmentUsers: 100,
      baselineConversion: 0.12,
      liftRel: 0.2,
      revenuePerConversion: 45,
      aiCostPerUser: 0.03,
      durationDays: 14,
    });
    expect(a.users.length).toBe(200);
    expect(b.users.length).toBe(200);
    expect(a.users[0]?.converted).toBe(b.users[0]?.converted);
    expect(a.users[0]?.revenue).toBe(b.users[0]?.revenue);
  });

  it('labels data as synthetic', () => {
    const ds = generateDataset({
      seed: 'x',
      controlUsers: 10,
      treatmentUsers: 10,
      baselineConversion: 0.1,
      liftRel: 0.1,
      revenuePerConversion: 45,
      aiCostPerUser: 0.03,
      durationDays: 7,
    });
    expect(ds.label).toContain('SYNTHETIC');
  });

  it('treatment has higher conversion when liftRel > 0', () => {
    const ds = generateDataset({
      seed: 'lift-test',
      controlUsers: 5000,
      treatmentUsers: 5000,
      baselineConversion: 0.12,
      liftRel: 0.2,
      revenuePerConversion: 45,
      aiCostPerUser: 0.03,
      durationDays: 14,
    });
    const control = ds.users.filter((u) => u.variantId === 'control');
    const treatment = ds.users.filter((u) => u.variantId === 'treatment');
    const controlRate = control.filter((u) => u.converted).length / control.length;
    const treatmentRate = treatment.filter((u) => u.converted).length / treatment.length;
    expect(treatmentRate).toBeGreaterThan(controlRate);
  });

  it('treatment users have aiCost > 0, control has 0', () => {
    const ds = generateDataset({
      seed: 'cost-test',
      controlUsers: 50,
      treatmentUsers: 50,
      baselineConversion: 0.1,
      liftRel: 0.1,
      revenuePerConversion: 45,
      aiCostPerUser: 0.03,
      durationDays: 7,
    });
    for (const u of ds.users) {
      if (u.variantId === 'control') expect(u.aiCost).toBe(0);
      if (u.variantId === 'treatment') expect(u.aiCost).toBe(0.03);
    }
  });
});
