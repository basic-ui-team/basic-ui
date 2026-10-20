# Tailwind color recipes — RFC

Status
------
Accepted and implemented. This note is the standing design record for the
color recipe system. Implementation detail lives in
[core-design/color-system.md](../core-design/color-system.md).

Summary
-------
Component color styling moves off engine-owned semantic color classes and
onto Tailwind palette families chosen by the caller. Recipes — typed data
in each component's variant file — own the shade, state, and theme mapping;
a `cr` ("cook recipe") helper combines a validated palette family with a
recipe and returns styling that cooperates with Tailwind.

The design is shaped by one hard Tailwind v4 constraint: Tailwind scans
source as text and never evaluates runtime string construction. A helper
that assembles `bg-${color}-${shade}` can return a class Tailwind never
emitted CSS for, and generating every color/shade/state combination is
unbounded. The resolution: complete, static utility candidates that read
CSS custom properties (`bg-(--cr-bg)`), with only the property values
derived at runtime. CSS output stays bounded by the recipe utilities,
never by the size of the color palette.

Goals
-----
- Let a component consumer choose any registered palette family, including
  the brand ramps.
- Keep the shade, state, and theme mapping in the component's variant file.
- Keep utility candidates complete and statically discoverable.
- Emit no utility per color/shade/state combination.
- Let CSS theme changes (including dark mode) apply through the cascade
  without a React rerender.
- Validate colors before building CSS variable references; never emit a
  utility that references an unset variable.

Non-goals
---------
- Replacing Tailwind's color palette or theme configuration.
- Requiring consumers to maintain a safelist for the entire palette.
- Keeping a second color vocabulary in tokens: informational semantic
  states are retired; a severity is a curated recipe over a palette family,
  not a token-styled state.
- Recipes owning geometry. Width, radius, and layout stay in cva variant
  classes; a recipe emits color only.

Recipe shape
------------
Channels are the utility property names: `bg`, `text` (the foreground
channel, mapped to `text-*`), and `border`. Each channel carries a base
paint plus optional state paints, and an optional dark state set that
replaces the whole light set in dark mode:

```ts
type ColorShade =
  | "50" | "100" | "200" | "300" | "400" | "500"
  | "600" | "700" | "800" | "900" | "950";
type PaletteColorValue = ColorShade | "white" | "black";

type PaintValue = { value: PaletteColorValue; opacity?: number };
type PaintState = PaintValue & { hover?: PaintValue; active?: PaintValue; focus?: PaintValue };
type PaintRecipe = PaintState & { dark?: PaintState };
type ColorRecipe = Partial<Record<"bg" | "text" | "border", PaintRecipe>>;
```

Rules:

- State values fall back per field: an omitted state inherits the base
  value and the base opacity independently.
- `dark` replaces the entire state set (its hover/active/focus fall back to
  its own base); when omitted, dark mode uses the light recipe unchanged.
- Opacity is a number from 0 to 100, encoded as `color-mix(in oklab, ...)`;
  full opacity collapses to the plain `var(...)` so only partial opacities
  pay the `color-mix` cost.
- The `text-(color:--cr-text)` form is explicit because `text-` is ambiguous
  between font-size and color utilities.

Focus is a special state: recipes may set `focus` per channel, but it emits
**variables only** — never `focus:` channel utilities. Tailwind sorts
`focus:` after `hover:`, so a `focus:bg-*` utility would suppress hover
feedback on any focused element. Focus variables exist to feed
focus-indication utilities (rings), so the resting background is never
affected by focus.

Utility and variable strategy
-----------------------------
Channel templates are complete, static candidate strings:

```ts
const CHANNEL_CLASSES = {
  bg: "bg-(--cr-bg) hover:bg-(--cr-bg-hover) active:bg-(--cr-bg-active) dark:bg-(--cr-bg-dark) ...",
  text: "text-(color:--cr-text) hover:text-(color:--cr-text-hover) ...",
  border: "border-(--cr-border) hover:border-(--cr-border-hover) ...",
};
```

