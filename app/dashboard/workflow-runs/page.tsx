import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const WorkflowRunsClient = dynamicImport.default(() => import("@/components/WorkflowRunsClient"), { ssr: false });

function WorkflowRunsPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Workflow Runs</h1>
          <p className="text-body-sm text-text-muted mt-1">Execution history for lead-intake, daily-digest, failed-retry, and review-completion workflows.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="h-48 bg-surface-interactive rounded-lg" />
        <div className="h-64 bg-surface-interactive rounded-lg" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function WorkflowRunsPage() {
  return (
    <Suspense fallback={<WorkflowRunsPageFallback />}>
      <WorkflowRunsClient />
    </Suspense>
  );
}