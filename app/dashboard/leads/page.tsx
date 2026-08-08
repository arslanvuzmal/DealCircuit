import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
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
} from 'lucide-react';
import { formatNumber, formatRelativeTime } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Avatar } from '@/components/Avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/DropdownMenu';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      scores: { take: 1, orderBy: { createdAt: 'desc' } },
    },
  });
  return leads;
}

const CATEGORIES = ['HOT', 'WARM', 'COLD', 'REVIEW_REQUIRED', 'PENDING'];
const STATUSES = ['NEW', 'SCORED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
const CRM_STATUSES = ['SYNCED', 'FAILED', 'PENDING', 'FAILED_PERMANENT', 'FAILED_RETRYABLE'];

const categoryLabels: Record<string, string> = {
  HOT: 'HOT',
  WARM: 'WARM',
  COLD: 'COLD',
  REVIEW_REQUIRED: 'REVIEW',
  PENDING: 'PENDING',
};

const categoryVariants: Record<string, 'success' | 'warning' | 'neutral' | 'error' | 'info'> = {
  HOT: 'success',
  WARM: 'warning',
  COLD: 'neutral',
  REVIEW_REQUIRED: 'error',
  PENDING: 'info',
};

const crmStatusVariants: Record<string, 'success' | 'error' | 'warning' | 'neutral'> = {
  SYNCED: 'success',
  FAILED: 'error',
  FAILED_PERMANENT: 'error',
  FAILED_RETRYABLE: 'warning',
  PENDING: 'neutral',
};

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return <Badge variant="info" size="sm">PENDING</Badge>;
  return (
    <Badge variant={categoryVariants[category] || 'neutral'} size="sm">
      {categoryLabels[category] || category}
    </Badge>
  );
}

function CRMStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={crmStatusVariants[status] || 'neutral'} size="sm">
      {status}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    APPROVED: 'success',
    IN_REVIEW: 'warning',
    REJECTED: 'error',
    SCORED: 'info',
    NEW: 'neutral',
    ARCHIVED: 'neutral',
  };
  return (
    <Badge variant={variants[status] || 'neutral'} size="sm">
      {status}
    </Badge>
  );
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

export default async function LeadsDirectoryPage() {
  const leads = await fetchLeads();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-cyan" />
            Lead Directory
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Complete database of ingested, qualified, and synchronized leads.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="neutral" size="sm" className="flex items-center gap-1.5">
            <Filter className="w-3 h-3" />
            {formatNumber(leads.length)} Records
          </Badge>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="secondary" size="sm">
            <Columns className="w-4 h-4 mr-2" />
            Columns
          </Button>
        </div>
      </div>

      {/* Toolbar: Search + Filters */}
      <Card variant="compact" className="space-y-4">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                placeholder="Search leads, companies, emails…"
                className="pl-10"
                size="sm"
              />
            </div>

            {/* Category Filter */}
            <Select
              placeholder="All Categories"
              options={[{ value: '', label: 'All Categories' }, ...CATEGORIES.map(c => ({ value: c, label: categoryLabels[c] || c }))]}
              size="sm"
              className="w-40"
            />

            {/* Status Filter */}
            <Select
              placeholder="All Statuses"
              options={[{ value: '', label: 'All Statuses' }, ...STATUSES.map(s => ({ value: s, label: s }))]}
              size="sm"
              className="w-40"
            />

            {/* CRM Status Filter */}
            <Select
              placeholder="CRM Status"
              options={[{ value: '', label: 'CRM Status' }, ...CRM_STATUSES.map(s => ({ value: s, label: s }))]}
              size="sm"
              className="w-40"
            />

            {/* Date Range */}
            <Select
              placeholder="Date Range"
              options={[
                { value: '', label: 'Date Range' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 days' },
                { value: 'month', label: 'Last 30 days' },
                { value: 'quarter', label: 'Last 90 days' },
              ]}
              size="sm"
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
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
                    <Badge variant="neutral" size="sm">—</Badge>
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
                    {formatRelativeTime(lead.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <LeadRowActions lead={lead} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-caption text-text-muted">
            Showing {leads.length} of {formatNumber(leads.length)} leads
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm" disabled>Next</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Demo Mode Banner */}
      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">DEMO MODE</Badge>
              <span className="text-body-sm text-text-secondary">
                Data is simulated.
                <Link href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">
                  Manage demo data →
                </Link>
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}