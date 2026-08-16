/**
 * DealCircuit Design Tokens — Spacing System
 *
 * Based on a 4px base unit. All values in rem.
 * Use these tokens via Tailwind config or directly in components.
 */

export const spacing = {
  /** 0.125rem = 2px */
  '0.5': '0.125rem',
  /** 0.25rem = 4px — base unit */
  1: '0.25rem',
  /** 0.375rem = 6px */
  1.5: '0.375rem',
  /** 0.5rem = 8px */
  2: '0.5rem',
  /** 0.625rem = 10px */
  2.5: '0.625rem',
  /** 0.75rem = 12px */
  3: '0.75rem',
  /** 1rem = 16px */
  4: '1rem',
  /** 1.25rem = 20px */
  5: '1.25rem',
  /** 1.5rem = 24px */
  6: '1.5rem',
  /** 1.75rem = 28px */
  7: '1.75rem',
  /** 2rem = 32px */
  8: '2rem',
  /** 2.5rem = 40px */
  10: '2.5rem',
  /** 3rem = 48px */
  12: '3rem',
  /** 3.5rem = 56px */
  14: '3.5rem',
  /** 4rem = 64px */
  16: '4rem',
  /** 5rem = 80px */
  20: '5rem',
  /** 6rem = 96px */
  24: '6rem',
  /** 8rem = 128px */
  32: '8rem',
} as const;

/**
 * Semantic spacing aliases for common patterns.
 * Prefer these over raw spacing values for consistency.
 */
export const space = {
  /** Tight spacing — between inline elements, icon + text */
  xs: spacing[1],      // 4px
  /** Small spacing — form field gaps, button padding */
  sm: spacing[2],      // 8px
  /** Medium spacing — card padding, component gaps */
  md: spacing[4],      // 16px
  /** Large spacing — section gaps, page padding */
  lg: spacing[6],      // 24px
  /** Extra large — major section separation */
  xl: spacing[8],      // 32px
  /** 2xl — page-level margins */
  '2xl': spacing[12],  // 48px
  /** 3xl — hero sections */
  '3xl': spacing[16],  // 64px

  // Layout-specific
  /** Sidebar width (collapsed) */
  sidebarCollapsed: '4rem',      // 64px
  /** Sidebar width (expanded) */
  sidebarExpanded: '16rem',      // 256px
  /** Top bar height */
  topbarHeight: '3.5rem',        // 56px
  /** Table row height (compact) */
  rowCompact: '2.5rem',          // 40px
  /** Table row height (comfortable) */
  rowComfortable: '3rem',        // 48px
  /** Modal / drawer width */
  panelWidth: '28rem',           // 448px
  /** Max content width */
  contentMax: '72rem',           // 1152px
} as const;

export type Spacing = typeof spacing;
export type Space = typeof space;