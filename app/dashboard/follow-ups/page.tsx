import React from 'react';
import { prisma } from '@/lib/db';
import { Mail, ExternalLink, Send, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function FollowUpsPage() {
  const followUps = await prisma.followUp.findMany({
    include: { lead: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-purple" /> Follow-up Draft & Dispatch Manager
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Preview, inspect, and verify auto-generated email drafts dispatched via local Mailpit SMTP adapter.
          </p>
        </div>

        <a
          href="http://localhost:8025"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-semibold rounded-lg shadow hover:opacity-90 transition flex items-center gap-1.5"
        >
          <ExternalLink className="w-4 h-4" /> Open Mailpit Inbox (8025)
        </a>
      </div>

      <div className="space-y-4">
        {followUps.map((item) => (
          <div key={item.id} className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <div>
                <div className="font-bold text-dark-bright text-sm">{item.subject}</div>
                <div className="text-xs text-dark-muted">To: {item.recipientEmail} &bull; Lead: {item.lead.fullName} ({item.lead.companyName})</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                    item.status === 'SENT'
                      ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30'
                      : 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <pre className="bg-dark-bg/60 p-4 rounded-lg border border-dark-border text-dark-text whitespace-pre-wrap font-sans text-xs leading-relaxed">
              {item.body}
            </pre>

            <div className="flex items-center justify-between text-[11px] text-dark-muted pt-1">
              <span>Adapter: {item.emailAdapter}</span>
              <span>{item.sentAt ? `Dispatched: ${new Date(item.sentAt).toLocaleString()}` : `Created: ${new Date(item.createdAt).toLocaleString()}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