`cr(color, recipe)` returns `{ className, style }`: the concatenated channel
classes plus the CSS variables they read (`--cr-bg: var(--color-teal-700)`
and so on, with `-dark`, `-hover`, `-active`, and `-focus` variants). The
component merges `style` last so consumers can still override.

Two emission guarantees make this work in any Tailwind build:

- **Safelisting.** Source scanning of package sources is unreliable in real
  build chains, and external consumers do not scan package sources at all.
  Every channel candidate is therefore registered as an `@source inline(...)`
  directive in the generated stylesheet, derived from the templates so the
  two cannot drift.
- **Palette variables.** Tailwind tree-shakes `@theme` variables to those
  used by generated utilities, so recipe variables like
  `var(--color-rose-700)` would silently resolve to nothing for unused
  families. The generator therefore emits a `@theme static` block with the
  full registry ramp, extracted from the installed `tailwindcss/theme.css`
  (version-synced, never hand-maintained) plus the brand ramps from the
  tokens generated theme. See
  [responsive-css-investigation.md](../core-design/responsive-css-investigation.md)
  for the tree-shaking matrix.

Validation contract
-------------------
The color is a declaration of intent, not an arbitrary CSS value. The
registry (`PALETTE_FAMILIES`) is explicit: the 22 Tailwind ramp families
plus the brand `primary`/`secondary` ramps, both guaranteed present as CSS
variables by the static block. `cr` throws on an unsupported family; the
non-throwing `isPaletteColor` guard discriminates component color props
(palette vs structural values). TypeScript constrains typed callers via
`PaletteColor`; the runtime guard covers JS and dynamic values. There is no
silently-valid-but-colorless path.

Light and dark mode
-------------------
Inline variables reference theme tokens (`var(--color-teal-700)`), so
theme changes apply through the cascade with no React rerender. Palette
ramps stay identical between light and dark themes; per-theme appearance
comes from the recipe's `dark` state set, which requires the class-based
dark custom variant (`@custom-variant dark (&:where(.dark, .dark *))`)
emitted by the tokens theme.

Semantic boundary
-----------------
The recipe mechanism serves palette styling; it does not erase semantic
intent. Components whose color communicates status keep a semantic prop
that drives behavior (ARIA role, icon) plus a curated default family — a
severity is a recipe over a fixed family (error = red at hand-picked
shades), and consumers may override the family without changing the
behavior. The informational semantic tokens are retired from the theme;
tokens author brand ramps and structural neutrals (`bg-base`, `fg-base`,
`border-*`, surfaces) only.

Accessibility is part of the contract: recipes specify the foreground
channel deliberately rather than inferring it, and focus indicators must
not depend on the recipe's resting opacity — that is what the `focus`
state variable is for.

Focus rings
-----------
Rings follow the recipe and are never manually colored: the ring utilities
live in the component's variant file and read the recipe's focus variables
(`focus-visible:ring-(--cr-bg-focus)` and its dark pair). Components
without a recipe use `focus-visible:ring-current`, so the ring always
matches the text color. The ring offset is themed (`ring-offset-bg-base`)
so dark mode never paints a white gap. A component that can never receive
focus carries no focus utilities at all.

Trade-offs
----------
Advantages: bounded CSS output; no generated per-family utility matrix;
static, discoverable candidates; cascade-driven theming; recipes as the
single source of shade/state truth.

Costs: `cr` returns a structured result rather than a class string;
component wiring must merge `style` as well as `className`; the registry
and the static palette block must stay in sync with the installed Tailwind
(the generator fails fast on drift); recipes must choose shades with
deliberate contrast in both themes.

Open decisions
--------------
1. Custom brand registration: how consumers register a family with possibly
   partial shade ramps, and how validation learns it. The main open
   question before external consumers migrate.
2. Contrast as a contract: an automated check computing WCAG contrast for
   every recipe's fg/bg pair across states and themes, so hand-tuned
   recipes are mechanically verified.
3. Named values beyond numeric shades and `white`/`black`:
   `transparent` and `current` remain deferred.
