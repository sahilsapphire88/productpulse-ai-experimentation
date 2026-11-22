import * as React from 'react';
import { useExperiment } from '../store/experimentStore';
import { DataBadge } from '../components/common/DataBadge';
import { DollarSign, TrendingUp, ArrowRight, PlayCircle } from 'lucide-react';
import type { SimulatorInputs } from '../types';

export default function WhatIfSimulator() {
  const { state, runSimulator } = useExperiment();
  const exp = state.experiment;
  const sim = state.simulator;

  if (!exp) return null;

  const [inputs, setInputs] = React.useState<SimulatorInputs>({
    conversionRate: (exp.metrics.find((m) => m.kind === 'PRIMARY')?.targetValue ?? 0.15),
    sampleSize: exp.sampleSize ?? 20000,
    aiCostPerUser: exp.additionalCostPerUser,
    trafficShareTreatment: 0.5,
    durationDays: exp.durationDays,
    revenuePerUser: exp.revenuePerConversion,
    baselineConversion: (exp.metrics.find((m) => m.kind === 'PRIMARY')?.baselineValue ?? 0.12),
  });

  const handleChange = (key: keyof SimulatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleRun = () => {
    runSimulator(inputs);
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">What-If Simulator</h2>
        <p className="text-sm text-slate-500">Adjust assumptions to see how lift, economics, and the decision recommendation change dynamically.</p>
      </div>

      <div className="mb-6">
        <DataBadge kind="SYNTHETIC" className="text-[10px]" />
        <span className="ml-2 text-xs text-slate-500">Simulator outputs are based on synthetic / demo data.</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4">Simulate</h3>
            <div className="space-y-5">
              <SliderField
                label="Treatment conversion rate"
                value={inputs.conversionRate * 100}
                min={0}
                max={50}
                step={0.1}
                unit="%"
                onChange={(v) => handleChange('conversionRate', v / 100)}
              />
              <SliderField
                label="Sample size (total)"
                value={inputs.sampleSize}
                min={1000}
                max={100000}
                step={1000}
                unit=""
                onChange={(v) => handleChange('sampleSize', v)}
              />
              <SliderField
                label="AI cost / user ($)"
                value={inputs.aiCostPerUser * 100}
                min={0}
                max={10}
                step={0.1}
                unit="¢"
                onChange={(v) => handleChange('aiCostPerUser', v / 100)}
              />
              <SliderField
                label="Traffic to treatment"
                value={inputs.trafficShareTreatment * 100}
                min={10}
                max={90}
                step={5}
                unit="%"
                onChange={(v) => handleChange('trafficShareTreatment', v / 100)}
              />
              <SliderField
                label="Experiment duration"
                value={inputs.durationDays}
                min={7}
                max={90}
                step={1}
                unit=" days"
                onChange={(v) => handleChange('durationDays', v)}
              />
              <SliderField
                label="Revenue / conversion ($)"
                value={inputs.revenuePerUser}
                min={10}
                max={500}
                step={5}
                unit=""
                onChange={(v) => handleChange('revenuePerUser', v)}
              />
            </div>
            <button
              onClick={handleRun}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-5 w-5" /> Run Simulation
            </button>
          </div>
        </div>

        {/* Outputs */}
        <div className="lg:col-span-8 space-y-6">
          {!sim ? (
            <div className="bg-slate-50 rounded-xl p-12 text-center border border-slate-200">
              <PlayCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Run a simulation</h3>
              <p className="text-sm text-slate-600">Adjust the parameters and click Run Simulation to see projected lift, cost, ROI, and decision.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCardSimple title="Relative lift" value={`${(sim.lift.relative * 100).toFixed(1)}%`} />
                <StatCardSimple title="Absolute lift" value={`${sim.lift.absolute >= 0 ? '+' : ''}${sim.lift.absolute.toFixed(1)} pp`} />
                <StatCardSimple title="p-value" value={sim.significance.pValue.toFixed(4)} />
                <StatCardSimple title="Significant" value={sim.significance.isSignificant ? 'Yes' : 'No'} />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Economic Impact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase">Incremental revenue</div>
                    <div className="text-xl font-bold text-emerald-600">+${sim.cost.incrementalRevenue.toFixed(0)}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase">Incremental AI cost</div>
                    <div className="text-xl font-bold text-slate-600">${sim.cost.incrementalAiCost.toFixed(0)}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase">Net value</div>
                    <div className={`text-xl font-bold ${sim.cost.netIncrementalValue >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {sim.cost.netIncrementalValue >= 0 ? '+' : ''}${sim.cost.netIncrementalValue.toFixed(0)}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase">ROI</div>
                    <div className={`text-xl font-bold ${sim.cost.roi !== null && sim.cost.roi > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {sim.cost.roi !== null ? (sim.cost.roi * 100).toFixed(0) + '%' : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Recommendation
                </h3>
                <div className={`rounded-xl border p-6 mb-4 ${decisionConfig(sim.decision.decision)!.bg} ${decisionConfig(sim.decision.decision)!.border}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-bold ${decisionConfig(sim.decision.decision)!.color}`}>
                      {sim.decision.decision}
                    </span>
                    <p className="text-xs text-slate-500">Confidence: {(sim.decision.confidence * 100).toFixed(0)}%</p>
                  </div>
                  <p className="text-sm text-slate-700">{sim.decision.reasoning.join(' ')}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-900 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
      />
    </div>
  );
}

function StatCardSimple({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</div>
      <div className="text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function decisionConfig(decision: string) {
  const config: Record<string, { color: string; bg: string; border: string }> = {
    SHIP: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    ITERATE: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    KILL: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  };
  return config[decision as keyof typeof config] || config.ITERATE;
}
