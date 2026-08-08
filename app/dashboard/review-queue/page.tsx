import dynamicFn from 'next/dynamic';

const ReviewQueueClient = dynamicFn(
  () => import('@/components/ReviewQueueClient').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-text-muted">Loading review queue…</div> }
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchReviewLeads() {
  const { prisma } = await import('@/lib/db');
  const leads = await prisma.lead.findMany({
    where: { category: 'REVIEW_REQUIRED' },
    orderBy: { createdAt: 'desc' },
    include: { scores: { take: 1, orderBy: { createdAt: 'desc' } } },
  });
  return leads;
}

export default async function ReviewQueuePage() {
  const leads = await fetchReviewLeads();
  return <ReviewQueueClient leads={leads} />;
}