'use client';

import React from 'react';
import { FileText, Eye, Edit2, CheckCircle2, XCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SelectProps {
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}

function Select({ options, defaultValue, className, onChange, ...props }: SelectProps) {
  return (
    <select
      defaultValue={defaultValue}
      className={className}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export function HumanControlPreview() {
  const isDemo = true; // Hardcoded for now to avoid parsing issues

  return (
    <section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface-secondary/50" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
      <div className="text-center space-y-4 mb-12">
        <Badge variant="warning" size="sm" className="inline-flex items-center gap-2">
          <Edit2 className="w-3.5 h-3.5" />
          <span>Human Control</span>
        </Badge>
        <h2 className="text-section-title text-text-primary">Review Queue \u2014 When AI Isn\u2019t Sure</h2>
        <p className="text-body text-text-secondary max-w-2xl mx-auto">
          Low confidence, duplicates, and prompt injection attempts route here. Reviewers see full context.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="padded" className="space-y-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Review Queue (3 pending)</span>
              <Badge variant="warning" size="xs">Needs Attention</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { id: 'L-2024-045', company: 'VertexCare Health', score: 52, confidence: '61%', reason: 'Low confidence \u2014 ambiguous requirements', badge: 'Review Required' },
              { id: 'L-2024-038', company: 'ABC Logistics (dup)', score: 78, confidence: '82%', reason: 'Duplicate of L-2024-031', badge: 'Duplicate' },
              { id: 'L-2024-052', company: 'Test Corp', score: 12, confidence: '94%', reason: 'Prompt injection detected', badge: 'Security Flag' },
            ].map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 p-3 bg-surface-interactive border border-border-subtle rounded-lg hover:border-border transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan-dim flex items-center justify-center text-brand-cyan">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary truncate">{lead.company}</span>
                    <Badge variant={lead.badge === 'Security Flag' ? 'error' : lead.badge === 'Duplicate' ? 'warning' : 'info'} size="xs">{lead.badge}</Badge>
                  </div>
                  <p className="text-caption text-text-muted truncate">{lead.reason}</p>
                </div>
                <div className="flex items-center gap-4 text-body-sm text-text-secondary">
                  <span>Score: <span className="font-mono text-text-primary">{lead.score}</span></span>
                  <span>Conf: <span className="font-mono text-text-primary">{lead.confidence}</span></span>
                </div>
                <Button variant="ghost" size="sm">Review</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="padded" className="space-y-4 border-l-2" style={{ borderLeftColor: 'var(--color-brand-cyan)' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-cyan/10 rounded-lg flex items-center justify-center text-brand-cyan">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Review Detail \u2014 L-2024-045</h3>
                <p className="text-caption text-text-muted">VertexCare Health \u00b7 Low confidence</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-surface-interactive border border-border-subtle rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-text-primary">AI Recommendation</h4>
              <div className="grid grid-cols-2 gap-2 text-body-sm">
                <div><span className="text-text-muted">Stage</span><br /><span className="font-medium text-text-primary">Review Required</span></div>
                <div><span className="text-text-muted">Score</span><br /><span className="font-medium text-text-primary">52/100</span></div>
                <div><span className="text-text-muted">Confidence</span><br /><span className="font-mono text-text-primary">61%</span></div>
                <div><span className="text-text-muted">Risk</span><br /><span className="font-medium text-status-warning">Ambiguous requirements</span></div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-caption text-text-muted font-medium">Override Stage</label>
              <Select options={[
                { value: 'Sales Qualified', label: 'Sales Qualified' },
                { value: 'Marketing Qualified', label: 'Marketing Qualified' },
                { value: 'Review Required', label: 'Review Required' },
                { value: 'Disqualified', label: 'Disqualified' },
              ]} defaultValue="Review Required" className="input" />

              <label className="block text-caption text-text-muted font-medium">Override Score (0-100)</label>
              <Input type="number" min={0} max={100} defaultValue={52} className="input" />

              <label className="block text-caption text-text-muted font-medium">Reviewer Notes (Required)</label>
              <textarea className="input min-h-[80px] font-sans" placeholder="Reason for adjustment..." defaultValue="Client mentioned ERP timeline of 6 months. Budget confirmed $150k. Moving to Sales Qualified." />
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <Button variant="success" className="gap-2"><CheckCircle2 className="w-4 h-4" /> Approve</Button>
              <Button variant="danger" className="gap-2"><XCircle className="w-4 h-4" /> Reject</Button>
              <Button variant="secondary" className="gap-2"><RefreshCw className="w-4 h-4" /> Re-qualify</Button>
              <Button variant="ghost" className="gap-2"><Edit2 className="w-4 h-4" /> Request Info</Button>
            </div>

            {isDemo && (
              <Badge variant="info" size="xs" className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                Simulation Mode \u2014 no external CRM or email actions will be performed
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}