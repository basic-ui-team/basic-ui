# @basic-ui/tokens

## 0.5.0

### Minor Changes

- 3c64754: Add palette color recipes and make Button recipe-only.

  - Color recipes combine a validated palette family with per-variant shade,
    state, and theme mappings. Recipe utilities are static Tailwind candidates
    reading CSS custom properties, so CSS output stays bounded by the recipe
    channels, theme changes apply through the cascade without a rerender, and
    recipes support distinct light and dark paint sets.
  - Button: the `color` prop now accepts a palette family (any Tailwind ramp or
    the brand ramps) instead of semantic colors, applied through per-variant
    light/dark recipes. There are no existing consumers, so this ships as the
    first released shape.
  - The generated stylesheet registers the recipe channel utilities (light and
    dark) in its safelist and emits the supported palette ramps as
    `@theme static` variables, extracted at generation time from the installed
    Tailwind theme and the tokens generated theme. Without the static block,
    Tailwind tree-shakes unused palette variables and recipes referencing those
    families render colorless.
  - The tokens generated theme now declares a class-based dark custom variant
    (`dark` matches `.dark` on an ancestor). Previously all `dark:` utilities
    followed the OS color-scheme preference instead of the toggled theme class.

- 6aebe7c: Rationalize component colors onto palette recipes and retire the
  informational semantic tokens.

  - Component color props accept palette families (any Tailwind ramp or the
    brand ramps) instead of semantic colors: Text, Header, CardTitle, and
    CardDescription take `"default" | "muted" | PaletteColor`; Spinner and
    Divider the same; Icon takes `"muted" | PaletteColor` and inherits the
    surrounding color when omitted; Button and Toggle take `PaletteColor`.
    The `| string` escape hatch on typography components is closed.
  - Severities are curated recipes, not token-styled states. Alert keeps
    `severity` for the ARIA role and icon and maps it to a default palette
    family; a new `color` prop overrides the family. Badge's `"default"`
    color renders the slate family.
  - Focus rings follow the recipe and are never manually colored:
    recipe-driven components read the recipe's focus variables
    (`focus-visible:ring-(--cr-*-focus)`), recipe-less components use
    `ring-current`, and ring offsets are themed (`ring-offset-bg-base`) so
    dark mode no longer paints a white gap. Elements that can never receive
    focus carry no focus utilities.
  - Recipes emit color only: the border channel template no longer carries a
    width utility, so component-owned widths (the Spinner arc, Divider
    thickness, Alert and Card borders) cannot collide with recipe utilities.
  - Card `selected` paints a structural inverted surface
    (`bg-bg-inverted text-fg-inverted`) instead of a success border.
    Pagination is color prop-ised with paired resting/active recipes; the
    shared view now passes the recipe variables through the page and
    control render callbacks.
  - `BuiltInSemanticColors` and its guard are removed from core's public
    surface.
  - tokens: the `error`/`warning`/`success`/`info` semantic states are
    retired from `SemanticState`, both themes, and the generated
    `theme.css`/`tokens.ts`. Tokens author brand ramps and structural
    neutrals only. There are no existing consumers, so these removals ship
    as the first released shape.

- a3afea8: Make the primitives Tailwind-first: className styling, a component-derived
  safelist, and Tailwind's linear spacing scale.

  - Primitives style through `className`. A component exposes a style prop
    only when it buys something a class cannot — a mix, a state, a default,
    or a semantic — never a 1:1 utility pass-through. Box is a pure
    polymorphic shell (`as`, `className`, `style`); Flex keeps
    direction/justify/align/wrap/display; Grid keeps
    cols/rows/templatePreset/auto-placement and its alignment axes. Gap
    trios and Divider's `inset`/`m`/`p` are removed (the `hr` margin reset
    moves into the variant base); Spinner, Skeleton, Icon, Image, and Card
    no longer inherit layout props. Text, Header, and Card sections keep
    their overflow props through a shared `TextFlowOverflowProps`. There
    are no external consumers, so this ships as the released shape.
  - Zero-config consumer builds now generate every component-authored class.
    Tailwind never scans `node_modules`, so classes written as literals in
    variant tables (focus rings, transitions, animations, elevation) were
    previously absent from real consumer CSS while Storybook masked the gap
    by consuming workspace source. The shipped stylesheet now
    self-registers `@source "./"`, pointing consumer Tailwind builds at the
    package dist; `verify-package` asserts the consumer path end-to-end
    against the packed tarball.
  - The responsive safelist is derived from the same cva tables and
    geometry maps the components render with, so it cannot drift from the
    implementation. It covers only the 170 runtime-constructed utilities
    (16.2 KB gzipped, previously 40.5 KB for a hand-authored vocabulary
    that still missed component-authored classes); coverage tests pin
    spacing and sizing utilities out of the safelist.
  - Spacing adopts Tailwind's own linear scale. The 9-point geometric token
    scale is removed from `@basic-ui/tokens`, along with its configuration
    types, scale resolution, and merge special-casing (`mergeTheme` is a
    plain deep merge). The theme emits Tailwind's default base
    (`--spacing: 0.25rem`), so every bare numeric utility — fractionals
    like `p-1.5` included — resolves through `calc(var(--spacing) * N)`.
  - The palette registry (`PALETTE_FAMILIES`, brand and Tailwind families)
    moves to `@basic-ui/tokens`, which now also generates the
    `@theme static` palette emission consumed by color recipes; core ships
    only `@source` directives, recipes, and components.
  - Divider's label chip uses token utilities (`bg-bg-base`,
    `text-fg-muted`) instead of unstyled Tailwind classes, and its
    developer warning is production-gated. Tooltip renders non-element
    children without crashing, with a development-only warning, instead of
    throwing on `children.props`.

