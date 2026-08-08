import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { DashboardClientLayout } from './client-layout';

export default async function DashboardServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('token')?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  );
}