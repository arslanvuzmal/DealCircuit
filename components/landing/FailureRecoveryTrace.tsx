'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function FailureRecoveryTrace() {
  return (
    <section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center space-y-4 mb-12">
        <Badge variant="error" size="sm" className="inline-flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Failure Recovery</span>
        </Badge>
        <h2 className="text-section-title text-text-primary">When APIs Fail \u2014 Automatic Recovery</h2>
        <p className="text-body text-text-secondary max-w-2xl mx-auto">
          Mature automation doesn\u2019t silently stop. Exponential backoff, retry classification, full traceability.
        </p>
      </div>

      <Card variant="padded" className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-surface-raised border-b border-border-subtle px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-text-primary">Workflow Run: lead-intake-2024-01-15-1423</h3>
                <p className="text-caption text-text-muted">Lead L-2024-045 \u00b7 HubSpot CRM write failed \u00b7 Recovered on attempt #2</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" size="sm">RECOVERED</Badge>
                <span className="text-mono-sm text-text-muted">idempotency: lead_abc123_erp_001</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell w-20 text-left">Attempt</th>
                  <th className="table-header-cell w-24 text-left">Time</th>
                  <th className="table-header-cell text-left">Action</th>
                  <th className="table-header-cell w-32 text-left">Status</th>
                  <th className="table-header-cell w-40 text-left">Error / Resolution</th>
                  <th className="table-header-cell w-28 text-left">Duration</th>
                </tr>
              </thead>
              <tbody className="table-body divide-y divide-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <tr className="table-row">
                  <td className="table-cell table-cell-mono">1</td>
                  <td className="table-cell table-cell-mono">14:23:12</td>
                  <td className="table-cell">HubSpot: Create Opportunity</td>
                  <td className="table-cell"><Badge variant="error" size="xs">FAILED</Badge></td>
                  <td className="table-cell table-cell-mono text-text-muted">RATE_LIMITED (429) \u2014 retryable</td>
                  <td className="table-cell table-cell-mono">1.2s</td>
                </tr>
                <tr className="table-row">
                  <td className="table-cell table-cell-mono">2</td>
                  <td className="table-cell table-cell-mono">14:23:18</td>
                  <td className="table-cell">Retry with backoff (6s)</td>
                  <td className="table-cell"><Badge variant="warning" size="xs">RETRYING</Badge></td>
                  <td className="table-cell table-cell-mono text-text-muted">Exponential backoff applied</td>
                  <td className="table-cell table-cell-mono">6.1s</td>
                </tr>
                <tr className="table-row">
                  <td className="table-cell table-cell-mono">3</td>
                  <td className="table-cell table-cell-mono">14:23:25</td>
                  <td className="table-cell">HubSpot: Create Opportunity</td>
                  <td className="table-cell"><Badge variant="success" size="xs">SUCCESS</Badge></td>
                  <td className="table-cell table-cell-mono text-text-primary">Opportunity created: opp_7k9m2</td>
                  <td className="table-cell table-cell-mono">2.8s</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-surface-interactive border-t border-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="grid sm:grid-cols-3 gap-4 text-body-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-status-success" />
                <span className="font-medium text-text-primary">Idempotent</span>
                <span className="text-text-muted">Same key = no duplicate</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-status-warning" />
                <span className="font-medium text-text-primary">Bounded Retries</span>
                <span className="text-text-muted">Max 3 attempts, then alert</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-status-info" />
                <span className="font-medium text-text-primary">Full Audit</span>
                <span className="text-text-muted">Every attempt logged</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}