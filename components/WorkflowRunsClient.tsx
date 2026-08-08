"use client";

import React, { useState } from "react";
import { Workflow, CheckCircle2, XCircle, Zap, ArrowRight, Globe, Server, Share2, Search, Filter, ChevronDown, Loader2, GitBranch, ExternalLink, Layers, ArrowDown, ArrowUpRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

const STATUS_VARIANTS: Record<string, "success" | "error" | "warning" | "neutral" | "info"> = {
  SUCCESS: "success",
  FAILED: "error",
  RUNNING: "info",
  PENDING: "neutral",
};

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANTS[status] || "neutral"} size="sm">{status}</Badge>;
}

const architectureStages = [
  {
    icon: Globe,
    color: "text-brand-blue",
    border: "border-brand-blue/30",
    bg: "bg-brand-blue/10",
    title: "Public Intake",
    items: ["Lead capture form", "n8n webhook triggers"],
  },
  {
    icon: Server,
    color: "text-brand-purple",
    border: "border-brand-purple/30",
    bg: "bg-brand-purple/10",
    title: "LeadPilot Core",
    items: ["Validation & scoring engine", "PostgreSQL persistence", "Admin dashboard"],
  },
  {
    icon: Workflow,
    color: "text-brand-amber",
    border: "border-brand-amber/30",
    bg: "bg-brand-amber/10",
    title: "n8n Automation Layer",
    items: ["4 core workflows", "3 complex showcase templates"],
  },
  {
    icon: Share2,
    color: "text-brand-emerald",
    border: "border-brand-emerald/30",
    bg: "bg-brand-emerald/10",
    title: "External Systems",
    items: ["CRM sync", "Email dispatch", "Slack / notifications"],
  },
];

const workflowShowcases = [
  {
    slug: "multi-week-nurture",
    name: "Multi-Week Nurture Cadence",
    nodeCount: 47,
    tagline: "Orchestrates a 6-week automated email sequence with branching logic based on engagement signals.",
    tags: ["Nurture", "Email", "Branching"],
    liveUrl: "https://cloud.n8n.io/workflows/abc123",
  },
  {
    slug: "resilient-error-handling",
    name: "Resilient Error-Handling Chain",
    nodeCount: 32,
    tagline: "Implements exponential backoff, dead-letter queues, and automated alerting for failed CRM syncs.",
    tags: ["Error Handling", "Retry", "Monitoring"],
    liveUrl: "https://cloud.n8n.io/workflows/def456",
  },
  {
    slug: "parallel-scoring",
    name: "Parallel Scoring Orchestration",
    nodeCount: 28,
    tagline: "Runs all 5 scoring criteria in parallel, aggregates results, and routes to appropriate tier.",
    tags: ["Scoring", "Parallel", "Aggregation"],
    liveUrl: null,
  },
];

