import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const AuditClient = dynamicImport.default(() => import("@/components/AuditClient"), { ssr: false });

function AuditPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Audit Trail</h1>
          <p className="text-body-sm text-text-muted mt-1">Structured execution audit explorer — every decision, sync, and transformation traced.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-surface-interactive rounded-lg" />
        <div className="h-64 bg-surface-interactive rounded-lg" />
        <div className="h-48 bg-surface-interactive rounded-lg" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function AuditPage() {
  const mockEvents = [
    { id: "audit-1", eventType: "LEAD_INGESTED", actor: "webhook-github", actorType: "system", subject: { name: "John Smith", type: "Lead" }, status: "SUCCESS", duration: 45, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), payload: { source: "github", webhookId: "wh-123" } },
    { id: "audit-2", eventType: "LEAD_SCORED", actor: "scoring-engine", actorType: "system", subject: { name: "John Smith", type: "Lead" }, status: "SUCCESS", duration: 123, timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), payload: { score: 87, rulesTriggered: 5 } },
    { id: "audit-3", eventType: "LEAD_REVIEWED", actor: "jane.doe@company.com", actorType: "user", subject: { name: "John Smith", type: "Lead" }, status: "SUCCESS", duration: 0, timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), payload: { decision: "APPROVED", notes: "Strong fit" } },
    { id: "audit-4", eventType: "CRM_SYNC", actor: "hubspot-adapter", actorType: "system", subject: { name: "John Smith", type: "Lead" }, status: "SUCCESS", duration: 234, timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(), payload: { crmId: "hubspot-456", operation: "upsert" } },
    { id: "audit-5", eventType: "WORKFLOW_TRIGGERED", actor: "n8n-webhook", actorType: "system", subject: { name: "Follow-up Sequence", type: "Workflow" }, status: "SUCCESS", duration: 89, timestamp: new Date(Date.now() - 1000 * 30).toISOString(), payload: { workflowId: "wf-followup", trigger: "lead.approved" } },
    { id: "audit-6", eventType: "EMAIL_SENT", actor: "mailpit-smtp", actorType: "system", subject: { name: "Follow-up Email #1", type: "Email" }, status: "SUCCESS", duration: 56, timestamp: new Date(Date.now() - 1000 * 15).toISOString(), payload: { to: "john@acme.com", template: "followup-1" } },
    { id: "audit-7", eventType: "RULE_EVALUATED", actor: "scoring-engine", actorType: "system", subject: { name: "Job Title Match", type: "Rule" }, status: "SUCCESS", duration: 12, timestamp: new Date(Date.now() - 1000 * 10).toISOString(), payload: { ruleId: "rule-1", matched: true, impact: 15 } },
    { id: "audit-8", eventType: "LEAD_INGESTED", actor: "api-import", actorType: "system", subject: { name: "Alice Brown", type: "Lead" }, status: "FAILED", duration: 67, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), payload: { source: "csv-import", error: "Invalid email format" }, error: "ValidationError: workEmail must be a valid email address" },
  ];

  return (
    <Suspense fallback={<AuditPageFallback />}>
      <AuditClient events={mockEvents} />
    </Suspense>
  );
}