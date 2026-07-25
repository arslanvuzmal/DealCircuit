import React from 'react';
import { prisma } from '@/lib/db';
import { Workflow, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WorkflowRunsPage() {
  const runs = await prisma.workflowRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Workflow className="w-5 h-5 text-brand-purple" /> n8n Workflow Execution Logs
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Execution history for lead-intake, daily-digest, failed-retry, and review-completion workflows.
          </p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-text">
            <thead className="bg-dark-bg/60 text-dark-muted font-semibold uppercase border-b border-dark-border">
              <tr>
                <th className="p-3">Workflow Name</th>
                <th className="p-3">Execution ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Started At</th>
                <th className="p-3">Completed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-dark-hover/50 transition">
                  <td className="p-3 font-bold text-dark-bright">{run.workflowName}</td>
                  <td className="p-3 font-mono text-brand-cyan">{run.executionId || '-'}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        run.status === 'SUCCESS'
                          ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                          : run.status === 'FAILED'
                          ? 'bg-brand-coral/10 text-brand-coral border-brand-coral/30'
                          : 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                      }`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="p-3 text-dark-muted">{new Date(run.startedAt).toLocaleString()}</td>
                  <td className="p-3 text-dark-muted">{run.completedAt ? new Date(run.completedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
