import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useExperiment } from '../store/experimentStore';
import { DataBadge } from '../components/common/DataBadge';

export default function ExperimentDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useExperiment();
  const exp = state.experiment;
  const result = state.result;
  const cost = state.cost;
  const decision = state.decision;

  if (!exp) {
    return (
      <div className="page-container">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Experiment Not Found</h2>
        <p className="text-sm text-slate-500">The requested experiment does not exist.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{exp.name}</h2>
        <p className="text-sm text-slate-500">{exp.problem}</p>
      </div>

      <div className="mb-6">
        <DataBadge kind="SYNTHETIC" className="text-[10px]" />
        <span className="ml-2 text-xs text-slate-500">All experiment content is synthetic / demo data.</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Product</p>
                <p className="text-sm text-slate-700">{exp.product}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Problem</p>
                <p className="text-sm text-slate-700">{exp.problem}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Target Users</p>
                <p className="text-sm text-slate-700">{exp.targetUsers}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Feature Description</p>
                <p className="text-sm text-slate-700">{exp.featureDescription}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Expected Behavior</p>
                <p className="text-sm text-slate-700">{exp.expectedBehavior}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Experiment Design</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Type</p>
                <p className="text-sm text-slate-700">{exp.experimentType.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Duration</p>
                <p className="text-sm text-slate-700">{exp.durationDays} days</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Control</p>
                <p className="text-sm text-slate-700">{exp.variants.find((v) => v.id === 'control')?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Treatment</p>
                <p className="text-sm text-slate-700">{exp.variants.find((v) => v.id === 'treatment')?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Traffic Allocation</p>
                <p className="text-sm text-slate-700">
                  {Math.round(exp.variants.find((v) => v.id === 'control')?.trafficShare ?? 0.5 * 100)}% / {Math.round(exp.variants.find((v) => v.id === 'treatment')?.trafficShare ?? 0.5 * 100)}%
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">AI Cost / User</p>
                <p className="text-sm text-slate-700">${exp.additionalCostPerUser}</p>
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Results</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Control conversion</p>
                  <p className="text-sm font-medium text-slate-900">{(result.control.rate * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Treatment conversion</p>
                  <p className="text-sm font-medium text-slate-900">{(result.treatment.rate * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Absolute lift</p>
                  <p className={`text-sm font-medium ${result.lift.absolute >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {result.lift.absolute >= 0 ? '+' : ''}{result.lift.absolute.toFixed(1)} pp
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Relative lift</p>
                  <p className="text-sm font-medium text-slate-900">{(result.lift.relative * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">p-value</p>
                  <p className="text-sm font-medium text-slate-900">{result.significance.pValue.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Significant</p>
                  <p className={`text-sm font-medium ${result.significance.isSignificant ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {result.significance.isSignificant ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {decision && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Decision</h3>
              <div className={`rounded-lg p-4 mb-4 ${decisionConfig(decision.decision)!.bg} ${decisionConfig(decision.decision)!.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${decisionConfig(decision.decision)!.color}`}>
                    {decision.decision}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-2">{decision.reasoning[0] ?? ''}</p>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Next Steps</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                {decision.nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">AI Analysis</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p><strong>What changed?</strong> {result ? `Conversion moved from ${(result.control.rate * 100).toFixed(1)}% to ${(result.treatment.rate * 100).toFixed(1)}% (${(result.lift.relative * 100).toFixed(1)}% relative).` : 'No results yet.'}</p>
              <p><strong>Why might it have changed?</strong> Personalized recommendations increase relevance for low-engagement users.</p>
              <p><strong>What should the PM investigate?</strong> Check guardrail metrics (latency, error rate) and AI cost before scaling.</p>
            </div>
          </div>
        </div>
      </div>
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
