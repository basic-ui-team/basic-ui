# @basic-ui/core

## 0.6.0

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

### Patch Changes

- Updated dependencies [3c64754]
- Updated dependencies [6aebe7c]
- Updated dependencies [a3afea8]
- Updated dependencies [262c7eb]
- Updated dependencies [262c7eb]
  - @basic-ui/tokens@0.5.0
  - @basic-ui/react-utilities@0.3.0
  - @basic-ui/icons@0.1.0

## 0.5.0

### Minor Changes

- 16046dc: Complete the pre-1.0 migration from viewport-selected presentation to static,
  mobile-first responsive CSS delivered by `@basic-ui/core/styles.css`.

  Breaking API changes:

  - Remove `useResponsiveProps` from `@basic-ui/react-utilities`. Use responsive
    component props or `getResponsiveClassNames` for presentation. `useBreakpoint`
    remains available for behavioral viewport decisions.
  - Icon's semantic `variant` is now `color`; remove the former light/dark `color`
    override. Omitted `color` inherits the surrounding foreground.
  - Button renders a supplied `loadingIcon` directly, without sizing or a wrapper.
    There is no built-in fallback spinner; supply a styled Icon or Spinner when
    needed. `loadingIcon` is optional without an explicit `false` union.
  - Card root variant, typography weight/color, image rounding, and Divider
    direction/appearance/color are scalar. Keep responsive values for reviewed
    sizing and layout concerns.
  - Header and Card.Title use fixed visual h1-h6 sizes; implicit md/lg heading
    scaling is removed. Express scaling explicitly with responsive `size`.
  - Text and Card typography use single-line truncation with explicit wrapping and
    overflow restoration. Full-text accessibility attributes remain stable across
    viewports when truncation is enabled at any breakpoint.

  Omitted breakpoints retain the latest CSS value, not the base value. Use
  `aspectRatio="auto"` to restore intrinsic image proportions. See the companion
  layout, Grid/Divider, Badge, and Toggle notes for their API and geometry changes.

  The Button hover/active gating and broader color/theming redesign remain deferred.

- 39ecf88: Add per-component package exports to `@basic-ui/core` and repair the
  published build surface.

  New import forms (both tree-shake; existing root and stylesheet imports
  keep working):

  ```ts
  import { Button, Card } from "@basic-ui/core";
  import { Card, type CardProps } from "@basic-ui/core/Card";
  import { TablePagination, LinkPagination } from "@basic-ui/core/Pagination";
  ```

  - Every `components/<Name>/index.ts` convention directory is a public entry,
    advertised through a wildcard package export mapping to
    `dist/components/<Name>/index.js` with matching declarations. Pagination
    remains one grouped entry.
  - New public exports: `Card`, `Header`, `Image`, and `Skeleton` (with their
    prop types) are exported from the root barrel; `Card`'s compound members
    and prop/component types are exported from its own entry; `Skeleton` gains
    its component entry.
  - Build fixes: declarations are no longer erased by the Vite build step
    (`dist/index.d.ts` now really exists), React/React DOM including their
    runtime subpaths are externalized instead of being bundled into Core
    output, and story/test declarations are no longer emitted.
  - Manifest: remove legacy `typesVersions`, declare
    `sideEffects: ["**/*.css"]` after an import-time side-effect audit, and add
    a workspace-only `dev` export condition so local tooling (Storybook) can
    resolve Core source during development. `src/` remains unpublished.
  - TypeScript types for TS < 4.7 / non-`exports`-aware tooling are no longer
    supported via `typesVersions`.

