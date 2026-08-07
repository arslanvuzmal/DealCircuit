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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-xl shadow-card">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-green-600" /> Integrations & CRM Event Logs
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Outbound integration activity for CRM Sync, Webhooks, and Mailpit dispatch events.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-900 table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Target System</th>
                <th className="table-cell">Event Type</th>
                <th className="table-cell">Lead Contact</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Attempts</th>
                <th className="table-cell">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((evt) => (
                <tr key={evt.id} className="table-row-hover">
                  <td className="table-cell font-bold text-gray-900">{evt.system}</td>
                  <td className="table-cell font-mono text-blue-600">{evt.eventType}</td>
                  <td className="table-cell">{evt.lead?.fullName || 'System Event'}</td>
                  <td className="table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        evt.status === 'SUCCESS'
                          ? 'badge-success'
                          : evt.status === 'FAILED'
                          ? 'badge-failed'
                          : evt.status === 'FAILED_PERMANENT'
                          ? 'badge-failed'
                          : 'badge-pending'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="table-cell font-mono">{evt.attempts}/{evt.maxAttempts}</td>
                  <td className="table-cell text-gray-500 text-[11px]">{new Date(evt.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}