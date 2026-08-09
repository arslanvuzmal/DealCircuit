"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Filter,
  Search,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  Download,
  Columns,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Avatar } from "@/components/Avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/DropdownMenu";

const CATEGORIES = ["HOT", "WARM", "COLD", "REVIEW_REQUIRED", "PENDING"];
const STATUSES = ["NEW", "SCORED", "IN_REVIEW", "APPROVED", "REJECTED", "ARCHIVED"];
const CRM_STATUSES = ["SYNCED", "FAILED", "PENDING", "FAILED_PERMANENT", "FAILED_RETRYABLE"];

const categoryLabels: Record<string, string> = {
  HOT: "HOT",
  WARM: "WARM",
  COLD: "COLD",
  REVIEW_REQUIRED: "REVIEW",
  PENDING: "PENDING",
};

const categoryVariants: Record<string, "success" | "warning" | "neutral" | "error" | "info"> = {
  HOT: "success",
  WARM: "warning",
  COLD: "neutral",
  REVIEW_REQUIRED: "error",
  PENDING: "info",
};

const crmStatusVariants: Record<string, "success" | "error" | "warning" | "neutral"> = {
  SYNCED: "success",
  FAILED: "error",
  FAILED_PERMANENT: "error",
  FAILED_RETRYABLE: "warning",
  PENDING: "neutral",
};

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return <Badge variant="info" size="sm">PENDING</Badge>;
  return (
    <Badge variant={categoryVariants[category] || "neutral"} size="sm">
      {categoryLabels[category] || category}
    </Badge>
  );
}

function CRMStatusBadge({ status }: { status: string }) {
  const variants: Record<string, "success" | "error" | "warning" | "neutral"> = {
    SYNCED: "success",
    FAILED: "error",
    FAILED_PERMANENT: "error",
    FAILED_RETRYABLE: "warning",
    PENDING: "neutral",
  };
  return <Badge variant={variants[status] || "neutral"} size="sm">{status}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
    APPROVED: "success",
    IN_REVIEW: "warning",
    REJECTED: "error",
    SCORED: "info",
    NEW: "neutral",
    ARCHIVED: "neutral",
  };
  return <Badge variant={variants[status] || "neutral"} size="sm">{status}</Badge>;
}

function LeadRowActions({ lead }: { lead: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}`} className="flex w-full items-center">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>
            Inspect
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}`} className="flex w-full items-center">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}/approve`} className="flex w-full items-center text-status-success">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}/reject`} className="flex w-full items-center text-status-error">
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-status-error" onClick={() => { /* handle delete */ }}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LeadsTableProps {
  leads: any[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <Card variant="padded" className="space-y-4">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadCell className="w-64">Contact</TableHeadCell>
              <TableHeadCell className="w-56">Company</TableHeadCell>
              <TableHeadCell className="w-28 text-center">Category</TableHeadCell>
              <TableHeadCell className="w-28 text-center">Score</TableHeadCell>
              <TableHeadCell className="w-28 text-center">Confidence</TableHeadCell>
              <TableHeadCell className="w-28 text-center">Status</TableHeadCell>
              <TableHeadCell className="w-36 text-center">CRM Sync</TableHeadCell>
              <TableHeadCell className="w-28 text-center">Source</TableHeadCell>
              <TableHeadCell className="w-28 text-right">Updated</TableHeadCell>
              <TableHeadCell className="w-12 text-right">Actions</TableHeadCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="table-cell-primary">
                  <div className="flex items-center gap-3">
                    <Avatar name={lead.fullName} size="sm" />
                    <div className="min-w-0">
                      <div className="font-medium text-text-primary truncate">{lead.fullName}</div>
                      <div className="text-mono-sm text-text-muted truncate">{lead.workEmail}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-text-primary truncate">{lead.companyName}</div>
                    <div className="text-caption text-text-muted truncate">{lead.industry}</div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={lead.category === "HOT" ? "success" : lead.category === "WARM" ? "warning" : lead.category === "COLD" ? "neutral" : "error"} size="sm">
                    {lead.category || "PENDING"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-text-primary">
                  {lead.totalScore !== null ? `${lead.totalScore}/100` : <span className="text-text-muted">—</span>}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="neutral" size="sm">—</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={lead.status === "APPROVED" ? "success" : lead.status === "IN_REVIEW" ? "warning" : lead.status === "REJECTED" ? "error" : lead.status === "SCORED" ? "info" : "neutral"} size="sm">
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={lead.crmSyncStatus === "SYNCED" ? "success" : lead.crmSyncStatus === "FAILED" ? "error" : lead.crmSyncStatus === "FAILED_PERMANENT" ? "error" : lead.crmSyncStatus === "FAILED_RETRYABLE" ? "warning" : "neutral"} size="sm">
                    {lead.crmSyncStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-caption text-text-muted">
                  {lead.leadSource}
                </TableCell>
                <TableCell className="text-right text-caption text-text-muted">
                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Link href={`/dashboard/leads/${lead.id}`} className="flex w-full items-center">
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>
                          Inspect
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/leads/${lead.id}`} className="flex w-full items-center">
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/dashboard/leads/${lead.id}/approve`} className="flex w-full items-center text-status-success">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/leads/${lead.id}/reject`} className="flex w-full items-center text-status-error">
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-status-error" onClick={() => { /* handle delete */ }}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-caption text-text-muted">
          Showing {leads.length} leads
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled>Previous</Button>
          <Button variant="ghost" size="sm" disabled>Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
}