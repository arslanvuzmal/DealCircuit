import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const HealthClient = dynamicImport.default(() => import("@/components/HealthClient"), { ssr: false });

function HealthPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">System Health</h1>
          <p className="text-body-sm text-text-muted mt-1">System diagnostics, database connectivity, and environment status.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-surface-interactive rounded-lg" />
          <div className="h-40 bg-surface-interactive rounded-lg" />
          <div className="h-40 bg-surface-interactive rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function HealthPage() {
  return (
    <Suspense fallback={<HealthPageFallback />}>
      <HealthClient />
    </Suspense>
  );
}