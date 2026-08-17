'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: 'good' | 'bad' | 'neutral';
}

export function MetricCard({ label, value, trend = 'neutral' }: MetricCardProps) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-3">
      <p className="text-caption text-text-muted">{label}</p>
      <p className="font-bold text-text-primary text-body"
        style={{ color: trend === 'good' ? 'var(--color-status-success)' : 'var(--color-text-primary)' }}>
        {value}
      </p>
    </div>
  );
}