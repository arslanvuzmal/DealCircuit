'use client';

import React, { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button, type ButtonProps } from './Button';

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Show close button */
  showClose?: boolean;
  /** Disable backdrop click to close */
  disableBackdropClose?: boolean;
  /** Disable escape key to close */
  disableEscapeClose?: boolean;
  /** Custom className */
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  disableBackdropClose = false,
  disableEscapeClose = false,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = title ? `modal-title-${Math.random().toString(36).slice(2, 9)}` : undefined;
  const descriptionId = description ? `modal-desc-${Math.random().toString(36).slice(2, 9)}` : undefined;

  // Handle escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscapeClose) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, disableEscapeClose, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!disableBackdropClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (open) {
      const modal = modalRef.current;
      const focusableElements = modal?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements?.[0];
      const lastFocusable = focusableElements?.[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstFocusable?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        className={cn('modal', sizeClasses[size], className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 p-6 border-b border-border-subtle">
            <div>
              {title && (
                <h2 id={titleId} className="text-card-title text-text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="text-body-sm text-text-muted mt-1">
                  {description}
                </p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost p-2 rounded-full hover:bg-surface-interactive transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-text-secondary" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

/** Alert Dialog - simplified modal for confirmations */
export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
  loading?: boolean;
}

export function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}: AlertDialogProps) {
  const variantClasses: Record<string, string> = {
    danger: 'btn-danger',
    primary: 'btn-primary',
    warning: 'btn-warning',
  };

  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variantClasses[variant] as ButtonProps['variant']} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}