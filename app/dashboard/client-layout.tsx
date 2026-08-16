'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { cn } from '@/lib/utils';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-200 ease-default',
          collapsed ? 'lg:main-content-collapsed' : 'lg:main-content-expanded'
        )}>
          {/* Top Bar */}
          <TopBar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20">
            <div className="content-max mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/**
 * Renders the dashboard chrome (sidebar/topbar) for an already-authenticated request.
 * Auth itself happens one level up in the server component (app/dashboard/layout.tsx),
 * which checks the session cookie and redirects to /login before this ever mounts.
 * middleware.ts only guards specific mutating API routes (see its matcher), not pages.
 */
export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}