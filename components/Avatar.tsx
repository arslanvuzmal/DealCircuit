'use client';

import React, { forwardRef, ImgHTMLAttributes } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** User name for fallback initials */
  name?: string;
  /** Image source */
  src?: string;
  /** Alt text */
  alt?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Shape */
  shape?: 'circle' | 'square';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Custom className */
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[0.625rem]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

const statusColors = {
  online: 'bg-status-success',
  offline: 'bg-text-muted',
  busy: 'bg-status-error',
  away: 'bg-status-warning',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ name, src, alt, size = 'md', shape = 'circle', status, className, width, height, ...props }, ref) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';
    const hasImage = src && src.length > 0;
    const sizeMap = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 } as const;
    const dimension: number = sizeMap[size];

    return (
      <div className={cn('relative inline-flex shrink-0', className)}>
        {hasImage ? (
          <Image
            src={src}
            alt={alt || name || 'Avatar'}
            width={dimension as number}
            height={dimension as number}
            className={cn(sizeClasses[size], shapeClass, 'object-cover')}
            sizes={`${dimension}px`}
            {...props}
          />
        ) : (
          <div
            ref={ref}
            className={cn(
              sizeClasses[size],
              shapeClass,
              'bg-brand-cyan-dim',
              'flex items-center justify-center',
              'font-medium text-brand-cyan-light',
              'border border-border-subtle'
            )}
            aria-label={name || 'User avatar'}
            {...props}
          >
            {name ? getInitials(name) : <User className="w-full h-full" aria-hidden="true" />}
          </div>
        )}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 border-2 border-background-primary',
              statusSizeClasses[size],
              'rounded-full',
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

/** Avatar Group - for stacking multiple avatars */
export interface AvatarGroupProps {
  /** Array of avatar props */
  avatars: (AvatarProps & { key: string })[];
  /** Maximum avatars to show before +N */
  max?: number;
  /** Size for all avatars */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** ClassName */
  className?: string;
}

export function AvatarGroup({ avatars, max = 5, size = 'md', className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)} aria-label={`${avatars.length} users`}>
      {visibleAvatars.map((avatar) => {
        const { key, ...avatarProps } = avatar;
        return (
          <Avatar key={key} {...avatarProps} size={size} className="ring-2 ring-background-primary" />
        );
      })}
      {remainingCount > 0 && (
        <div
          className={cn(
            sizeClasses[size],
            'rounded-full',
            'bg-surface-interactive',
            'flex items-center justify-center',
            'font-medium text-text-secondary',
            'border-2 border-background-primary'
          )}
          aria-label={`${remainingCount} more users`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}