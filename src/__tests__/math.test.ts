import { describe, it, expect } from 'vitest';
import { normalCdf, twoProportionZTest, liftStats, sampleSizeForMDE } from '../lib/math';

describe('math', () => {
  describe('normalCdf', () => {
    it('returns 0.5 at x=0', () => {
      expect(normalCdf(0)).toBeCloseTo(0.5, 4);
    });
    it('is symmetric', () => {
      expect(normalCdf(-1)).toBeCloseTo(1 - normalCdf(1), 4);
    });
    it('returns near 1 for large positive x', () => {
      expect(normalCdf(5)).toBeGreaterThan(0.9999);
    });
  });

  describe('twoProportionZTest', () => {
    it('computes correct rates', () => {
      const result = twoProportionZTest(120, 1000, 150, 1000);
      expect(result.p1).toBeCloseTo(0.12, 4);
      expect(result.p2).toBeCloseTo(0.15, 4);
    });
    it('detects significance for large difference', () => {
      const result = twoProportionZTest(100, 10000, 200, 10000);
      expect(result.isSignificant).toBe(true);
    });
    it('does not detect significance for tiny difference', () => {
      const result = twoProportionZTest(1000, 10000, 1010, 10000);
      expect(result.isSignificant).toBe(false);
    });
    it('returns CI with lower < upper', () => {
      const result = twoProportionZTest(120, 1000, 150, 1000);
      expect(result.ci.lower).toBeLessThan(result.ci.upper);
    });
  });

  describe('liftStats', () => {
    it('computes absolute and relative lift', () => {
      const lift = liftStats(0.12, 0.148);
      expect(lift.absolute).toBeCloseTo(2.8, 1);
      expect(lift.relative).toBeCloseTo(0.233, 2);
    });
    it('handles zero baseline', () => {
      const lift = liftStats(0, 0.1);
      expect(lift.relative).toBe(0);
    });
  });

  describe('sampleSizeForMDE', () => {
    it('returns positive sample size', () => {
      const n = sampleSizeForMDE(0.12, 0.03);
      expect(n).toBeGreaterThan(0);
    });
    it('returns 0 for zero MDE', () => {
      const n = sampleSizeForMDE(0.12, 0);
      expect(n).toBe(0);
    });
  });
});
