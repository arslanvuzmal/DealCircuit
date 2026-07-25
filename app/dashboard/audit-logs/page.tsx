import React from 'react';
import { prisma } from '@/lib/db';
import { History, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-brand-cyan" /> Audit Logs & Security History
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Immutable audit record of user approvals, score adjustments, and administrative overrides.
          </p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-text">
            <thead className="bg-dark-bg/60 text-dark-muted font-semibold uppercase border-b border-dark-border">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity Type</th>
                <th className="p-3">Entity ID</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-hover/50 transition">
                  <td className="p-3 font-semibold text-dark-bright">{log.userEmail || 'System Auto'}</td>
                  <td className="p-3 font-mono text-brand-purple">{log.action}</td>
                  <td className="p-3">{log.entityType}</td>
                  <td className="p-3 font-mono text-dark-muted">{log.entityId}</td>
                  <td className="p-3 text-dark-muted">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
