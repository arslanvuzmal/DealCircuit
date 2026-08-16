import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { buildLeadsWhere } from '@/lib/leadsFilter';

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const token = cookies().get('token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const where = buildLeadsWhere({
    q: sp.get('q') || undefined,
    category: sp.get('category') || undefined,
    status: sp.get('status') || undefined,
    crmStatus: sp.get('crmStatus') || undefined,
    dateRange: sp.get('dateRange') || undefined,
  });

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 5000,
    include: { scores: { take: 1, orderBy: { createdAt: 'desc' } } },
  });

  const columns = [
    'id', 'fullName', 'workEmail', 'companyName', 'industry', 'category',
    'totalScore', 'confidence', 'status', 'crmSyncStatus', 'leadSource', 'createdAt',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.fullName,
    lead.workEmail,
    lead.companyName,
    lead.industry,
    lead.category ?? '',
    lead.totalScore ?? '',
    lead.scores[0]?.confidence != null ? Math.round(lead.scores[0].confidence * 100) : '',
    lead.status,
    lead.crmSyncStatus,
    lead.leadSource,
    lead.createdAt.toISOString(),
  ]);

  const csv = [columns.join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