- aaedf17: Add the `Dialog` component (#75), ported from appiq onto the `useDialog` headless hook (M2).

  - Modal/non-modal behavior via `useDialog`: focus trap, scroll lock, Escape, focus restore, `aria-modal` wiring
  - Accessible-name guarantee: `title`, `aria-label`, or external `aria-labelledby`; description wired via `aria-describedby`
  - `dismissOnOutside` for backdrop/outside dismissal (default on, opt-out supported); non-modal overlay wrapper is pointer-transparent so background content stays interactive
  - Sizes (`sm`/`md`/`lg`) and `fullWidth` via CVA on basic-ui tokens
  - `useDialog`: `hasDescription` now defaults to `false` (callers rendering a description opt in), and `dialogProps` types the optional `aria-describedby`

- 0a56a88: Migrate Flex to generated responsive layout utilities for direction, justification, alignment, wrapping, and display. Flex no longer applies an implicit `gap-3`; set `gap` explicitly when spacing is desired.
- 88da429: Add Core's Tailwind stylesheet entry and generated responsive layout utility source.
- 577c035: Replace named layout spacing values with numeric steps from 0 through 9 across layout props, Flex, Grid, and Divider.
- 08c7362: Modernize Alert with controlled visibility, explicit dismissal, semantic visual variants, and simplified icon composition.
- 2891fc4: Modernize Badge as an attached semantic indicator with count and dot variants.
- d5d1db3: Modernize Box with static responsive layout utilities, transparent defaults, shared display support, and native polymorphic prop forwarding.
- 54034d3: Add `@basic-ui/react-utilities` package and extract shared React utilities from core.

  - New `@basic-ui/react-utilities` package with `cn`, `normalizeProps`, `getTruncateAccessibilityProps`, `forwardRefWithAs` and polymorphic prop types (`CommonProps`, `PropsWithAs`, `RestrictedPropsWithAs`, `PolymorphicRef`), plus `useBreakpoint`, the `ResponsiveValue` type, and `BREAKPOINTS`
  - `@basic-ui/core` depends on it via `workspace:*` and imports from it directly; the utilities are no longer re-exported from `@basic-ui/core`
  - **BREAKING**: `cn`, `forwardRefWithAs`, `normalizeProps`, `getTruncateAccessibilityProps`, `useBreakpoint`, and the polymorphic prop types moved to `@basic-ui/react-utilities` — import them from there instead of `@basic-ui/core`

- 346c16e: Accept responsive Badge sizes for both count and dot variants. The ping halo
  shares the requested size using dot geometry. Colors, placement, announcements,
  and count formatting remain scalar and unchanged.
- 29ab118: Migrate Grid and Divider presentation to static responsive CSS.

  - Grid presets override both column and row counts; `templatePreset="none"`
    restores the latest counts, or implicit tracks when counts are absent.
  - Correct Grid axis gap utilities to `gap-x-*` and `gap-y-*`.
  - Divider direction, appearance, and color are scalar. Thickness and inset
    remain responsive; vertical insets apply on the vertical axis.
  - Support the finite existing Grid template vocabulary independently of recipes.

- 09c5d6b: Remove `unset` from layout props. Omit a prop to emit no declaration; use a
  concrete value to override an earlier breakpoint: `0` for spacing, `"auto"`
  for dimensions, and `"visible"` for overflow.

  Maximum dimensions now accept `"none"` instead of the unsupported `"auto"`.
  For example, `wMax={{ base: "screen", md: "none" }}` removes the constraint
  at `md`. Export `MaxSizingType` for the distinct maximum-dimension contract.

- a8fb044: Add the `Toggle` (switch) component (#80), ported from appiq onto the headless M1 hooks.

  - State via `useControllableState` (controlled `value`/`onChange` + uncontrolled `defaultValue`)
  - id/aria wiring via `useAriaIds` so it composes with Field conventions (#56)
  - `role="switch"` with `aria-checked`; Space/Enter activation via the native button base
  - Sizes (`sm`/`md`/`lg`) and intent colors via CVA on basic-ui tokens

- c5e6787: Add the `Tooltip` component (#77), ported from appiq onto the `useTooltip` headless hook (#72).

  - All timing, hover/focus, and dismissal semantics from `useTooltip`; positioning from `useAnchorPositioning` (#70) via `usePopover`
  - `delay`/`closeDelay` props; the panel stays open while hovered (WCAG 1.4.13); Escape dismissal configurable
  - `role="tooltip"` + `aria-describedby` wiring from the hook; renders through a portal
  - CVA variants ported to basic-ui tokens: sizes (`sm`/`md`/`lg`, responsive), semantic `color` surfaces, optional `bordered`
  - `disabled` prop leaves the trigger untouched (no handlers, no aria wiring)

### Patch Changes

- bbb0df6: Use semantic z-index layers for dialog backdrops, modal surfaces, and sticky card sections.
- a0e9801: Formalize `Box` as the ancestral primitive of `core` (#84).

  - Decision documented in CONVENTIONS.md: `Box` stays in `@basic-ui/core` at `components/Box` by convention — the composition rule plus the CI check provide the structural guarantee; a separate package was considered and rejected as overhead without behavioral benefit
  - All `Box` imports standardized to the relative form (`../Box`, depth-adjusted); the `@core/components`, `@core/components/Box` alias forms are gone from `components/**`
  - The composition check now also fails on non-relative `Box` imports, keeping the primitive dependency explicit and refactor-safe
  - No public API changes

- 1b92507: Correct Toggle geometry that mixed nonlinear token spacing with Tailwind's
  default numeric scale. Tracks now use explicit 32x16, 36x20, and 44x24px sizes,
  12/14/16px thumbs, and 16/18/24px checked travel with 2px horizontal insets.
  Thumbs remain vertically centered; medium and large sizes retain extra vertical
  space. Both states use the same responsive size decision.

  Add a finite reviewed fixed-pixel geometry vocabulary, independent of component
  recipes, so these literal utilities are available through the public stylesheet.

- 136ae28: Decouple Card anatomy parts from sibling-component imports per the component composition rule (#60, completes #87).

  - `Card.Title`, `Card.Description` and `Card.Image` no longer wrap the public `Header`, `Text` and `Image` components; each renders on `Box` with styling owned by new `cardTitleVariants`, `cardDescriptionVariants` and `cardImageFitVariants` in `card.variants.ts`, with visual parity to the previous defaults
  - `card.types.ts` now defines the parts' prop types (`CardTitleOwnProps`, `CardDescriptionOwnProps`, `CardImageOwnProps`) instead of re-exporting `HeaderProps`/`TextProps`/`ImageProps` — the exported `CardTitleProps`/`CardDescriptionProps`/`CardImageProps` aliases and the `Card.Title`/`Card.Description`/`Card.Image` APIs are unchanged
  - Every component in `core` now imports only `Box`; the composition check runs fully strict with no grandfathered violations

- 018df66: Decouple Button, Alert and Pagination from sibling-component imports per the component composition rule (#60).

  - Button: loading state no longer renders `Spinner`/`Flex`/`Text` internally — the loader layout and spinner glyph are inlined via `buttonLoaderVariants`/`buttonSpinnerVariants` with identical markup behavior (`role="status"` and `aria-label` preserved); rendering output is unchanged for consumers
  - Alert and Pagination: the `Icon` wrapper is no longer used internally; severity and chevron glyphs render directly from `@basic-ui/icons` with the same sizing (`sm` → `w-lg h-lg`, `md` → `w-xl h-xl`) and color inheritance
  - No public API changes

- 1db76d1: Allow Icon components to accept shared layout props without requiring an additional Box wrapper.
- d6b049e: Consume the Milestone 1 headless hooks in core components (integration pass 1.5, per the plan on #55).

  - `usePagination` now builds its page state on `useControllableState` instead of a hand-rolled controlled/uncontrolled pattern; pagination behavior (clamping, warnings, `onPageChange`) is unchanged
  - `Alert` now uses `useDisclosure` for its dismissed state instead of a local `useState`; dismissal behavior and the `onDismiss` callback are unchanged

- 06c3562: Coordinate Toggle track, thumb size, and checked travel from the same responsive size.
  Thumb geometry is applied directly to the owned thumb; scalar colors and interaction
  styles stay on the track. Extend the shared utility vocabulary with numeric dimensions
  and translations from 0 through 12 in half steps, and fractional spacing from 0.5
  through 3.5. Component recipe coverage is tested through the public CSS entry.
- Updated dependencies [957afd2]
- Updated dependencies [16046dc]
- Updated dependencies [aaedf17]
- Updated dependencies [e63b2dd]
- Updated dependencies [7250ed1]
- Updated dependencies [983382a]
- Updated dependencies [78678dd]
- Updated dependencies [7e0f682]
- Updated dependencies [195b552]
- Updated dependencies [54034d3]
- Updated dependencies [69422d1]
- Updated dependencies [f181617]
- Updated dependencies [91321d4]
- Updated dependencies [792add3]
  - @basic-ui/react-utilities@0.2.0
  - @basic-ui/tokens@0.4.0

## 0.4.0

### Minor Changes

- ff80d71: \[core] reorganize layout-related code and improve responsive utilities

  \[core] Moved layout types and utilities to a dedicated `layout` directory within `lib`.

  \[core] Updated imports across components to reflect new paths for layout types.

  \[core/hooks] Enhanced `useResponsiveProps` to resolve responsive values inline without extra hook calls.

  \[core] Updated `package.json` to reflect changes in exports and types.

- 4eb400d: [core/button] - Added new `Button` component with support for variants, sizes, colors, and loading state. This component is designed to be flexible and accessible, allowing for easy integration into various UI designs. The `Button` component also includes a new `rounded` prop for controlling border radius, enhancing the customization options available to developers.

  [tokens] updated some semantic (error, info, etc) colors to be more consistent with the new design system. These changes may affect the appearance of components that rely on these tokens, so please review the updated token values and adjust your styles accordingly if necessary.

- 08e95ec: \[core/divider] Added divider component. Component supports horizontal and vertical orientations, as well as solid, dashed, and dotted appearances.

  \[core/Text] Updated text component to extend Layout props directly so users can modify text props fully. This is the final component currently implemented that should allow full prop manipulation (without using escape hatches)

- 0e5e419: [core/badge] Added Badge component which allows the user to display a small status icon at the corner of any element. The badge can display a small dot icon, a number or a custom icon. The badge can be used to indicate the status of an element, such as whether it is active, inactive, or has new content.

  [core/lib] Improved the `normalizeProps` utility to better handle camelCase-to-dashed HTML attribute conversion, including support for `aria-hidden` and `aria-live`, and added dev-time warnings for unrecognized attributes to help catch potential issues during development.

  [core/skeleton] Added Skeleton component which allows the user to display a placeholder while content is loading. The skeleton can be used to indicate that content is loading and to improve the user experience by providing a visual cue that something is happening. The skeleton can be used in various shapes and sizes, such as text, circular, and rectangular. The skeleton can also be animated to provide a more dynamic loading experience.

  [core/layout] Update layout to return a named object of resolved layout props and apply them to the core box element. Users will stil be able to use className and style props to override the default styles, but the layout system will now be more flexible and easier to use. This change allows for better separation of concerns between layout and styling, and makes it easier to create custom layouts without having to worry about the underlying implementation details.

### Patch Changes

- Updated dependencies [e280131]
- Updated dependencies [4eb400d]
- Updated dependencies [1a1b31c]
- Updated dependencies [1aaf6c3]
  - @basic-ui/tokens@0.3.0
  - @basic-ui/icons@0.0.3

## 0.3.0

### Minor Changes

- 7a75d22: \[core/Pagination] complete migration to universal box primitive component.

  \[core/Alert] Migrate to universal box primitive component.

  \[core/Alert] Migrate to universal box primitive component.

  \[tests] exclude dist and test utils from test runner to speed up test execution.

- 1f998f5: [core/Box] Refine box as the "mother primitve" component. Improved type safety and flexibility by leveraging TypeScript's advanced type features. This allows Box to be used as a polymorphic component, enabling it to render as different HTML elements or custom components while maintaining proper typing and prop forwarding. This enhancement ensures that Box can serve as a versatile foundation for building other components in the library, while also providing better developer experience and reducing potential runtime errors.

  [core/Image] Added a new Image component that serves as a wrapper around the native HTML <img> or <picture> elements. This component provides enhanced functionality such as automatic handling of responsive images, lazy loading, and improved accessibility features.

  [core/Card] Implemented a full Card system with the following components: Card, CardHeader, CardBody, CardFooter, CardImage, CardTitle, and CardDescription. This comprehensive set of components allows developers to easily create complex card layouts with consistent styling and structure, while also providing flexibility for customization. Each component is designed to be used together or independently, making it easier to build a wide variety of card-based UI elements.

  [core/Card] Support a Card.Unstyled component that removes visual card styling while still giving developers access to the card's structure and functionality. This allows for greater flexibility in designing custom card layouts without being constrained by default styles, while still benefiting from the underlying card components and their features.

  [core/Layout] Added/updated layout utilities and responsive-prop handling used across components.

  [core] Replaced many as any usages, tightened typings (displayName casts, prop types), fixed type-check errors, and improved handler typings.

- 8a26486: Added:
  [core/box] New Box component with polymorphic as prop, display prop and inherited layout props, and Storybook stories and tests.
  [core/layout] New Layout props with responsive support and tokenized spacing values, and helper functions splitLayoutProps and generateLayoutClassNames for handling layout-related props and class names in components.
  [core/text] Export Text component and props in component barrel file for easier imports.

  Changed:
  [core/components] Refactor components to use new Layout props and helper functions for consistent spacing and layout handling, and update Storybook stories and tests accordingly.
  [core/flex] Refactor Flex props to use display prop instead of inline bool prop, and update Storybook stories and tests to reflect this change.

### Patch Changes

- 1f998f5: [lint] Added lint scripts to all packages while simplifying the root configuration. This allows for consistent code quality checks across the entire monorepo and makes it easier for developers to run linting on their code before committing changes. By using ESLint with caching enabled, we can improve the performance of linting by only checking files that have changed since the last linting run, which helps to speed up the development workflow and maintain a clean codebase.

  [typescript] Enforced stronger typing across the codebase by enabling the noImplicitAny TypeScript compiler option and fix resulting errors.

  [accesibility] Brought jsx-a11y rules into package configs and fixed violations across the codebase. This improvement ensures that our components adhere to accessibility best practices, making them more inclusive and usable for all users, including those with disabilities.

- Updated dependencies [1f998f5]
  - @basic-ui/tokens@0.2.1
  - @basic-ui/icons@0.0.2

## 0.2.0

### Minor Changes

- ce32fac: [core/header] Add new Header component (polymorphic as prop) with responsive size, weight, color, align, truncate, and wrap variants; accessibility improvements (auto title / aria-label when truncated); includes Storybook stories and unit tests.

  [core/lib] Export BUILT_IN_HEADER_COLORS, isBuiltInHeaderColor, and BuiltInHeaderColor type to support header colors.

- f998f4d: [core/grid] Add Grid layout component with responsive, tokenized spacing and alignment props, auto column and row support, and template presets for common layouts (masonry, card list, sidebar, hero).
  [core/hooks] Add useBreakpoint and useResponsiveProps hooks for responsive prop handling, and deprecate useMediaQuery in favor of useBreakpoint for better SSR support and simpler API.
  [core/hooks] Refactor responsive prop handling to use useBreakpoint and simplify logic in previous useMediaQuery implementation.
  [core/flex] Refactor Flex prop types to use useResponsiveProps and add responsive support for all props, including gap and alignment.
  [core/docs] Update Storybook and docs to reflect new Grid component and responsive prop handling changes.
  [core/lib/accessibility] Add accessibility tests for getTruncateAccessibilityProps function and update documentation with usage examples.
- 5bb6101: [core/flex] Implemented a fully polymorphic, responsive, and customizable Flex component.

  [core/lib] Introduced the forwardRefWithAs helper (referenced in docs and used in components) to enable type-safe polymorphic components with proper ref forwarding and as prop support.

  [core/lib/accessibility] add getTruncateAccessibilityProps function for improved accessibility handling.

  [core/text] refactor Text component to use forwardRefWithAs and export TextOwnProps interface.

  [core/header] refactor Header component to use forwardRefWithAs and export HeaderOwnProps interface.

### Patch Changes

- Updated dependencies [ce32fac]
  - @basic-ui/tokens@0.2.0

## 0.1.0

### Minor Changes

- 2212108: [pagination] Deprecate and delete initial, old pagination component and related files.
  [pagination] Deprecate and delete old usePagination hook.
  [pagination] implement redesigned usePagination hook with new API and improved internal logic.
  [pagination] Implement new redesigned LinkPagination, using usePagination hook and common internal view renderer.
  [pagination] Implement new redesigned ButtonPagination, using usePagination hook and common internal view renderer.
  [pagination] Add new pagination stories and tests for new components.
  [test-utils] Add renderWithProvider, renderHookWithProvider and setupUser utils for testing components and hooks that require context providers or user interactions.
  [test-utils] Add createProviderBuilder utility for easily creating context providers for testing.
  [alert] update tests to use new renderWithProvider test util and remove redundant provider wrappers from individual tests.
  [common-props] clean up commonProps jsdoc comments and remove redundant descriptions.
- eac131a: Implement Polymorphic typing: Added a new types/props.ts file with utility types for polymorphic components, including CommonProps, PolymorphicRef, PropsWithAs, RestrictedPropsWithAs, and PolymorphicComponent, to standardize prop and ref handling across components.

  Updated Alert's prop types in alert.types.ts to use the new polymorphic types, restricting allowed elements to div, span, or p.

  Refactored Alert to accept an as prop, allowing it to render as a div, span, or p, with proper TypeScript typing and ref forwarding for each element type. This is achieved using new shared polymorphic types (PolymorphicRef, RestrictedPropsWithAs, etc.) defined in types/props.ts.

  Expanded Alert.test.tsx with tests for ref forwarding and rendering as all supported elements (div, span, p), and verified that native props and component props are handled correctly regardless of the rendered element.

  Updated JSDoc comments and usage examples in Alert.tsx to reflect the new polymorphic API and clarify usage patterns.

### Patch Changes

- 58c9cf9: Reimplement Alert component for better usability and cleaner API interface
- Updated dependencies [6484252]
  - @basic-ui/tokens@0.1.0
