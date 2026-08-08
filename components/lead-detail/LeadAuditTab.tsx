"use client";

import React from "react";
import { FileText } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { CRMStatusBadge } from "./LeadBadges";

interface LeadAuditTabProps {
  lead: any;
}

export function LeadAuditTab({ lead }: LeadAuditTabProps) {
  return (
    <Card variant="padded" className="space-y-4">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-brand-blue" /> Structured Execution Audit Trail</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table><TableHeader><TableRow><TableHeadCell>Timestamp</TableHeadCell><TableHeadCell>Event</TableHeadCell><TableHeadCell>Status</TableHeadCell><TableHeadCell>Provider</TableHeadCell><TableHeadCell className="text-right">Trace ID</TableHeadCell></TableRow></TableHeader>
        <TableBody>{lead.integrationEvents?.map((e: any) => <TableRow key={e.id}><TableCell className="text-caption text-text-muted">{formatDateTime(e.createdAt)}</TableCell><TableCell className="table-cell-primary">{e.eventType}</TableCell><TableCell><CRMStatusBadge status={e.status} /></TableCell><TableCell>{e.provider}</TableCell><TableCell className="text-right text-mono-sm text-text-muted">{e.traceId || e.id.slice(0, 12)}</TableCell></TableRow>)}</TableBody></Table>
      </CardContent>
    </Card>
  );
}