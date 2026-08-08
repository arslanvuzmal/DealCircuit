/**
 * LeadPilot Design Tokens — Main Export
 *
 * Centralized design system tokens for colors, spacing, typography,
 * shadows, radius, and transitions.
 *
 * Usage:
 *   import { tokens, colors, spacing, typeScale } from '@/lib/design-tokens';
 *
 * For Tailwind integration, see `tailwind.config.js` which imports these tokens.
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';
export * from './radius';
export * from './transitions';

import { colors } from './colors';
import { spacing, space } from './spacing';
import { fontFamily, fontWeight, lineHeight, letterSpacing, typeScale } from './typography';
import { shadows } from './shadows';
import { radius, borderRadius } from './radius';
import { transitionDuration, transitionEasing, transitions, reducedMotionSafe } from './transitions';

/**
 * Unified token object for programmatic access.
 * Useful for styled-components, Framer Motion, or dynamic theming.
 */
export const tokens = {
  colors,
  spacing,
  space,
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
  transitions,
  reducedMotionSafe,
} as const;

/**
 * Type for the full token set.
 */
export type Tokens = typeof tokens;

/**
 * CSS Custom Properties (CSS Variables) generated from tokens.
 * Inject these into `:root` or a theme provider for runtime theming.
 */
export const cssVariables = {
  // Colors
  '--color-background-primary': colors.background.primary,
  '--color-background-secondary': colors.background.secondary,
  '--color-background-tertiary': colors.background.tertiary,
  '--color-background-inverse': colors.background.inverse,

  '--color-surface-default': colors.surface.default,
  '--color-surface-raised': colors.surface.raised,
  '--color-surface-interactive': colors.surface.interactive,
  '--color-surface-highlight': colors.surface.highlight,
  '--color-surface-inverse': colors.surface.inverse,
  '--color-surface-inverse-raised': colors.surface.inverseRaised,

  '--color-border-subtle': colors.border.subtle,
  '--color-border-default': colors.border.default,
  '--color-border-focus': colors.border.focus,
  '--color-border-error': colors.border.error,
  '--color-border-success': colors.border.success,
  '--color-border-warning': colors.border.warning,
  '--color-border-inverse-subtle': colors.border.inverseSubtle,
  '--color-border-inverse-default': colors.border.inverseDefault,

  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-muted': colors.text.muted,
  '--color-text-placeholder': colors.text.placeholder,
  '--color-text-inverse-primary': colors.text.inversePrimary,
  '--color-text-inverse-secondary': colors.text.inverseSecondary,
  '--color-text-inverse-muted': colors.text.inverseMuted,
  '--color-text-link': colors.text.link,
  '--color-text-link-hover': colors.text.linkHover,

  '--color-brand-cyan': colors.brand.cyan,
  '--color-brand-cyan-hover': colors.brand.cyanHover,
  '--color-brand-cyan-light': colors.brand.cyanLight,
  '--color-brand-cyan-dim': colors.brand.cyanDim,
  '--color-brand-navy': colors.brand.navy,
  '--color-brand-blue': colors.brand.blue,
  '--color-brand-blue-hover': colors.brand.blueHover,
  '--color-brand-blue-light': colors.brand.blueLight,

  // Status
  '--color-status-success': colors.status.success.DEFAULT,
  '--color-status-success-light': colors.status.success.light,
  '--color-status-success-dark': colors.status.success.dark,
  '--color-status-success-bg': colors.status.success.bg,
  '--color-status-success-border': colors.status.success.border,
  '--color-status-success-text': colors.status.success.text,

  '--color-status-warning': colors.status.warning.DEFAULT,
  '--color-status-warning-light': colors.status.warning.light,
  '--color-status-warning-dark': colors.status.warning.dark,
  '--color-status-warning-bg': colors.status.warning.bg,
  '--color-status-warning-border': colors.status.warning.border,
  '--color-status-warning-text': colors.status.warning.text,

  '--color-status-error': colors.status.error.DEFAULT,
  '--color-status-error-light': colors.status.error.light,
  '--color-status-error-dark': colors.status.error.dark,
  '--color-status-error-bg': colors.status.error.bg,
  '--color-status-error-border': colors.status.error.border,
  '--color-status-error-text': colors.status.error.text,

  '--color-status-info': colors.status.info.DEFAULT,
  '--color-status-info-light': colors.status.info.light,
  '--color-status-info-dark': colors.status.info.dark,
  '--color-status-info-bg': colors.status.info.bg,
  '--color-status-info-border': colors.status.info.border,
  '--color-status-info-text': colors.status.info.text,

  // Provenance
  '--color-provenance-user-provided': colors.provenance.userProvided.DEFAULT,
  '--color-provenance-user-provided-bg': colors.provenance.userProvided.bg,
  '--color-provenance-user-provided-border': colors.provenance.userProvided.border,
  '--color-provenance-user-provided-text': colors.provenance.userProvided.text,

  '--color-provenance-derived': colors.provenance.derived.DEFAULT,
  '--color-provenance-derived-bg': colors.provenance.derived.bg,
  '--color-provenance-derived-border': colors.provenance.derived.border,
  '--color-provenance-derived-text': colors.provenance.derived.text,

  '--color-provenance-demo-enriched': colors.provenance.demoEnriched.DEFAULT,
  '--color-provenance-demo-enriched-bg': colors.provenance.demoEnriched.bg,
  '--color-provenance-demo-enriched-border': colors.provenance.demoEnriched.border,
  '--color-provenance-demo-enriched-text': colors.provenance.demoEnriched.text,

  '--color-provenance-externally-verified': colors.provenance.externallyVerified.DEFAULT,
  '--color-provenance-externally-verified-bg': colors.provenance.externallyVerified.bg,
  '--color-provenance-externally-verified-border': colors.provenance.externallyVerified.border,
  '--color-provenance-externally-verified-text': colors.provenance.externallyVerified.text,

  '--color-provenance-unknown': colors.provenance.unknown.DEFAULT,
  '--color-provenance-unknown-bg': colors.provenance.unknown.bg,
  '--color-provenance-unknown-border': colors.provenance.unknown.border,
  '--color-provenance-unknown-text': colors.provenance.unknown.text,

  // Overlay
  '--color-overlay-modal': colors.overlay.modal,
  '--color-overlay-popover': colors.overlay.popover,

  // Spacing (as rem values for CSS vars)
  '--space-0-5': spacing['0.5'],
  '--space-1': spacing[1],
  '--space-1-5': spacing[1.5],
  '--space-2': spacing[2],
  '--space-2-5': spacing[2.5],
  '--space-3': spacing[3],
  '--space-4': spacing[4],
  '--space-5': spacing[5],
  '--space-6': spacing[6],
  '--space-7': spacing[7],
  '--space-8': spacing[8],
  '--space-10': spacing[10],
  '--space-12': spacing[12],
  '--space-14': spacing[14],
  '--space-16': spacing[16],
  '--space-20': spacing[20],
  '--space-24': spacing[24],
  '--space-32': spacing[32],

  // Semantic space
  '--space-xs': space.xs,
  '--space-sm': space.sm,
  '--space-md': space.md,
  '--space-lg': space.lg,
  '--space-xl': space.xl,
  '--space-2xl': space['2xl'],
  '--space-3xl': space['3xl'],

  // Layout
  '--space-sidebar-collapsed': space.sidebarCollapsed,
  '--space-sidebar-expanded': space.sidebarExpanded,
  '--space-topbar-height': space.topbarHeight,
  '--space-row-compact': space.rowCompact,
  '--space-row-comfortable': space.rowComfortable,
  '--space-panel-width': space.panelWidth,
  '--space-content-max': space.contentMax,

  // Typography
  '--font-sans': fontFamily.sans.join(', '),
  '--font-mono': fontFamily.mono.join(', '),

  '--font-weight-normal': fontWeight.normal.toString(),
  '--font-weight-medium': fontWeight.medium.toString(),
  '--font-weight-semibold': fontWeight.semibold.toString(),
  '--font-weight-bold': fontWeight.bold.toString(),

  '--line-height-tight': lineHeight.tight.toString(),
  '--line-height-snug': lineHeight.snug.toString(),
  '--line-height-normal': lineHeight.normal.toString(),
  '--line-height-relaxed': lineHeight.relaxed.toString(),
  '--line-height-mono': lineHeight.mono.toString(),

  '--letter-spacing-tighter': letterSpacing.tighter,
  '--letter-spacing-tight': letterSpacing.tight,
  '--letter-spacing-normal': letterSpacing.normal,
  '--letter-spacing-wide': letterSpacing.wide,
  '--letter-spacing-wider': letterSpacing.wider,
  '--letter-spacing-widest': letterSpacing.widest,

  // Type scale (font-size)
  '--text-display': typeScale.display.fontSize,
  '--text-page-title': typeScale.pageTitle.fontSize,
  '--text-section-title': typeScale.sectionTitle.fontSize,
  '--text-card-title': typeScale.cardTitle.fontSize,
  '--text-body-lg': typeScale.bodyLg.fontSize,
  '--text-body': typeScale.body.fontSize,
  '--text-body-sm': typeScale.bodySm.fontSize,
  '--text-metadata': typeScale.metadata.fontSize,
  '--text-caption': typeScale.caption.fontSize,
  '--text-mono': typeScale.mono.fontSize,
  '--text-mono-sm': typeScale.monoSm.fontSize,
  '--text-button': typeScale.button.fontSize,
  '--text-label': typeScale.label.fontSize,
  '--text-nav': typeScale.nav.fontSize,
  '--text-kpi-value': typeScale.kpiValue.fontSize,
  '--text-kpi-label': typeScale.kpiLabel.fontSize,

  // Shadows
  '--shadow-card': shadows.card,
  '--shadow-card-hover': shadows.cardHover,
  '--shadow-card-active': shadows.cardActive,
  '--shadow-raised': shadows.raised,
  '--shadow-floating': shadows.floating,
  '--shadow-focus': shadows.focus,
  '--shadow-focus-light': shadows.focusLight,
  '--shadow-inset': shadows.inset,
  '--shadow-sticky': shadows.sticky,

  // Radius
  '--radius-none': radius.none,
  '--radius-xs': radius.xs,
  '--radius-sm': radius.sm,
  '--radius-md': radius.md,
  '--radius-lg': radius.lg,
  '--radius-xl': radius.xl,
  '--radius-2xl': radius['2xl'],
  '--radius-full': radius.full,

  // Semantic radius
  '--radius-button': borderRadius.button,
  '--radius-input': borderRadius.input,
  '--radius-card': borderRadius.card,
  '--radius-modal': borderRadius.modal,
  '--radius-badge': borderRadius.badge,
  '--radius-avatar': borderRadius.avatar,
  '--radius-table': borderRadius.table,
  '--radius-tooltip': borderRadius.tooltip,

  // Transitions
  '--duration-instant': transitionDuration.instant,
  '--duration-fast': transitionDuration.fast,
  '--duration-normal': transitionDuration.normal,
  '--duration-slow': transitionDuration.slow,
  '--duration-ambient': transitionDuration.ambient,

  '--easing-default': transitionEasing.default,
  '--easing-ease-out': transitionEasing.easeOut,
  '--easing-ease-in': transitionEasing.easeIn,
  '--easing-sharp': transitionEasing.sharp,
  '--easing-spring': transitionEasing.spring,
} as const;

export type CssVariables = typeof cssVariables;

/**
 * Helper to inject CSS variables into a style object.
 * Usage: <div style={cssVarsToStyle(tokens.cssVariables)} />
 */
export function cssVarsToStyle(variables: CssVariables): React.CSSProperties {
  return variables as unknown as React.CSSProperties;
}