import dynamicFn from 'next/dynamic';
import { prisma } from '@/lib/db';

const IntegrationsClient = dynamicFn(
  () => import('@/components/IntegrationsClient').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-text-muted">Loading integrations…</div> }
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchIntegrations() {
  const events = await prisma.integrationEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { lead: true },
  });
  return events;
}

export default async function IntegrationsPage() {
  const events = await fetchIntegrations();
  return <IntegrationsClient events={events} />;
}