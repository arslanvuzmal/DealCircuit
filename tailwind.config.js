/** @type {import('tailwindcss').Config} */
// DealCircuit Design System — Tailwind Configuration
// Imports design tokens from lib/design-tokens for single source of truth.

const { colors, spacing, fontFamily, fontWeight, lineHeight, letterSpacing, typeScale, shadows, radius, borderRadius, transitionDuration, transitionEasing } = require('./lib/design-tokens/tailwind-tokens');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode (we use dark as default)
  theme: {
    extend: {
      // ============================================================
      // COLORS — Semantic, purpose-driven palette
      // ============================================================
      colors: {
        // Background layers
        background: {
          primary: colors.background.primary,
          secondary: colors.background.secondary,
          tertiary: colors.background.tertiary,
          inverse: colors.background.inverse,
        },
        // Surface / card layers
        surface: {
          DEFAULT: colors.surface.default,
          raised: colors.surface.raised,
          interactive: colors.surface.interactive,
          highlight: colors.surface.highlight,
          inverse: colors.surface.inverse,
          'inverse-raised': colors.surface.inverseRaised,
        },
        // Border system
        border: {
          subtle: colors.border.subtle,
          DEFAULT: colors.border.default,
          focus: colors.border.focus,
          error: colors.border.error,
          success: colors.border.success,
          warning: colors.border.warning,
          'inverse-subtle': colors.border.inverseSubtle,
          'inverse-default': colors.border.inverseDefault,
        },
        // Text hierarchy
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          muted: colors.text.muted,
          placeholder: colors.text.placeholder,
          'inverse-primary': colors.text.inversePrimary,
          'inverse-secondary': colors.text.inverseSecondary,
          'inverse-muted': colors.text.inverseMuted,
          link: colors.text.link,
          'link-hover': colors.text.linkHover,
        },
        // Brand / accent
        brand: {
          cyan: colors.brand.cyan,
          'cyan-hover': colors.brand.cyanHover,
          'cyan-light': colors.brand.cyanLight,
          'cyan-dim': colors.brand.cyanDim,
          navy: colors.brand.navy,
          blue: colors.brand.blue,
          'blue-hover': colors.brand.blueHover,
          'blue-light': colors.brand.blueLight,
        },
        // Semantic status colors
        status: {
          success: {
            DEFAULT: colors.status.success.DEFAULT,
            light: colors.status.success.light,
            dark: colors.status.success.dark,
            bg: colors.status.success.bg,
            'bg-light': colors.status.success.bgLight,
            border: colors.status.success.border,
            text: colors.status.success.text,
            'text-dark': colors.status.success.textDark,
          },
          warning: {
            DEFAULT: colors.status.warning.DEFAULT,
            light: colors.status.warning.light,
            dark: colors.status.warning.dark,
            bg: colors.status.warning.bg,
            'bg-light': colors.status.warning.bgLight,
            border: colors.status.warning.border,
            text: colors.status.warning.text,
            'text-dark': colors.status.warning.textDark,
          },
          error: {
            DEFAULT: colors.status.error.DEFAULT,
            light: colors.status.error.light,
            dark: colors.status.error.dark,
            bg: colors.status.error.bg,
            'bg-light': colors.status.error.bgLight,
            border: colors.status.error.border,
            text: colors.status.error.text,
            'text-dark': colors.status.error.textDark,
          },
          info: {
            DEFAULT: colors.status.info.DEFAULT,
            light: colors.status.info.light,
            dark: colors.status.info.dark,
            bg: colors.status.info.bg,
            'bg-light': colors.status.info.bgLight,
            border: colors.status.info.border,
            text: colors.status.info.text,
            'text-dark': colors.status.info.textDark,
          },
        },
        // Provenance / evidence colors (Intelligence Lab)
        provenance: {
          'user-provided': {
            DEFAULT: colors.provenance.userProvided.DEFAULT,
            bg: colors.provenance.userProvided.bg,
            border: colors.provenance.userProvided.border,
            text: colors.provenance.userProvided.text,
          },
          derived: {
            DEFAULT: colors.provenance.derived.DEFAULT,
            bg: colors.provenance.derived.bg,
            border: colors.provenance.derived.border,
            text: colors.provenance.derived.text,
          },
          'demo-enriched': {
            DEFAULT: colors.provenance.demoEnriched.DEFAULT,
            bg: colors.provenance.demoEnriched.bg,
            border: colors.provenance.demoEnriched.border,
            text: colors.provenance.demoEnriched.text,
          },
          'externally-verified': {
            DEFAULT: colors.provenance.externallyVerified.DEFAULT,
            bg: colors.provenance.externallyVerified.bg,
            border: colors.provenance.externallyVerified.border,
            text: colors.provenance.externallyVerified.text,
          },
          unknown: {
            DEFAULT: colors.provenance.unknown.DEFAULT,
            bg: colors.provenance.unknown.bg,
            border: colors.provenance.unknown.border,
            text: colors.provenance.unknown.text,
          },
        },
        // Overlay
        overlay: {
          modal: colors.overlay.modal,
          popover: colors.overlay.popover,
        },
      },

      // ============================================================
      // SPACING — 4px base unit, semantic aliases
      // ============================================================
      spacing: {
        ...spacing,
        // Semantic aliases
        xs: spacing['0.5'],
        sm: spacing[1],
        md: spacing[2],
        lg: spacing[4],
        xl: spacing[6],
        '2xl': spacing[8],
        '3xl': spacing[12],
        // Layout-specific
        'sidebar-collapsed': spacing.sidebarCollapsed,
        'sidebar-expanded': spacing.sidebarExpanded,
        'topbar-height': spacing.topbarHeight,
        'row-compact': spacing.rowCompact,
        'row-comfortable': spacing.rowComfortable,
        'panel-width': spacing.panelWidth,
        'content-max': spacing.contentMax,
      },

      // ============================================================
      // TYPOGRAPHY — Inter + JetBrains Mono, mature type scale
      // ============================================================
      fontFamily: {
        sans: fontFamily.sans,
        mono: fontFamily.mono,
      },
      fontWeight: {
        normal: fontWeight.normal,
        medium: fontWeight.medium,
        semibold: fontWeight.semibold,
        bold: fontWeight.bold,
      },
      lineHeight: {
        tight: lineHeight.tight,
        snug: lineHeight.snug,
        normal: lineHeight.normal,
        relaxed: lineHeight.relaxed,
        mono: lineHeight.mono,
      },
      letterSpacing: {
        tighter: letterSpacing.tighter,
        tight: letterSpacing.tight,
        normal: letterSpacing.normal,
        wide: letterSpacing.wide,
        wider: letterSpacing.wider,
        widest: letterSpacing.widest,
      },
      fontSize: {
        // Semantic type scale
        display: [typeScale.display.fontSize, { lineHeight: typeScale.display.lineHeight, letterSpacing: typeScale.display.letterSpacing, fontWeight: typeScale.display.fontWeight }],
        'page-title': [typeScale.pageTitle.fontSize, { lineHeight: typeScale.pageTitle.lineHeight, letterSpacing: typeScale.pageTitle.letterSpacing, fontWeight: typeScale.pageTitle.fontWeight }],
        'section-title': [typeScale.sectionTitle.fontSize, { lineHeight: typeScale.sectionTitle.lineHeight, letterSpacing: typeScale.sectionTitle.letterSpacing, fontWeight: typeScale.sectionTitle.fontWeight }],
        'card-title': [typeScale.cardTitle.fontSize, { lineHeight: typeScale.cardTitle.lineHeight, letterSpacing: typeScale.cardTitle.letterSpacing, fontWeight: typeScale.cardTitle.fontWeight }],
        'body-lg': [typeScale.bodyLg.fontSize, { lineHeight: typeScale.bodyLg.lineHeight, letterSpacing: typeScale.bodyLg.letterSpacing, fontWeight: typeScale.bodyLg.fontWeight }],
        body: [typeScale.body.fontSize, { lineHeight: typeScale.body.lineHeight, letterSpacing: typeScale.body.letterSpacing, fontWeight: typeScale.body.fontWeight }],
        'body-sm': [typeScale.bodySm.fontSize, { lineHeight: typeScale.bodySm.lineHeight, letterSpacing: typeScale.bodySm.letterSpacing, fontWeight: typeScale.bodySm.fontWeight }],
        metadata: [typeScale.metadata.fontSize, { lineHeight: typeScale.metadata.lineHeight, letterSpacing: typeScale.metadata.letterSpacing, fontWeight: typeScale.metadata.fontWeight }],
        caption: [typeScale.caption.fontSize, { lineHeight: typeScale.caption.lineHeight, letterSpacing: typeScale.caption.letterSpacing, fontWeight: typeScale.caption.fontWeight }],
        mono: [typeScale.mono.fontSize, { lineHeight: typeScale.mono.lineHeight, letterSpacing: typeScale.mono.letterSpacing, fontWeight: typeScale.mono.fontWeight, fontFamily: typeScale.mono.fontFamily }],
        'mono-sm': [typeScale.monoSm.fontSize, { lineHeight: typeScale.monoSm.lineHeight, letterSpacing: typeScale.monoSm.letterSpacing, fontWeight: typeScale.monoSm.fontWeight, fontFamily: typeScale.monoSm.fontFamily }],
        button: [typeScale.button.fontSize, { lineHeight: typeScale.button.lineHeight, letterSpacing: typeScale.button.letterSpacing, fontWeight: typeScale.button.fontWeight }],
        label: [typeScale.label.fontSize, { lineHeight: typeScale.label.lineHeight, letterSpacing: typeScale.label.letterSpacing, fontWeight: typeScale.label.fontWeight }],
        nav: [typeScale.nav.fontSize, { lineHeight: typeScale.nav.lineHeight, letterSpacing: typeScale.nav.letterSpacing, fontWeight: typeScale.nav.fontWeight }],
        'kpi-value': [typeScale.kpiValue.fontSize, { lineHeight: typeScale.kpiValue.lineHeight, letterSpacing: typeScale.kpiValue.letterSpacing, fontWeight: typeScale.kpiValue.fontWeight }],
        'kpi-label': [typeScale.kpiLabel.fontSize, { lineHeight: typeScale.kpiLabel.lineHeight, letterSpacing: typeScale.kpiLabel.letterSpacing, fontWeight: typeScale.kpiLabel.fontWeight }],
      },

      // ============================================================
      // SHADOWS — Low-noise, layered
      // ============================================================
      boxShadow: {
        card: shadows.card,
        'card-hover': shadows.cardHover,
        'card-active': shadows.cardActive,
        raised: shadows.raised,
        floating: shadows.floating,
        focus: shadows.focus,
        'focus-light': shadows.focusLight,
        inset: shadows.inset,
        sticky: shadows.sticky,
        none: shadows.none,
      },

      // ============================================================
      // BORDER RADIUS
      // ============================================================
      borderRadius: {
        none: radius.none,
        xs: radius.xs,
        sm: radius.sm,
        DEFAULT: radius.md,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        '2xl': radius['2xl'],
        full: radius.full,
        // Semantic
        button: borderRadius.button,
        input: borderRadius.input,
        card: borderRadius.card,
        modal: borderRadius.modal,
        badge: borderRadius.badge,
        avatar: borderRadius.avatar,
        table: borderRadius.table,
        tooltip: borderRadius.tooltip,
      },

      // ============================================================
      // TRANSITIONS — Consistent timing & easing
      // ============================================================
      transitionDuration: {
        instant: transitionDuration.instant,
        fast: transitionDuration.fast,
        normal: transitionDuration.normal,
        slow: transitionDuration.slow,
        ambient: transitionDuration.ambient,
      },
      transitionTimingFunction: {
        DEFAULT: transitionEasing.default,
        'ease-out': transitionEasing.easeOut,
        'ease-in': transitionEasing.easeIn,
        sharp: transitionEasing.sharp,
        spring: transitionEasing.spring,
      },

      // ============================================================
      // Z-INDEX — Layering system
      // ============================================================
      zIndex: {
        hide: '-1',
        base: '0',
        dropdown: '100',
        sticky: '200',
        overlay: '300',
        modal: '400',
        popover: '500',
        tooltip: '600',
        toast: '700',
      },

      // ============================================================
      // SCREENS — Breakpoints for responsive design
      // ============================================================
      screens: {
        xs: '390px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1680px',
      },
    },
  },
  plugins: [],
}