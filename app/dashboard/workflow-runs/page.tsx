import React from 'react';
import { prisma } from '@/lib/db';
import { Workflow, CheckCircle2, XCircle, GitBranch, ArrowUpRight, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GITHUB_REPO = 'https://github.com/arslanvuzmal/leadpilot-ai';
const TEMPLATE_BRANCH = 'main';

const complexAutomationTemplates = [
  {
    name: 'Advanced Multi-Touch Nurture Sequence',
    file: 'advanced-lead-nurture-sequence.json',
    nodeCount: 27,
    description:
      'Long-running, time-delayed nurture cadence for WARM/COLD leads. Branches by category, stages Wait delays across days/weeks, routes by engagement level, and re-scores leads that respond late.',
    tags: ['Wait delays', 'Switch routing', 'Re-scoring', 'Multi-week cadence'],
  },
  {
    name: 'Multi-Stage CRM Sync Escalation & Resilience',
    file: 'multi-stage-crm-escalation.json',
    nodeCount: 23,
    description:
      'Resilient CRM sync with error-type-aware retries: auth failures halt and alert immediately, rate limits back off exponentially, timeouts retry fast then slow, all converging into a maxAttempts human-escalation gate.',
    tags: ['Error classification', 'Exponential backoff', 'Human escalation'],
  },
  {
    name: 'Enterprise Lead Scoring Orchestration',
    file: 'enterprise-lead-scoring-orchestration.json',
    nodeCount: 26,
    description:
      'Runs deterministic and AI scoring in true parallel, reconciles discrepancies with a safety-first fallback, applies confidence-based review routing, then fans out into three simultaneous category-specific action chains.',
    tags: ['Parallel branches', 'Score reconciliation', 'Fan-out / fan-in'],
  },
];

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
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-amber" /> Complex Automation Templates
          </h2>
          <span className="text-[10px] text-dark-muted font-mono">{complexAutomationTemplates.length} showcase workflows</span>
        </div>
        <p className="text-xs text-dark-muted -mt-2">
          Beyond the 4 core production workflows above, these templates demonstrate the depth of automation
          n8n can orchestrate for this platform — multi-week nurture cadences, resilient error-handling chains,
          and true parallel scoring orchestration. Each link opens the full, real, importable workflow JSON.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {complexAutomationTemplates.map((tpl) => (
            <a
              key={tpl.file}
              href={`${GITHUB_REPO}/blob/${TEMPLATE_BRANCH}/n8n/workflows/templates/${tpl.file}`}
              target="_blank"
              rel="noreferrer"
              className="group bg-dark-bg/60 border border-dark-border hover:border-brand-cyan rounded-xl p-4 space-y-3 text-xs transition"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-dark-bright text-sm leading-snug">{tpl.name}</span>
                <ArrowUpRight className="w-4 h-4 text-dark-muted group-hover:text-brand-cyan transition flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 text-brand-purple font-mono font-bold">
                <GitBranch className="w-3.5 h-3.5" /> {tpl.nodeCount} nodes
              </div>
              <p className="text-dark-muted leading-relaxed">{tpl.description}</p>
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
            </a>
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
