"use client";

import React, { useState } from "react";
import { ArrowRight, Search, Filter, ChevronDown, Zap, Timer, CheckCircle2, XCircle, AlertTriangle, RotateCcw, Clock, BarChart2, Settings, Share2, ArrowUpRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

const WORKFLOW_STATUSES = ["COMPLETED", "RUNNING", "FAILED", "PENDING", "CANCELLED"];
const statusVariants: Record<string, "success" | "error" | "warning" | "neutral" | "info"> = { COMPLETED: "success", RUNNING: "info", FAILED: "error", PENDING: "neutral", CANCELLED: "warning" };

function WorkflowStatusBadge({ status }: { status: string }) { return <Badge variant={statusVariants[status] || "neutral"} size="sm">{status}</Badge>; }

function EmptyWorkflows() {
  return <div className="p-12 text-center"><Zap className="w-12 h-12 text-text-muted mx-auto mb-4" /><p className="text-body text-text-secondary">No workflow runs recorded yet.</p></div>;
}

function WorkflowsTable({ workflows }: { workflows: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadCell>Workflow</TableHeadCell>
          <TableHeadCell>Trigger</TableHeadCell>
          <TableHeadCell>Lead</TableHeadCell>
          <TableHeadCell className="text-center">Status</TableHeadCell>
          <TableHeadCell className="text-center">Duration</TableHeadCell>
          <TableHeadCell className="text-right">Started</TableHeadCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflows.map((wf) => (
          <TableRow key={wf.id}>
            <TableCell className="font-bold text-text-primary">{wf.name}</TableCell>
            <TableCell><Badge variant="neutral" size="sm">{wf.trigger}</Badge></TableCell>
            <TableCell>
              <div className="min-w-0">
                <div className="font-medium text-text-primary truncate">{wf.lead?.fullName || "System"}</div>
                <div className="text-caption text-text-muted truncate">{wf.lead?.workEmail || "N/A"}</div>
              </div>
            </TableCell>
            <TableCell className="text-center"><WorkflowStatusBadge status={wf.status} /></TableCell>
            <TableCell className="text-center font-mono text-text-secondary">{wf.duration ? `${wf.duration}ms` : "—"}</TableCell>
            <TableCell className="text-right text-caption text-text-muted">{formatRelativeTime(wf.startedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface WorkflowsClientProps { workflows: any[]; }

export default function WorkflowsClient({ workflows }: WorkflowsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [triggerFilter, setTriggerFilter] = useState("");
  const [sortBy, setSortBy] = useState("startedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredWorkflows = workflows.filter((wf) => { 
    if (searchQuery && !wf.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !wf.trigger?.toLowerCase().includes(searchQuery.toLowerCase()) && !wf.lead?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())) return false; 
    if (statusFilter && wf.status !== statusFilter) return false; 
    if (triggerFilter && wf.trigger !== triggerFilter) return false; 
    return true; 
  }).sort((a, b) => { 
    const aVal = a[sortBy]; 
    const bVal = b[sortBy]; 
    if (sortOrder === "asc") return aVal > bVal ? 1 : -1; 
    return aVal < bVal ? 1 : -1; 
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2">
            <Zap className="w-6 h-6 text-brand-cyan" /> Workflows
          </h1>
          <p className="text-body-sm text-text-muted mt-1">n8n workflow execution history with retry visualization.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">{workflows.length} Total Runs</Badge>
          <Badge variant="info" size="sm">{[...new Set(workflows.map((w) => w.name))].length} Workflows</Badge>
        </div>
      </div>

      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input placeholder="Search workflow, trigger, lead…" className="pl-10" size="sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select placeholder="All Statuses" options={[{ value: "", label: "All Statuses" }, { value: "COMPLETED", label: "COMPLETED" }, { value: "RUNNING", label: "RUNNING" }, { value: "FAILED", label: "FAILED" }, { value: "PENDING", label: "PENDING" }, { value: "CANCELLED", label: "CANCELLED" }]} size="sm" className="w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
            <Select placeholder="All Triggers" options={[{ value: "", label: "All Triggers" }, ...[...new Set(workflows.map((w) => w.trigger))].map((t) => ({ value: t, label: t }))]} size="sm" className="w-40" value={triggerFilter} onChange={(e) => setTriggerFilter(e.target.value)} />
            <Select placeholder="Sort By" options={[{ value: "startedAt", label: "Date" }, { value: "name", label: "Workflow" }, { value: "status", label: "Status" }]} size="sm" className="w-36" value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
            <Select placeholder="Order" options={[{ value: "desc", label: "Descending" }, { value: "asc", label: "Ascending" }]} size="sm" className="w-36" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} />
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardContent className="p-0">
          {workflows.length === 0 ? <EmptyWorkflows /> : <WorkflowsTable workflows={filteredWorkflows} />}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">{filteredWorkflows.length} of {workflows.length} runs</span>
        </CardFooter>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-cyan" /> Workflow Definitions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-blue/20 rounded-lg"><Zap className="w-5 h-5 text-brand-blue" /></div>
                  <div>
                    <p className="font-medium text-text-primary">Lead Enrichment</p>
                    <p className="text-caption text-text-muted">n8n workflow</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border-subtle">
                <div><p className="text-kpi-value text-text-primary font-mono">1,247</p><p className="text-caption text-text-muted">Runs</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">98.2%</p><p className="text-caption text-text-muted">Success</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">1.2s</p><p className="text-caption text-text-muted">Avg Duration</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm"><ArrowUpRight className="w-4 h-4 mr-1" /> View Runs</Button>
                <Button variant="ghost" size="sm"><Settings className="w-4 h-4 mr-1" /> Configure</Button>
              </div>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-cyan/20 rounded-lg"><Share2 className="w-5 h-5 text-brand-cyan" /></div>
                  <div>
                    <p className="font-medium text-text-primary">CRM Sync</p>
                    <p className="text-caption text-text-muted">n8n workflow</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border-subtle">
                <div><p className="text-kpi-value text-text-primary font-mono">3,421</p><p className="text-caption text-text-muted">Runs</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">94.7%</p><p className="text-caption text-text-muted">Success</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">2.8s</p><p className="text-caption text-text-muted">Avg Duration</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm"><ArrowUpRight className="w-4 h-4 mr-1" /> View Runs</Button>
                <Button variant="ghost" size="sm"><Settings className="w-4 h-4 mr-1" /> Configure</Button>
              </div>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-cyan/20 rounded-lg"><Timer className="w-5 h-5 text-brand-cyan" /></div>
                  <div>
                    <p className="font-medium text-text-primary">Follow-up Sequences</p>
                    <p className="text-caption text-text-muted">n8n workflow</p>
                  </div>
                </div>
                <Badge variant="warning" size="sm">Paused</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border-subtle">
                <div><p className="text-kpi-value text-text-primary font-mono">567</p><p className="text-caption text-text-muted">Runs</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">87.3%</p><p className="text-caption text-text-muted">Success</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">4.1s</p><p className="text-caption text-text-muted">Avg Duration</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm"><ArrowUpRight className="w-4 h-4 mr-1" /> View Runs</Button>
                <Button variant="ghost" size="sm"><Settings className="w-4 h-4 mr-1" /> Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">3 workflow definitions</span>
          <Button variant="secondary" size="sm"><ArrowRight className="w-4 h-4 mr-2" /> Import from n8n</Button>
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