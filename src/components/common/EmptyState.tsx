import * as React from 'react';
import { BookOpen, BarChart3 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = BookOpen,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={['flex flex-col items-center justify-center py-12 text-center', className].filter(Boolean).join(' ')}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function EmptyExperiments() {
  return (
    <EmptyState
      title="No experiments yet"
      description="Create your first experiment to get started with AI-powered product decision making."
      icon={BarChart3}
    />
  );
}
