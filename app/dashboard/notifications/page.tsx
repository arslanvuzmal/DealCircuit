import React from 'react';
import { prisma } from '@/lib/db';
import { Bell, Flame, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-6 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-dark-bright tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-purple" /> System Notifications & Alerts
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Real-time alert log for captured hot leads, review-required flags, and CRM sync issues.
          </p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center p-8 text-dark-muted text-xs">
            No system notifications logged yet.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-dark-bg/60 border border-dark-border rounded-xl p-4 flex items-start gap-3 text-xs"
              >
                <div className="p-2 rounded-lg bg-dark-hover flex-shrink-0">
                  {notif.type === 'HOT_LEAD' ? (
                    <Flame className="w-4 h-4 text-brand-emerald" />
                  ) : notif.type === 'REVIEW_NEEDED' ? (
                    <AlertTriangle className="w-4 h-4 text-brand-coral" />
                  ) : notif.type === 'SYNC_ERROR' ? (
                    <XCircle className="w-4 h-4 text-brand-amber" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-dark-bright text-sm">{notif.title}</span>
                    <span className="text-[11px] text-dark-muted">{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-dark-text leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
