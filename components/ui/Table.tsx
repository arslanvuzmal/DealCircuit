'use client';

import React, { forwardRef, HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="table-container">
      <table ref={ref} className={cn('table', className)} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

/** Table Header */
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('table-header', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

/** Table Body */
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('table-body', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

/** Table Row */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Row is selected */
  selected?: boolean;
  /** Click handler for row */
  onClick?: () => void;
  /** Row is interactive (clickable) */
  interactive?: boolean;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected = false, onClick, interactive = false, className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'table-row',
        interactive && 'table-row-hover cursor-pointer',
        selected && 'table-row-selected',
        className
      )}
      onClick={onClick}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive && onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }} : undefined}
      role={interactive ? 'button' : undefined}
      aria-pressed={interactive ? selected : undefined}
      {...props}
    >
      {children}
    </tr>
  )
);
TableRow.displayName = 'TableRow';

/** Table Head Cell */
export interface TableHeadCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Column width */
  width?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

const TableHeadCell = forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  ({ width, align = 'left', className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn('table-header-cell', align !== 'left' && `text-${align}`, className)}
      style={{ width }}
      {...props}
    >
      {children}
    </th>
  )
);
TableHeadCell.displayName = 'TableHeadCell';

/** Table Cell */
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Use mono font (for IDs, technical data) */
  mono?: boolean;
  /** Primary emphasis */
  primary?: boolean;
  /** Truncate long text */
  truncate?: number;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = 'left', mono = false, primary = false, truncate, className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'table-cell',
        align !== 'left' && `text-${align}`,
        mono && 'table-cell-mono',
        primary && 'table-cell-primary',
        truncate && `truncate-${truncate}`,
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = 'TableCell';

/** Table Footer */
export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('bg-surface-raised border-t border-border-subtle', className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

/** Table Caption */
export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, children, ...props }, ref) => (
    <caption ref={ref} className={cn('text-caption text-text-muted p-4 text-left', className)} {...props}>
      {children}
    </caption>
  )
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell, TableFooter, TableCaption };