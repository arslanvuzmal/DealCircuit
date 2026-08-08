"use client";

import React from "react";
import { ShieldCheck, Mail } from "lucide-react";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

interface LeadActivityTabProps {
  lead: any;
}

export function LeadActivityTab({ lead }: LeadActivityTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Approvals */}
      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-status-success" /> Approval History</span>
            <Badge variant="neutral" size="sm">{lead.approvals?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHeadCell>Reviewer</TableHeadCell><TableHeadCell className="text-center">Decision</TableHeadCell><TableHeadCell>Category</TableHeadCell><TableHeadCell className="text-right">Date</TableHeadCell></TableRow></TableHeader>
            <TableBody>{lead.approvals?.map((a: any) => <TableRow key={a.id}><TableCell className="table-cell-primary">{a.user?.name || "System"}</TableCell><TableCell className="text-center"><Badge variant={a.decision === "APPROVED" ? "success" : "error"} size="sm">{a.decision}</Badge></TableCell><TableCell>{a.newCategory || "—"}</TableCell><TableCell className="text-right text-caption text-text-muted">{formatDateTime(a.createdAt)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Follow-ups */}
      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Mail className="w-5 h-5 text-brand-blue" /> Follow-up Drafts</span>
            <Badge variant="neutral" size="sm">{lead.followUps?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHeadCell>Type</TableHeadCell><TableHeadCell>Subject</TableHeadCell><TableHeadCell className="text-right">Created</TableHeadCell></TableRow></TableHeader>
            <TableBody>{lead.followUps?.map((f: any) => <TableRow key={f.id}><TableCell><Badge variant="info" size="sm">{f.type}</Badge></TableCell><TableCell className="truncate max-w-xs">{f.subject || "—"}</TableCell><TableCell className="text-right text-caption text-text-muted">{formatRelativeTime(f.createdAt)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}