import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Users, Filter, Download, Columns } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LeadsFilterBar } from '@/components/leads/LeadsFilterBar';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { buildLeadsWhere } from '@/lib/leadsFilter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PAGE_SIZE = 25;

interface LeadsPageSearchParams {
  q?: string;
  category?: string;
  status?: string;
  crmStatus?: string;
  dateRange?: string;
  page?: string;
}

async function fetchLeads(searchParams: LeadsPageSearchParams) {
  const where = buildLeadsWhere(searchParams);
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        scores: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, page };
}

function buildQueryString(searchParams: LeadsPageSearchParams, overrides: Record<string, string | undefined>) {
  const merged = { ...searchParams, ...overrides };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

export default async function LeadsDirectoryPage({
  searchParams,
}: {
  searchParams: LeadsPageSearchParams;
}) {
  const { leads, total, page } = await fetchLeads(searchParams);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportQuery = buildQueryString(searchParams, { page: undefined });

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
            {total} Records
          </Badge>
          <a
            href={`/api/leads/export${exportQuery ? `?${exportQuery}` : ''}`}
            className="btn btn-secondary btn-sm inline-flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </a>
        </div>
      </div>

      {/* Toolbar: Search + Filters */}
      <LeadsFilterBar initial={searchParams} />

      {/* Leads Table - Client Component for interactivity */}
      <LeadsTable
        leads={leads}
        page={page}
        totalPages={totalPages}
        total={total}
        prevHref={page > 1 ? `/dashboard/leads?${buildQueryString(searchParams, { page: String(page - 1) })}` : undefined}
        nextHref={page < totalPages ? `/dashboard/leads?${buildQueryString(searchParams, { page: String(page + 1) })}` : undefined}
      />

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
