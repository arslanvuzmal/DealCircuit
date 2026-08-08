/**
 * LeadPilot Design Tokens — Transition / Motion System
 *
 * Consistent timing and easing for micro-interactions.
 * Respects `prefers-reduced-motion`.
 */

export const transitionDuration = {
  /** Instant — for color changes, opacity */
  instant: '50ms',
  /** Fast — for hover, focus, small transforms */
  fast: '120ms',
  /** Normal — for most UI transitions (drawers, modals, tooltips) */
  normal: '180ms',
  /** Slow — for larger panel animations, logo animation loops */
  slow: '280ms',
  /** Very slow — for ambient logo animation cycles */
  ambient: '2000ms',
} as const;

export const transitionEasing = {
  /** Default — natural feel */
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Ease out — for entering elements */
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Ease in — for exiting elements */
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Sharp — for quick feedback (button press) */
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  /** Spring-like — for logo animation, playful motion */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

/**
 * Pre-composed transition strings for common patterns.
 * Use via `cn(transitions.fade, transitions.slideUp)` etc.
 */
export const transitions = {
  /** Fade in/out */
  fade: `opacity ${transitionDuration.fast} ${transitionEasing.easeOut}`,
  /** Slide up + fade (modals, drawers, toasts) */
  slideUp: `transform ${transitionDuration.normal} ${transitionEasing.easeOut}, opacity ${transitionDuration.normal} ${transitionEasing.easeOut}`,
  /** Slide down + fade (dropdowns) */
  slideDown: `transform ${transitionDuration.normal} ${transitionEasing.easeOut}, opacity ${transitionDuration.normal} ${transitionEasing.easeOut}`,
  /** Scale + fade (popovers, tooltips) */
  scale: `transform ${transitionDuration.fast} ${transitionEasing.spring}, opacity ${transitionDuration.fast} ${transitionEasing.easeOut}`,
  /** Color/background/border changes */
  color: `color ${transitionDuration.instant} ${transitionEasing.default}, background-color ${transitionDuration.instant} ${transitionEasing.default}, border-color ${transitionDuration.instant} ${transitionEasing.default}, fill ${transitionDuration.instant} ${transitionEasing.default}, stroke ${transitionDuration.instant} ${transitionEasing.default}`,
  /** Box shadow changes */
  shadow: `box-shadow ${transitionDuration.fast} ${transitionEasing.default}`,
  /** Width/height changes (accordions) */
  dimension: `width ${transitionDuration.normal} ${transitionEasing.easeOut}, height ${transitionDuration.normal} ${transitionEasing.easeOut}`,
  /** All interactive properties (buttons, links) */
  interactive: `color ${transitionDuration.instant} ${transitionEasing.default}, background-color ${transitionDuration.instant} ${transitionEasing.default}, border-color ${transitionDuration.instant} ${transitionEasing.default}, opacity ${transitionDuration.instant} ${transitionEasing.default}, transform ${transitionDuration.fast} ${transitionEasing.sharp}, box-shadow ${transitionDuration.fast} ${transitionEasing.default}`,
  /** Logo ambient animation */
  logoAmbient: `opacity ${transitionDuration.ambient} ${transitionEasing.default}, transform ${transitionDuration.ambient} ${transitionEasing.default}`,
} as const;

/**
 * Utility to generate reduced-motion safe transitions.
 * When `prefers-reduced-motion: reduce`, only opacity/color transitions remain.
 */
export const reducedMotionSafe = {
  fade: `opacity ${transitionDuration.fast} ${transitionEasing.easeOut}`,
  color: `color ${transitionDuration.instant} ${transitionEasing.default}, background-color ${transitionDuration.instant} ${transitionEasing.default}, border-color ${transitionDuration.instant} ${transitionEasing.default}`,
} as const;

export type TransitionDuration = typeof transitionDuration;
export type TransitionEasing = typeof transitionEasing;
export type Transitions = typeof transitions;