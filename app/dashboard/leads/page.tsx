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
import { LeadsTable } from '@/components/leads/LeadsTable';

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
            {leads.length} Records
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
              options={[{ value: '', label: 'All Categories' }, ...['HOT', 'WARM', 'COLD', 'REVIEW_REQUIRED', 'PENDING'].map(c => ({ value: c, label: c }))]}
              size="sm"
              className="w-40"
            />

            {/* Status Filter */}
            <Select
              placeholder="All Statuses"
              options={[{ value: '', label: 'All Statuses' }, ...['NEW', 'SCORED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'].map(s => ({ value: s, label: s }))]}
              size="sm"
              className="w-40"
            />

            {/* CRM Status Filter */}
            <Select
              placeholder="CRM Status"
              options={[{ value: '', label: 'CRM Status' }, ...['SYNCED', 'FAILED', 'PENDING', 'FAILED_PERMANENT', 'FAILED_RETRYABLE'].map(s => ({ value: s, label: s }))]}
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

      {/* Leads Table - Client Component for interactivity */}
      <LeadsTable leads={leads} />

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