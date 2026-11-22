import * as React from 'react';
import { useExperiment } from '../store/experimentStore';
import { DataBadge } from '../components/common/DataBadge';
import { addDecisionLogEntry, loadDecisionLog } from '../lib/decisionLog';

export default function ExperimentHistory() {
  const { state } = useExperiment();
  const [log, setLog] = React.useState<ReturnType<typeof loadDecisionLog>>([]);
  const [entry, setEntry] = React.useState<{
    experimentName: string;
    hypothesis: string;
    result: string;
    decision: 'SHIP' | 'ITERATE' | 'KILL';
    evidence: string;
    followUp: string;
  }>({
    experimentName: '',
    hypothesis: '',
    result: '',
    decision: 'ITERATE',
    evidence: '',
    followUp: '',
  });

  React.useEffect(() => {
    setLog(loadDecisionLog());
  }, []);

  const handleSave = () => {
    addDecisionLogEntry({
      date: new Date().toISOString(),
      experimentId: 'manual',
      experimentName: entry.experimentName,
      hypothesis: entry.hypothesis,
      result: entry.result,
      decision: entry.decision,
      evidence: entry.evidence,
      followUp: entry.followUp,
    });
    setLog(loadDecisionLog());
    setEntry({
      experimentName: '',
      hypothesis: '',
      result: '',
      decision: 'ITERATE',
      evidence: '',
      followUp: '',
    });
  };

  const exp = state.experiment;
  const decision = state.decision;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Product Decision Log</h2>
        <p className="text-sm text-slate-500">Automatically recorded experiment decisions with evidence and follow-up actions.</p>
      </div>

      <div className="mb-6">
        <DataBadge kind="ILLUSTRATIVE" className="text-[10px]" />
        <span className="ml-2 text-xs text-slate-500">Decision log entries are illustrative records of PM decision-making.</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4">Record Decision</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 block">Experiment Name</label>
                <input
                  value={entry.experimentName}
                  onChange={(e) => setEntry({ ...entry, experimentName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. AI recommendations test"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 block">Hypothesis</label>
                <textarea
                  value={entry.hypothesis}
                  onChange={(e) => setEntry({ ...entry, hypothesis: e.target.value })}
                  className="input-field min-h-[60px]"
                  placeholder="We believe that..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 block">Result</label>
                <textarea
                  value={entry.result}
                  onChange={(e) => setEntry({ ...entry, result: e.target.value })}
                  className="input-field min-h-[60px]"
                  placeholder="Control 12% → Treatment 14.8%"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 block">Decision</label>
                <select
                  value={entry.decision}
                  onChange={(e) => setEntry({ ...entry, decision: e.target.value as any })}
                  className="input-field"
                >
                  <option value="SHIP">🚀 SHIP</option>
                  <option value="ITERATE">🔄 ITERATE</option>
                  <option value="KILL">🛑 KILL</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 block">Evidence</label>
                <textarea
                  value={entry.evidence}
                  onChange={(e) => setEntry({ ...entry, evidence: e.target.value })}
                  className="input-field min-h-[60px]"
                  placeholder="p-value, lift, ROI..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 block">Follow-up Action</label>
                <textarea
                  value={entry.followUp}
                  onChange={(e) => setEntry({ ...entry, followUp: e.target.value })}
                  className="input-field min-h-[60px]"
                  placeholder="Next steps..."
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2">
                Record Decision
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                Decision Log ({log.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 font-semibold text-slate-600 text-left">Date</th>
                    <th className="p-4 font-semibold text-slate-600 text-left">Experiment</th>
                    <th className="p-4 font-semibold text-slate-600 text-left">Decision</th>
                    <th className="p-4 font-semibold text-slate-600 text-left">Evidence</th>
                    <th className="p-4 font-semibold text-slate-600 text-left">Follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {log.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No decisions recorded yet. Record your first decision above.
                      </td>
                    </tr>
                  ) : (
                    log.map((l) => (
                      <tr key={l.id} className="border-b border-slate-100">
                        <td className="p-4 text-slate-600 font-mono text-xs">{new Date(l.date).toLocaleDateString()}</td>
                        <td className="p-4 text-slate-700">{l.experimentName}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                            l.decision === 'SHIP' ? 'bg-emerald-50 text-emerald-700' :
                            l.decision === 'ITERATE' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>
                            {l.decision}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 max-w-xs truncate">{l.evidence}</td>
                        <td className="p-4 text-slate-600 max-w-xs truncate">{l.followUp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {exp && decision && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Quick record:</strong> The current experiment <em>{exp.name}</em> has a decision of{' '}
            <strong>{decision.decision}</strong>. Use the form above to log it with full evidence.
          </p>
        </div>
      )}
    </div>
  );
}
