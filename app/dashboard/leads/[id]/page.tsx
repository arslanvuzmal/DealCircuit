import dynamicFn from "next/dynamic";
import { notFound } from "next/navigation";

const LeadDetailClient = dynamicFn(
  () => import("@/components/LeadDetailClient").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-text-muted">Loading lead details…</div> }
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchLeadDetail(id: string) {
  const { prisma } = await import("@/lib/db");
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      scores: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { createdAt: "desc" } },
      approvals: { include: { user: true }, orderBy: { createdAt: "desc" } },
      integrationEvents: { orderBy: { createdAt: "desc" } },
    },
  });
  return lead;
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await fetchLeadDetail(params.id);

  if (!lead) {
    notFound();
  }

  return <LeadDetailClient lead={lead} />;
}