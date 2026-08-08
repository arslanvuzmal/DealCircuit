/**
 * LeadPilot Design Tokens — Typography System
 *
 * Mature type scale with clear hierarchy.
 * All sizes in rem, line-heights unitless.
 * Font: Inter (via Google Fonts / self-hosted)
 */

export const fontFamily = {
  /** Primary UI font */
  sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  /** Monospace for technical data (ids, traces, code) */
  mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'monospace'],
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  /** Tight — for headings */
  tight: 1.1,
  /** Snug — for subheadings */
  snug: 1.25,
  /** Normal — for body text */
  normal: 1.5,
  /** Relaxed — for readable long-form */
  relaxed: 1.625,
  /** Mono — for code/technical */
  mono: 1.4,
} as const;

export const letterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.01em',
  wider: '0.02em',
  /** For uppercase labels, buttons */
  widest: '0.05em',
} as const;

/**
 * Type Scale — semantic names mapped to size/weight/line-height.
 * Use these via the `Text` component or Tailwind classes.
 */
export const typeScale = {
  /** Hero / marketing display — 48px / 3rem */
  display: {
    fontSize: '3rem',           // 48px
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
  },
  /** Page title (H1) — 36px / 2.25rem */
  pageTitle: {
    fontSize: '2.25rem',        // 36px
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  /** Section title (H2) — 28px / 1.75rem */
  sectionTitle: {
    fontSize: '1.75rem',        // 28px
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },
  /** Card / subsection title (H3) — 20px / 1.25rem */
  cardTitle: {
    fontSize: '1.25rem',        // 20px
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  /** Large body / lead paragraph — 18px / 1.125rem */
  bodyLg: {
    fontSize: '1.125rem',       // 18px
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  /** Default body text — 16px / 1rem */
  body: {
    fontSize: '1rem',           // 16px
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  /** Secondary body — 14px / 0.875rem */
  bodySm: {
    fontSize: '0.875rem',       // 14px
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  /** Metadata / helper text — 13px / 0.8125rem */
  metadata: {
    fontSize: '0.8125rem',      // 13px
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  /** Caption / timestamp / footnote — 12px / 0.75rem */
  caption: {
    fontSize: '0.75rem',        // 12px
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  /** Technical / mono — 13px for IDs, traces, code */
  mono: {
    fontSize: '0.8125rem',      // 13px
    lineHeight: lineHeight.mono,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.mono.join(', '),
  },
  /** Mono small — 11px for dense tables */
  monoSm: {
    fontSize: '0.6875rem',      // 11px
    lineHeight: lineHeight.mono,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.mono.join(', '),
  },
  /** Button label — 14px semibold */
  button: {
    fontSize: '0.875rem',       // 14px
    lineHeight: 1,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.widest,
  },
  /** Input label — 13px medium */
  label: {
    fontSize: '0.8125rem',      // 13px
    lineHeight: 1,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },
  /** Nav item — 14px medium */
  nav: {
    fontSize: '0.875rem',       // 14px
    lineHeight: 1,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },
  /** KPI metric value — 32px / 2rem */
  kpiValue: {
    fontSize: '2rem',           // 32px
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.sans.join(', '),
  },
  /** KPI metric label — 12px uppercase */
  kpiLabel: {
    fontSize: '0.75rem',        // 12px
    lineHeight: 1,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
} as const;

export type FontFamily = typeof fontFamily;
export type FontWeight = typeof fontWeight;
export type LineHeight = typeof lineHeight;
export type LetterSpacing = typeof letterSpacing;
export type TypeScale = typeof typeScale;