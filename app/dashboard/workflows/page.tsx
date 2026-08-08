import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const WorkflowsClient = dynamicImport.default(() => import("@/components/WorkflowsClient"), { ssr: false });

function WorkflowsPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Workflows</h1>
          <p className="text-body-sm text-text-muted mt-1">n8n workflow execution history with retry visualization.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-surface-interactive rounded-lg" />
        <div className="h-64 bg-surface-interactive rounded-lg" />
        <div className="h-64 bg-surface-interactive rounded-lg" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function WorkflowsPage() {
  return (
    <Suspense fallback={<WorkflowsPageFallback />}>
      <WorkflowsClient workflows={[
        { id: "wf-1", name: "Lead Enrichment", trigger: "lead.created", lead: { fullName: "John Smith", workEmail: "john@acme.com" }, status: "COMPLETED", duration: 1234, startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: "wf-2", name: "CRM Sync", trigger: "lead.updated", lead: { fullName: "Jane Doe", workEmail: "jane@beta.io" }, status: "COMPLETED", duration: 2876, startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: "wf-3", name: "Follow-up Sequences", trigger: "lead.scored", lead: { fullName: "Bob Wilson", workEmail: "bob@gamma.co" }, status: "RUNNING", duration: null, startedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
        { id: "wf-4", name: "Lead Enrichment", trigger: "lead.created", lead: { fullName: "Alice Brown", workEmail: "alice@delta.net" }, status: "FAILED", duration: 5432, startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        { id: "wf-5", name: "CRM Sync", trigger: "lead.updated", lead: { fullName: "Charlie Davis", workEmail: "charlie@epsilon.org" }, status: "COMPLETED", duration: 1987, startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      ]} />
    </Suspense>
  );
}