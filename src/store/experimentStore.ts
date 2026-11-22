import * as React from 'react';
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import type {
  Experiment,
  ExperimentResult,
  CostBreakdown,
  DecisionRecord,
  SimulatorInputs,
  SimulatorOutputs,
} from '../types';
import { analyzeExperiment } from '../lib/analysisEngine';
import { computeCostBreakdown } from '../lib/costAnalysis';
import { makeDecision } from '../lib/decisionEngine';
import { generateDataset } from '../lib/demoData';
import { generateHypothesis } from '../lib/hypothesisGenerator';
import { runSimulation } from '../lib/simulator';
import { addDecisionLogEntry } from '../lib/decisionLog';

export interface AppState {
  experiment: Experiment | null;
  result: ExperimentResult | null;
  cost: CostBreakdown | null;
  decision: DecisionRecord | null;
  hypothesis: ReturnType<typeof generateHypothesis> | null;
  simulator: SimulatorOutputs | null;
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_EXPERIMENT'; payload: Experiment }
  | { type: 'RUN_ANALYSIS'; payload: { result: ExperimentResult; cost: CostBreakdown; decision: DecisionRecord } }
  | { type: 'SET_SIMULATOR'; payload: SimulatorOutputs }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const DEMO_SEED = 'experimentlab-demo-ai-recommendations-2026';

const initialExperiment: Experiment = {
  id: 'exp-001',
  name: 'AI-generated personalized recommendations',
  status: 'COMPLETED',
  createdAt: new Date(Date.now() - 17 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  product: 'Consumer app',
  problem: 'Low conversion among infrequent users',
  targetUsers: 'Users with fewer than 3 sessions/week',
  featureDescription: 'AI-generated personalized recommendations on the home feed.',
  expectedBehavior: 'Target users click recommendations and convert at a higher rate.',
  experimentType: 'AB_TEST',
  variants: [
    { id: 'control', name: 'Control', trafficShare: 0.5, description: 'Current home feed (no AI recommendations).' },
    { id: 'treatment', name: 'Treatment', trafficShare: 0.5, description: 'AI-generated personalized recommendations.' },
  ],
  durationDays: 14,
  metrics: [
    { kind: 'PRIMARY', name: 'Conversion', label: 'Conversion rate', unit: 'percent', baselineValue: 0.12, targetValue: 0.15 },
    { kind: 'SECONDARY', name: 'CTR', label: 'Click-through rate', unit: 'percent', baselineValue: 0.08 },
    { kind: 'SECONDARY', name: 'Session duration', label: 'Avg session duration', unit: 'seconds', baselineValue: 240 },
    { kind: 'GUARDRAIL', name: 'Latency', label: 'Avg latency', unit: 'seconds', baselineValue: 0.28 },
    { kind: 'GUARDRAIL', name: 'Infra cost', label: 'AI cost per user', unit: 'currency', baselineValue: 0 },
  ],
  primaryMetric: 'Conversion',
  additionalCostPerUser: 0.03,
  revenuePerConversion: 45,
  synthetic: true,
  sampleSize: 20000,
};

type ContextValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  generateDemoData: () => Promise<void>;
  runAnalysis: () => Promise<void>;
  runSimulator: (inputs: SimulatorInputs) => void;
} | null;

export const ExperimentContext = createContext<ContextValue>(null);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const initialState: AppState = {
    experiment: initialExperiment,
    result: null,
    cost: null,
    decision: null,
    hypothesis: generateHypothesis(initialExperiment),
    simulator: null,
    loading: false,
    error: null,
  };

  function reducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
      case 'SET_EXPERIMENT':
        return { ...state, experiment: action.payload, error: null };
      case 'RUN_ANALYSIS':
        return {
          ...state,
          result: action.payload.result,
          cost: action.payload.cost,
          decision: action.payload.decision,
          loading: false,
          error: null,
        };
      case 'SET_SIMULATOR':
        return { ...state, simulator: action.payload };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const generateDemoData = useCallback(async () => {
    const exp = state.experiment;
    if (!exp) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const primary = exp.metrics.find((m) => m.kind === 'PRIMARY');
      const baseline = primary?.baselineValue ?? 0.12;
      const perVariant = Math.floor((exp.sampleSize ?? 20000) / 2);

      const dataset = generateDataset({
        seed: DEMO_SEED,
        controlUsers: perVariant,
        treatmentUsers: perVariant,
        baselineConversion: baseline,
        liftRel: 0.233,
        revenuePerConversion: exp.revenuePerConversion,
        aiCostPerUser: exp.additionalCostPerUser,
        durationDays: exp.durationDays,
      });

      const result = analyzeExperiment(
        dataset.users.filter((u) => u.variantId === 'control'),
        dataset.users.filter((u) => u.variantId === 'treatment'),
        exp.durationDays,
        exp.revenuePerConversion
      );

      const cost = computeCostBreakdown(
        result,
        perVariant,
        exp.additionalCostPerUser,
        exp.revenuePerConversion
      );

      const decision = makeDecision(result, cost, result.guardrailChanges);

      addDecisionLogEntry({
        date: new Date().toISOString(),
        experimentId: exp.id,
        experimentName: exp.name,
        hypothesis: state.hypothesis?.primary ?? '',
        result: `Control ${(result.control.rate * 100).toFixed(1)}% → Treatment ${(result.treatment.rate * 100).toFixed(1)}% (${result.lift.absolute.toFixed(1)} pp, ${(result.lift.relative * 100).toFixed(1)}% rel)`,
        decision: decision.decision,
        evidence: `p=${result.significance.pValue.toFixed(3)}, ROI ${(cost.roi ?? 0).toFixed(2)}`,
        followUp: decision.nextSteps.join('; '),
      });

      dispatch({ type: 'RUN_ANALYSIS', payload: { result, cost, decision } });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Analysis failed.',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.experiment, state.hypothesis]);

  const runAnalysis = useCallback(async () => {
    await generateDemoData();
  }, [generateDemoData]);

  const runSimulator = useCallback((inputs: SimulatorInputs) => {
    const output = runSimulation(inputs);
    dispatch({ type: 'SET_SIMULATOR', payload: output });
  }, []);

  const ctxValue: ContextValue = {
    state,
    dispatch,
    generateDemoData,
    runAnalysis,
    runSimulator,
  };

  return React.createElement(
    ExperimentContext.Provider,
    { value: ctxValue },
    children
  );
}

export function useExperiment() {
  const ctx = useContext(ExperimentContext);
  if (!ctx) {
    throw new Error('useExperiment must be used within ExperimentProvider');
  }
  return ctx;
}
