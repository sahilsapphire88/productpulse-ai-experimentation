import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExperiment } from '../store/experimentStore';
import { Button } from '../components/ui/button';
import type { Experiment, MetricConfig, Variant } from '../types';

export default function ExperimentDesign() {
  const navigate = useNavigate();
  const { state, dispatch } = useExperiment();
  const exp = state.experiment;

  if (!exp) return null;

  const [trafficShare, setTrafficShare] = React.useState(
    exp.variants.find((v) => v.id === 'treatment')?.trafficShare ?? 0.5
  );

  const handleUpdate = (field: keyof Experiment, value: unknown) => {
    dispatch({ type: 'SET_EXPERIMENT', payload: { ...exp, [field]: value } as Experiment });
  };

  const handleMetricChange = (index: number, field: string, value: string | number) => {
    const metrics = [...exp.metrics];
    const m = metrics[index];
    if (!m) return;
    metrics[index] = { ...m, [field]: value };
    handleUpdate('metrics', metrics);
  };

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    const variants = [...exp.variants];
    const v = variants[index];
    if (!v) return;
    variants[index] = { ...v, [field]: value };
    if (field === 'trafficShare') {
      const otherIndex = index === 0 ? 1 : 0;
      const other = variants[otherIndex];
      if (other) {
        variants[otherIndex] = { ...other, trafficShare: 1 - Number(value) };
      }
    }
    handleUpdate('variants', variants);
    setTrafficShare(variants[index].trafficShare);
  };

  const primaryMetric = exp.metrics.find((m) => m.kind === 'PRIMARY');

  return (
    <div className="page-container">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Experiment Design</h2>
        <p className="text-sm text-slate-500">
          Configure your experiment: type, variants, traffic allocation, and metrics.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Experiment Type</label>
          <div className="grid grid-cols-2 gap-2">
            {['AB_TEST', 'FEATURE_FLAG', 'HOLDOUT', 'PRE_POST'].map((type) => (
              <button
                key={type}
                onClick={() => handleUpdate('experimentType', type)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  exp.experimentType === type
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Variants & Traffic Allocation</label>
          <div className="grid grid-cols-2 gap-4">
            {exp.variants.map((variant, i) => (
              <div key={variant.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold text-slate-900">{variant.name}</span>
                  <span className="text-xs font-mono text-slate-400">{variant.id}</span>
                </div>
                <div className="space-y-1 mb-3">
                  <label className="text-xs font-medium text-slate-500 block">Description</label>
                  <input
                    value={variant.description}
                    onChange={(e) => handleVariantChange(i, 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Traffic Share</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={variant.trafficShare}
                    onChange={(e) => handleVariantChange(i, 'trafficShare', e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{Math.round(variant.trafficShare * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">Total traffic must equal 100%.</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Metrics</label>
          <p className="text-xs text-slate-400 mb-3">
            Configure primary, secondary, and guardrail metrics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['PRIMARY', 'SECONDARY', 'GUARDRAIL'].map((kind) => (
              <div key={kind} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                  {kind}
                </h4>
                {exp.metrics.filter((m) => m.kind === kind).map((m) => {
                  const metricIndex = exp.metrics.findIndex(
                    (mm) => mm.name === m.name && mm.kind === m.kind
                  );
                  return (
                    <div key={m.name} className="mb-3">
                      <label className="text-xs font-medium text-slate-700 block">{m.label}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={m.baselineValue}
                        onChange={(e) => {
                          const val =
                            kind === 'PRIMARY'
                              ? Number(e.target.value) / 100
                              : Number(e.target.value);
                          if (metricIndex >= 0) {
                            handleMetricChange(metricIndex, 'baselineValue', val);
                          }
                        }}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                      {m.targetValue !== undefined && (
                        <div className="text-xs text-slate-400">
                          Target: {(m.targetValue * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-slate-200">
          <Link to="/hypothesis" className="btn-secondary">Back</Link>
          <Button onClick={() => navigate('/results')}>
            Generate Data & Analyze →
          </Button>
        </div>
      </div>
    </div>
  );
}
