import dynamicFn from 'next/dynamic';
import { prisma } from '@/lib/db';

const IntelligenceLabClient = dynamicFn(
  () => import('@/components/IntelligenceLabClient').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-text-muted">Loading Intelligence Lab…</div> }
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { scores: { take: 1, orderBy: { createdAt: 'desc' } } },
  });
  return leads;
}

export default async function IntelligenceLabPage() {
  const leads = await fetchLeads();
  return <IntelligenceLabClient leads={leads} />;
}