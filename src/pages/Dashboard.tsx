import * as React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, PlayCircle, ShieldCheck, Clock } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { DataBadge } from '../components/common/DataBadge';
import { useExperiment } from '../store/experimentStore';

export default function Dashboard() {
  const { state } = useExperiment();
  const exp = state.experiment;

  const experiments = exp ? [
    {
      id: exp.id,
      name: exp.name,
      status: exp.status as 'Running' | 'Completed' | 'Draft' | 'Archived',
      primaryMetric: exp.primaryMetric,
      lift: state.result ? state.result.lift : null,
      significance: state.result ? state.result.significance : null,
      decision: state.decision,
    },
  ] : [];

  return (
    <div className="page-container">
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Experiment Dashboard</h2>
          <p className="text-sm text-slate-500">Monitor active experiments and track decision outcomes.</p>
        </div>
        <div className="flex items-end gap-2">
          <Link to="/create" className="btn-primary">Create Experiment</Link>
        </div>
      </div>

      <div className="mb-8">
        <DataBadge kind="SYNTHETIC" className="text-[10px]" />
        <span className="ml-2 text-xs text-slate-500">All dashboard figures are synthetic / demo data.</span>
      </div>

      {/* Health stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Running experiments" value={experiments.filter(e => e.status === 'Running').length} labelKind="SYNTHETIC" />
        <StatCard title="Completed experiments" value={experiments.filter(e => e.status === 'Completed').length} labelKind="SYNTHETIC" />
        <StatCard title="Win rate" value="60%" delta="+12% vs last month" deltaPositive labelKind="SYNTHETIC" />
        <StatCard title="Avg lift" value="+14.2%" labelKind="SYNTHETIC" />
      </div>

      {/* Active experiments */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Active Experiments
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 font-semibold text-slate-600">Experiment</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
                <th className="p-4 font-semibold text-slate-600">Primary metric</th>
                <th className="p-4 font-semibold text-slate-600">Current lift</th>
                <th className="p-4 font-semibold text-slate-600">Confidence</th>
                <th className="p-4 font-semibold text-slate-600">Decision</th>
              </tr>
            </thead>
            <tbody>
              {experiments.length > 0 ? experiments.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <Link to={`/experiments/${e.id}`} className="font-medium text-slate-900 hover:text-blue-600">{e.name}</Link>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                      e.status === 'Running' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{e.primaryMetric}</td>
                  <td className="p-4">
                    {e.lift ? (
                      <span className={`font-medium ${e.lift.relative > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {e.lift.absolute > 0 ? '+' : ''}{e.lift.absolute.toFixed(1)} pp
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {e.significance ? (
                      <span className={`font-medium ${e.significance.isSignificant ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {(e.significance.isSignificant ? (1 - e.significance.pValue) * 100 : 0).toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {e.decision ? (
                      <DecisionChip decision={e.decision.decision} />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No experiments yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <ExperimentHealthCard
          title="Avg experiment duration"
          value="14 days"
          icon={Clock}
          labelKind="SYNTHETIC"
        />
        <ExperimentHealthCard
          title="Cost per experiment"
          value="$180"
          labelKind="SYNTHETIC"
        />
        <ExperimentHealthCard
          title="Experiments resulting in iteration"
          value="35%"
          labelKind="SYNTHETIC"
        />
        <ExperimentHealthCard
          title="Decision confidence"
          value="82%"
          labelKind="SYNTHETIC"
        />
      </div>
    </div>
  );
}

function DecisionChip({ decision }: { decision: 'SHIP' | 'ITERATE' | 'KILL' }) {
  const config: Record<string, { color: string; text: string }> = {
    SHIP: { color: 'bg-emerald-50 text-emerald-700', text: '🚀 SHIP' },
    ITERATE: { color: 'bg-amber-50 text-amber-700', text: '🔄 ITERATE' },
    KILL: { color: 'bg-rose-50 text-rose-700', text: '🛑 KILL' },
  };
  const c = config[decision as keyof typeof config]!;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${c.color}`}>
      {c.text}
    </span>
  );
}

function ExperimentHealthCard({ title, value, icon: Icon, labelKind }: { title: string; value: string; icon?: React.ElementType; labelKind?: 'SYNTHETIC' | 'AI_GENERATED' | 'ILLUSTRATIVE' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      {Icon && (
        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{title}</div>
      {labelKind && <DataBadge kind={labelKind} className="mt-2 text-[10px]" />}
    </div>
  );
}
