import * as React from 'react';
import { Link } from 'react-router-dom';
import { useExperiment } from '../store/experimentStore';
import { Button } from '../components/ui/button';
import { DataBadge } from '../components/common/DataBadge';
import { BarChart3, TrendingUp, AlertTriangle, DollarSign, Clock } from 'lucide-react';

export default function Results() {
  const { state, generateDemoData } = useExperiment();
  const exp = state.experiment;
  const result = state.result;
  const cost = state.cost;

  return (
    <div className="page-container">
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Results</h2>
          <p className="text-sm text-slate-500">Statistical analysis computed from the generated synthetic dataset.</p>
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={generateDemoData} disabled={state.loading}>
            {state.loading ? 'Regenerating...' : 'Regenerate Dataset'}
          </Button>
          <Link to="/decision" className="btn-primary">
            View Decision →
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <DataBadge kind="SYNTHETIC" className="text-[10px]" />
        <span className="ml-2 text-xs text-slate-500">All figures below are computed from synthetic / demo data.</span>
      </div>

      {!result ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
          <BarChart3 className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="font-semibold text-slate-900 mb-2">No results yet</h3>
          <p className="text-sm text-slate-600 mb-4">Generate a dataset to see experiment results.</p>
          <Button onClick={generateDemoData} disabled={state.loading}>
            {state.loading ? 'Generating...' : 'Generate Dataset'}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Control conversion" value={`${(result.control.rate * 100).toFixed(1)}%`} labelKind="SYNTHETIC" />
            <MetricCard title="Treatment conversion" value={`${(result.treatment.rate * 100).toFixed(1)}%`} labelKind="SYNTHETIC" />
            <MetricCard title="Absolute lift" value={`${result.lift.absolute >= 0 ? '+' : ''}${result.lift.absolute.toFixed(1)} pp`} labelKind="SYNTHETIC" />
            <MetricCard title="Relative lift" value={`${(result.lift.relative * 100).toFixed(1)}%`} labelKind="SYNTHETIC" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Lift & Confidence
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Statistical significance</span>
                    <span className={`font-medium ${result.significance.isSignificant ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {result.significance.isSignificant ? 'Significant' : 'Not significant'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">p = {result.significance.pValue.toFixed(4)}</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">95% Confidence interval</span>
                    <span className="font-mono text-sm">
                      {`[${(result.confidenceInterval.lower * 100).toFixed(2)} pp, ${(result.confidenceInterval.upper * 100).toFixed(2)} pp]`}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Sample size (control)</span>
                    <span className="font-medium">{result.sampleSize.control.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Sample size (treatment)</span>
                    <span className="font-medium">{result.sampleSize.treatment.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Cost & Revenue
              </h3>
              {cost && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Incremental revenue</span>
                    <span className={`font-medium ${cost.incrementalRevenue >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      +${cost.incrementalRevenue.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Incremental AI cost</span>
                    <span className="font-medium text-slate-600">${cost.incrementalAiCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Net incremental value</span>
                    <span className={`font-medium ${cost.netIncrementalValue >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ${cost.netIncrementalValue >= 0 ? '+' : ''}${cost.netIncrementalValue.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">ROI</span>
                    <span className={`font-medium ${cost.roi !== null && cost.roi > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {cost.roi !== null ? (cost.roi * 100).toFixed(0) + '%' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Cost / conversion</span>
                    <span className="font-medium text-slate-600">
                      {cost.costPerConversion !== null ? `$${cost.costPerConversion.toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Guardrail Metrics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 font-semibold text-slate-600 text-left">Metric</th>
                    <th className="p-3 font-semibold text-slate-600 text-right">Control</th>
                    <th className="p-3 font-semibold text-slate-600 text-right">Treatment</th>
                    <th className="p-3 font-semibold text-slate-600 text-right">Change</th>
                    <th className="p-3 font-semibold text-slate-600 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.guardrailChanges.map((g) => (
                    <tr key={g.metric} className="border-b border-slate-100">
                      <td className="p-3 text-slate-700">{g.metric}</td>
                      <td className="p-3 text-slate-600 text-right">{typeof g.controlValue === 'number' ? g.controlValue.toFixed(2) : g.controlValue}</td>
                      <td className="p-3 text-slate-600 text-right">{typeof g.treatmentValue === 'number' ? g.treatmentValue.toFixed(2) : g.treatmentValue}</td>
                      <td className="p-3 text-slate-600 text-right">{g.changePercent >= 0 ? '+' : ''}{g.changePercent.toFixed(1)}%</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                          g.status === 'PASS' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" /> Experiment Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-500">Duration</div>
                <div className="font-medium text-slate-900">{result.durationDays} days</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Control users</div>
                <div className="font-medium text-slate-900">{result.sampleSize.control.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Treatment users</div>
                <div className="font-medium text-slate-900">{result.sampleSize.treatment.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Type</div>
                <div className="font-medium text-slate-900">{exp?.experimentType.replace('_', ' ') ?? '—'}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value, labelKind }: { title: string; value: string; labelKind?: 'SYNTHETIC' | 'AI_GENERATED' | 'ILLUSTRATIVE' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {labelKind && <DataBadge kind={labelKind} className="mt-3 text-[10px]" />}
    </div>
  );
}
