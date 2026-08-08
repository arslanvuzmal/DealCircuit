"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Database, ShieldCheck, Zap, ArrowRight, Search } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

const crmVariants: Record<string, "success" | "error" | "warning" | "neutral"> = { 
  SYNCED: "success", 
  FAILED: "error", 
  FAILED_PERMANENT: "error", 
  FAILED_RETRYABLE: "warning", 
  PENDING: "neutral" 
};

function CRMStatusBadge({ status }: { status: string }) { 
  return <Badge variant={crmVariants[status] || "neutral"} size="sm">{status}</Badge>; 
}

function EmptyEvents() {
  return <div className="p-12 text-center"><ShieldCheck className="w-12 h-12 text-text-muted mx-auto mb-4" /><p className="text-body text-text-secondary">No integration events recorded yet.</p></div>;
}

function EventsTable({ events }: { events: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadCell>System</TableHeadCell>
          <TableHeadCell>Event Type</TableHeadCell>
          <TableHeadCell>Lead Contact</TableHeadCell>
          <TableHeadCell className="text-center">Status</TableHeadCell>
          <TableHeadCell className="text-center">Attempts</TableHeadCell>
          <TableHeadCell className="text-right">Timestamp</TableHeadCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((evt) => (
          <TableRow key={evt.id}>
            <TableCell className="font-bold text-text-primary">{evt.system}</TableCell>
            <TableCell><Badge variant="info" size="sm">{evt.eventType}</Badge></TableCell>
            <TableCell>
              <div className="min-w-0">
                <div className="font-medium text-text-primary truncate">{evt.lead?.fullName || "System Event"}</div>
                <div className="text-caption text-text-muted truncate">{evt.lead?.workEmail || "N/A"}</div>
              </div>
            </TableCell>
            <TableCell className="text-center"><CRMStatusBadge status={evt.status} /></TableCell>
            <TableCell className="text-center font-mono text-text-secondary">{evt.attempts}/{evt.maxAttempts}</TableCell>
            <TableCell className="text-right text-caption text-text-muted">{formatRelativeTime(evt.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface IntegrationsClientProps { events: any[]; }

export default function IntegrationsClient({ events }: IntegrationsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [systemFilter, setSystemFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredEvents = events.filter((evt) => { 
    if (searchQuery && !evt.lead?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) && !evt.eventType?.toLowerCase().includes(searchQuery.toLowerCase()) && !evt.system?.toLowerCase().includes(searchQuery.toLowerCase())) return false; 
    if (statusFilter && evt.status !== statusFilter) return false; 
    if (systemFilter && evt.system !== systemFilter) return false; 
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
            <Database className="w-6 h-6 text-brand-blue" /> CRM & Integrations
          </h1>
          <p className="text-body-sm text-text-muted mt-1">Outbound integration activity for CRM Sync, Webhooks, and Mailpit dispatch events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">{events.length} Total Events</Badge>
          <Badge variant="info" size="sm">{[...new Set(events.map((e) => e.system))].length} Systems</Badge>
        </div>
      </div>

      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input placeholder="Search event, lead, system…" className="pl-10" size="sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select placeholder="All Statuses" options={[{ value: "", label: "All Statuses" }, { value: "SUCCESS", label: "SUCCESS" }, { value: "FAILED", label: "FAILED" }, { value: "FAILED_PERMANENT", label: "FAILED_PERMANENT" }, { value: "FAILED_RETRYABLE", label: "FAILED_RETRYABLE" }, { value: "PENDING", label: "PENDING" }]} size="sm" className="w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
            <Select placeholder="All Systems" options={[{ value: "", label: "All Systems" }, ...[...new Set(events.map((e) => e.system))].map((s) => ({ value: s, label: s }))]} size="sm" className="w-40" value={systemFilter} onChange={(e) => setSystemFilter(e.target.value)} />
            <Select placeholder="Sort By" options={[{ value: "createdAt", label: "Date" }, { value: "eventType", label: "Event" }, { value: "system", label: "System" }]} size="sm" className="w-36" value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
            <Select placeholder="Order" options={[{ value: "desc", label: "Descending" }, { value: "asc", label: "Ascending" }]} size="sm" className="w-36" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} />
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardContent className="p-0">
          {events.length === 0 ? <EmptyEvents /> : <EventsTable events={events} />}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">{events.length} events</span>
        </CardFooter>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-blue" /> CRM Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-blue/20 rounded-lg"><Database className="w-5 h-5 text-brand-blue" /></div>
                  <div>
                    <p className="font-medium text-text-primary">HubSpot</p>
                    <p className="text-caption text-text-muted">Primary CRM</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-kpi-value text-text-primary font-mono">247</p><p className="text-caption text-text-muted">Synced</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">3</p><p className="text-caption text-text-muted">Failed</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">12</p><p className="text-caption text-text-muted">Pending</p></div>
              </div>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-cyan/20 rounded-lg"><ShieldCheck className="w-5 h-5 text-brand-cyan" /></div>
                  <div>
                    <p className="font-medium text-text-primary">Salesforce</p>
                    <p className="text-caption text-text-muted">Secondary CRM</p>
                  </div>
                </div>
                <Badge variant="warning" size="sm">Not Configured</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-kpi-value text-text-muted">—</p><p className="text-caption text-text-muted">Synced</p></div>
                <div><p className="text-kpi-value text-text-muted">—</p><p className="text-caption text-text-muted">Failed</p></div>
                <div><p className="text-kpi-value text-text-muted">—</p><p className="text-caption text-text-muted">Pending</p></div>
              </div>
            </div>
            <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-cyan/20 rounded-lg"><Zap className="w-5 h-5 text-brand-cyan" /></div>
                  <div>
                    <p className="font-medium text-text-primary">Mailpit (Email)</p>
                    <p className="text-caption text-text-muted">SMTP Testing</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-kpi-value text-text-primary font-mono">1,234</p><p className="text-caption text-text-muted">Captured</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">0</p><p className="text-caption text-text-muted">Failed</p></div>
                <div><p className="text-kpi-value text-text-primary font-mono">5</p><p className="text-caption text-text-muted">Queued</p></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">3 integration adapters</span>
          <Button variant="secondary" size="sm"><ArrowRight className="w-4 h-4 mr-2" /> Configure New</Button>
        </CardFooter>
      </Card>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">DEMO MODE</Badge>
              <span className="text-body-sm text-text-secondary">Data is simulated. <Link href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data →</Link></span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}