- 262c7eb: Add a workspace-only `dev` export condition to every workspace package,
  matching `@basic-ui/core`.

  - The condition maps to `src/index.ts` and is local-only: `src/` is not
    published (`files: ["dist"]`), so published/default consumers always
    resolve `dist/` and are unaffected.
  - Local tooling that opts into the condition (Storybook appends `dev` to
    Vite's default resolve conditions) now resolves workspace packages to
    source without per-package aliases, keeping package exports validated.

### Patch Changes

- 262c7eb: Remove the stale `bui:` utility-prefix comment from the generated
  `styles/theme.css`. The prefix was a never-implemented design and no code
  uses it; the comment misdescribed the published stylesheet. No functional
  change to tokens or CSS output.

## 0.4.0

### Minor Changes

- 7e0f682: Replace named spacing tokens with a configurable numeric spacing scale and resolve authored themes before CSS serialization. The `@basic-ui/tokens/pkg` subpath is removed.
- 69422d1: Replace the z-index token scale with semantic local and global layering tiers, including dedicated overlay and popover layers.
- f181617: Improve semantic color contrast, adopt amber for warning roles, and refine dark semantic surfaces.

## 0.3.0

### Minor Changes

- e280131: [tokens] improve mergeTheme function for better flexibility and maintainability
- 4eb400d: [core/button] - Added new `Button` component with support for variants, sizes, colors, and loading state. This component is designed to be flexible and accessible, allowing for easy integration into various UI designs. The `Button` component also includes a new `rounded` prop for controlling border radius, enhancing the customization options available to developers.

  [tokens] updated some semantic (error, info, etc) colors to be more consistent with the new design system. These changes may affect the appearance of components that rely on these tokens, so please review the updated token values and adjust your styles accordingly if necessary.

- 1a1b31c: [tokens/themeConfig] Refactored theme config. Color themes are now written as nested objects generated directly from types.

  [tokens] refactored themeToCustomProperties (Renamed to themeToCSSVariables) to handle nested color objects properly.

  [token/themes] move and refactor preset themes into themes folder. Refactored to match new token config. Use tailwind oklch values for color ramps to ensure better colors and accessibility.

  [tokens/scripts] refactored generate-theme-css to generate both css for exporting and token object for programmatic token use.

## 0.2.1

### Patch Changes

- 1f998f5: [lint] Added lint scripts to all packages while simplifying the root configuration. This allows for consistent code quality checks across the entire monorepo and makes it easier for developers to run linting on their code before committing changes. By using ESLint with caching enabled, we can improve the performance of linting by only checking files that have changed since the last linting run, which helps to speed up the development workflow and maintain a clean codebase.

  [typescript] Enforced stronger typing across the codebase by enabling the noImplicitAny TypeScript compiler option and fix resulting errors.

  [accesibility] Brought jsx-a11y rules into package configs and fixed violations across the codebase. This improvement ensures that our components adhere to accessibility best practices, making them more inclusive and usable for all users, including those with disabilities.

## 0.2.0

### Minor Changes

- ce32fac: [tokens/font-size] Add 5xl font-size token and CSS variable --text-5xl; update light preset and FontSizeTokens type to include 5xl.

## 0.1.0

### Minor Changes

- 6484252: \[theme] update border to border-base in theme and update components to use new token

  \[theme] fix failing tests
