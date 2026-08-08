"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, FileText, AlertTriangle, CheckCircle2, XCircle, Shield, Zap, Database, Clock, ArrowRight, Download, Eye } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

const AUDIT_EVENT_TYPES = ["LEAD_INGESTED", "LEAD_SCORED", "LEAD_REVIEWED", "CRM_SYNC", "WEBHOOK_RECEIVED", "WORKFLOW_TRIGGERED", "EMAIL_SENT", "RULE_EVALUATED"];
const auditVariants: Record<string, "success" | "error" | "warning" | "neutral" | "info"> = { 
  LEAD_INGESTED: "info", 
  LEAD_SCORED: "neutral", 
  LEAD_REVIEWED: "success", 
  CRM_SYNC: "success", 
  WEBHOOK_RECEIVED: "info", 
  WORKFLOW_TRIGGERED: "neutral", 
  EMAIL_SENT: "warning", 
  RULE_EVALUATED: "neutral" 
};

const AUDIT_STATUSES = ["SUCCESS", "FAILED", "PARTIAL", "PENDING"];
const statusVariants: Record<string, "success" | "error" | "warning" | "neutral"> = { SUCCESS: "success", FAILED: "error", PARTIAL: "warning", PENDING: "neutral" };

function AuditStatusBadge({ status }: { status: string }) { return <Badge variant={statusVariants[status] || "neutral"} size="sm">{status}</Badge>; }
function AuditEventBadge({ type }: { type: string }) { return <Badge variant={auditVariants[type] || "neutral"} size="sm">{type}</Badge>; }

function EmptyAudit() {
  return <div className="p-12 text-center"><FileText className="w-12 h-12 text-text-muted mx-auto mb-4" /><p className="text-body text-text-secondary">No audit events recorded yet.</p></div>;
}

