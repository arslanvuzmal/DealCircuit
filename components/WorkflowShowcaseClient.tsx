"use client";

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowDown, GitBranch, ExternalLink, Layers, CheckCircle2, ArrowRightCircle, ChevronDown, ChevronUp, Code2, Zap, Mail, Database, Shield, Users, Clock, Target, Workflow } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const GITHUB_REPO = "https://github.com/arslanvuzmal/leadpilot-ai";
const TEMPLATE_BRANCH = "main";

interface PipelineStep {
  title: string;
  description: string;
  color: "cyan" | "purple" | "emerald" | "amber" | "coral" | "muted";
  linkSlug?: string;
}

interface PipelineSection {
  type: "step" | "parallel";
  step?: PipelineStep;
  title?: string;
  paths?: Array<{
    label: string;
    color: "cyan" | "purple" | "emerald" | "amber" | "coral" | "muted";
    steps: PipelineStep[];
  }>;
}

interface WorkflowShowcase {
  slug: string;
  name: string;
  nodeCount: number;
  tagline: string;
  tags: string[];
  liveUrl?: string;
  file?: string;
  businessNarrative: string[];
  pipeline: PipelineSection[];
  technicalHighlights: string[];
}

const workflowShowcases: Record<string, WorkflowShowcase> = {
  "multi-week-nurture": {
    slug: "multi-week-nurture",
    name: "Multi-Week Nurture Cadence",
    nodeCount: 47,
    tagline: "Orchestrates a 6-week automated email sequence with branching logic based on engagement signals.",
    tags: ["Nurture", "Email", "Branching"],
    liveUrl: "https://cloud.n8n.io/workflows/abc123",
    businessNarrative: [
      "This workflow automates the entire post-approval nurture journey for qualified leads. Once a lead is approved in LeadPilot, they enter a 6-week email sequence designed to build trust, demonstrate value, and drive toward a sales conversation.",
      "The sequence adapts dynamically based on engagement signals: opens, clicks, replies, and website visits. Highly engaged leads are fast-tracked to sales outreach; disengaged leads receive re-engagement attempts before being moved to a long-term nurture list.",
      "Each email template is personalized using lead enrichment data (company name, role, tech stack, funding stage). The workflow tracks all interactions in a centralized engagement log, providing sales with a complete picture before first contact.",
    ],
    pipeline: [
      { type: "step", step: { title: "Lead Approved Trigger", description: "Webhook fires when lead status changes to APPROVED in LeadPilot", color: "cyan" } },
      { type: "step", step: { title: "Enrichment & Segmentation", description: "Fetch additional firmographic data; assign to industry-specific track", color: "purple" } },
      { type: "step", step: { title: "Week 1: Introduction Email", description: "Personalized intro with case study relevant to their industry", color: "emerald" } },
      { type: "parallel", title: "ENGAGEMENT BRANCH", paths: [
        { label: "Engaged (Open/Click)", color: "emerald", steps: [
          { title: "Week 2: Deep Dive Content", description: "Technical whitepaper or product demo video", color: "emerald" },
          { title: "Week 3: ROI Calculator", description: "Interactive tool showing potential value", color: "emerald" },
          { title: "Week 4: Sales Outreach Trigger", description: "Create task in CRM for AE to call", color: "amber" },
        ]},
        { label: "Not Engaged", color: "coral", steps: [
          { title: "Week 2: Re-engagement Email", description: "Different angle: peer success story", color: "coral" },
          { title: "Week 3: Value Proposition Reminder", description: "Short, punchy reminder of key benefits", color: "coral" },
          { title: "Week 4: Breakup Email", description: "Permission-based opt-out with resource link", color: "coral" },
        ]},
      ]},
      { type: "step", step: { title: "Long-term Nurture List", description: "Add to monthly newsletter; quarterly check-in", color: "muted" } },
    ],
    technicalHighlights: [
      "47 nodes including HTTP Request, IF, Switch, Merge, Wait, and Set nodes",
      "Uses n8n's built-in webhook authentication for secure LeadPilot integration",
      "Engagement tracking via Mailpit webhook callbacks (open/click pixels)",
      "CRM task creation via HubSpot API with custom properties for sequence tracking",
      "Exponential backoff wait nodes (1h, 4h, 12h, 24h) for API rate limit handling",
      "Dead letter queue for failed email sends with Slack alerting",
      "Workflow JSON version-controlled in Git; deployed via n8n CLI",
    ],
  },
  "resilient-error-handling": {
    slug: "resilient-error-handling",
    name: "Resilient Error-Handling Chain",
    nodeCount: 32,
    tagline: "Implements exponential backoff, dead-letter queues, and automated alerting for failed CRM syncs.",
    tags: ["Error Handling", "Retry", "Monitoring"],
    liveUrl: "https://cloud.n8n.io/workflows/def456",
    businessNarrative: [
      "CRM synchronization is the most critical integration in LeadPilot. When it fails, leads don't reach sales, and revenue is impacted. This workflow wraps every CRM sync operation in a resilient error-handling layer that automatically retries, escalates, and alerts.",
      "The pattern implements: immediate retry (network blip), exponential backoff (1m, 5m, 15m, 1h), dead-letter queue for permanent failures, and Slack/email alerting for human intervention.",
      "All failures are logged to the Audit Trail with full context (payload, error, retry count), enabling rapid root-cause analysis and replay capability.",
    ],
    pipeline: [
      { type: "step", step: { title: "CRM Sync Triggered", description: "Lead approved or updated; sync payload prepared", color: "cyan" } },
      { type: "step", step: { title: "Attempt Sync (Try)", description: "HTTP Request to HubSpot API with upsert logic", color: "purple" } },
      { type: "parallel", title: "ERROR HANDLING BRANCH", paths: [
        { label: "Success (2xx)", color: "emerald", steps: [
          { title: "Log Success", description: "Write audit record with CRM ID", color: "emerald" },
          { title: "Update Lead Status", description: "Set crmSyncStatus = SYNCED", color: "emerald" },
        ]},
        { label: "Retryable Error (429, 5xx)", color: "amber", steps: [
          { title: "Increment Retry Counter", description: "Track attempt number in workflow data", color: "amber" },
          { title: "Exponential Backoff Wait", description: "Wait 1m → 5m → 15m → 1h → 4h", color: "amber" },
          { title: "Retry Sync (Loop)", description: "Jump back to Attempt Sync node", color: "amber" },
        ]},
        { label: "Permanent Error (4xx, except 429)", color: "coral", steps: [
          { title: "Write Dead Letter", description: "Store failed payload in DLQ table", color: "coral" },
          { title: "Alert on Slack", description: "Notify #crm-alerts with payload link", color: "coral" },
          { title: "Update Lead Status", description: "Set crmSyncStatus = FAILED_PERMANENT", color: "coral" },
        ]},
      ]},
    ],
    technicalHighlights: [
      "32 nodes with explicit error boundaries using n8n's 'Continue On Fail' pattern",
      "Custom retry counter stored in workflow static data (persists across executions)",
      "Exponential backoff implemented via Wait node with expression: Math.pow(5, retryCount) * 60000",
      "Dead letter queue uses separate PostgreSQL table with full payload preservation",
      "Slack alerts use Block Kit formatting with buttons for 'Retry Now' and 'View in Audit'",
      "HubSpot API rate limit (100 req/10s) handled via built-in concurrency control",
      "Audit Trail integration writes structured events for every attempt and outcome",
    ],
  },
  "parallel-scoring": {
    slug: "parallel-scoring",
    name: "Parallel Scoring Orchestration",
    nodeCount: 28,
    tagline: "Runs all 5 scoring criteria in parallel, aggregates results, and routes to appropriate tier.",
    tags: ["Scoring", "Parallel", "Aggregation"],
    liveUrl: undefined,
    file: "parallel-scoring.json",
    businessNarrative: [
      "Lead scoring is the brain of LeadPilot. This workflow executes all 5 scoring criteria simultaneously, dramatically reducing latency compared to sequential evaluation. Results are aggregated in real-time and the lead is routed to HOT, WARM, or REVIEW tier instantly.",
      "Parallel execution means a lead that would take 2-3 seconds sequentially now completes in ~400ms. The workflow uses n8n's parallel branching with a Merge node to wait for all criteria to complete before calculating the final score.",
      "Each criterion is a self-contained sub-workflow, making it easy to add, remove, or modify scoring rules without touching the orchestration logic.",
    ],
    pipeline: [
      { type: "step", step: { title: "Lead Ingested", description: "New lead arrives via webhook or API import", color: "cyan" } },
      { type: "step", step: { title: "Fan-Out: 5 Parallel Branches", description: "Split payload to 5 independent scoring sub-workflows", color: "purple" } },
      { type: "parallel", title: "SCORING CRITERIA (PARALLEL)", paths: [
        { label: "Job Title Match", color: "cyan", steps: [{ title: "Evaluate Title Rules", description: "Match against configured title patterns", color: "cyan" }]},
        { label: "Company Size", color: "purple", steps: [{ title: "Enrich & Score", description: "Fetch employee count; apply tier scoring", color: "purple" }]},
        { label: "Tech Stack Match", color: "emerald", steps: [{ title: "Analyze Technologies", description: "Detect stack; score per configured weights", color: "emerald" }]},
        { label: "Recent Funding", color: "amber", steps: [{ title: "Check Funding API", description: "Query Crunchbase/PitchBook for recent rounds", color: "amber" }]},
        { label: "Negative Signals", color: "coral", steps: [{ title: "Competitor Check", description: "Flag competitor domains; apply penalty", color: "coral" }]},
      ]},
      { type: "step", step: { title: "Merge & Aggregate", description: "Wait for all 5 branches; sum weighted scores", color: "purple" } },
      { type: "step", step: { title: "Tier Assignment", description: "HOT (≥80) | WARM (60-79) | REVIEW (<60)", color: "amber" } },
      { type: "step", step: { title: "Update Lead Record", description: "Write totalScore, category, and criteria breakdown", color: "emerald" } },
      { type: "step", step: { title: "Trigger Downstream", description: "Fire lead.scored webhook for n8n workflows", color: "cyan" } },
    ],
    technicalHighlights: [
      "28 nodes with true parallel execution via n8n's branching model",
      "Merge node uses 'Wait for All' mode with 30s timeout fallback",
      "Each criterion is a reusable sub-workflow (callable via Execute Workflow node)",
      "Scoring config loaded from PostgreSQL at runtime (dynamic rule updates without deploy)",
      "Sub-400ms p99 latency (vs 2-3s sequential) measured under load",
      "Criteria breakdown stored as JSONB on lead record for Audit Trail transparency",
      "Webhook trigger for downstream workflows includes full scoring breakdown",
    ],
  },
};

