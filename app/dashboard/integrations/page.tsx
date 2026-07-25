import React from 'react';
import { prisma } from '@/lib/db';
import { Radio, CheckCircle2, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

export const revalidate = 0;

export default async function IntegrationsPage() {
  const events = await prisma.integrationEvent.findMany({
    include: { lead: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const failedCount = await prisma.integrationEvent.count({ where: { status: 'FAILED' } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-emerald" /> Integrations & CRM Status Monitor
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Monitor real-time status for local Demo CRM, Mailpit SMTP, and n8n webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald rounded-lg font-mono font-semibold">
            Demo CRM: Active
          </span>
        </div>
      </div>

      {/* Integration Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark-bright text-sm">Demo CRM Adapter</h3>
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
          </div>
          <p className="text-xs text-dark-muted">
            Built-in CRM adapter supporting contacts, companies, opportunities, and simulated failure testing.
          </p>
          <div className="text-[11px] font-mono text-dark-bright bg-dark-bg p-2 rounded border border-dark-border">
            Status: HEALTHY (Zero paid API needed)
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark-bright text-sm">Mailpit Email Adapter</h3>
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
          </div>
          <p className="text-xs text-dark-muted">
            Local SMTP server capturing all follow-up drafts and digest emails without external sending limits.
          </p>
          <a
            href="http://localhost:8025"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-brand-cyan hover:underline flex items-center gap-1"
          >
            http://localhost:8025 <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark-bright text-sm">n8n Automation Engine</h3>
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
          </div>
          <p className="text-xs text-dark-muted">
            Workflow orchestration for Lead Intake, Daily Digest, Failed Event Retry, and Review Completion.
          </p>
          <div className="text-[11px] font-mono text-dark-bright bg-dark-bg p-2 rounded border border-dark-border">
            Workflows: 4 Importable JSON specs
          </div>
        </div>
      </div>

      {/* Integration Events Log */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-dark-bright">Recent Integration Events Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-text">
            <thead className="bg-dark-bg/60 text-dark-muted font-semibold uppercase border-b border-dark-border">
              <tr>
                <th className="p-3">Target System</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Lead Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3">Attempts</th>
                <th className="p-3">Error / Result</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-dark-hover/50 transition">
                  <td className="p-3 font-semibold text-dark-bright font-mono">{evt.system}</td>
                  <td className="p-3 font-mono text-dark-muted">{evt.eventType}</td>
                  <td className="p-3">{evt.lead.fullName} ({evt.lead.companyName})</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        evt.status === 'SUCCESS'
                          ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                          : 'bg-brand-coral/10 text-brand-coral border-brand-coral/30'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-dark-bright">{evt.attempts} / {evt.maxAttempts}</td>
                  <td className="p-3 text-dark-muted truncate max-w-[200px]">
                    {evt.lastError || 'Clean Execution'}
                  </td>
                  <td className="p-3 text-dark-muted text-[11px]">
                    {new Date(evt.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
