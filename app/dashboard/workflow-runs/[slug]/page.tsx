import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowDown, GitBranch, ExternalLink, Layers, CheckCircle2, ArrowRightCircle } from 'lucide-react';
import { getWorkflowShowcase, workflowShowcases, StepColor, PipelineStep } from '@/lib/workflowShowcase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GITHUB_REPO = 'https://github.com/arslanvuzmal/leadpilot-ai';
const TEMPLATE_BRANCH = 'main';

const colorClasses: Record<StepColor, { border: string; text: string; bg: string; dot: string }> = {
  cyan: { border: 'border-brand-cyan/40', text: 'text-brand-cyan', bg: 'bg-brand-cyan/10', dot: 'bg-brand-cyan' },
  purple: { border: 'border-brand-purple/40', text: 'text-brand-purple', bg: 'bg-brand-purple/10', dot: 'bg-brand-purple' },
  emerald: { border: 'border-brand-emerald/40', text: 'text-brand-emerald', bg: 'bg-brand-emerald/10', dot: 'bg-brand-emerald' },
  amber: { border: 'border-brand-amber/40', text: 'text-brand-amber', bg: 'bg-brand-amber/10', dot: 'bg-brand-amber' },
  coral: { border: 'border-brand-coral/40', text: 'text-brand-coral', bg: 'bg-brand-coral/10', dot: 'bg-brand-coral' },
  muted: { border: 'border-dark-border', text: 'text-dark-muted', bg: 'bg-dark-bg/60', dot: 'bg-dark-muted' },
};

function StepCard({ step, compact }: { step: PipelineStep; compact?: boolean }) {
  const c = colorClasses[step.color];
  const content = (
    <>
      <div className={`flex items-center gap-2 font-bold ${c.text} ${compact ? 'text-xs' : 'text-sm'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
        {step.title}
        {step.linkSlug && <ArrowRightCircle className="w-3 h-3 flex-shrink-0 opacity-70" />}
      </div>
      <p className="text-dark-muted text-[11px] leading-relaxed">{step.description}</p>
    </>
  );

  if (step.linkSlug) {
    return (
      <Link
        href={`/dashboard/workflow-runs/${step.linkSlug}`}
        className={`block border ${c.border} ${c.bg} hover:brightness-125 rounded-xl ${compact ? 'p-3' : 'p-4'} space-y-1 transition`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`border ${c.border} ${c.bg} rounded-xl ${compact ? 'p-3' : 'p-4'} space-y-1`}>
      {content}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-1.5">
      <ArrowDown className="w-4 h-4 text-dark-border" />
    </div>
  );
}

export default function WorkflowShowcasePage({ params }: { params: { slug: string } }) {
  const workflow = getWorkflowShowcase(params.slug);
  if (!workflow) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/workflow-runs"
        className="inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Workflow Runs
      </Link>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3">
        <h1 className="text-xl font-bold text-dark-bright tracking-tight">{workflow.name}</h1>
        <p className="text-sm text-dark-text leading-relaxed max-w-3xl">{workflow.tagline}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-purple/10 border border-brand-purple/30 text-brand-purple rounded text-[11px] font-bold font-mono">
            <GitBranch className="w-3.5 h-3.5" /> {workflow.nodeCount} nodes
          </span>
          {workflow.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-dark-hover border border-dark-border rounded text-[11px] text-dark-muted font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2 border-b border-dark-border pb-3">
          <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> What This Means for Your Business
        </h2>
        <div className="space-y-3">
          {workflow.businessNarrative.map((para, i) => (
            <p key={i} className="text-xs text-dark-text leading-relaxed">{para}</p>
          ))}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2 border-b border-dark-border pb-3">
          <Layers className="w-4 h-4 text-brand-cyan" /> Automation Pipeline
        </h2>
        <div className="max-w-3xl mx-auto">
          {workflow.pipeline.map((section, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Connector />}
              {section.type === 'step' ? (
                <StepCard step={section.step} />
              ) : (
                <div className="space-y-2">
                  <div className="text-center text-[11px] text-dark-muted font-semibold uppercase tracking-wide">
                    {section.title}
                  </div>
                  <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${section.paths.length}, minmax(0, 1fr))` }}
                  >
                    {section.paths.map((path) => {
                      const c = colorClasses[path.color];
                      return (
                        <div key={path.label} className={`border-2 ${c.border} rounded-xl p-3 space-y-2 bg-dark-bg/40`}>
                          <div className={`text-center text-xs font-bold ${c.text}`}>{path.label}</div>
                          {path.steps.map((step, si) => (
                            <React.Fragment key={si}>
                              {si > 0 && (
                                <div className="flex justify-center py-0.5">
                                  <ArrowDown className="w-3 h-3 text-dark-border" />
                                </div>
                              )}
                              <StepCard step={step} compact />
                            </React.Fragment>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-dark-bright border-b border-dark-border pb-3">Technical Detail</h2>
        <ul className="space-y-2">
          {workflow.technicalHighlights.map((point, i) => (
            <li key={i} className="text-xs text-dark-muted leading-relaxed flex gap-2">
              <span className="text-brand-cyan flex-shrink-0">▸</span> {point}
            </li>
          ))}
        </ul>
        <a
          href={`${GITHUB_REPO}/blob/${TEMPLATE_BRANCH}/n8n/workflows/templates/${workflow.file}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-dark-hover border border-dark-border hover:border-brand-cyan text-dark-bright text-xs font-medium rounded-lg transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" /> View Raw Workflow JSON on GitHub
        </a>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-dark-bright border-b border-dark-border pb-3">Other Automations in This System</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workflowShowcases
            .filter((w) => w.slug !== workflow.slug)
            .map((w) => (
              <Link
                key={w.slug}
                href={`/dashboard/workflow-runs/${w.slug}`}
                className="group flex items-center justify-between gap-2 bg-dark-bg/60 border border-dark-border hover:border-brand-cyan rounded-lg p-3 transition"
              >
                <div>
                  <div className="text-xs font-bold text-dark-bright">{w.name}</div>
                  <div className="text-[10px] text-dark-muted font-mono mt-0.5">{w.nodeCount} nodes</div>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 text-dark-muted group-hover:text-brand-cyan transition rotate-180 flex-shrink-0" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
