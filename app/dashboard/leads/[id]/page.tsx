import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Flame,
  Zap,
  Snowflake,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  Globe,
  Briefcase,
  DollarSign,
  Clock,
  UserCheck,
  ShieldAlert,
  Bot,
  Send,
  History,
} from 'lucide-react';

export const revalidate = 0;

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      scores: { orderBy: { createdAt: 'desc' } },
      followUps: { orderBy: { createdAt: 'desc' } },
      approvals: { include: { user: true }, orderBy: { createdAt: 'desc' } },
      integrationEvents: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!lead) {
    notFound();
  }

  const latestScore = lead.scores[0];
  const latestFollowUp = lead.followUps[0];
  const scoreBreakdown = latestScore?.scoreBreakdownJson ? JSON.parse(latestScore.scoreBreakdownJson) : null;
  const risks: string[] = latestScore?.risksJson ? JSON.parse(latestScore.risksJson) : [];
  const missingInfo: string[] = latestScore?.missingInfoJson ? JSON.parse(latestScore.missingInfoJson) : [];

  return (
    <div className="space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/leads"
          className="text-xs text-dark-muted hover:text-dark-bright flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        <div className="flex items-center gap-3">
          {lead.category === 'REVIEW_REQUIRED' && (
            <Link
              href="/dashboard/review-queue"
              className="px-3 py-1.5 bg-brand-coral/20 border border-brand-coral/40 text-brand-coral text-xs font-semibold rounded-lg hover:bg-brand-coral/30 transition flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Action Required in Review Queue
            </Link>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-dark-bright tracking-tight">{lead.fullName}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  lead.category === 'HOT'
                    ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                    : lead.category === 'WARM'
                    ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                    : lead.category === 'COLD'
                    ? 'bg-dark-bg text-dark-muted border-dark-border'
                    : 'bg-brand-coral/10 text-brand-coral border-brand-coral/30'
                }`}
              >
                {lead.category || 'PENDING'}
              </span>
            </div>
            <p className="text-xs text-dark-muted mt-1 flex items-center gap-2">
              <span>{lead.companyName}</span> &bull; <span>{lead.workEmail}</span> &bull; <span>ID: {lead.id}</span>
            </p>
          </div>

          <div className="flex items-center gap-6 bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
            <div className="text-center">
              <span className="text-[10px] text-dark-muted block">TOTAL SCORE</span>
              <span className="text-2xl font-extrabold text-brand-emerald">{lead.totalScore ?? '-'}/100</span>
            </div>
            <div className="h-8 w-px bg-dark-border" />
            <div className="text-center">
              <span className="text-[10px] text-dark-muted block">STATUS</span>
              <span className="text-xs font-bold text-dark-bright font-mono">{lead.status}</span>
            </div>
            <div className="h-8 w-px bg-dark-border" />
            <div className="text-center">
              <span className="text-[10px] text-dark-muted block">CRM SYNC</span>
              <span className="text-xs font-bold text-brand-cyan font-mono">{lead.crmSyncStatus}</span>
            </div>
          </div>
        </div>

        {/* Lead Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1">
            <span className="text-dark-muted block flex items-center gap-1"><Building className="w-3.5 h-3.5 text-brand-cyan" /> Company & Size</span>
            <span className="font-semibold text-dark-bright block">{lead.companyName} ({lead.companySize})</span>
          </div>

          <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1">
            <span className="text-dark-muted block flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-brand-purple" /> Industry & Service</span>
            <span className="font-semibold text-dark-bright block">{lead.industry} &bull; {lead.serviceRequired}</span>
          </div>

          <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1">
            <span className="text-dark-muted block flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-brand-emerald" /> Budget Range</span>
            <span className="font-semibold text-dark-bright block">{lead.budgetRange}</span>
          </div>

          <div className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1">
            <span className="text-dark-muted block flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-amber" /> Timeline & Authority</span>
            <span className="font-semibold text-dark-bright block">{lead.desiredTimeline} &bull; {lead.decisionAuthority}</span>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border space-y-2 text-xs">
          <h3 className="font-bold text-dark-bright">Project Description & Requirements:</h3>
          <p className="text-dark-text whitespace-pre-line leading-relaxed">{lead.projectDescription}</p>
        </div>
      </div>

      {/* Qualification Breakdown & AI Reasoning */}
      {latestScore && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Breakdown Bars */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand-cyan" /> 5-Criteria Score Breakdown
            </h2>

            {scoreBreakdown && (
              <div className="space-y-3 text-xs">
                {Object.entries(scoreBreakdown).map(([key, item]: [string, any]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="capitalize text-dark-bright">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-brand-emerald font-bold">{item.score} / {item.maxScore}</span>
                    </div>
                    <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                      <div
                        className="h-full bg-gradient-to-r from-brand-cyan to-brand-emerald rounded-full"
                        style={{ width: `${Math.min(100, (item.score / item.maxScore) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-dark-muted italic">{item.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Reasoning & Risks */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-amber" /> AI Explanation & Risk Analysis
            </h2>

            <div className="space-y-3">
              <div>
                <span className="text-dark-muted block mb-1 font-semibold">Summary & Rationale:</span>
                <p className="text-dark-text bg-dark-bg/60 p-3 rounded-lg border border-dark-border">{latestScore.summary}</p>
              </div>

              {risks.length > 0 && (
                <div>
                  <span className="text-brand-coral block mb-1 font-semibold">Identified Risks:</span>
                  <ul className="list-disc list-inside text-dark-muted space-y-1 bg-brand-coral/5 p-3 rounded-lg border border-brand-coral/20">
                    {risks.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {missingInfo.length > 0 && (
                <div>
                  <span className="text-brand-amber block mb-1 font-semibold">Missing Information:</span>
                  <ul className="list-disc list-inside text-dark-muted space-y-1 bg-brand-amber/5 p-3 rounded-lg border border-brand-amber/20">
                    {missingInfo.map((info, idx) => (
                      <li key={idx}>{info}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 text-[11px] text-dark-muted flex justify-between border-t border-dark-border">
                <span>Provider: {latestScore.aiProvider}</span>
                <span>Model: {latestScore.aiModel}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Draft & Sent Mail */}
      {latestFollowUp && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-purple" /> Follow-up Email Status
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
              STATUS: {latestFollowUp.status}
            </span>
          </div>

          <div>
            <span className="text-dark-muted block mb-1 font-semibold">Subject:</span>
            <div className="font-semibold text-dark-bright">{latestFollowUp.subject}</div>
          </div>

          <div>
            <span className="text-dark-muted block mb-1 font-semibold">Body Content:</span>
            <pre className="bg-dark-bg/60 p-4 rounded-lg border border-dark-border text-dark-text whitespace-pre-wrap font-sans text-xs">
              {latestFollowUp.body}
            </pre>
          </div>
        </div>
      )}

      {/* Audit & Decision Log */}
      {lead.approvals.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3 text-xs">
          <h2 className="text-sm font-bold text-dark-bright flex items-center gap-2">
            <History className="w-4 h-4 text-brand-cyan" /> Reviewer Decision Log
          </h2>

          <div className="space-y-2">
            {lead.approvals.map((app) => (
              <div key={app.id} className="bg-dark-bg/60 p-3 rounded-lg border border-dark-border space-y-1">
                <div className="flex justify-between text-dark-bright font-semibold">
                  <span>Action: {app.action} by {app.user.name}</span>
                  <span className="text-dark-muted font-normal text-[11px]">{new Date(app.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-dark-muted italic">{app.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
