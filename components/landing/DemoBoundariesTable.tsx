'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function DemoBoundariesTable() {
  const rows = [
    { capability: 'Lead Capture & Validation', demo: '\u2705 Full \u2014 schema validation, sanitization, idempotency keys', prod: '\u2705 Identical' },
    { capability: 'AI Qualification & Scoring', demo: '\u2705 Full \u2014 deterministic scoring, scenario evaluation', prod: '\u2705 Identical (with real LLM)' },
    { capability: 'Deduplication', demo: '\u2705 Full \u2014 fuzzy matching, confidence scoring', prod: '\u2705 Identical' },
    { capability: 'Review Queue', demo: '\u2705 Full \u2014 approve/modify/reject/request-info UI', prod: '\u2705 Identical' },
    { capability: 'CRM Write (HubSpot)', demo: '\u26A0\uFE0F Simulated \u2014 prepares record, logs "would create"', prod: '\u2705 Real API write with idempotency' },
    { capability: 'Follow-up Email', demo: '\u26A0\uFE0F Simulated \u2014 prepares template, logs "would send"', prod: '\u2705 Real send via Mailpit/SendGrid' },
    { capability: 'Team Notification (Slack)', demo: '\u26A0\uFE0F Simulated \u2014 formats message, logs "would post"', prod: '\u2705 Real webhook post' },
    { capability: 'Workflow Execution (n8n)', demo: '\u26A0\uFE0F Simulated \u2014 executes logic, logs steps', prod: '\u2705 Real n8n workflow runs' },
    { capability: 'Audit Trail', demo: '\u2705 Full \u2014 every decision logged with provenance', prod: '\u2705 Identical + immutable storage' },
    { capability: 'Failure Recovery', demo: '\u2705 Full \u2014 retry logic, backoff, classification', prod: '\u2705 Identical + real API retries' },
    { capability: 'Company Enrichment', demo: '\u26A0\uFE0F Demo data \u2014 marked "DEMO ENRICHED" provenance', prod: '\u2705 Real Clearbit/Apollo/API' },
  ];

  return (
    <section className="max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-surface-secondary/50" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
      <div className="text-center space-y-4 mb-12">
        <Badge variant="neutral" size="sm" className="inline-flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-brand-cyan-dim flex items-center justify-center text-brand-cyan">✓</span>
          <span>Demo Boundaries</span>
        </Badge>
        <h2 className="text-section-title text-text-primary">What Demo Mode Does (and Doesn\u2019t) Do</h2>
        <p className="text-body text-text-secondary max-w-2xl mx-auto">
          Transparent about simulation. No false claims of external actions.
        </p>
      </div>

      <Card variant="padded" className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell w-1/3 text-left">Capability</th>
              <th className="table-header-cell w-1/3 text-left">Demo Mode</th>
              <th className="table-header-cell text-left">Production</th>
            </tr>
          </thead>
          <tbody className="table-body divide-y divide-border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
            {rows.map((row, i) => (
              <tr key={i} className="table-row">
                <td className="table-cell table-cell-primary font-medium">{row.capability}</td>
                <td className="table-cell table-cell-mono text-text-secondary">{row.demo}</td>
                <td className="table-cell table-cell-mono text-text-secondary">{row.prod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}