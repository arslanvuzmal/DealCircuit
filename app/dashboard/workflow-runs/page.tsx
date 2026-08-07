import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Workflow, CheckCircle2, XCircle, GitBranch, ArrowUpRight, Zap, ArrowRight, Globe, Server, Share2 } from 'lucide-react';
import { workflowShowcases } from '@/lib/workflowShowcase';

const architectureStages = [
  {
    icon: Globe,
    color: 'text-blue-600',
    border: 'border-blue-300',
    title: 'Public Intake',
    items: ['Lead capture form', 'n8n webhook triggers'],
  },
  {
    icon: Server,
    color: 'text-purple-600',
    border: 'border-purple-300',
    title: 'LeadPilot Core',
    items: ['Validation & scoring engine', 'PostgreSQL persistence', 'Admin dashboard'],
  },
  {
    icon: Workflow,
    color: 'text-amber-600',
    border: 'border-amber-300',
    title: 'n8n Automation Layer',
    items: ['4 core workflows', '3 complex showcase templates'],
  },
  {
    icon: Share2,
    color: 'text-green-600',
    border: 'border-green-300',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-xl shadow-card">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Workflow className="w-5 h-5 text-purple-600" /> n8n Workflow Execution Logs
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Execution history for lead-intake, daily-digest, failed-retry, and review-completion workflows.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 card-hover">
        <h2 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-3">System Architecture</h2>
        <p className="text-xs text-gray-500 -mt-2">
          How a lead actually moves through the platform, end to end — from public form submission to
          synced CRM record.
        </p>
        <div className="flex flex-col lg:flex-row items-stretch gap-3">
          {architectureStages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.title}>
                <div className={`flex-1 border ${stage.border} bg-gray-50 rounded-xl p-4 space-y-2`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${stage.color}`}>
                    <Icon className="w-4 h-4" /> {stage.title}
                  </div>
                  <ul className="space-y-1">
                    {stage.items.map((item) => (
                      <li key={item} className="text-[11px] text-gray-500 leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {i < architectureStages.length - 1 && (
                  <div className="flex items-center justify-center lg:px-0 py-1 lg:py-0">
                    <ArrowRight className="w-4 h-4 text-gray-300 rotate-90 lg:rotate-0 flex-shrink-0" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 card-hover">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" /> Complex Automation Templates
          </h2>
          <span className="text-[10px] text-gray-500 font-mono">{workflowShowcases.length} showcase workflows</span>
        </div>
        <p className="text-xs text-gray-500 -mt-2">
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
              className="group bg-gray-50 border border-gray-200 hover:border-blue-600 rounded-xl p-4 space-y-3 text-xs transition"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-gray-900 text-sm leading-snug">{tpl.name}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0" />
              </div>
              {tpl.liveUrl && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> LIVE IN N8N CLOUD
                </div>
              )}
              <div className="flex items-center gap-1.5 text-purple-600 font-mono font-bold">
                <GitBranch className="w-3.5 h-3.5" /> {tpl.nodeCount} nodes
              </div>
              <p className="text-gray-500 leading-relaxed">{tpl.tagline}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tpl.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-500 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-900 table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Workflow Name</th>
                <th className="table-cell">Execution ID</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Started At</th>
                <th className="table-cell">Completed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {runs.map((run) => (
                <tr key={run.id} className="table-row-hover">
                  <td className="table-cell font-bold text-gray-900">{run.workflowName}</td>
                  <td className="table-cell font-mono text-blue-600">{run.executionId || '-'}</td>
                  <td className="table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        run.status === 'SUCCESS'
                          ? 'badge-success'
                          : run.status === 'FAILED'
                          ? 'badge-failed'
                          : 'badge-pending'
                      }`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500">{new Date(run.startedAt).toLocaleString()}</td>
                  <td className="table-cell text-gray-500">{run.completedAt ? new Date(run.completedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}