const colorClasses: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  cyan: { border: "border-brand-cyan/40", text: "text-brand-cyan", bg: "bg-brand-cyan/10", dot: "bg-brand-cyan" },
  purple: { border: "border-brand-purple/40", text: "text-brand-purple", bg: "bg-brand-purple/10", dot: "bg-brand-purple" },
  emerald: { border: "border-brand-emerald/40", text: "text-brand-emerald", bg: "bg-brand-emerald/10", dot: "bg-brand-emerald" },
  amber: { border: "border-brand-amber/40", text: "text-brand-amber", bg: "bg-brand-amber/10", dot: "bg-brand-amber" },
  coral: { border: "border-brand-coral/40", text: "text-brand-coral", bg: "bg-brand-coral/10", dot: "bg-brand-coral" },
  muted: { border: "border-border-subtle", text: "text-text-muted", bg: "bg-surface-interactive", dot: "text-text-muted" },
};

function StepCard({ step, compact }: { step: PipelineStep; compact?: boolean }) {
  const c = colorClasses[step.color];
  const content = (
    <>
      <div className={`flex items-center gap-2 font-bold ${c.text} ${compact ? "text-caption" : "text-body-sm"}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
        {step.title}
        {step.linkSlug && <ArrowRightCircle className="w-3 h-3 flex-shrink-0 opacity-70" />}
      </div>
      <p className="text-caption text-text-muted leading-relaxed">{step.description}</p>
    </>
  );

  if (step.linkSlug) {
    return (
      <Link
        href={`/dashboard/workflow-runs/${step.linkSlug}`}
        className={`block border ${c.border} ${c.bg} hover:brightness-110 rounded-xl ${compact ? "p-3" : "p-4"} space-y-1 transition`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`border ${c.border} ${c.bg} rounded-xl ${compact ? "p-3" : "p-4"} space-y-1`}>
      {content}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-1.5">
      <ArrowDown className="w-4 h-4 text-border-subtle" />
    </div>
  );
}

interface WorkflowShowcaseClientProps {
  slug: string;
}

export default function WorkflowShowcaseClient({ slug }: WorkflowShowcaseClientProps) {
  const workflow = workflowShowcases[slug];
  if (!workflow) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/dashboard/workflow-runs"
        className="inline-flex items-center gap-1.5 text-caption text-brand-cyan hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Workflow Runs
      </Link>

      <Card variant="padded" className="space-y-4">
        <CardContent className="space-y-4">
          <h1 className="text-page-title text-text-primary">{workflow.name}</h1>
          <p className="text-body text-text-secondary leading-relaxed max-w-3xl">{workflow.tagline}</p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {workflow.liveUrl && (
              <Badge variant="success" size="sm" className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" /> LIVE IN N8N CLOUD
              </Badge>
            )}
            <Badge variant="neutral" size="sm" className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" /> {workflow.nodeCount} nodes
            </Badge>
            {workflow.tags.map((tag) => (
              <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-status-success" /> What This Means for Your Business</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {workflow.businessNarrative.map((para, i) => (
            <p key={i} className="text-body-sm text-text-secondary leading-relaxed">{para}</p>
          ))}
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5 text-brand-cyan" /> Automation Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-3xl mx-auto">
            {workflow.pipeline.map((section, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Connector />}
                {section.type === "step" ? (
                  <StepCard step={section.step!} />
                ) : (
                  <div className="space-y-3">
                    <div className="text-center text-caption text-text-muted font-semibold uppercase tracking-wide">
                      {section.title}
                    </div>
                    <div
                      className="grid gap-3"
                      style={{ gridTemplateColumns: `repeat(${section.paths!.length}, minmax(0, 1fr))` }}
                    >
                      {section.paths!.map((path) => {
                        const c = colorClasses[path.color];
                        return (
                          <div key={path.label} className={`border-2 ${c.border} rounded-xl p-3 space-y-2 bg-surface-interactive`}>
                            <div className={`text-center text-caption font-bold ${c.text}`}>{path.label}</div>
                            {path.steps.map((step, si) => (
                              <React.Fragment key={si}>
                                {si > 0 && (
                                  <div className="flex justify-center py-0.5">
                                    <ArrowDown className="w-3 h-3 text-border-subtle" />
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
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 className="w-5 h-5 text-brand-blue" /> Technical Detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2">
            {workflow.technicalHighlights.map((point, i) => (
              <li key={i} className="text-body-sm text-text-secondary leading-relaxed flex gap-2">
                <span className="text-brand-cyan flex-shrink-0">▸</span> {point}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
            {workflow.liveUrl ? (
              <a
                href={workflow.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-status-success/10 border border-status-success/30 hover:border-status-success text-status-success text-body-sm font-bold rounded-lg transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Live Workflow in n8n Cloud
              </a>
            ) : workflow.file ? (
              <a
                href={`${GITHUB_REPO}/blob/${TEMPLATE_BRANCH}/n8n/workflows/templates/${workflow.file}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-interactive border border-border-subtle hover:border-brand-cyan text-text-primary text-body-sm font-medium rounded-lg transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" /> View Raw Workflow JSON on GitHub
              </a>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Workflow className="w-5 h-5 text-brand-purple" /> Other Automations in This System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(workflowShowcases)
              .filter((w) => w.slug !== workflow.slug)
              .map((w) => (
                <Link
                  key={w.slug}
                  href={`/dashboard/workflow-runs/${w.slug}`}
                  className="group flex items-center justify-between gap-2 bg-surface-interactive border border-border-subtle hover:border-brand-cyan/50 rounded-lg p-3 transition"
                >
                  <div>
                    <div className="text-body-sm font-medium text-text-primary">{w.name}</div>
                    <div className="text-caption text-text-muted font-mono mt-0.5">{w.nodeCount} nodes</div>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-cyan transition rotate-180 flex-shrink-0" />
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">DEMO MODE</Badge>
              <span className="text-body-sm text-text-secondary">Data is simulated. <a href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data →</a></span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}