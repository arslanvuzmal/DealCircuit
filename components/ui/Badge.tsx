'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'neutral'
    | 'brand'
    | 'user-provided'
    | 'derived'
    | 'demo-enriched'
    | 'externally-verified'
    | 'unknown';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Show dot indicator */
  dot?: boolean;
  /** Dot color override */
  dotColor?: string;
}

const variantClasses = {
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  neutral: 'badge-neutral',
  brand: 'badge-brand',
  'user-provided': 'badge-user-provided',
  derived: 'badge-derived',
  'demo-enriched': 'badge-demo-enriched',
  'externally-verified': 'badge-externally-verified',
  unknown: 'badge-unknown',
};

const sizeClasses = {
  xs: 'px-1 py-0 text-[0.625rem] gap-0.5',
  sm: 'px-1.5 py-0.5 text-[0.6875rem] gap-1',
  md: 'px-2 py-0.5 text-caption gap-1.5',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'neutral', size = 'md', dot, dotColor, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('badge', variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {dot && (
          <span
            className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: dotColor || 'currentColor' }}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;