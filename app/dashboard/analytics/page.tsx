import { Suspense } from "react";
import * as dynamicImport from "next/dynamic";

const AnalyticsClient = dynamicImport.default(() => import("@/components/AnalyticsClient"), { ssr: false });

function AnalyticsPageFallback() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Analytics</h1>
          <p className="text-body-sm text-text-muted mt-1">Business-purpose metrics — pipeline, conversion, velocity, and quality.</p>
        </div>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="h-32 bg-surface-interactive rounded-lg" />
          <div className="h-32 bg-surface-interactive rounded-lg" />
          <div className="h-32 bg-surface-interactive rounded-lg" />
          <div className="h-32 bg-surface-interactive rounded-lg" />
          <div className="h-32 bg-surface-interactive rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-surface-interactive rounded-lg" />
          <div className="h-64 bg-surface-interactive rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-surface-interactive rounded-lg" />
          <div className="h-64 bg-surface-interactive rounded-lg" />
        </div>
        <div className="h-64 bg-surface-interactive rounded-lg" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic" as const;
export const revalidate = 0;

export default function AnalyticsPage() {
  const mockData = {
    totalLeads: 2847,
    pipelineValue: 1247000,
    avgVelocity: 3.2,
    conversionRate: 14.7,
    avgApprovedScore: 87,
    maxWeeklyVolume: 156,
    weeklyVolume: [
      { week: "Week 1", count: 89 },
      { week: "Week 2", count: 124 },
      { week: "Week 3", count: 156 },
      { week: "Week 4", count: 132 },
    ],
    funnel: [
      { stage: "Ingested", count: 2847 },
      { stage: "Scored", count: 2634 },
      { stage: "In Review", count: 567 },
      { stage: "Approved", count: 419 },
      { stage: "Synced", count: 398 },
    ],
    sourcePerformance: [
      { source: "Website Form", leads: 1234, approved: 234, rate: 18.9, avgScore: 78 },
      { source: "API Import", leads: 892, approved: 112, rate: 12.5, avgScore: 72 },
      { source: "LinkedIn", leads: 456, approved: 48, rate: 10.5, avgScore: 81 },
      { source: "Referral", leads: 265, approved: 25, rate: 9.4, avgScore: 85 },
    ],
    velocityByCategory: [
      { category: "HOT", avgDays: 1.2, count: 89, minDays: 0.1, maxDays: 4.5 },
      { category: "WARM", avgDays: 2.8, count: 234, minDays: 0.5, maxDays: 8.2 },
      { category: "COLD", avgDays: 5.4, count: 96, minDays: 1.2, maxDays: 15.3 },
    ],
    scoringRules: [
      { id: "1", name: "Job Title Match", triggered: 1234, avgImpact: 15, correlation: "0.72", active: true },
      { id: "2", name: "Company Size > 50", triggered: 892, avgImpact: 12, correlation: "0.65", active: true },
      { id: "3", name: "Tech Stack Match", triggered: 567, avgImpact: 18, correlation: "0.78", active: true },
      { id: "4", name: "Recent Funding", triggered: 234, avgImpact: 22, correlation: "0.81", active: true },
      { id: "5", name: "Negative: Competitor", triggered: 112, avgImpact: -25, correlation: "-0.68", active: true },
    ],
  };

  return (
    <Suspense fallback={<AnalyticsPageFallback />}>
      <AnalyticsClient data={mockData} />
    </Suspense>
  );
}