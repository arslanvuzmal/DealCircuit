'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Child element to attach tooltip to */
  children: React.ReactElement;
  /** Position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing (ms) */
  delay?: number;
  /** Custom className for tooltip */
  className?: string;
  /** Custom className for arrow */
  arrowClassName?: string;
}

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = {
  top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-border-subtle',
  bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-border-subtle',
  left: 'right-[-4px] top-1/2 -translate-y-1/2 border-l-border-subtle',
  right: 'left-[-4px] top-1/2 -translate-y-1/2 border-r-border-subtle',
};

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
  arrowClassName,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLElement>(null);

  // Clone child to add ref and event handlers
  const childWithProps = React.cloneElement(children, {
    ref: childRef,
    onMouseEnter: () => {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    },
    onMouseLeave: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(false);
    },
    onFocus: () => setIsVisible(true),
    onBlur: () => setIsVisible(false),
  });

  // Render tooltip via portal
  const tooltipContent = isVisible && childRef.current ? (
    createPortal(
      <div
        ref={tooltipRef}
        className={cn(
          'fixed z-[600] surface-raised border border-border-subtle rounded-md shadow-floating',
          'px-3 py-2 text-body-sm text-text-secondary',
          'whitespace-nowrap max-w-[300px] text-wrap',
          'animate-slide-up',
          positionStyles[position],
          className
        )}
        role="tooltip"
        id={`tooltip-${Math.random().toString(36).slice(2, 9)}`}
      >
        {content}
        <div
          className={cn(
            'absolute w-0 h-0 border-2 border-transparent',
            arrowStyles[position],
            arrowClassName
          )}
          aria-hidden="true"
        />
      </div>,
      document.body
    )
  ) : null;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <>{childWithProps}{tooltipContent}</>;
}

/** Tooltip Trigger - for keyboard-accessible tooltips on non-interactive elements */
export interface TooltipTriggerProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function TooltipTrigger({ content, children, position = 'top', delay = 200, className }: TooltipTriggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 9)}`;

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const childWithProps = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    'aria-describedby': isVisible ? tooltipId : undefined,
  });

  const tooltipContent = isVisible && triggerRef.current ? (
    createPortal(
      <div
        id={tooltipId}
        className={cn(
          'fixed z-[600] surface-raised border border-border-subtle rounded-md shadow-floating',
          'px-3 py-2 text-body-sm text-text-secondary',
          'whitespace-nowrap max-w-[300px] text-wrap',
          'animate-slide-up',
          positionStyles[position],
          className
        )}
        role="tooltip"
      >
        {content}
        <div
          className={cn(
            'absolute w-0 h-0 border-2 border-transparent',
            arrowStyles[position]
          )}
          aria-hidden="true"
        />
      </div>,
      document.body
    )
  ) : null;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <>{childWithProps}{tooltipContent}</>;
}