"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, CheckCircle2, XCircle, Archive as ArchiveIcon, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Avatar } from "@/components/Avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/DropdownMenu";

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

const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  APPROVED: "success",
  IN_REVIEW: "warning",
  REJECTED: "error",
  SCORED: "info",
  NEW: "neutral",
  ARCHIVED: "neutral",
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
  return <Badge variant={crmStatusVariants[status] || "neutral"} size="sm">{status}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariants[status] || "neutral"} size="sm">{status}</Badge>;
}

function ConfidenceBadge({ confidence }: { confidence: number | null | undefined }) {
  if (confidence == null) return <Badge variant="neutral" size="sm">—</Badge>;
  return (
    <Badge variant={confidence >= 0.8 ? "success" : confidence >= 0.5 ? "warning" : "error"} size="sm">
      {Math.round(confidence * 100)}%
    </Badge>
  );
}

function LeadRowActions({ lead }: { lead: any }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  const runAction = async (action: "approve" | "reject" | "archive") => {
    setPending(action);
    try {
      const res = await fetch(`/api/leads/${lead.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to ${action} lead`);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setPending(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={pending !== null}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}`} className="flex w-full items-center">
            <Eye className="mr-2 h-4 w-4" />
            Inspect
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => runAction("approve")} disabled={pending !== null}>
          <span className="flex w-full items-center text-status-success">
            <CheckCircle2 className="mr-2 h-4 w-4" /> {pending === "approve" ? "Approving…" : "Approve"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => runAction("reject")} disabled={pending !== null}>
          <span className="flex w-full items-center text-status-error">
            <XCircle className="mr-2 h-4 w-4" /> {pending === "reject" ? "Rejecting…" : "Reject"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => runAction("archive")} disabled={pending !== null}>
          <span className="flex w-full items-center text-status-error">
            <ArchiveIcon className="mr-2 h-4 w-4" /> {pending === "archive" ? "Archiving…" : "Archive"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LeadsTableProps {
  leads: any[];
  page: number;
  totalPages: number;
  total: number;
  prevHref?: string;
  nextHref?: string;
}

export function LeadsTable({ leads, page, totalPages, total, prevHref, nextHref }: LeadsTableProps) {
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
                  <CategoryBadge category={lead.category} />
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-text-primary">
                  {lead.totalScore !== null ? `${lead.totalScore}/100` : <span className="text-text-muted">—</span>}
                </TableCell>
                <TableCell className="text-center">
                  <ConfidenceBadge confidence={lead.scores?.[0]?.confidence} />
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="text-center">
                  <CRMStatusBadge status={lead.crmSyncStatus} />
                </TableCell>
                <TableCell className="text-center text-caption text-text-muted">
                  {lead.leadSource}
                </TableCell>
                <TableCell className="text-right text-caption text-text-muted">
                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <LeadRowActions lead={lead} />
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-text-muted py-10">
                  No leads match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-caption text-text-muted">
          {total === 0 ? "No leads" : `Page ${page} of ${totalPages} · ${total} total`}
        </span>
        <div className="flex items-center gap-2">
          {prevHref ? (
            <Link href={prevHref}>
              <Button variant="ghost" size="sm">Previous</Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" disabled>Previous</Button>
          )}
          {nextHref ? (
            <Link href={nextHref}>
              <Button variant="ghost" size="sm">Next</Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" disabled>Next</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
