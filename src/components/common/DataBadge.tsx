import * as React from 'react';
import { AlertTriangle, Info, Sparkles } from 'lucide-react';

interface DataBadgeProps {
  kind: 'SYNTHETIC' | 'AI_GENERATED' | 'ILLUSTRATIVE';
  className?: string;
}

const KIND_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  SYNTHETIC: { icon: AlertTriangle, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  AI_GENERATED: { icon: Sparkles, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  ILLUSTRATIVE: { icon: Info, color: 'bg-purple-50 border-purple-200 text-purple-700' },
};

const KIND_LABEL: Record<string, string> = {
  SYNTHETIC: 'SYNTHETIC / DEMO DATA',
  AI_GENERATED: 'AI-GENERATED HYPOTHESIS',
  ILLUSTRATIVE: 'ILLUSTRATIVE',
};

export function DataBadge({ kind, className }: DataBadgeProps) {
  const config = KIND_CONFIG[kind]!;
  const Icon = config.icon;
  const label = KIND_LABEL[kind];
  return (
    <span className={className}>
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
        <Icon className="mr-1.5 h-3.5 w-3.5" />
        {label}
      </span>
    </span>
  );
}

export function SyntheticBadge({ className }: { className?: string }) {
  return <DataBadge kind="SYNTHETIC" className={className} />;
}

export function AIGeneratedBadge({ className }: { className?: string }) {
  return <DataBadge kind="AI_GENERATED" className={className} />;
}

export function IllustrativeBadge({ className }: { className?: string }) {
  return <DataBadge kind="ILLUSTRATIVE" className={className} />;
}
