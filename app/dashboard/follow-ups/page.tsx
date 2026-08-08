import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const FollowUpsClient = dynamicImport.default(() => import("@/components/FollowUpsClient"), { ssr: false });

function FollowUpsPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Follow-up Drafts</h1>
          <p className="text-body-sm text-text-muted mt-1">AI-generated email drafts for qualified leads — dispatched via Mailpit.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-surface-interactive rounded-lg" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function FollowUpsPage() {
  return (
    <Suspense fallback={<FollowUpsPageFallback />}>
      <FollowUpsClient />
    </Suspense>
  );
}