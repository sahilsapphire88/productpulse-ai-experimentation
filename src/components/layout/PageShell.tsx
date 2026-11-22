import * as React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  FileText,
  BarChart3,
  ShieldCheck,
  PlayCircle,
  BookOpen,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create', label: 'Create Experiment', icon: PlayCircle },
  { href: '/hypothesis', label: 'Hypothesis', icon: FileText },
  { href: '/design', label: 'Experiment Design', icon: Settings },
  { href: '/results', label: 'Results', icon: BarChart3 },
  { href: '/decision', label: 'Decision', icon: ShieldCheck },
  { href: '/simulator', label: 'What-If Simulator', icon: Settings },
  { href: '/history', label: 'Decision Log', icon: FileText },
  { href: '/metrics', label: 'Product Metrics', icon: LayoutDashboard },
  { href: '/docs', label: 'Documentation', icon: BookOpen },
];

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  return (
    <aside className={['fixed inset-y-0 left-0 z-20 w-64 border-r border-slate-200 bg-white', className].filter(Boolean).join(' ')}>
      <div className="flex h-full flex-col">
        <div className="p-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight">ExperimentLab</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            const base = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors';
            const active = 'bg-blue-50 text-blue-700 border-r-2 border-blue-700';
            const inactive = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';
            return (
              <Link
                key={item.href}
                to={item.href}
                className={[base, isActive ? active : inactive].join(' ')}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-3">All data is synthetic</p>
          <button className="w-full flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>
    </aside>
  );
}

export function TopNav({ className }: { className?: string }) {
  return (
    <header className={['sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80', className].filter(Boolean).join(' ')}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Demo Mode</span>
            <span className="flex h-6 items-center gap-1 px-2 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              SYNTHETIC DATA
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <span className="text-sm font-semibold">AD</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
