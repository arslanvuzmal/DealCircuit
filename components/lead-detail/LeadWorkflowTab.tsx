"use client";

import React from "react";
import { GitBranch } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { CRMStatusBadge } from "./LeadBadges";

interface LeadWorkflowTabProps {
  lead: any;
}

export function LeadWorkflowTab({ lead }: LeadWorkflowTabProps) {
  return (
    <Card variant="padded" className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><GitBranch className="w-5 h-5 text-brand-cyan" /> Integration Events</span>
          <Badge variant="neutral" size="sm">{lead.integrationEvents?.length || 0}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHeadCell>Event</TableHeadCell><TableHeadCell>Provider</TableHeadCell><TableHeadCell className="text-center">Status</TableHeadCell><TableHeadCell>Attempts</TableHeadCell><TableHeadCell className="text-right">Last Updated</TableHeadCell></TableRow></TableHeader>
          <TableBody>{lead.integrationEvents?.map((e: any) => <TableRow key={e.id}><TableCell className="table-cell-primary">{e.eventType}</TableCell><TableCell>{e.provider}</TableCell><TableCell className="text-center"><CRMStatusBadge status={e.status} /></TableCell><TableCell className="text-center font-mono text-text-secondary">{e.attemptCount}</TableCell><TableCell className="text-right text-caption text-text-muted">{formatRelativeTime(e.updatedAt || e.createdAt)}</TableCell></TableRow>)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}