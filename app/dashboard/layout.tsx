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
  Bell,
  Activity,
  Settings,
  ShieldCheck,
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
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/leads', label: 'Leads', icon: Users },
    { href: '/dashboard/review', label: 'Review', icon: CheckSquare },
    { href: '/dashboard/follow-ups', label: 'Follow-ups', icon: Mail },
    { href: '/dashboard/workflows', label: 'Workflows', icon: Workflow },
    { href: '/dashboard/integrations', label: 'Integrations', icon: Radio },
    { href: '/dashboard/audit', label: 'Audit', icon: History },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md">
              LP
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">LeadPilot AI</h2>
              <span className="text-[10px] text-blue-600 font-mono flex items-center gap-1">
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
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                >
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200">
            <div>
              <div className="font-semibold text-gray-900 truncate">{user.name}</div>
              <div className="text-[10px] text-gray-500 font-mono">{user.role}</div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-xs font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> LeadPilot AI - Operations Console
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/submit"
              target="_blank"
              className="text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              Public Form ↗
            </Link>
            <a
              href="http://localhost:8025"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md text-gray-700 font-mono transition"
            >
              Mailpit UI (8025)
            </a>
            <Link
              href="/dashboard/notifications"
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
            >
              <Bell className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
}