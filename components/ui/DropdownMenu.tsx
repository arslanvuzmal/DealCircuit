'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <>{children}</>;
}

export interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
  className?: string;
}

export function DropdownMenuTrigger({ asChild = false, children, className }: DropdownMenuTriggerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> };
    const { ref: _ref, onClick: _onClick, 'aria-expanded': _ariaExpanded, 'aria-haspopup': _ariaHaspopup, className: _className, ...restProps } = childProps;
    return (
      <>
        <button
          ref={triggerRef}
          onClick={handleClick}
          className={cn('inline-flex items-center', className, childProps.className)}
          aria-expanded={open}
          aria-haspopup="true"
          {...restProps}
        >
          {childProps.children}
        </button>
        {open && (
          createPortal(
            <div
              ref={contentRef}
              className="fixed z-[500] animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute right-0 top-full mt-1 w-full min-w-[160px]">
                <div data-dropdown-menu-content className="surface-raised border border-border-subtle rounded-lg shadow-floating py-1 min-w-[160px]">
                  {childProps.children}
                </div>
              </div>
            </div>,
            document.body
          )
        )}
      </>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={handleClick}
        className={cn('inline-flex items-center', className)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {children}
      </button>
      {open && (
        createPortal(
          <div
            ref={contentRef}
            className="fixed z-[500] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-0 top-full mt-1 w-full min-w-[160px]">
              <div data-dropdown-menu-content className="surface-raised border border-border-subtle rounded-lg shadow-floating py-1 min-w-[160px]">
                {children.props.children}
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}

export interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'end';
  sideOffset?: number;
}

export function DropdownMenuContent({ children, className, align = 'end', sideOffset = 4 }: DropdownMenuContentProps) {
  return (
    <div
      data-dropdown-menu-content
      className={cn(
        'surface-raised border border-border-subtle rounded-lg shadow-floating py-1 min-w-[160px]',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  inset?: boolean;
}

export function DropdownMenuItem({ children, className, disabled = false, onClick, inset = false }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-body-sm text-text-secondary',
        'hover:bg-surface-highlight hover:text-text-primary',
        'transition-colors duration-120',
        'focus:outline-none focus:bg-surface-highlight focus:text-text-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        inset && 'pl-8',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return <div className={cn('h-px bg-border-subtle my-1', className)} />;
}