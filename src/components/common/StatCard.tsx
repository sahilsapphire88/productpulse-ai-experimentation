import * as React from 'react';
import { DataBadge } from './DataBadge';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  labelKind?: 'SYNTHETIC' | 'AI_GENERATED' | 'ILLUSTRATIVE';
  className?: string;
}

export function StatCard({
  title,
  value,
  delta,
  deltaPositive,
  labelKind,
  className,
}: StatCardProps) {
  return (
    <div className={['stat-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="flex items-baseline mt-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {delta && (
          <span className={`ml-2 text-sm font-medium ${
            deltaPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {delta}
          </span>
        )}
      </div>
      {labelKind && (
        <div className="mt-3">
          <DataBadge kind={labelKind} className="text-[10px]" />
        </div>
      )}
    </div>
  );
}
