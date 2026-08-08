import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const ScoringRulesClient = dynamicImport.default(() => import("@/components/ScoringRulesClient"), { ssr: false });

function ScoringRulesPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Scoring Rules</h1>
          <p className="text-body-sm text-text-muted mt-1">Active 5-criteria qualification weights, max score caps, and tier thresholds.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 bg-surface-interactive rounded-lg" />
          <div className="h-48 bg-surface-interactive rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function ScoringRulesPage() {
  return (
    <Suspense fallback={<ScoringRulesPageFallback />}>
      <ScoringRulesClient />
    </Suspense>
  );
}