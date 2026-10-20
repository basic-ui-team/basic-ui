# Color system

## Purpose and model

Core color recipes separate component styling from palette values. A component
owns a recipe describing its channels and states; at render time, the recipe
binds to a validated palette family by setting CSS custom properties. Tailwind
utilities are fixed and statically compiled, while changing the palette values
does not require new utility classes or a React rerender.

```text
Component color prop + component recipe
  -> cr(family, recipe)
  -> fixed channel/state utility classes + CSS variables
  -> palette variables from the active theme
```

The runtime implementation is
`packages/core/src/lib/colorRecipes/colorRecipes.ts`. Its `cr(color, recipe)`
function returns `{ className, style }`. Components compose the returned
classes with their normal variants and merge the returned style before the
consumer's `style`, so consumers can override recipe variables.

## Recipe contract

A recipe can define any of three channels: `bg`, `text`, and `border`. Each
channel has a base shade and optional `hover`, `active`, and `focus` values.
The `dark` field supplies a replacement state set for class-based dark mode.

```ts
cr("teal", {
  bg: {
    value: "700",
    hover: { value: "600" },
    dark: { value: "800", hover: { value: "700" } },
  },
  text: { value: "white" },
});
```

The recipe's paint values are shade names (`50` through `950`) or `white` and
`black`. Opacity is optional and ranges from 0 to 100.

- Omitted hover and active values inherit the base shade and base opacity.
- An omitted dark set uses the light set. A supplied dark set replaces that
  channel's full state set; its omitted hover and active values inherit from its
  own base.
- Each state inherits its shade and opacity independently. An explicit state
  shade with no opacity uses the base opacity.
- Full or unspecified opacity references the palette variable directly.
  Partial opacity uses `color-mix(in oklab, ..., transparent)`; it does not
  create interpolated utility names.
- Unsupported families and out-of-range opacity fail explicitly.

The runtime supplies complete static utilities for each defined channel:
base, hover, active, and dark-mode forms. This keeps generated CSS independent
of the number of palette families. `focus` is deliberately different: it
produces `--cr-*-focus` variables but no `focus:` channel utility. Tailwind
orders `focus:` after `hover:`, so a focused background utility could mask
hover feedback. Focus-ring classes consume the focus variables instead.

## Palette and component API

`PaletteColor` is the closed set of 22 Tailwind palette families plus the
`primary` and `secondary` ramps from the Tokens theme. Each has shades 50–950;
white and black are paint values rather than palette families. The
`PALETTE_FAMILIES` list is the runtime/type source of truth, and `isPaletteColor`
is available when a component must distinguish palette values from structural
values.

Component props expose families, not arbitrary strings or individual shades.
Shade choices belong to component recipes. Current prop patterns are:

| Component surface | Color prop contract |
| --- | --- |
| Button, Toggle, Pagination | `PaletteColor` |
| Alert | `PaletteColor`; severity chooses the default family and semantic role, while `color` overrides only the family |
| Badge | `"default" \| PaletteColor`; `"default"` resolves to `slate` |
| Text, Header, Card Title/Description, Spinner, Divider | `"default" \| "muted" \| PaletteColor` |
| Icon | `"muted" \| PaletteColor`; omitted color inherits from surrounding text |

`default` and `muted` on text and divider surfaces are structural theme colors,
not palette aliases. They resolve to the appropriate `fg-base`/`fg-muted` or
`border-base`/`border-muted` utilities. Severity remains component semantics:
for example, Alert maps severity to a curated family, icon, and role, then lets
an explicit palette color change appearance without changing severity meaning.

Tokens' semantic color model is separate from palette recipes. It defines
`bg`, `fg`, `surface`, and `border` roles with structural states (`base`,
`muted`, `hover`, `active`, `disabled`, `inverted`, and `skeleton`). It does not
model informational severities; components map those semantics to palette
families where appropriate.

Keep recipes with the components that own them, generally in their
`*.variants.ts` files. The shared runtime handles variable and class emission;
it does not define a global component color scale.

## Focus indication

Recipe-backed focus rings read the matching channel's focus variable:

- Button solid and ghost variants use the background channel; outline uses
  border; link uses text.
- Toggle and Pagination use the background channel.
- Components without a color recipe use `focus-visible:ring-current` when
  they need a focus ring.

Use `focus-visible` for keyboard focus indication and the themed
`ring-offset-bg-base` where the component's ring needs a surface-colored
separation. Do not add focus styling to elements that cannot receive focus.

## Theme and stylesheet generation

Tokens owns structural semantic colors and the `primary`/`secondary` brand
ramps. Standard palette ramps come from the installed Tailwind theme. Core's
`packages/core/scripts/palette-theme.ts` builds an `@theme static` block from
those inputs:

- It reads Tailwind's installed `theme.css` for the registered standard
  palette families.
- It reads the generated Tokens theme for `primary` and `secondary`.
- It verifies every registered family has source variables, failing generation
  if the registry and theme sources drift.

The static theme block prevents Tailwind from dropping palette variables that
are referenced through runtime CSS variables rather than direct color utility
classes. `colorRecipeUtilityCandidates` supplies a separate inline source list
for every fixed recipe utility. Core combines both with its other generated
utility source in
`packages/core/src/generated/layout-utilities.generated.css`, imported by
`packages/core/src/styles.css`. The Tokens theme defines the class-based
`.dark` variant used by the recipe's dark utilities.

The package's published CSS must work without scanning consumer or dependency
source files. Do not replace this explicit candidate source with runtime class
generation or rely on applications finding component internals to safelist
them.

## Extension and verification

When extending this system:

1. Add the runtime type/value only when the palette or recipe model genuinely
   needs a new family, paint value, channel, or state.
2. Keep utility candidates complete and static; variable names and recipe
   utilities must stay aligned.
3. Ensure the theme source emits every registered family and preserve the
   generator's fail-fast drift checks.
4. Add focused runtime tests and a compiled-CSS assertion for the resulting
   candidates and palette variables.

Relevant checks:

- `packages/core/src/lib/colorRecipes/colorRecipes.test.ts` covers variable
  resolution, fallback, opacity, validation, focus, dark recipes, and brand
  families.
- `packages/core/scripts/responsive-utilities.css.test.ts` compiles the public
  CSS with source scanning disabled and checks generated candidates and static
  palette variables.
- `pnpm --filter @basic-ui/core check:layout-utilities` verifies generated
  source freshness.
- `pnpm --filter @basic-ui/core verify:package` checks the published package
  stylesheet boundary.

## Known follow-ups

- Disabled pagination buttons and anchors still receive recipe hover tints;
  suppression is deferred to the pagination refinement, likely when
  `usePagination` and the shared utils move to a headless-hooks space.
- CardTitle and CardDescription inherit the inverted root when the card is
  `selected` and no explicit color is given; explicit `muted`/palette colors
  still apply. A card styling rework is planned (structure holds; styling and
  native element behavior need work).
- Issue #125: the outline Button hover tint is too faint to read as color;
  recipe tuning, not code.
- Open RFC decisions: custom brand registration, automated contrast checks,
  `transparent`/`current` named values.
