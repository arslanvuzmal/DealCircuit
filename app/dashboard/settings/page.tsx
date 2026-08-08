import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const SettingsClient = dynamicImport.default(() => import("@/components/SettingsClient"), { ssr: false });

function SettingsPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Settings</h1>
          <p className="text-body-sm text-text-muted mt-1">Workspace configuration — integrations, security, data policies, and preferences.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-surface-interactive rounded-lg" />
        <div className="h-48 bg-surface-interactive rounded-lg" />
        <div className="h-48 bg-surface-interactive rounded-lg" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageFallback />}>
      <SettingsClient />
    </Suspense>
  );
}