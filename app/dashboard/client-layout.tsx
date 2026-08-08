'use client';

import React, { Suspense } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-200 ease-default',
        'lg:ml-[16rem]' // sidebar expanded width
      )}>
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20">
          <div className="max-w-[72rem] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/** Client-side wrapper for authentication check */
export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled by middleware
  // This component just provides the layout
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}