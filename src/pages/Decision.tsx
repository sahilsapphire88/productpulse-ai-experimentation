import * as React from 'react';
import { Link } from 'react-router-dom';
import { useExperiment } from '../store/experimentStore';
import { DataBadge } from '../components/common/DataBadge';
import { Rocket, RefreshCw, AlertTriangle, DollarSign } from 'lucide-react';

export default function Decision() {
  const { state } = useExperiment();
  const exp = state.experiment;
  const result = state.result;
  const cost = state.cost;
  const decision = state.decision;

  if (!exp || !result || !cost || !decision) {
    return (
      <div className="page-container">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Decision</h2>
        <p className="text-sm text-slate-500 mb-6">Generate results first to see the decision recommendation.</p>
        <Link to="/results" className="btn-secondary">Go to Results</Link>
      </div>
    );
  }

  const config: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
    SHIP: { icon: Rocket, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    ITERATE: { icon: RefreshCw, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    KILL: { icon: AlertTriangle, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  };
  const c = config[decision.decision as keyof typeof config]!;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Decision</h2>
        <p className="text-sm text-slate-500">Transparent Ship / Iterate / Kill recommendation with reasoning.</p>
      </div>

      <div className="mb-6">
        <DataBadge kind="SYNTHETIC" className="text-[10px]" />
        <span className="ml-2 text-xs text-slate-500">Decision computed from synthetic / demo data.</span>
      </div>

      {/* Decision Card */}
      <div className={`rounded-xl border p-8 shadow-sm mb-8 ${c.bg} ${c.border}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${c.color.replace('text-', 'bg-')}100`}>
            <c.icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">Recommendation: {decision.decision}</h3>
            <p className="text-sm text-slate-500">Confidence: {(decision.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>

        <h4 className="font-semibold text-slate-900 mb-3">Reasoning</h4>
        <ul className="space-y-3 text-sm text-slate-700 mb-6">
          {decision.reasoning.map((r, i) => (
            <li key={i} className="flex items-start gap-2 pl-4">
              <span className="text-slate-400">•</span>
              {r}
            </li>
          ))}
        </ul>

        <h4 className="font-semibold text-slate-900 mb-3">Next Steps</h4>
        <ul className="space-y-3 text-sm text-slate-700">
          {decision.nextSteps.map((s, i) => (
            <li key={i} className="flex items-start gap-2 pl-4">
              <span className="text-slate-400">→</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Supporting data */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Cost Analysis
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Incremental revenue</span>
              <span className="font-medium">${cost.incrementalRevenue.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Incremental AI cost</span>
              <span className="font-medium">${cost.incrementalAiCost.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Net incremental value</span>
              <span className={`font-medium ${cost.netIncrementalValue >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${cost.netIncrementalValue >= 0 ? '+' : ''}${cost.netIncrementalValue.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ROI</span>
              <span className="font-medium">{cost.roi !== null ? (cost.roi * 100).toFixed(0) + '%' : 'N/A'}</span>
            </div>
            <DataBadge kind="SYNTHETIC" className="mt-3 text-[10px]" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Guardrails
          </h4>
          <div className="space-y-2 text-sm">
            {result.guardrailChanges.map((g) => (
              <div key={g.metric} className="flex justify-between">
                <span className="text-slate-600">{g.metric}</span>
                <span className={`font-medium ${g.status === 'PASS' ? 'text-emerald-600' : 'text-amber-600'}`}>{g.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-slate-900 mb-3">Statistical Evidence</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">p-value</span>
              <span className="font-medium">{result.significance.pValue.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Relative lift</span>
              <span className="font-medium">{(result.lift.relative * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Significant</span>
              <span className={`font-medium ${result.significance.isSignificant ? 'text-emerald-600' : 'text-slate-400'}`}>
                {result.significance.isSignificant ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/simulator" className="btn-primary">Run What-If Simulator →</Link>
        <Link to="/history" className="btn-secondary">View Decision Log</Link>
      </div>
    </div>
  );
}
