import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../store/experimentStore';
import { Button } from '../components/ui/button';
import { DataBadge } from '../components/common/DataBadge';
import type { Experiment } from '../types';

interface FormValues {
  product: string;
  name: string;
  problem: string;
  targetUsers: string;
  featureDescription: string;
  expectedBehavior: string;
  businessGoal: string;
  baselineMetric: number;
  expectedImprovement: number;
  durationDays: number;
  additionalCostPerUser: number;
  revenuePerConversion: number;
}

const DEFAULTS: FormValues = {
  product: 'Consumer app',
  name: 'AI-generated personalized recommendations',
  problem: 'Low conversion among infrequent users',
  targetUsers: 'Users with fewer than 3 sessions/week',
  featureDescription: 'AI-generated personalized recommendations on the home feed.',
  expectedBehavior: 'Target users click recommendations and convert at a higher rate.',
  businessGoal: 'Increase conversion and retention among low-engagement segments.',
  baselineMetric: 12,
  expectedImprovement: 15,
  durationDays: 14,
  additionalCostPerUser: 0.03,
  revenuePerConversion: 45,
};

export default function CreateExperiment() {
  const navigate = useNavigate();
  const { dispatch } = useExperiment();
  const [values, setValues] = React.useState<FormValues>(DEFAULTS);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (key: keyof FormValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = 'Feature name is required.';
    if (!values.problem.trim()) next.problem = 'Problem is required.';
    if (!values.targetUsers.trim()) next.targetUsers = 'Target users is required.';
    if (values.baselineMetric < 0 || values.baselineMetric > 100) next.baselineMetric = 'Must be 0-100.';
    if (values.expectedImprovement <= values.baselineMetric) next.expectedImprovement = 'Must exceed baseline.';
    if (values.durationDays < 1) next.durationDays = 'Must be at least 1 day.';
    if (values.additionalCostPerUser < 0) next.additionalCostPerUser = 'Must be non-negative.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const experiment: Experiment = {
      id: `exp-${Date.now()}`,
      name: values.name,
      status: 'DRAFT' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: values.product,
      problem: values.problem,
      targetUsers: values.targetUsers,
      featureDescription: values.featureDescription,
      expectedBehavior: values.expectedBehavior,
      experimentType: 'AB_TEST' as const,
      variants: [
        { id: 'control', name: 'Control', trafficShare: 0.5, description: 'Current experience (no change).' },
        { id: 'treatment', name: 'Treatment', trafficShare: 0.5, description: values.featureDescription },
      ],
      durationDays: values.durationDays,
      metrics: [
        { kind: 'PRIMARY' as const, name: 'Conversion', label: 'Conversion rate', unit: 'percent', baselineValue: values.baselineMetric / 100, targetValue: values.expectedImprovement / 100 },
        { kind: 'SECONDARY' as const, name: 'CTR', label: 'Click-through rate', unit: 'percent', baselineValue: 0.08 },
        { kind: 'SECONDARY' as const, name: 'Session duration', label: 'Avg session duration', unit: 'seconds', baselineValue: 240 },
        { kind: 'GUARDRAIL' as const, name: 'Latency', label: 'Avg latency', unit: 'seconds', baselineValue: 0.28 },
        { kind: 'GUARDRAIL' as const, name: 'Infra cost', label: 'AI cost per user', unit: 'currency', baselineValue: 0 },
      ],
      primaryMetric: 'Conversion',
      additionalCostPerUser: values.additionalCostPerUser,
      revenuePerConversion: values.revenuePerConversion,
      synthetic: true,
      sampleSize: 20000,
    };

    dispatch({ type: 'SET_EXPERIMENT', payload: experiment });
    setSubmitting(false);
    navigate('/hypothesis');
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Experiment</h2>
        <p className="text-sm text-slate-500">Define your product experiment. All generated data will be labelled synthetic / demo data.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Product / feature name" name="name" value={values.name} onChange={(v) => handleChange('name', v)} error={errors.name} />
            <TextField label="Product" name="product" value={values.product} onChange={(v) => handleChange('product', v)} />
          </div>

          <TextArea label="Problem being solved" name="problem" value={values.problem} onChange={(v) => handleChange('problem', v)} error={errors.problem} />
          <TextArea label="Target users" name="targetUsers" value={values.targetUsers} onChange={(v) => handleChange('targetUsers', v)} error={errors.targetUsers} />
          <TextArea label="Feature description" name="featureDescription" value={values.featureDescription} onChange={(v) => handleChange('featureDescription', v)} />
          <TextArea label="Expected user behavior" name="expectedBehavior" value={values.expectedBehavior} onChange={(v) => handleChange('expectedBehavior', v)} />
          <TextArea label="Business goal" name="businessGoal" value={values.businessGoal} onChange={(v) => handleChange('businessGoal', v)} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NumberField label="Current baseline metric (%)" name="baselineMetric" value={values.baselineMetric} onChange={(v) => handleChange('baselineMetric', Number(v))} error={errors.baselineMetric} hint="e.g. 12" />
            <NumberField label="Expected improvement (%)" name="expectedImprovement" value={values.expectedImprovement} onChange={(v) => handleChange('expectedImprovement', Number(v))} error={errors.expectedImprovement} hint="e.g. 15" />
            <NumberField label="Experiment duration (days)" name="durationDays" value={values.durationDays} onChange={(v) => handleChange('durationDays', Number(v))} error={errors.durationDays} hint="e.g. 14" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberField label="Additional AI cost / user ($)" name="additionalCostPerUser" value={values.additionalCostPerUser} step="0.001" onChange={(v) => handleChange('additionalCostPerUser', Number(v))} error={errors.additionalCostPerUser} hint="e.g. 0.03" />
            <NumberField label="Revenue / conversion ($)" name="revenuePerConversion" value={values.revenuePerConversion} onChange={(v) => handleChange('revenuePerConversion', Number(v))} hint="e.g. 45" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Experiment'}
            </Button>
            <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
          <span className="mt-0.5">💡</span>
          <div>
            <p className="text-sm font-medium text-blue-900">Example: AI recommendations</p>
            <p className="text-sm text-blue-700">
              Feature: "AI-generated personalized recommendations" • Target: "Users with fewer than 3 sessions/week" • Baseline conversion: 12% • Expected: 15% • Additional AI cost: $0.03/user
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({ label, name, value, onChange, error }: { label: string; name: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700 block">{label}</label>
      <input
        name={name}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function TextArea({ label, name, value, onChange, error }: { label: string; name: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700 block">{label}</label>
      <textarea
        name={name}
        className={`input-field min-h-[80px] ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function NumberField({ label, name, value, onChange, error, step, hint }: { label: string; name: string; value: number | string; onChange: (v: string) => void; error?: string; step?: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700 block">{label}</label>
      <input
        name={name}
        type="number"
        step={step}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
