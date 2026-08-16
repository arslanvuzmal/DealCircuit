'use client';

import React from 'react';
import { ArrowRight, Zap, CheckCircle2, XCircle, Clock, Users, Server, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface WhatIfComparisonPanelProps {
  traditionalSteps: string[];
  leadPilotSteps: string[];
}

export default function WhatIfComparisonPanel({ traditionalSteps, leadPilotSteps }: WhatIfComparisonPanelProps) {
  return (
    <Card variant="padded" className="space-y-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-amber/10 rounded-lg flex items-center justify-center text-brand-amber">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-body-sm">What If DealCircuit Didn&apos;t Exist?</h3>
            <p className="text-caption text-text-muted">Traditional manual process vs. DealCircuit automation</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="compact" className="p-5 space-y-3" style={{ backgroundColor: 'var(--color-status-error-bg)', borderColor: 'var(--color-status-error-border)' }}>
            <CardHeader>
              <div className="flex items-center gap-2 text-status-error-text mb-3">
                <XCircle className="w-5 h-5" />
                <h4 className="font-semibold text-text-primary">Traditional Manual Process</h4>
              </div>
            </CardHeader>
            <div className="space-y-2">
              {traditionalSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'var(--color-status-error-bg)', color: 'var(--color-status-error-text)' }}>{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="compact" className="p-5 space-y-3" style={{ backgroundColor: 'var(--color-status-success-bg)', borderColor: 'var(--color-status-success-border)' }}>
            <CardHeader>
              <div className="flex items-center gap-2 text-status-success-text mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="font-semibold text-text-primary">DealCircuit Automated Process</h4>
              </div>
            </CardHeader>
            <div className="space-y-2">
              {leadPilotSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'var(--color-status-success-bg)', color: 'var(--color-status-success-text)' }}>{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card variant="compact" className="p-4 space-y-4" style={{ backgroundColor: 'var(--color-surface-interactive)', borderColor: 'var(--color-border-subtle)' }}>
          <h4 className="font-semibold text-text-primary">Key Differences</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-body-sm">
            <div className="bg-surface-interactive p-3 rounded-lg border border-border-subtle">
              <div className="font-medium text-text-secondary mb-1">Time to Qualify</div>
              <div className="text-status-error-text font-medium">~12 min (manual)</div>
              <div className="text-status-success-text font-medium">~8 sec (automated)</div>
            </div>
            <div className="bg-surface-interactive p-3 rounded-lg border border-border-subtle">
              <div className="font-medium text-text-secondary mb-1">Human Review Time</div>
              <div className="text-status-error-text font-medium">~12 min (read + research)</div>
              <div className="text-status-success-text font-medium">~45 sec (review AI output)</div>
            </div>
            <div className="bg-surface-interactive p-3 rounded-lg border border-border-subtle">
              <div className="font-medium text-text-secondary mb-1">Duplicate Risk</div>
              <div className="text-status-error-text font-medium">High (no idempotency)</div>
              <div className="text-status-success-text font-medium">Controlled (idempotency keys)</div>
            </div>
            <div className="bg-surface-interactive p-3 rounded-lg border border-border-subtle">
              <div className="font-medium text-text-secondary mb-1">Failure Recovery</div>
              <div className="text-status-error-text font-medium">Manual intervention</div>
              <div className="text-status-success-text font-medium">Auto-retry + audit</div>
            </div>
            <div className="bg-surface-interactive p-3 rounded-lg border border-border-subtle">
              <div className="font-medium text-text-secondary mb-1">Audit Trail</div>
              <div className="text-status-error-text font-medium">None / scattered</div>
              <div className="text-status-success-text font-medium">Structured execution log</div>
            </div>
            <div className="bg-surface-interactive p-3 rounded-lg border border-border-subtle">
              <div className="font-medium text-text-secondary mb-1">Personalization</div>
              <div className="text-status-error-text font-medium">Generic template</div>
              <div className="text-status-success-text font-medium">Evidence-grounded</div>
            </div>
          </div>
        </Card>

        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <Badge variant="info" size="sm" className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Simulation Mode - comparisons are illustrative
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}