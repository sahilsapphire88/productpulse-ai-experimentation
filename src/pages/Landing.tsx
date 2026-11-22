import * as React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, BarChart3, Zap, ShieldCheck, PlayCircle, BookOpen } from 'lucide-react';
import { DataBadge } from '../components/common/DataBadge';

export default function Landing() {
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-6">
          SYNTHETIC / DEMO DATA
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          ExperimentLab
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
          AI Experimentation Copilot for Product Managers. Turn product ideas
          into measurable hypotheses, design experiments, analyze results, and
          make evidence-based Ship / Iterate / Kill decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a href="/dashboard" className="btn-primary px-8 py-3 text-lg flex items-center justify-center gap-2">
            <PlayCircle className="h-5 w-5" /> Get Started
          </a>
          <Link to="/docs" className="btn-secondary px-8 py-3 text-lg flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5" /> Documentation
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <FeatureCard icon={Rocket} title="Structured Workflow" description="Idea → Hypothesis → Experiment → Analysis → Decision" />
          <FeatureCard icon={Zap} title="AI Hypothesis Generator" description="Structured hypotheses with assumptions, risks, failure modes." />
          <FeatureCard icon={BarChart3} title="Analysis Engine" description="Statistical analysis computed from demo data." />
          <FeatureCard icon={ShieldCheck} title="Decision Engine" description="Transparent SHIP / ITERATE / KILL with reasoning." />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 text-left">
          <h3 className="font-semibold text-slate-900 mb-2">Ethical Data Disclaimer</h3>
          <p className="text-sm text-slate-600">
            All experiment data, metrics, and results in this demo are{' '}
            <span className="font-medium text-amber-700">synthetic / demo data</span>.
            No real customers, real experiments, or real statistical results are
            represented. All research participants and pricing are
            <span className="font-medium text-purple-700">illustrative</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
