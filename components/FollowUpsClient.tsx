"use client";

import React, { useState } from "react";
import { Mail, ExternalLink, Send, CheckCircle2, ChevronDown, ChevronUp, FileText, Clock, Zap } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

const STATUS_VARIANTS: Record<string, "success" | "error" | "warning" | "neutral" | "info"> = {
  PENDING: "warning",
  SENT: "success",
  FAILED: "error",
  DRAFT: "neutral",
};

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANTS[status] || "neutral"} size="sm">{status}</Badge>;
}

function EmptyFollowUps() {
  return (
    <div className="p-12 text-center">
      <Mail className="w-12 h-12 text-text-muted mx-auto mb-4" />
      <p className="text-body text-text-secondary">No follow-up drafts generated yet.</p>
      <p className="text-caption text-text-muted mt-1">Submit a qualified lead to trigger automated generation.</p>
    </div>
  );
}

function FollowUpsTable({ followUps }: { followUps: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadCell>Recipient</TableHeadCell>
          <TableHeadCell>Subject</TableHeadCell>
          <TableHeadCell className="text-center">Status</TableHeadCell>
          <TableHeadCell className="text-center">Lead Score</TableHeadCell>
          <TableHeadCell className="text-center">Generated</TableHeadCell>
          <TableHeadCell className="text-right">Actions</TableHeadCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {followUps.map((draft) => (
          <TableRow key={draft.id}>
            <TableCell>
              <div className="min-w-0">
                <div className="font-medium text-text-primary truncate">{draft.recipientEmail}</div>
                <div className="text-caption text-text-muted truncate">{draft.lead?.fullName || "Unknown Lead"}</div>
              </div>
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="font-medium text-text-primary truncate">{draft.subject}</div>
            </TableCell>
            <TableCell className="text-center"><StatusBadge status={draft.status} /></TableCell>
            <TableCell className="text-center font-mono text-text-secondary">{draft.lead?.totalScore ? `${draft.lead.totalScore}/100` : "—"}</TableCell>
            <TableCell className="text-center text-caption text-text-muted">{formatRelativeTime(draft.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="w-8 h-8"><FileText className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="w-8 h-8"><ExternalLink className="w-4 h-4" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface FollowUpsClientProps {}

export default function FollowUpsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mockFollowUps = [
    { id: "fu-1", recipientEmail: "john@acme.com", subject: "Following up on our conversation", status: "SENT", lead: { fullName: "John Smith", totalScore: 87 }, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), body: "Hi John,\n\nThanks for the great conversation earlier..." },
    { id: "fu-2", recipientEmail: "jane@beta.io", subject: "Next steps for your project", status: "PENDING", lead: { fullName: "Jane Doe", totalScore: 72 }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), body: "Hi Jane,\n\nI wanted to follow up on our discussion..." },
    { id: "fu-3", recipientEmail: "bob@gamma.co", subject: "Proposal attached", status: "FAILED", lead: { fullName: "Bob Wilson", totalScore: 65 }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), body: "Hi Bob,\n\nAs promised, here's the proposal..." },
    { id: "fu-4", recipientEmail: "alice@delta.net", subject: "Checking in", status: "DRAFT", lead: { fullName: "Alice Brown", totalScore: 58 }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), body: "Hi Alice,\n\nJust checking in to see..." },
    { id: "fu-5", recipientEmail: "charlie@epsilon.org", subject: "Meeting follow-up", status: "SENT", lead: { fullName: "Charlie Davis", totalScore: 91 }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), body: "Hi Charlie,\n\nGreat meeting today..." },
  ];

  const filteredFollowUps = mockFollowUps
    .filter((draft) => {
      if (searchQuery && !draft.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) && !draft.subject.toLowerCase().includes(searchQuery.toLowerCase()) && !draft.lead?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (statusFilter && draft.status !== statusFilter) return false;
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
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><Mail className="w-6 h-6 text-brand-purple" /> Follow-up Drafts</h1>
          <p className="text-body-sm text-text-muted mt-1">AI-generated email drafts for qualified leads — dispatched via Mailpit SMTP.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm"><ExternalLink className="w-4 h-4 mr-2" /> Open Mailpit</Button>
        </div>
      </div>

      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <input type="search" placeholder="Search recipient, subject, lead…" className="pl-10 w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select placeholder="All Statuses" options={[{ value: "", label: "All Statuses" }, { value: "PENDING", label: "PENDING" }, { value: "SENT", label: "SENT" }, { value: "FAILED", label: "FAILED" }, { value: "DRAFT", label: "DRAFT" }]} size="sm" className="w-36" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
            <Select placeholder="Sort By" options={[{ value: "createdAt", label: "Date" }, { value: "status", label: "Status" }, { value: "recipientEmail", label: "Recipient" }]} size="sm" className="w-36" value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
            <Select placeholder="Order" options={[{ value: "desc", label: "Descending" }, { value: "asc", label: "Ascending" }]} size="sm" className="w-36" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} />
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardContent className="p-0">
          {filteredFollowUps.length === 0 ? <EmptyFollowUps /> : <FollowUpsTable followUps={filteredFollowUps} />}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">{filteredFollowUps.length} of {mockFollowUps.length} drafts</span>
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