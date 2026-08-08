"use client";

import React, { useState } from "react";
import { Bell, Flame, AlertTriangle, XCircle, CheckCircle2, Shield, Zap, Filter, ChevronDown } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

const NOTIFICATION_TYPES = ["HOT_LEAD", "REVIEW_NEEDED", "SYNC_ERROR", "WORKFLOW_FAILED", "SYNC_SUCCESS", "LEAD_APPROVED"];
const typeIcons: Record<string, React.ReactNode> = {
  HOT_LEAD: <Flame className="w-4 h-4 text-status-warning" />,
  REVIEW_NEEDED: <AlertTriangle className="w-4 h-4 text-status-error" />,
  SYNC_ERROR: <XCircle className="w-4 h-4 text-status-error" />,
  WORKFLOW_FAILED: <Zap className="w-4 h-4 text-status-error" />,
  SYNC_SUCCESS: <CheckCircle2 className="w-4 h-4 text-status-success" />,
  LEAD_APPROVED: <Shield className="w-4 h-4 text-status-success" />,
};
const typeLabels: Record<string, string> = {
  HOT_LEAD: "Hot Lead Captured",
  REVIEW_NEEDED: "Review Required",
  SYNC_ERROR: "CRM Sync Failed",
  WORKFLOW_FAILED: "Workflow Failed",
  SYNC_SUCCESS: "CRM Sync Success",
  LEAD_APPROVED: "Lead Approved",
};
const typeVariants: Record<string, "success" | "error" | "warning" | "neutral" | "info"> = {
  HOT_LEAD: "warning",
  REVIEW_NEEDED: "error",
  SYNC_ERROR: "error",
  WORKFLOW_FAILED: "error",
  SYNC_SUCCESS: "success",
  LEAD_APPROVED: "success",
};

function NotificationRow({ notification }: { notification: any }) {
  const Icon = typeIcons[notification.type] || <Bell className="w-4 h-4" />;
  return (
    <TableRow>
      <TableCell className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-surface-interactive">{Icon}</div>
        <div>
          <div className="font-medium text-text-primary">{typeLabels[notification.type] || notification.type}</div>
          <div className="text-caption text-text-muted">{notification.title}</div>
        </div>
      </TableCell>
      <TableCell className="max-w-md text-text-secondary">{notification.message}</TableCell>
      <TableCell className="text-center"><Badge variant={typeVariants[notification.type] || "neutral"} size="sm">{notification.type}</Badge></TableCell>
      <TableCell className="text-center text-caption text-text-muted">{formatRelativeTime(notification.createdAt)}</TableCell>
      <TableCell className="text-center text-caption text-text-muted">{notification.read ? "Read" : "Unread"}</TableCell>
    </TableRow>
  );
}

function EmptyNotifications() {
  return (
    <div className="p-12 text-center">
      <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
      <p className="text-body text-text-secondary">No system notifications logged yet.</p>
    </div>
  );
}

interface NotificationsClientProps {}

export default function NotificationsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const mockNotifications = [
    { id: "notif-1", type: "HOT_LEAD", title: "New HOT Lead: John Smith", message: "Lead scored 87/100 from Website Form. Ready for immediate outreach.", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false },
    { id: "notif-2", type: "REVIEW_NEEDED", title: "Review Required: Alice Brown", message: "Lead scored 58/100 (below 60 threshold). Duplicate check flagged.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
    { id: "notif-3", type: "SYNC_ERROR", title: "CRM Sync Failed: Bob Wilson", message: "HubSpot API returned 429 (rate limit). Retry scheduled in 5 minutes.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), read: true },
    { id: "notif-4", type: "LEAD_APPROVED", title: "Lead Approved: Jane Doe", message: "Approved by jane.doe@company.com. CRM sync initiated.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), read: true },
    { id: "notif-5", type: "SYNC_SUCCESS", title: "CRM Sync Complete: John Smith", message: "Successfully synced to HubSpot (contact ID: hubspot-456).", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true },
    { id: "notif-6", type: "WORKFLOW_FAILED", title: "Workflow Failed: Follow-up Sequence", message: "n8n workflow 'followup-sequence' failed at node 'Send Email'. Error: SMTP timeout.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), read: true },
    { id: "notif-7", type: "HOT_LEAD", title: "New HOT Lead: Charlie Davis", message: "Lead scored 91/100 from LinkedIn. Company: Epsilon Corp (200+ employees).", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
    { id: "notif-8", type: "REVIEW_NEEDED", title: "Review Required: Diana Prince", message: "Lead scored 55/100. Potential competitor email domain detected.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), read: true },
  ];

  const filteredNotifications = mockNotifications
    .filter((n) => {
      if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (typeFilter && n.type !== typeFilter) return false;
      if (readFilter && (readFilter === "read" ? !n.read : n.read)) return false;
      return true;
    })
    .sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortBy]);
      const bVal = String((b as Record<string, unknown>)[sortBy]);
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><Bell className="w-6 h-6 text-brand-purple" /> Notifications</h1>
          <p className="text-body-sm text-text-muted mt-1">Real-time alert log for captured hot leads, review-required flags, and CRM sync issues.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={unreadCount > 0 ? "warning" : "neutral"} size="sm">{unreadCount} Unread</Badge>
          <Badge variant="neutral" size="sm">{mockNotifications.length} Total</Badge>
        </div>
      </div>

      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md"><Input placeholder="Search title, message…" className="pl-10" size="sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select placeholder="All Types" options={[{ value: "", label: "All Types" }, ...NOTIFICATION_TYPES.map(t => ({ value: t, label: typeLabels[t] }))]} size="sm" className="w-44" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
            <Select placeholder="Read Status" options={[{ value: "", label: "All" }, { value: "read", label: "Read" }, { value: "unread", label: "Unread" }]} size="sm" className="w-36" value={readFilter} onChange={(e) => setReadFilter(e.target.value)} />
            <Select placeholder="Sort By" options={[{ value: "createdAt", label: "Date" }, { value: "type", label: "Type" }, { value: "read", label: "Read Status" }]} size="sm" className="w-36" value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
            <Select placeholder="Order" options={[{ value: "desc", label: "Descending" }, { value: "asc", label: "Ascending" }]} size="sm" className="w-36" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} />
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? <EmptyNotifications /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Event</TableHeadCell>
                  <TableHeadCell>Message</TableHeadCell>
                  <TableHeadCell className="text-center">Type</TableHeadCell>
                  <TableHeadCell className="text-center">Time</TableHeadCell>
                  <TableHeadCell className="text-center">Status</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((n) => <NotificationRow key={n.id} notification={n} />)}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">{filteredNotifications.length} of {mockNotifications.length} notifications</span>
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