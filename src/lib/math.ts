import type { LiftStats } from '../types';

const invSqrt2pi = 1 / Math.sqrt(2 * Math.PI);
function pdf(x: number): number {
  return invSqrt2pi * Math.exp(-0.5 * x * x);
}
// Abramowitz & Stegun 7.1.26, |error| < 1.5e-7
export function normalCdf(x: number): number {
  const p = 0.2316419;
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  if (x < 0) return 1 - normalCdf(-x);
  const t = 1 / (1 + p * x);
  const poly = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
  return 1 - pdf(x) * poly;
}

export function normalCdfInverse(p: number): number {
  const a = [
    -3.969683028665376e+01,
    2.209460984245205e+02,
    -2.759285104469687e+02,
    1.383577518672690e+02,
    -3.066479806614716e+01,
    2.506628277459239e+00,
  ];
  const b = [
    -5.447609879822406e+01,
    1.615858368580409e+02,
    -1.556989798598866e+02,
    6.680131188771972e+01,
    -1.328068155288572e+01,
  ];
  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
    4.374664141464968e+00,
    2.938163982698783e+00,
  ];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q = 0;
  let r = 0;
  let val = 0;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    val =
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q +
        c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  } else if (p <= phigh) {
    q = p - 0.5;
    r = q * q;
    val =
      (((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r +
        a[5]!) *
        q /
      (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r +
        1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    val =
      -((((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q +
        c[5]!) /
        ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1));
  }
  return val;
}

export interface TwoProportionZTest {
  p1: number;
  p2: number;
  z: number;
  pValue: number;
  isSignificant: boolean;
  ci: ConfidenceIntervalResult;
  seDiff: number;
}

export interface ConfidenceIntervalResult {
  lower: number;
  upper: number;
  level: number;
}

export function twoProportionZTest(
  c: number,
  n1: number,
  t: number,
  n2: number,
  alpha: number = 0.05
): TwoProportionZTest {
  const p1 = n1 === 0 ? 0 : c / n1;
  const p2 = n2 === 0 ? 0 : t / n2;
  const pPool = n1 + n2 === 0 ? 0 : (c + t) / (n1 + n2);
  const sePool =
    pPool === 0 || n1 === 0 || n2 === 0
      ? 0
      : Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  const z = sePool === 0 ? 0 : (p2 - p1) / sePool;
  const pValue = 2 * (1 - normalCdf(Math.abs(z)));
  const seDiff =
    n1 === 0 || n2 === 0
      ? 0
      : Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2);
  const zCritical = normalCdfInverse(1 - alpha / 2);
  const margin = zCritical * seDiff;
  const diff = p2 - p1;
  return {
    p1,
    p2,
    z,
    pValue,
    isSignificant: pValue < alpha,
    ci: { lower: diff - margin, upper: diff + margin, level: 1 - alpha },
    seDiff,
  };
}

export function liftStats(cRate: number, tRate: number): LiftStats {
  const absolute = (tRate - cRate) * 100;
  const relative = cRate === 0 ? 0 : (tRate - cRate) / cRate;
  return { absolute, relative, controlRate: cRate, treatmentRate: tRate };
}

export function sampleSizeForMDE(
  baseline: number,
  mde: number,
  alpha: number = 0.05,
  power: number = 0.8
): number {
  const za = normalCdfInverse(1 - alpha / 2);
  const zb = normalCdfInverse(power);
  const p1 = baseline;
  const p2 = baseline + mde;
  const pBar = (p1 + p2) / 2;
  const num = 2 * pBar * (1 - pBar) * Math.pow(za + zb, 2);
  const den = Math.pow(p2 - p1, 2);
  if (den === 0) return 0;
  return Math.ceil(num / den);
}

export function toSignificance(z: TwoProportionZTest): import('../types').Significance {
  return {
    zScore: z.z,
    pValue: z.pValue,
    isSignificant: z.isSignificant,
    alpha: 0.05,
  };
}
