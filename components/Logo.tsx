'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  /** Logo variant */
  variant?: 'default' | 'sidebar' | 'login' | 'marketing';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show animated signal */
  animated?: boolean;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * LeadPilot Logo Component
 * 
 * Animated logo representing data flow, lead routing, and intelligence.
 * Uses CSS animations for the SVG elements and Framer Motion for text if needed.
 * Respects prefers-reduced-motion.
 */
export function Logo({
  variant = 'default',
  size = 'md',
  animated = true,
  className,
  onClick,
}: LogoProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Size configurations
  const sizeConfig = {
    sm: { container: 28, node: 8, orbit: 20, text: 'text-xs', gap: 2 },
    md: { container: 40, node: 12, orbit: 28, text: 'text-sm', gap: 3 },
    lg: { container: 56, node: 16, orbit: 40, text: 'text-base', gap: 4 },
    xl: { container: 72, node: 20, orbit: 52, text: 'text-lg', gap: 5 },
  };

  const config = sizeConfig[size];
  const showText = variant !== 'sidebar' || size !== 'sm';
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2',
        variant === 'sidebar' && 'justify-center',
        variant === 'login' && 'justify-center mx-auto mb-6',
        variant === 'marketing' && 'justify-start',
        className
      )}
      style={{ gap: config.gap }}
      aria-label="LeadPilot AI"
      disabled={!onClick}
    >
      <svg
        width={config.container}
        height={config.container}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn('flex-shrink-0', shouldAnimate && 'animate-logo-ambient')}
        style={{ animationDuration: shouldAnimate ? '4s' : '0s' }}
      >
        <defs>
          {/* Cyan glow filter */}
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#38BDF8" floodOpacity="0.4" result="glow" />
            <feComposite in="glow" in2="blur" operator="in" />
            <feComposite in="SourceGraphic" operator="over" />
          </filter>
          {/* Gradient for center node */}
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </radialGradient>
          {/* Gradient for orbit paths */}
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer glow ring - CSS animated */}
        {shouldAnimate && (
          <circle
            cx="32"
            cy="32"
            r={config.orbit / 2 + 4}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            style={{ filter: 'url(#cyanGlow)' }}
            className="animate-logo-glow"
          />
        )}

        {/* Primary orbit path - CSS animated */}
        <circle
          cx="32"
          cy="32"
          r={config.orbit / 2}
          fill="none"
          stroke="url(#orbitGradient)"
          strokeWidth={size === 'sm' ? 1.5 : 2}
          strokeDasharray="30 60"
          strokeLinecap="round"
          className={cn(shouldAnimate && 'animate-spin-slow')}
        />

        {/* Secondary orbit path (cross) - CSS animated */}
        <ellipse
          cx="32"
          cy="32"
          rx={config.orbit / 2 * 0.7}
          ry={config.orbit / 2 * 0.35}
          fill="none"
          stroke="#38BDF8"
          strokeWidth={size === 'sm' ? 1 : 1.5}
          strokeDasharray="20 40"
          strokeOpacity="0.5"
          className={cn(shouldAnimate && 'animate-spin-reverse')}
          style={{ transformOrigin: '32px 32px' }}
        />

        {/* Signal particles on primary orbit - CSS animated */}
        {shouldAnimate && (
          <>
            <circle
              cx={32 + config.orbit / 2}
              cy="32"
              r={size === 'sm' ? 2.5 : 3.5}
              fill="#38BDF8"
              style={{ filter: 'url(#cyanGlow)' }}
              className="animate-logo-signal"
            />
            <circle
              cx={32 + config.orbit / 2}
              cy="32"
              r={size === 'sm' ? 2 : 3}
              fill="#38BDF8"
              style={{ filter: 'url(#cyanGlow)', opacity: 0.6 }}
              className="animate-logo-signal-delayed"
            />
          </>
        )}

        {/* Center node - the "brain" - CSS animated pulse */}
        <circle
          cx="32"
          cy="32"
          r={config.node}
          fill="url(#nodeGradient)"
          style={{ filter: shouldAnimate ? 'url(#cyanGlow)' : 'none' }}
          className={cn(shouldAnimate && 'animate-logo-pulse')}
        />

        {/* Inner core */}
        <circle
          cx="32"
          cy="32"
          r={config.node * 0.45}
          fill="#0B1220"
          opacity={0.9}
        />

        {/* Data points inside center */}
        {size !== 'sm' && (
          <g fill="#38BDF8" opacity="0.8">
            <circle cx="32" cy={32 - config.node * 0.3} r={size === 'md' ? 1.2 : 1.8} />
            <circle cx={32 + config.node * 0.3} cy={32 + config.node * 0.2} r={size === 'md' ? 1.2 : 1.8} />
            <circle cx={32 - config.node * 0.3} cy={32 + config.node * 0.2} r={size === 'md' ? 1.2 : 1.8} />
          </g>
        )}
      </svg>

      {showText && (
        <>
          <span className={cn(
            'font-bold text-text-primary',
            config.text,
            variant === 'login' && 'text-lg',
            variant === 'marketing' && 'text-xl'
          )}>
            LeadPilot
          </span>
          {variant !== 'sidebar' && (
            <span className={cn(
              'font-medium text-text-muted',
              variant === 'login' && 'text-sm',
              variant === 'marketing' && 'text-base'
            )}>
              AI
            </span>
          )}
        </>
      )}
    </button>
  );
}

/** Logo with animated signal for loading states */
export function LoadingLogo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return <Logo variant="default" size={size} animated={true} className={className} />;
}

/** Static logo for favicon/marketing */
export function StaticLogo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  return <Logo variant="default" size={size} animated={false} className={className} />;
}