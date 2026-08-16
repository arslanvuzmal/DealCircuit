'use client';

import React, { useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';

const CATEGORIES = ['HOT', 'WARM', 'COLD', 'REVIEW_REQUIRED', 'PENDING'];
const STATUSES = ['NEW', 'SCORED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
const CRM_STATUSES = ['SYNCED', 'FAILED', 'PENDING', 'FAILED_PERMANENT', 'FAILED_RETRYABLE'];

export function LeadsFilterBar({
  initial,
}: {
  initial: { q?: string; category?: string; status?: string; crmStatus?: string; dateRange?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initial.q || '');

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <Card variant="compact" className="space-y-4">
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder="Search leads, companies, emails…"
              className="pl-10"
              size="sm"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateParam('q', q);
              }}
              onBlur={() => updateParam('q', q)}
            />
          </div>

          <Select
            placeholder="All Categories"
            options={[{ value: '', label: 'All Categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
            size="sm"
            className="w-40"
            value={initial.category || ''}
            onChange={(e) => updateParam('category', e.target.value)}
          />

          <Select
            placeholder="All Statuses"
            options={[{ value: '', label: 'All Statuses' }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
            size="sm"
            className="w-40"
            value={initial.status || ''}
            onChange={(e) => updateParam('status', e.target.value)}
          />

          <Select
            placeholder="CRM Status"
            options={[{ value: '', label: 'CRM Status' }, ...CRM_STATUSES.map((s) => ({ value: s, label: s }))]}
            size="sm"
            className="w-40"
            value={initial.crmStatus || ''}
            onChange={(e) => updateParam('crmStatus', e.target.value)}
          />

          <Select
            placeholder="Date Range"
            options={[
              { value: '', label: 'Date Range' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 days' },
              { value: 'month', label: 'Last 30 days' },
              { value: 'quarter', label: 'Last 90 days' },
            ]}
            size="sm"
            className="w-40"
            value={initial.dateRange || ''}
            onChange={(e) => updateParam('dateRange', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
