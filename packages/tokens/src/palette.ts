/**
 * The palette registry: every color family with a full shade ramp that the
 * design system accepts.
 *
 * Neutral families mirror Tailwind's default theme (kept in lockstep by the
 * palette-static generation's fail-fast checks); brand families are defined
 * by this package's theme presets. Downstream packages — color recipes,
 * component props, docs — consume this registry instead of re-declaring it.
 */
export const TAILWIND_PALETTE_FAMILIES = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
] as const;

export const BRAND_PALETTE_FAMILIES = ["primary", "secondary"] as const;

export const PALETTE_FAMILIES = [
  ...TAILWIND_PALETTE_FAMILIES,
  ...BRAND_PALETTE_FAMILIES,
] as const;

export type PaletteColor = (typeof PALETTE_FAMILIES)[number];
