/**
 * Color recipes: combine a validated palette color family with a recipe of
 * shades and states, and return styling that cooperates with Tailwind.
 *
 * Tailwind only generates CSS for complete, statically discoverable utility
 * candidates - it never evaluates runtime string construction. Recipes
 * therefore keep their utility candidates as fixed strings that read CSS
 * custom properties (`bg-(--cr-bg)`), and only the custom property values are
 * derived at runtime from the consumer-supplied color family. CSS output stays
 * bounded by the recipe utilities, never by the size of the color palette.
 */

export type ColorShade =
  | "50" | "100" | "200" | "300" | "400" | "500"
  | "600" | "700" | "800" | "900" | "950";

export type PaletteColorValue = ColorShade | "white" | "black";

/** Palette color families with a full shade ramp available as CSS variables. */
export const PALETTE_FAMILIES = [
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink",
  "rose", "slate", "gray", "zinc", "neutral", "stone",
  // Brand families defined by the basic-ui generated theme.
  "primary", "secondary",
] as const;

export type PaletteColor = (typeof PALETTE_FAMILIES)[number];

export type ColorRecipeChannel = "bg" | "text" | "border";

export type PaintValue = {
  value: PaletteColorValue;
  /** Opacity from 0 to 100, encoded as a color-mix so no utility is interpolated. */
  opacity?: number;
};

/** One paint state set: base value plus optional hover and active overrides. */
export type PaintState = PaintValue & {
  hover?: PaintValue;
  active?: PaintValue;
};

/**
 * A channel paint recipe. `dark` replaces the whole state set in dark mode
 * (with its own hover/active fallbacks); when omitted, dark mode uses the
 * light recipe unchanged.
 */
export type PaintRecipe = PaintState & {
  dark?: PaintState;
};

export type ColorRecipe = Partial<Record<ColorRecipeChannel, PaintRecipe>>;

export type CookedColorRecipe = {
  className: string;
  style: Record<string, string>;
};

/**
 * Complete, static utility candidates per channel. States and themes always
 * have a utility and always get a variable; omitted recipe states and themes
 * fall back, so no utility ever references an unset variable.
 * The `text-(color:...)` form is explicit because `text-` is ambiguous
 * between font-size and color utilities. The `dark:` variants require the
 * class-based dark custom variant emitted by the tokens theme.
 */
const CHANNEL_CLASSES: Record<ColorRecipeChannel, string> = {
  bg: "bg-(--cr-bg) hover:bg-(--cr-bg-hover) active:bg-(--cr-bg-active) dark:bg-(--cr-bg-dark) dark:hover:bg-(--cr-bg-hover-dark) dark:active:bg-(--cr-bg-active-dark)",
  text: "text-(color:--cr-text) hover:text-(color:--cr-text-hover) active:text-(color:--cr-text-active) dark:text-(color:--cr-text-dark) dark:hover:text-(color:--cr-text-hover-dark) dark:active:text-(color:--cr-text-active-dark)",
  border: "border border-(--cr-border) hover:border-(--cr-border-hover) active:border-(--cr-border-active) dark:border-(--cr-border-dark) dark:hover:border-(--cr-border-hover-dark) dark:active:border-(--cr-border-active-dark)",
};

/**
 * Every complete recipe utility candidate, derived from the channel templates.
 * Registering these in the generated `@source inline(...)` safelist guarantees
 * the utilities exist in any Tailwind build that uses the shipped stylesheet,
 * regardless of how (or whether) the consumer scans package sources.
 */
export const colorRecipeUtilityCandidates = Object.values(CHANNEL_CLASSES).flatMap((classes) =>
  classes.split(" "),
);

const FAMILY_SET = new Set<string>(PALETTE_FAMILIES);

function validatePaletteColor(color: string): asserts color is PaletteColor {
  if (!FAMILY_SET.has(color)) {
    throw new Error(
      `Unsupported palette color "${color}". Supported families: ${PALETTE_FAMILIES.join(", ")}.`,
    );
  }
}

function validateOpacity(opacity: number) {
  if (opacity < 0 || opacity > 100) {
    throw new Error(`Color recipe opacity must be between 0 and 100, received ${opacity}.`);
  }
}

function cssColor(family: PaletteColor, paint: PaintValue): string {
  const token =
    paint.value === "white" || paint.value === "black"
      ? `--color-${paint.value}`
      : `--color-${family}-${paint.value}`;
  if (paint.opacity === undefined) {
    return `var(${token})`;
  }
  validateOpacity(paint.opacity);
  return `color-mix(in oklab, var(${token}) ${paint.opacity}%, transparent)`;
}

/**
 * Cook a color recipe for a palette color family.
 * Returns the static recipe classes plus the CSS variables they read;
 * the variables reference theme tokens, so theme (including dark mode)
 * changes apply through the cascade without a React rerender.
 */
export function cr(color: PaletteColor, recipe: ColorRecipe): CookedColorRecipe {
  validatePaletteColor(color);
  const classes: string[] = [];
  const style: Record<string, string> = {};
  // State values fall back per field: an omitted state inherits the base
  // value and the base opacity independently.
  const fill = (base: PaintValue, override?: PaintValue): PaintValue => ({
    value: override?.value ?? base.value,
    opacity: override?.opacity ?? base.opacity,
  });
  for (const channel of Object.keys(recipe) as ColorRecipeChannel[]) {
    const paint = recipe[channel];
    if (!paint) continue;
    classes.push(CHANNEL_CLASSES[channel]);
    const themes: [suffix: "" | "-dark", state: PaintState][] = [
      ["", paint],
      ["-dark", paint.dark ?? paint],
    ];
    for (const [suffix, state] of themes) {
      style[`--cr-${channel}${suffix}`] = cssColor(color, state);
      style[`--cr-${channel}-hover${suffix}`] = cssColor(color, fill(state, state.hover));
      style[`--cr-${channel}-active${suffix}`] = cssColor(color, fill(state, state.active));
    }
  }
  return { className: classes.join(" "), style };
}
