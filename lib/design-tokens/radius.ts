/**
 * DealCircuit Design Tokens — Border Radius System
 *
 * Consistent radius scale. All values in rem.
 */

export const radius = {
  /** Hairline — for badges, pills, small elements */
  none: '0',
  xs: '0.125rem',   // 2px
  /** Small — for buttons, inputs, badges */
  sm: '0.25rem',    // 4px
  /** Default — for cards, panels, modals */
  md: '0.375rem',   // 6px
  /** Medium — for larger cards, dropdowns */
  lg: '0.5rem',     // 8px
  /** Large — for modals, drawers */
  xl: '0.75rem',    // 12px
  /** Extra large — for hero cards */
  '2xl': '1rem',    // 16px
  /** Full — for pills, circular avatars */
  full: '9999px',
} as const;

/**
 * Semantic radius aliases for common patterns.
 */
export const borderRadius = {
  /** Default button radius */
  button: radius.sm,
  /** Input / select radius */
  input: radius.sm,
  /** Card / panel radius */
  card: radius.md,
  /** Modal / drawer / popover radius */
  modal: radius.lg,
  /** Badge / tag / pill radius */
  badge: radius.full,
  /** Avatar radius */
  avatar: radius.full,
  /** Table cell (no radius) */
  table: radius.none,
  /** Tooltip radius */
  tooltip: radius.sm,
} as const;

export type Radius = typeof radius;
export type BorderRadius = typeof borderRadius;