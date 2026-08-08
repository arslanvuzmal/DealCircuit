"use client";

import React from "react";
import { Database, ShieldCheck } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { StatusBadge, CRMStatusBadge } from "./LeadBadges";

interface LeadCRMTabProps {
  lead: any;
}

export function LeadCRMTab({ lead }: LeadCRMTabProps) {
  return (
    <>
      <Card variant="padded" className="space-y-4">
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-brand-blue" /> CRM Record Preview</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-surface-interactive rounded-lg p-4 border border-border-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-blue/20 rounded-lg"><Database className="w-6 h-6 text-brand-blue" /></div>
              <div><p className="text-caption text-text-muted">CRM Status</p><p className="font-medium text-text-primary">{lead.crmSyncStatus}</p></div>
              {lead.crmExternalId && <div className="ml-auto"><p className="text-caption text-text-muted">External ID</p><p className="font-mono text-text-primary">{lead.crmExternalId}</p></div>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm">
              <div><p className="text-caption text-text-muted">Account</p><p className="font-medium text-text-primary">{lead.companyName}</p></div>
              <div><p className="text-caption text-text-muted">Contact</p><p className="font-medium text-text-primary">{lead.fullName}</p></div>
              <div><p className="text-caption text-text-muted">Stage</p><StatusBadge status={lead.status} /></div>
              <div><p className="text-caption text-text-muted">Owner</p><p className="font-medium text-text-primary">—</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="padded" className="space-y-4">
        <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-status-success" /> Sync History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHeadCell>Event</TableHeadCell><TableHeadCell>Status</TableHeadCell><TableHeadCell>Attempts</TableHeadCell><TableHeadCell className="text-right">Timestamp</TableHeadCell></TableRow></TableHeader>
          <TableBody>{lead.integrationEvents?.filter((e: any) => e.provider !== "internal").map((e: any) => <TableRow key={e.id}><TableCell className="table-cell-primary">{e.eventType}</TableCell><TableCell><CRMStatusBadge status={e.status} /></TableCell><TableCell className="text-center font-mono">{e.attemptCount}</TableCell><TableCell className="text-right text-caption text-text-muted">{formatDateTime(e.createdAt)}</TableCell></TableRow>)}</TableBody></Table>
        </CardContent>
      </Card>
    </>
  );
}