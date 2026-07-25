import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Workflow, CheckCircle2, XCircle, GitBranch, ArrowUpRight, Zap, ArrowRight, Globe, Server, Share2 } from 'lucide-react';
import { workflowShowcases } from '@/lib/workflowShowcase';

const architectureStages = [
  {
    icon: Globe,
    color: 'text-brand-cyan',
    border: 'border-brand-cyan/30',
    title: 'Public Intake',
    items: ['Lead capture form', 'n8n webhook triggers'],
  },
  {
    icon: Server,
    color: 'text-brand-purple',
    border: 'border-brand-purple/30',
    title: 'LeadPilot Core',
    items: ['Validation & scoring engine', 'PostgreSQL persistence', 'Admin dashboard'],
  },
  {
    icon: Workflow,
    color: 'text-brand-amber',
    border: 'border-brand-amber/30',
    title: 'n8n Automation Layer',
    items: ['4 core workflows', '3 complex showcase templates'],
  },
  {
    icon: Share2,
    color: 'text-brand-emerald',
    border: 'border-brand-emerald/30',
    title: 'External Systems',
    items: ['CRM sync', 'Email dispatch', 'Slack / notifications'],
  },
];

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
        <h2 className="text-sm font-bold text-dark-bright border-b border-dark-border pb-3">System Architecture</h2>
        <p className="text-xs text-dark-muted -mt-2">
          How a lead actually moves through the platform, end to end — from public form submission to
          synced CRM record.
        </p>
        <div className="flex flex-col lg:flex-row items-stretch gap-3">
          {architectureStages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.title}>
                <div className={`flex-1 border ${stage.border} bg-dark-bg/60 rounded-xl p-4 space-y-2`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${stage.color}`}>
                    <Icon className="w-4 h-4" /> {stage.title}
                  </div>
                  <ul className="space-y-1">
                    {stage.items.map((item) => (
                      <li key={item} className="text-[11px] text-dark-muted leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {i < architectureStages.length - 1 && (
                  <div className="flex items-center justify-center lg:px-0 py-1 lg:py-0">
                    <ArrowRight className="w-4 h-4 text-dark-border rotate-90 lg:rotate-0 flex-shrink-0" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-amber" /> Complex Automation Templates
          </h2>
          <span className="text-[10px] text-dark-muted font-mono">{workflowShowcases.length} showcase workflows</span>
        </div>
        <p className="text-xs text-dark-muted -mt-2">
          Beyond the 4 core production workflows above, these templates demonstrate the depth of automation
          n8n can orchestrate for this platform — multi-week nurture cadences, resilient error-handling chains,
          and true parallel scoring orchestration. Each card opens a full pipeline breakdown: what it does for
          your business, the visual automation flow, and the real underlying workflow JSON.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {workflowShowcases.map((tpl) => (
            <Link
              key={tpl.slug}
              href={`/dashboard/workflow-runs/${tpl.slug}`}
              className="group bg-dark-bg/60 border border-dark-border hover:border-brand-cyan rounded-xl p-4 space-y-3 text-xs transition"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-dark-bright text-sm leading-snug">{tpl.name}</span>
                <ArrowUpRight className="w-4 h-4 text-dark-muted group-hover:text-brand-cyan transition flex-shrink-0" />
              </div>
              {tpl.liveUrl && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" /> LIVE IN N8N CLOUD
                </div>
              )}
              <div className="flex items-center gap-1.5 text-brand-purple font-mono font-bold">
                <GitBranch className="w-3.5 h-3.5" /> {tpl.nodeCount} nodes
              </div>
              <p className="text-dark-muted leading-relaxed">{tpl.tagline}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tpl.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-dark-hover border border-dark-border rounded text-[10px] text-dark-muted font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
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
