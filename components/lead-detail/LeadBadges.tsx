"use client";

import React from "react";
import { Search, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const categoryLabels: Record<string, string> = {
  HOT: "HOT", WARM: "WARM", COLD: "COLD",
  REVIEW_REQUIRED: "REVIEW REQUIRED", PENDING: "PENDING",
};
const categoryVariants: Record<string, "success" | "warning" | "neutral" | "error" | "info"> = {
  HOT: "success", WARM: "warning", COLD: "neutral", REVIEW_REQUIRED: "error", PENDING: "info",
};
const statusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  APPROVED: "success", IN_REVIEW: "warning", REJECTED: "error", SCORED: "info", NEW: "neutral", ARCHIVED: "neutral",
};
const crmVariants: Record<string, "success" | "error" | "warning" | "neutral"> = {
  SYNCED: "success", FAILED: "error", FAILED_PERMANENT: "error", FAILED_RETRYABLE: "warning", PENDING: "neutral",
};

export function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return <Badge variant="info" size="sm">PENDING</Badge>;
  return <Badge variant={categoryVariants[category] || "neutral"} size="sm">{categoryLabels[category] || category}</Badge>;
}
export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariants[status] || "neutral"} size="sm">{status}</Badge>;
}
export function CRMStatusBadge({ status }: { status: string }) {
  return <Badge variant={crmVariants[status] || "neutral"} size="sm">{status}</Badge>;
}

export function ProvenanceBadge({ source }: { source: string }) {
  const variants: Record<string, "user-provided" | "derived" | "demo-enriched" | "externally-verified" | "unknown"> = {
    USER_PROVIDED: "user-provided", DERIVED: "derived", DEMO_ENRICHED: "demo-enriched", EXTERNALLY_VERIFIED: "externally-verified",
  };
  const variant = variants[source] || "unknown";
  const labels: Record<string, string> = {
    "user-provided": "User Provided", derived: "Derived",
    "demo-enriched": "Demo Enriched", "externally-verified": "Externally Verified", unknown: "Unknown",
  };
  return <Badge variant={variant} size="sm">{labels[variant] || variant}</Badge>;
}

export function ScoreRow({ label, score, max, color }: { label: string; score: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-body-sm"><span className="text-text-secondary">{label}</span><span className="font-mono font-bold text-text-primary">{score}/{max}</span></div>
      <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} /></div>
    </div>
  );
}