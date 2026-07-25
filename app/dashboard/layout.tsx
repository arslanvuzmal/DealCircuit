import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Mail,
  Sliders,
  Radio,
  Workflow,
  History,
  SlidersHorizontal,
  LogOut,
  ShieldCheck,
  Bell,
  Sparkles,
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('token')?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect('/login');
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview Metrics', icon: LayoutDashboard },
    { href: '/dashboard/leads', label: 'Lead Directory', icon: Users },
    { href: '/dashboard/review-queue', label: 'Review Queue', icon: CheckSquare },
    { href: '/dashboard/follow-ups', label: 'Follow-up Drafts', icon: Mail },
    { href: '/dashboard/scoring-rules', label: 'Scoring Rules', icon: Sliders },
    { href: '/dashboard/integrations', label: 'Integrations & CRM', icon: Radio },
    { href: '/dashboard/workflow-runs', label: 'n8n Workflows', icon: Workflow },
    { href: '/dashboard/audit-logs', label: 'Audit Logs', icon: History },
    { href: '/dashboard/demo-controls', label: 'Demo Controls', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-r border-dark-border flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-3 border-b border-dark-border pb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-white text-base shadow-md">
              LP
            </div>
            <div>
              <h2 className="text-sm font-bold text-dark-bright tracking-tight">LeadPilot AI</h2>
              <span className="text-[10px] text-brand-cyan font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> DEMO_MODE
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-dark-muted hover:text-dark-bright hover:bg-dark-hover transition"
                >
                  <Icon className="w-4 h-4 text-brand-cyan" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-dark-border space-y-3">
          <div className="flex items-center justify-between text-xs bg-dark-bg/60 p-2.5 rounded-lg border border-dark-border">
            <div>
              <div className="font-semibold text-dark-bright truncate">{user.name}</div>
              <div className="text-[10px] text-dark-muted font-mono">{user.role}</div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-dark-card border-b border-dark-border px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-xs font-semibold text-dark-bright flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-purple" /> Lead Qualification & CRM Automation Platform
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/submit"
              target="_blank"
              className="text-brand-cyan hover:underline font-medium flex items-center gap-1"
            >
              Public Form ↗
            </Link>
            <a
              href="http://localhost:8025"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-dark-hover border border-dark-border rounded-md text-dark-bright font-mono hover:border-brand-cyan transition"
            >
              Mailpit UI (8025)
            </a>
            <div className="w-8 h-8 rounded-full bg-dark-hover border border-dark-border flex items-center justify-center text-dark-muted">
              <Bell className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
