import * as React from 'react';
import { DataBadge } from '../components/common/DataBadge';

export default function Metrics() {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Product Metrics</h2>
        <p className="text-sm text-slate-500">How we measure ExperimentLab's own success as a product.</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <DataBadge kind="SYNTHETIC" className="text-[10px]" />
          <span className="ml-2 text-xs text-slate-500">Demo metric values are synthetic / illustrative.</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Metric definitions are real product thinking; values shown are demo/illustrative.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">North Star Metric</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
          <h4 className="font-bold text-slate-900 mb-1">Validated Product Decisions</h4>
          <p className="text-sm text-blue-700">
            The number of product decisions (Ship / Iterate / Kill) made with
            clear statistical and economic evidence, per month.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">Supporting Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 font-semibold text-slate-600 text-left">Metric</th>
                <th className="p-4 font-semibold text-slate-600 text-left">Definition</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Demo value</th>
                <th className="p-4 font-semibold text-slate-600 text-left">Label</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Experiment completion rate', def: '% of created experiments that reach a decision.', value: '78%', label: 'DEMO / ILLUSTRATIVE' },
                { name: 'Decision confidence', def: 'Average confidence score of generated decisions.', value: '82%', label: 'DEMO / ILLUSTRATIVE' },
                { name: 'Time-to-decision', def: 'Median days from experiment creation to decision.', value: '14 days', label: 'DEMO / ILLUSTRATIVE' },
                { name: 'Experiment win rate', def: '% of experiments resulting in a SHIP decision.', value: '32%', label: 'DEMO / ILLUSTRATIVE' },
                { name: 'Average improvement', def: 'Mean relative lift of shipped experiments.', value: '+14.2%', label: 'DEMO / ILLUSTRATIVE' },
                { name: 'Cost per experiment', def: 'Average AI inference + analysis cost per experiment.', value: '$180', label: 'DEMO / ILLUSTRATIVE' },
                { name: '% resulting in iteration', def: '% of experiments with ITERATE decision.', value: '45%', label: 'DEMO / ILLUSTRATIVE' },
              ].map((m, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">{m.name}</td>
                  <td className="p-4 text-slate-600">{m.def}</td>
                  <td className="p-4 text-slate-600 text-right font-mono">{m.value}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium border-purple-200 text-purple-700 bg-purple-50">
                      {m.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Metric Definition vs Demo Values</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Product Metric Definition</h4>
            <p className="text-sm text-slate-600">
              Each metric has a formal definition, formula, and owner. These are
              real product governance artifacts — not generated numbers.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-slate-900 mb-2">Demo Metric Values</h4>
            <p className="text-sm text-slate-700">
              All numeric values shown above are <strong>synthetic / demo data</strong>.
              They illustrate what the dashboard would look like with real usage
              but do not represent actual product performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
