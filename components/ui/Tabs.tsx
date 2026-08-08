'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ children, defaultValue, value, onValueChange, className }: TabsProps) {
  const [activeValue, setActiveValue] = useState(value || defaultValue);

  const handleValueChange = useCallback((newValue: string) => {
    setActiveValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const contextValue = React.useMemo(
    () => ({ activeValue, onValueChange: handleValueChange }),
    [activeValue, handleValueChange]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext<{
  activeValue: string;
  onValueChange: (value: string) => void;
} | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-surface-interactive rounded-lg p-1 border border-border-subtle',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({ value, children, disabled = false, className }: TabsTriggerProps) {
  const { activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center px-4 py-2 text-body-sm font-medium rounded-md',
        'transition-all duration-120 ease-default',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
        disabled
          ? 'opacity-50 cursor-not-allowed text-text-muted'
          : isActive
          ? 'bg-surface-default text-text-primary shadow-card'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-highlight',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export function TabsContent({ value, children, className, forceMount = false }: TabsContentProps) {
  const { activeValue } = useTabsContext();
  const isActive = activeValue === value;

  if (!isActive && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      aria-labelledby={`tabs-trigger-${value}`}
      className={cn('animate-fade-in', className)}
      hidden={!isActive}
    >
      {children}
    </div>
  );
}