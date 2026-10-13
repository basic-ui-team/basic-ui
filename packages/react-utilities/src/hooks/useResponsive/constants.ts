export const BREAKPOINTS = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Object key order preserves the mobile-first declaration order above.
export const BREAKPOINT_ORDER = Object.keys(BREAKPOINTS) as Breakpoint[];