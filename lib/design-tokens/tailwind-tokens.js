/**
 * DealCircuit Design Tokens — JavaScript Version for Tailwind Config
 * This file is used by tailwind.config.js which runs in Node.js (not TypeScript)
 */

// ============================================================
// COLORS
// ============================================================
const colors = {
  background: {
    primary: '#0B1220',
    secondary: '#111927',
    tertiary: '#161F2E',
    inverse: '#F8FAFC',
  },
  surface: {
    default: '#111927',
    raised: '#161F2E',
    interactive: '#1A2434',
    highlight: '#1E2A3E',
    inverse: '#FFFFFF',
    inverseRaised: '#F1F5F9',
  },
  border: {
    subtle: '#1E2A3E',
    default: '#2A3A4F',
    focus: '#38BDF8',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    inverseSubtle: '#E2E8F0',
    inverseDefault: '#CBD5E1',
  },
  text: {
    primary: '#F0F6FC',
    secondary: '#A8BBE0',
    muted: '#6B7C96',
    placeholder: '#4A5A72',
    inversePrimary: '#0B1220',
    inverseSecondary: '#334155',
    inverseMuted: '#64748B',
    link: '#38BDF8',
    linkHover: '#0EA5E9',
  },
  brand: {
    cyan: '#38BDF8',
    cyanHover: '#0EA5E9',
    cyanLight: '#7DD3FC',
    cyanDim: '#0E2A3E',
    navy: '#0B1220',
    blue: '#3B82F6',
    blueHover: '#2563EB',
    blueLight: '#93C5FD',
  },
  status: {
    success: {
      DEFAULT: '#10B981',
      light: '#34D399',
      dark: '#059669',
      bg: '#022C22',
      bgLight: '#064E3B',
      border: '#065F46',
      text: '#6EE7B7',
      textDark: '#065F46',
    },
    warning: {
      DEFAULT: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      bg: '#2C1A00',
      bgLight: '#451A03',
      border: '#78350F',
      text: '#FDE047',
      textDark: '#78350F',
    },
    error: {
      DEFAULT: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      bg: '#2C0808',
      bgLight: '#450A0A',
      border: '#7F1D1D',
      text: '#FCA5A5',
      textDark: '#7F1D1D',
    },
    info: {
      DEFAULT: '#38BDF8',
      light: '#7DD3FC',
      dark: '#0EA5E9',
      bg: '#0E2A3E',
      bgLight: '#155E75',
      border: '#164E63',
      text: '#A5F3FC',
      textDark: '#164E63',
    },
  },
  provenance: {
    userProvided: {
      DEFAULT: '#3B82F6',
      bg: '#172554',
      border: '#1E3A8A',
      text: '#93C5FD',
    },
    derived: {
      DEFAULT: '#8B5CF6',
      bg: '#2E1065',
      border: '#4C1D95',
      text: '#C4B5FD',
    },
    demoEnriched: {
      DEFAULT: '#F59E0B',
      bg: '#2C1A00',
      border: '#78350F',
      text: '#FDE047',
    },
    externallyVerified: {
      DEFAULT: '#10B981',
      bg: '#022C22',
      border: '#065F46',
      text: '#6EE7B7',
    },
    unknown: {
      DEFAULT: '#6B7C96',
      bg: '#1E2A3E',
      border: '#334155',
      text: '#94A3B8',
    },
  },
  overlay: {
    modal: 'rgba(11, 18, 32, 0.72)',
    popover: 'rgba(11, 18, 32, 0.48)',
  },
};

// ============================================================
// SPACING
// ============================================================
const spacing = {
  '0.5': '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  sidebarCollapsed: '4rem',
  sidebarExpanded: '16rem',
  topbarHeight: '3.5rem',
  rowCompact: '2.5rem',
  rowComfortable: '3rem',
  panelWidth: '28rem',
  contentMax: '72rem',
};

// ============================================================
// TYPOGRAPHY
// ============================================================
const fontFamily = {
  sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'monospace'],
};

const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  mono: 1.4,
};

const letterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.01em',
  wider: '0.02em',
  widest: '0.05em',
};

const typeScale = {
  display: { fontSize: '3rem', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.02em' },
  pageTitle: { fontSize: '2.25rem', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.01em' },
  sectionTitle: { fontSize: '1.75rem', lineHeight: 1.25, fontWeight: 600, letterSpacing: '-0.01em' },
  cardTitle: { fontSize: '1.25rem', lineHeight: 1.25, fontWeight: 600, letterSpacing: '0' },
  bodyLg: { fontSize: '1.125rem', lineHeight: 1.5, fontWeight: 400, letterSpacing: '0' },
  body: { fontSize: '1rem', lineHeight: 1.5, fontWeight: 400, letterSpacing: '0' },
  bodySm: { fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 400, letterSpacing: '0' },
  metadata: { fontSize: '0.8125rem', lineHeight: 1.5, fontWeight: 400, letterSpacing: '0.01em' },
  caption: { fontSize: '0.75rem', lineHeight: 1.5, fontWeight: 400, letterSpacing: '0.01em' },
  mono: { fontSize: '0.8125rem', lineHeight: 1.4, fontWeight: 400, letterSpacing: '0', fontFamily: 'JetBrains Mono, Fira Code, SF Mono, Monaco, monospace' },
  monoSm: { fontSize: '0.6875rem', lineHeight: 1.4, fontWeight: 400, letterSpacing: '0', fontFamily: 'JetBrains Mono, Fira Code, SF Mono, Monaco, monospace' },
  button: { fontSize: '0.875rem', lineHeight: 1, fontWeight: 600, letterSpacing: '0.05em' },
  label: { fontSize: '0.8125rem', lineHeight: 1, fontWeight: 500, letterSpacing: '0' },
  nav: { fontSize: '0.875rem', lineHeight: 1, fontWeight: 500, letterSpacing: '0' },
  kpiValue: { fontSize: '2rem', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.01em' },
  kpiLabel: { fontSize: '0.75rem', lineHeight: 1, fontWeight: 500, letterSpacing: '0.05em' },
};

// ============================================================
// SHADOWS
// ============================================================
const shadows = {
  card: '0 1px 2px 0 rgb(0 0 0 / 0.08), 0 1px 1px -1px rgb(0 0 0 / 0.06)',
  cardHover: '0 4px 8px -2px rgb(0 0 0 / 0.12), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
  cardActive: '0 1px 2px 0 rgb(0 0 0 / 0.1), 0 1px 1px -1px rgb(0 0 0 / 0.06)',
  raised: '0 8px 24px -4px rgb(0 0 0 / 0.2), 0 4px 12px -2px rgb(0 0 0 / 0.12)',
  floating: '0 12px 32px -6px rgb(0 0 0 / 0.24), 0 4px 16px -4px rgb(0 0 0 / 0.16)',
  focus: '0 0 0 2px #38BDF8, 0 0 0 4px #0B1220',
  focusLight: '0 0 0 2px #38BDF8, 0 0 0 4px #FFFFFF',
  inset: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
  sticky: '0 1px 0 0 rgb(0 0 0 / 0.08)',
  none: 'none',
};

// ============================================================
// BORDER RADIUS
// ============================================================
const radius = {
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
};

const borderRadius = {
  button: '0.25rem',
  input: '0.25rem',
  card: '0.375rem',
  modal: '0.5rem',
  badge: '9999px',
  avatar: '9999px',
  table: '0',
  tooltip: '0.25rem',
};

// ============================================================
// TRANSITIONS
// ============================================================
const transitionDuration = {
  instant: '50ms',
  fast: '120ms',
  normal: '180ms',
  slow: '280ms',
  ambient: '2000ms',
};

const transitionEasing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

module.exports = {
  colors,
  spacing,
  fontFamily,
  fontWeight,
  lineHeight,
  letterSpacing,
  typeScale,
  shadows,
  radius,
  borderRadius,
  transitionDuration,
  transitionEasing,
};