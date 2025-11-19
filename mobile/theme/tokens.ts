/**
 * Design Tokens
 * Centralized design system tokens for consistent theming across the app
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Main primary color
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },

  // Secondary brand colors
  secondary: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef", // Main secondary color
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
  },

  // Semantic colors
  success: {
    50: "#f0fdf4",
    500: "#22c55e", // Main success color
    700: "#15803d",
  },

  warning: {
    50: "#fffbeb",
    500: "#f59e0b", // Main warning color
    700: "#b45309",
  },

  error: {
    50: "#fef2f2",
    500: "#ef4444", // Main error color
    700: "#b91c1c",
  },

  info: {
    50: "#eff6ff",
    500: "#3b82f6", // Main info color
    700: "#1d4ed8",
  },

  // Neutral colors (light mode)
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Dark mode colors
  dark: {
    50: "#18181b",
    100: "#27272a",
    200: "#3f3f46",
    300: "#52525b",
    400: "#71717a",
    500: "#a1a1aa",
    600: "#d4d4d8",
    700: "#e4e4e7",
    800: "#f4f4f5",
    900: "#fafafa",
  },

  // Common colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
} as const;

export const spacing = {
  0: 0,
  1: 4,    // 4px
  2: 8,    // 8px
  3: 12,   // 12px
  4: 16,   // 16px
  5: 20,   // 20px
  6: 24,   // 24px
  8: 32,   // 32px
  10: 40,  // 40px
  12: 48,  // 48px
  16: 64,  // 64px
  20: 80,  // 80px
  24: 96,  // 96px
  32: 128, // 128px
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
} as const;

export const fontWeight = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
} as const;

export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;

export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: "auto",
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const duration = {
  fast: 150,
  base: 200,
  slow: 300,
  slower: 500,
} as const;

/**
 * Animation easing curves
 */
export const easing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
} as const;

/**
 * Breakpoints for responsive design
 * These match common device widths
 */
export const breakpoints = {
  sm: 640,   // Small phones
  md: 768,   // Large phones / small tablets
  lg: 1024,  // Tablets
  xl: 1280,  // Large tablets / small laptops
  "2xl": 1536, // Laptops and desktops
} as const;

/**
 * Safe area insets (for notches, status bars, etc.)
 */
export const safeArea = {
  top: 44,    // iPhone notch height
  bottom: 34, // iPhone home indicator height
} as const;

/**
 * Common icon sizes
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  base: 20,
  md: 24,
  lg: 32,
  xl: 40,
  "2xl": 48,
} as const;

/**
 * Export all tokens
 */
export const tokens = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  shadows,
  opacity,
  zIndex,
  duration,
  easing,
  breakpoints,
  safeArea,
  iconSizes,
} as const;

export default tokens;
