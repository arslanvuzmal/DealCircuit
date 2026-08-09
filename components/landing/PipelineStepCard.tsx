'use client';

import React from 'react';
import { Database, Search, Brain, GitBranch, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface PipelineStepCardProps {
  step: number;
  label: string;
  icon: React.ReactNode;
  desc: string;
  color: string;
  detail: string;
  isLast?: boolean;
}

export function PipelineStepCard({ step, label, icon, desc, color, detail, isLast }: PipelineStepCardProps) {
  const colorMap: Record<string, string> = {
    'brand-blue': 'var(--color-brand-blue)',
    'brand-cyan': 'var(--color-brand-cyan)',
    'amber': 'var(--color-status-warning)',
    'emerald': 'var(--color-status-success)',
  };

  const bgMap: Record<string, string> = {
    'brand-blue': 'var(--color-brand-blue-light)',
    'brand-cyan': 'var(--color-brand-cyan-light)',
    'amber': 'var(--color-status-warning-bg)',
    'emerald': 'var(--color-status-success-bg)',
  };

  return (
    <Card variant="padded" className="relative space-y-4 group"
      style={{
        borderLeft: `3px solid ${colorMap[color]}`,
        borderLeftWidth: '3px',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgMap[color], color: colorMap[color] }}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-caption font-mono text-text-muted">{step}.</span>
            <h4 className="font-semibold text-text-primary">{label}</h4>
          </div>
          <p className="text-body-sm text-text-muted mt-1">{desc}</p>
        </div>
      </div>

      <div className="pl-13 text-caption text-text-muted border-l border-border-subtle pl-3"
        style={{ borderColor: 'var(--color-border-subtle)' }}>
        {detail}
      </div>

      {!isLast && (
        <div className="absolute left-5 top-[5.5rem] bottom-[-2.5rem] w-0.5 bg-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }} aria-hidden="true" />
      )}
    </Card>
  );
}