export default function WorkflowRunsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [workflowFilter, setWorkflowFilter] = useState("");
  const [sortBy, setSortBy] = useState("startedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const mockRuns = [
    { id: "run-1", workflowName: "Lead Enrichment", executionId: "exec_abc123", status: "SUCCESS", startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), completedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
    { id: "run-2", workflowName: "CRM Sync", executionId: "exec_def456", status: "SUCCESS", startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), completedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString() },
    { id: "run-3", workflowName: "Follow-up Sequence", executionId: "exec_ghi789", status: "RUNNING", startedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), completedAt: null },
    { id: "run-4", workflowName: "Lead Enrichment", executionId: "exec_jkl012", status: "FAILED", startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), completedAt: new Date(Date.now() - 1000 * 60 * 29).toISOString() },
    { id: "run-5", workflowName: "Daily Digest", executionId: "exec_mno345", status: "SUCCESS", startedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), completedAt: new Date(Date.now() - 1000 * 60 * 60 * 7.9).toISOString() },
    { id: "run-6", workflowName: "Failed Retry", executionId: "exec_pqr678", status: "SUCCESS", startedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), completedAt: new Date(Date.now() - 1000 * 60 * 60 * 11.8).toISOString() },
    { id: "run-7", workflowName: "CRM Sync", executionId: "exec_stu901", status: "FAILED", startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), completedAt: new Date(Date.now() - 1000 * 60 * 60 * 23.9).toISOString() },
    { id: "run-8", workflowName: "Review Completion", executionId: "exec_vwx234", status: "SUCCESS", startedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), completedAt: new Date(Date.now() - 1000 * 60 * 60 * 35.9).toISOString() },
  ];

  const filteredRuns = mockRuns
    .filter((run) => {
      if (searchQuery && !run.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) && !run.executionId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter && run.status !== statusFilter) return false;
      if (workflowFilter && run.workflowName !== workflowFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortBy]);
      const bVal = String((b as Record<string, unknown>)[sortBy]);
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><Workflow className="w-6 h-6 text-brand-purple" /> Workflow Runs</h1>
          <p className="text-body-sm text-text-muted mt-1">Execution history for lead-intake, daily-digest, failed-retry, and review-completion workflows.</p>
        </div>
      </div>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5 text-brand-blue" /> System Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-sm text-text-muted">How a lead actually moves through the platform, end to end — from public form submission to synced CRM record.</p>
          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            {architectureStages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <React.Fragment key={stage.title}>
                  <div className={`flex-1 border ${stage.border} ${stage.bg} rounded-xl p-4 space-y-2`}>
                    <div className={`flex items-center gap-2 font-bold text-sm ${stage.color}`}>
                      <Icon className="w-4 h-4" /> {stage.title}
                    </div>
                    <ul className="space-y-1">
                      {stage.items.map((item) => (
                        <li key={item} className="text-caption text-text-muted leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                  {i < architectureStages.length - 1 && (
                    <div className="flex items-center justify-center lg:px-0 py-1 lg:py-0">
                      <ArrowRight className="w-4 h-4 text-border-subtle rotate-90 lg:rotate-0 flex-shrink-0" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><GitBranch className="w-5 h-5 text-brand-amber" /> Complex Automation Templates</CardTitle>
            <span className="text-caption text-text-muted font-mono">{workflowShowcases.length} showcase workflows</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-sm text-text-muted">Beyond the 4 core production workflows, these templates demonstrate the depth of automation n8n can orchestrate — multi-week nurture cadences, resilient error-handling chains, and true parallel scoring orchestration.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {workflowShowcases.map((tpl) => (
              <div key={tpl.slug} className="group bg-surface-interactive border border-border-subtle hover:border-brand-cyan/50 rounded-xl p-4 space-y-3 text-caption transition">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-text-primary truncate">{tpl.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand-cyan transition flex-shrink-0" />
                </div>
                {tpl.liveUrl && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-status-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" /> LIVE IN N8N CLOUD
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-brand-purple font-mono font-bold">
                  <GitBranch className="w-3.5 h-3.5" /> {tpl.nodeCount} nodes
                </div>
                <p className="text-text-muted leading-relaxed">{tpl.tagline}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tpl.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-surface-highlight border border-border-subtle rounded text-[10px] text-text-secondary font-medium">{tag}</span>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start"><ArrowRight className="w-3 h-3 mr-1" /> View Pipeline</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" /><Input placeholder="Search workflow, execution ID…" className="pl-10" size="sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select placeholder="All Statuses" options={[{ value: "", label: "All Statuses" }, { value: "SUCCESS", label: "SUCCESS" }, { value: "FAILED", label: "FAILED" }, { value: "RUNNING", label: "RUNNING" }, { value: "PENDING", label: "PENDING" }]} size="sm" className="w-36" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
            <Select placeholder="All Workflows" options={[{ value: "", label: "All Workflows" }, ...[...new Set(mockRuns.map((r) => r.workflowName))].map((w) => ({ value: w, label: w }))]} size="sm" className="w-44" value={workflowFilter} onChange={(e) => setWorkflowFilter(e.target.value)} />
            <Select placeholder="Sort By" options={[{ value: "startedAt", label: "Date" }, { value: "workflowName", label: "Workflow" }, { value: "status", label: "Status" }]} size="sm" className="w-36" value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
            <Select placeholder="Order" options={[{ value: "desc", label: "Descending" }, { value: "asc", label: "Ascending" }]} size="sm" className="w-36" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} />
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeadCell>Workflow Name</TableHeadCell>
                <TableHeadCell>Execution ID</TableHeadCell>
                <TableHeadCell className="text-center">Status</TableHeadCell>
                <TableHeadCell className="text-center">Started At</TableHeadCell>
                <TableHeadCell className="text-center">Completed At</TableHeadCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-bold text-text-primary">{run.workflowName}</TableCell>
                  <TableCell className="font-mono text-brand-blue">{run.executionId || "-"}</TableCell>
                  <TableCell className="text-center"><StatusBadge status={run.status} /></TableCell>
                  <TableCell className="text-center text-caption text-text-muted">{formatRelativeTime(run.startedAt)}</TableCell>
                  <TableCell className="text-center text-caption text-text-muted">{run.completedAt ? formatRelativeTime(run.completedAt) : <span className="text-brand-amber">Running…</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">{filteredRuns.length} of {mockRuns.length} executions</span>
        </CardFooter>
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