function AuditTable({ events, onViewDetails }: { events: any[]; onViewDetails: (id: string) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadCell>Timestamp</TableHeadCell>
          <TableHeadCell>Event Type</TableHeadCell>
          <TableHeadCell>Actor</TableHeadCell>
          <TableHeadCell>Subject</TableHeadCell>
          <TableHeadCell className="text-center">Status</TableHeadCell>
          <TableHeadCell className="text-center">Duration</TableHeadCell>
          <TableHeadCell className="text-right">Actions</TableHeadCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((evt) => (
          <TableRow key={evt.id}>
            <TableCell className="font-mono text-caption text-text-secondary whitespace-nowrap">{formatRelativeTime(evt.timestamp)}</TableCell>
            <TableCell><AuditEventBadge type={evt.eventType} /></TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-cyan-dim flex items-center justify-center text-brand-cyan text-xs font-medium">{evt.actor?.charAt(0) || "S"}</span>
                <div><div className="font-medium text-text-primary text-sm">{evt.actor}</div><div className="text-caption text-text-muted">{evt.actorType}</div></div>
              </div>
            </TableCell>
            <TableCell>
              <div className="min-w-0">
                <div className="font-medium text-text-primary truncate">{evt.subject?.name || "System"}</div>
                <div className="text-caption text-text-muted truncate">{evt.subject?.type || "N/A"}</div>
              </div>
            </TableCell>
            <TableCell className="text-center"><AuditStatusBadge status={evt.status} /></TableCell>
            <TableCell className="text-center font-mono text-text-secondary">{evt.duration ? `${evt.duration}ms` : "—"}</TableCell>
            <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => onViewDetails(evt.id)}><Eye className="w-4 h-4" /></Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface AuditClientProps { events: any[]; }

export default function AuditClient({ events }: AuditClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actorFilter, setActorFilter] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const filteredEvents = events.filter((evt) => { 
    if (searchQuery && !evt.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !evt.eventType?.toLowerCase().includes(searchQuery.toLowerCase()) && !evt.actor?.toLowerCase().includes(searchQuery.toLowerCase())) return false; 
    if (typeFilter && evt.eventType !== typeFilter) return false; 
    if (statusFilter && evt.status !== statusFilter) return false; 
    if (actorFilter && evt.actor !== actorFilter) return false; 
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
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><FileText className="w-6 h-6 text-brand-blue" /> Audit Trail</h1>
          <p className="text-body-sm text-text-muted mt-1">Structured execution audit explorer — every decision, sync, and transformation traced.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">{events.length} Total Events</Badge>
          <Badge variant="info" size="sm">{[...new Set(events.map((e) => e.eventType))].length} Event Types</Badge>
          <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" /><Input placeholder="Search subject, actor, event…" className="pl-10" size="sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select placeholder="All Event Types" options={[{ value: "", label: "All Event Types" }, ...AUDIT_EVENT_TYPES.map(t => ({ value: t, label: t }))]} size="sm" className="w-44" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
            <Select placeholder="All Statuses" options={[{ value: "", label: "All Statuses" }, ...AUDIT_STATUSES.map(s => ({ value: s, label: s }))]} size="sm" className="w-36" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
            <Select placeholder="All Actors" options={[{ value: "", label: "All Actors" }, ...[...new Set(events.map((e) => e.actor))].map(a => ({ value: a, label: a }))]} size="sm" className="w-40" value={actorFilter} onChange={(e) => setActorFilter(e.target.value)} />
            <Select placeholder="Sort By" options={[{ value: "timestamp", label: "Time" }, { value: "eventType", label: "Event" }, { value: "status", label: "Status" }]} size="sm" className="w-32" value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
            <Select placeholder="Order" options={[{ value: "desc", label: "Descending" }, { value: "asc", label: "Ascending" }]} size="sm" className="w-32" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} />
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardContent className="p-0">
          {events.length === 0 ? <EmptyAudit /> : <AuditTable events={filteredEvents} onViewDetails={setSelectedEvent} />}
        </CardContent>
        <CardFooter className="flex items-center justify-between"><span className="text-caption text-text-muted">{filteredEvents.length} of {events.length} events</span></CardFooter>
      </Card>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-surface-elevated rounded-xl border border-border-subtle max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border-subtle">
              <h3 className="text-heading-sm text-text-primary">Audit Event Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>Close</Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><p className="text-caption text-text-muted">Event ID</p><p className="font-mono text-text-primary">{selectedEvent.id}</p></div>
                <div><p className="text-caption text-text-muted">Timestamp</p><p className="font-mono text-text-primary">{new Date(selectedEvent.timestamp).toISOString()}</p></div>
                <div><p className="text-caption text-text-muted">Event Type</p><p className="font-mono text-text-primary">{selectedEvent.eventType}</p></div>
                <div><p className="text-caption text-text-muted">Status</p><p><AuditStatusBadge status={selectedEvent.status} /></p></div>
                <div className="col-span-2"><p className="text-caption text-text-muted">Actor</p><p className="font-medium text-text-primary">{selectedEvent.actor} <Badge variant="neutral" size="sm" className="ml-2">{selectedEvent.actorType}</Badge></p></div>
                <div className="col-span-2"><p className="text-caption text-text-muted">Subject</p><p className="font-medium text-text-primary">{selectedEvent.subject?.name || "System"} <Badge variant="neutral" size="sm" className="ml-2">{selectedEvent.subject?.type || "N/A"}</Badge></p></div>
              </div>
              <div className="border-t border-border-subtle pt-4">
                <p className="text-caption text-text-muted mb-2">Payload</p>
                <pre className="bg-bg-tertiary rounded-lg p-4 text-caption text-text-secondary overflow-x-auto font-mono">{JSON.stringify(selectedEvent.payload, null, 2)}</pre>
              </div>
              {selectedEvent.error && (
                <div className="border-t border-border-subtle pt-4 mt-4">
                  <p className="text-caption text-text-muted mb-2">Error</p>
                  <pre className="bg-status-error-bg/20 rounded-lg p-4 text-caption text-status-error overflow-x-auto font-mono">{selectedEvent.error}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Card variant="padded" className="space-y-4">
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-brand-blue" /> System Health Summary</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle text-center"><div className="text-kpi-value text-text-primary font-mono">99.2%</div><div className="text-caption text-text-muted">Success Rate</div></div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle text-center"><div className="text-kpi-value text-text-primary font-mono">1,247</div><div className="text-caption text-text-muted">Events (24h)</div></div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle text-center"><div className="text-kpi-value text-text-primary font-mono">12ms</div><div className="text-caption text-text-muted">Avg Latency</div></div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle text-center"><div className="text-kpi-value text-status-error font-mono">3</div><div className="text-caption text-text-muted">Active Alerts</div></div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between"><span className="text-caption text-text-muted">Last updated: {formatRelativeTime(new Date().toISOString())}</span><Button variant="secondary" size="sm"><ArrowRight className="w-4 h-4 mr-2" /> View Alerts</Button></CardFooter>
      </Card>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (<Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Badge variant="info" size="sm">DEMO MODE</Badge><span className="text-body-sm text-text-secondary">Data is simulated. <a href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data →</a></span></div></div></Card>)}
    </div>
  );
}