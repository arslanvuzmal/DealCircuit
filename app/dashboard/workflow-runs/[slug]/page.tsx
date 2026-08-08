import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const WorkflowShowcaseClient = dynamicImport.default(() => import("@/components/WorkflowShowcaseClient"), { ssr: false });

function WorkflowShowcasePageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Workflow Showcase</h1>
          <p className="text-body-sm text-text-muted mt-1">Detailed pipeline breakdown and technical specification.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="h-48 bg-surface-interactive rounded-lg" />
        <div className="h-64 bg-surface-interactive rounded-lg" />
        <div className="h-64 bg-surface-interactive rounded-lg" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function WorkflowShowcasePage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<WorkflowShowcasePageFallback />}>
      <WorkflowShowcaseClient slug={params.slug} />
    </Suspense>
  );
}