'use client';

import React from 'react';
import { Database, Search, Brain, GitBranch, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface DecisionPipelineStep {
  label: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
  status: 'complete' | 'active' | 'pending';
}

export function DecisionPipeline() {
  const steps: DecisionPipelineStep[] = [
    { label: 'Capture', icon: <Database className="w-8 h-8" />, color: 'brand-blue', desc: 'Webhook / Form / API', status: 'complete' },
    { label: 'Deduplicate', icon: <Search className="w-8 h-8" />, color: 'brand-cyan', desc: 'Fuzzy match + merge', status: 'complete' },
    { label: 'Qualify', icon: <Brain className="w-8 h-8" />, color: 'brand-cyan', desc: 'AI scoring + scenario', status: 'complete' },
    { label: 'Route', icon: <GitBranch className="w-8 h-8" />, color: 'amber', desc: 'Auto or human review', status: 'active' },
    { label: 'Execute', icon: <CheckCircle2 className="w-8 h-8" />, color: 'emerald', desc: 'CRM + Follow-up + Log', status: 'pending' },
  ];

  return (
    <div className="relative">
      <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }} aria-hidden="true" />
      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[calc(60%-2rem)] h-0.5 bg-brand-cyan" style={{ backgroundColor: 'var(--color-brand-cyan)' }} aria-hidden="true" />

      <div className="relative flex flex-col gap-8 sm:gap-10 px-8">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-6 relative">
            <div className="relative flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center bg-surface border-2 border-border-subtle transition-all duration-300"
              style={{
                backgroundColor: step.status === 'active' ? 'var(--color-brand-cyan-dim)' : 'var(--color-surface-default)',
                borderColor: step.status === 'complete' ? 'var(--color-status-success)' : step.status === 'active' ? 'var(--color-brand-cyan)' : 'var(--color-border-subtle)',
                boxShadow: step.status === 'active' ? '0 0 0 4px var(--color-brand-cyan-dim)' : 'none',
              }}
            >
              {step.icon}
              {step.status === 'complete' && (
                <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-status-success bg-surface rounded-full" />
              )}
              {step.status === 'active' && (
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-brand-cyan animate-pulse-soft" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-text-primary"
                  style={{ color: step.status === 'pending' ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}
                >
                  {step.label}
                </h4>
                {step.status === 'active' && <Badge variant="info" size="xs">ACTIVE</Badge>}
                {step.status === 'complete' && <Badge variant="success" size="xs">DONE</Badge>}
                {step.status === 'pending' && <Badge variant="neutral" size="xs">PENDING</Badge>}
              </div>
              <p className="text-body-sm text-text-muted"
                style={{ color: step.status === 'pending' ? 'var(--color-text-placeholder)' : 'var(--color-text-muted)' }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}