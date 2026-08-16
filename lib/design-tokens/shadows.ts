/**
 * DealCircuit Design Tokens — Shadow System
 *
 * Low-noise, layered shadows for depth without heaviness.
 * All values as CSS box-shadow strings.
 */

export const shadows = {
  /** Subtle — for cards at rest */
  card: '0 1px 2px 0 rgb(0 0 0 / 0.08), 0 1px 1px -1px rgb(0 0 0 / 0.06)',
  /** Hover — for interactive cards */
  cardHover: '0 4px 8px -2px rgb(0 0 0 / 0.12), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
  /** Active / pressed */
  cardActive: '0 1px 2px 0 rgb(0 0 0 / 0.1), 0 1px 1px -1px rgb(0 0 0 / 0.06)',
  /** Raised surfaces (dropdowns, modals, tooltips) */
  raised: '0 8px 24px -4px rgb(0 0 0 / 0.2), 0 4px 12px -2px rgb(0 0 0 / 0.12)',
  /** Floating elements (toasts, popovers) */
  floating: '0 12px 32px -6px rgb(0 0 0 / 0.24), 0 4px 16px -4px rgb(0 0 0 / 0.16)',
  /** Focus ring — for accessibility */
  focus: '0 0 0 2px #38BDF8, 0 0 0 4px #0B1220',
  /** Focus ring on light surfaces */
  focusLight: '0 0 0 2px #38BDF8, 0 0 0 4px #FFFFFF',
  /** Inset — for pressed inputs, sunken areas */
  inset: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
  /** Subtle divider shadow — for sticky headers */
  sticky: '0 1px 0 0 rgb(0 0 0 / 0.08)',
  /** None — explicit reset */
  none: 'none',
} as const;

export type Shadows = typeof shadows;