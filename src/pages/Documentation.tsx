import * as React from 'react';
import { DataBadge } from '../components/common/DataBadge';

const docs = [
  { file: 'PRD.md', title: 'Product Requirements Document', desc: 'Problem statement, goals, success metrics, and scope.' },
  { file: 'Product-Hypothesis.md', title: 'Product Hypothesis', desc: 'The PM-level hypothesis for ExperimentLab itself.' },
  { file: 'User-Research-Plan.md', title: 'User Research Plan', desc: 'Ethical research plan with illustrative participants.' },
  { file: 'Personas.md', title: 'Personas', desc: 'PM, Growth PM, AI PM, and Product Analyst personas.' },
  { file: 'Competitive-Analysis.md', title: 'Competitive Analysis', desc: 'Market landscape and identified gaps.' },
  { file: 'RICE-Prioritization.md', title: 'RICE Prioritization', desc: 'Feature backlog scored by Reach × Impact × Confidence / Effort.' },
  { file: 'MoSCoW-Prioritization.md', title: 'MoSCoW Prioritization', desc: 'Must / Should / Could / Won\'t feature breakdown.' },
  { file: 'Product-Metrics.md', title: 'Product Metrics', desc: 'North star metric and supporting metrics.' },
  { file: 'Experimentation-Framework.md', title: 'Experimentation Framework', desc: 'Before / During / After experiment workflow.' },
  { file: 'Product-Decision-Log.md', title: 'Product Decision Log', desc: 'Template and example decision records.' },
  { file: 'Technical-Architecture.md', title: 'Technical Architecture', desc: 'Stack, data flow, and engine responsibilities.' },
  { file: 'Business-Model.md', title: 'Business Model', desc: 'Free / Pro / Team tiers with illustrative pricing.' },
  { file: 'Roadmap.md', title: 'Roadmap', desc: 'Phase 1 MVP, Phase 2, Phase 3 plans.' },
  { file: 'Case-Study.md', title: 'Case Study', desc: 'End-to-end worked example of the AI recommendations experiment.' },
];

export default function Documentation() {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Product Documentation</h2>
        <p className="text-sm text-slate-500">Full product thinking behind ExperimentLab.</p>
      </div>

      <div className="mb-6">
        <DataBadge kind="ILLUSTRATIVE" className="text-[10px]" />
        <span className="ml-2 text-xs text-slate-500">All documentation contents are illustrative / hypothetical.</span>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {docs.map((d) => (
          <a
            key={d.file}
            href={`/docs/${d.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-slate-400">📄</span>
              <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600">{d.title}</h4>
            </div>
            <p className="text-xs text-slate-500">{d.desc}</p>
          </a>
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-3">How to read these docs</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-slate-400">•</span>
            Each document opens in a new tab as a Markdown file.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-slate-400">•</span>
            Research participants, pricing, and metric values are labeled <strong>Illustrative</strong> or <strong>Synthetic / Demo Data</strong>.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-slate-400">•</span>
            No real customer data, real experiments, or real statistical results are claimed.
          </li>
        </ul>
      </div>
    </div>
  );
}
