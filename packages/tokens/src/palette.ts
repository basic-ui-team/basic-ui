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

export const BRAND_PALETTE_FAMILIES = ["primary", "secondary", "accent"] as const;

export const PALETTE_FAMILIES = [
  ...TAILWIND_PALETTE_FAMILIES,
  ...BRAND_PALETTE_FAMILIES,
] as const;

export type PaletteColor = (typeof PALETTE_FAMILIES)[number];
