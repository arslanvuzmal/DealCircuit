import React from 'react';
import { prisma } from '@/lib/db';
import { Radio, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function IntegrationsPage() {
  const events = await prisma.integrationEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { lead: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-emerald" /> Integrations & CRM Event Logs
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Outbound integration activity for CRM Sync, Webhooks, and Mailpit dispatch events.
          </p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-text">
            <thead className="bg-dark-bg/60 text-dark-muted font-semibold uppercase border-b border-dark-border">
              <tr>
                <th className="p-3">Target System</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Lead Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3">Attempts</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-dark-hover/50 transition">
                  <td className="p-3 font-bold text-dark-bright">{evt.system}</td>
                  <td className="p-3 font-mono text-brand-cyan">{evt.eventType}</td>
                  <td className="p-3">{evt.lead?.fullName || 'System Event'}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        evt.status === 'SUCCESS'
                          ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                          : evt.status === 'FAILED'
                          ? 'bg-brand-coral/10 text-brand-coral border-brand-coral/30'
                          : 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{evt.attempts}/{evt.maxAttempts}</td>
                  <td className="p-3 text-dark-muted text-[11px]">{new Date(evt.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
