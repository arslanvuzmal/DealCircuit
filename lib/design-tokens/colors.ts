/**
 * DealCircuit Design Tokens — Color System
 *
 * Enterprise SaaS palette:
 * - Deep navy backgrounds (primary app surface)
 * - Charcoal elevated surfaces
 * - Subtle cyan accent (intelligence, data flow)
 * - Soft white / muted blue text hierarchy
 * - Minimal, semantic status colors
 */

export const colors = {
  // ============================================================
  // BACKGROUND LAYERS
  // ============================================================
  background: {
    /** Primary app background — deep navy */
    primary: '#0B1220',
    /** Secondary background for panels, cards — slightly lighter navy */
    secondary: '#111927',
    /** Tertiary for subtle contrast areas (hover, active) */
    tertiary: '#161F2E',
    /** Inverse (light) background for modals, popovers on light surfaces */
    inverse: '#F8FAFC',
  },

  // ============================================================
  // SURFACE / CARD LAYERS
  // ============================================================
  surface: {
    /** Default card / panel background */
    default: '#111927',
    /** Raised surface (dropdowns, modals, tooltips) */
    raised: '#161F2E',
    /** Interactive surface (hover/active states) */
    interactive: '#1A2434',
    /** Subtle highlight for selected rows, active nav items */
    highlight: '#1E2A3E',
    /** Inverse surface for light-mode components */
    inverse: '#FFFFFF',
    /** Inverse raised */
    inverseRaised: '#F1F5F9',
  },

  // ============================================================
  // BORDER SYSTEM
  // ============================================================
  border: {
    /** Hairline border — default for cards, tables, inputs */
    subtle: '#1E2A3E',
    /** Standard border — inputs, focused elements */
    default: '#2A3A4F',
    /** Emphasized border — focus rings, active tabs */
    focus: '#38BDF8', // cyan-400
    /** Error border */
    error: '#EF4444', // red-500
    /** Success border */
    success: '#10B981', // emerald-500
    /** Warning border */
    warning: '#F59E0B', // amber-500
    /** Inverse borders for light surfaces */
    inverseSubtle: '#E2E8F0',
    inverseDefault: '#CBD5E1',
  },

  // ============================================================
  // TEXT HIERARCHY
  // ============================================================
  text: {
    /** Primary heading / high-emphasis text */
    primary: '#F0F6FC',
    /** Secondary body text */
    secondary: '#A8BBE0',
    /** Muted / helper / metadata text */
    muted: '#6B7C96',
    /** Placeholder / disabled text */
    placeholder: '#4A5A72',
    /** Inverse (on dark surfaces) */
    inversePrimary: '#0B1220',
    inverseSecondary: '#334155',
    inverseMuted: '#64748B',
    /** Link / interactive text */
    link: '#38BDF8',
    linkHover: '#0EA5E9',
  },

  // ============================================================
  // BRAND / ACCENT
  // ============================================================
  brand: {
    /** Primary brand cyan — intelligence, data flow, primary actions */
    cyan: '#38BDF8', // cyan-400
    cyanHover: '#0EA5E9', // cyan-500
    cyanLight: '#7DD3FC', // cyan-300
    cyanDim: '#0E2A3E', // for subtle backgrounds
    /** Deep navy brand — for logos, primary buttons on light */
    navy: '#0B1220',
    /** Soft blue — secondary actions, info states */
    blue: '#3B82F6', // blue-500
    blueHover: '#2563EB', // blue-600
    blueLight: '#93C5FD', // blue-300
  },

  // ============================================================
  // SEMANTIC STATUS COLORS (minimal, accessible)
  // ============================================================
  status: {
    success: {
      DEFAULT: '#10B981', // emerald-500
      light: '#34D399', // emerald-400
      dark: '#059669', // emerald-600
      bg: '#022C22', // emerald-950 with opacity
      bgLight: '#064E3B', // emerald-900
      border: '#065F46', // emerald-800
      text: '#6EE7B7', // emerald-300
      textDark: '#065F46',
    },
    warning: {
      DEFAULT: '#F59E0B', // amber-500
      light: '#FBBF24', // amber-400
      dark: '#D97706', // amber-600
      bg: '#2C1A00',
      bgLight: '#451A03',
      border: '#78350F', // amber-800
      text: '#FDE047', // amber-300
      textDark: '#78350F',
    },
    error: {
      DEFAULT: '#EF4444', // red-500
      light: '#F87171', // red-400
      dark: '#DC2626', // red-600
      bg: '#2C0808',
      bgLight: '#450A0A',
      border: '#7F1D1D', // red-800
      text: '#FCA5A5', // red-300
      textDark: '#7F1D1D',
    },
    info: {
      DEFAULT: '#38BDF8', // cyan-400
      light: '#7DD3FC', // cyan-300
      dark: '#0EA5E9', // cyan-500
      bg: '#0E2A3E',
      bgLight: '#155E75',
      border: '#164E63', // cyan-800
      text: '#A5F3FC', // cyan-200
      textDark: '#164E63',
    },
  },

  // ============================================================
  // PROVENANCE / EVIDENCE COLORS (for Intelligence Lab)
  // ============================================================
  provenance: {
    userProvided: {
      DEFAULT: '#3B82F6', // blue-500
      bg: '#172554', // blue-950
      border: '#1E3A8A', // blue-900
      text: '#93C5FD', // blue-300
    },
    derived: {
      DEFAULT: '#8B5CF6', // violet-500
      bg: '#2E1065', // violet-950
      border: '#4C1D95', // violet-900
      text: '#C4B5FD', // violet-300
    },
    demoEnriched: {
      DEFAULT: '#F59E0B', // amber-500
      bg: '#2C1A00',
      border: '#78350F', // amber-800
      text: '#FDE047', // amber-300
    },
    externallyVerified: {
      DEFAULT: '#10B981', // emerald-500
      bg: '#022C22',
      border: '#065F46', // emerald-800
      text: '#6EE7B7', // emerald-300
    },
    unknown: {
      DEFAULT: '#6B7C96', // slate-500
      bg: '#1E2A3E',
      border: '#334155', // slate-700
      text: '#94A3B8', // slate-400
    },
  },

  // ============================================================
  // OVERLAY / BACKDROP
  // ============================================================
  overlay: {
    /** Modal backdrop */
    modal: 'rgba(11, 18, 32, 0.72)',
    /** Popover / tooltip backdrop */
    popover: 'rgba(11, 18, 32, 0.48)',
  },
} as const;

export type Colors = typeof colors;