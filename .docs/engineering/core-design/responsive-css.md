# Responsive CSS

## Purpose

Core responsive presentation is authored as ordinary mobile-first CSS utilities.
Components resolve their own responsive values to classes; Tailwind compiles a
finite, shared set of candidates into the public Core stylesheet. Presentation
does not depend on JavaScript viewport subscriptions.

Use this model for adapting component size and layout to viewport width. It is
not a general API for making every visual or behavioral prop responsive.

## Responsive contract

`ResponsiveValue<T>` is either a scalar `T` or an object with a required `base`
value and optional `sm`, `md`, `lg`, `xl`, and `2xl` values:

```tsx
<Box p={{ base: 2, md: 4 }} />
<Icon size={{ base: "sm", md: "lg" }} />
```

The object form emits classes only for supplied breakpoints. The browser's
mobile-first cascade carries the latest declaration forward: at `lg`, the
first example still has `p-4`. It does not replace an entire variant at each
breakpoint, and an empty class does not undo an earlier declaration. Use a
concrete reset value (`0`, `auto`, `visible`, or `none`, where supported).

Responsive props are for spatial and typographic layout concerns such as size,
spacing, dimensions, flow, alignment, display, and media fitting. Keep cosmetic
choices (for example color, weight, rounding, severity), semantics, ARIA,
interaction, and state scalar. A property being visual or finite does not by
itself make it responsive. Use literal responsive Tailwind classes in
`className` when a component's typed API does not expose a needed utility.

## Authoring model

Each component owns its recipe and maps its public values to ordinary utility
classes. `getResponsiveClassNames` resolves each supplied value and prefixes
the resulting utilities; it does not read viewport state or enumerate recipe
combinations.

- Scalar props continue through their normal CVA recipes.
- Responsive props resolve the local recipe for each supplied value, using
  current scalar props where styles depend on them. For example, Badge size can
  vary by breakpoint while its count/dot mode remains scalar.
- Keep related geometry together when it must stay coherent. Toggle size
  controls track, thumb, and checked travel as one size choice.
- Do not prefix a whole component recipe to make one axis responsive. Resolve
  only the responsive concern so colors, focus styling, and scalar defaults
  remain independent.
- Do not build a general responsive-by-responsive compound engine. If a
  component needs that behavior, identify the concrete style dependency and
  review it as a specific design change.
- Components own their own anatomy; consumer-provided children own their
  presentation unless the component explicitly defines otherwise. A shared
  prop name does not require shared sizing semantics or recipes.

Keep accessibility behavior independent of the active viewport. In particular,
truncation must retain stable full text for string children and restore
requested wrapping and overflow when disabled. Direction or other values that
also define semantic state (such as Divider orientation/ARIA) remain scalar.

## CSS generation and package boundary

The implementation has two separate inputs:

1. Component-local recipes decide which classes a component emits.
2. `responsiveUtilityFamilies` in
   `packages/core/src/lib/responsive-utilities.ts` defines the finite
   responsive utility vocabulary available in the published stylesheet.

The Core generator expands each approved utility at `base`, `sm`, `md`, `lg`,
`xl`, and `2xl`, then writes
`packages/core/src/generated/layout-utilities.generated.css`. Core imports
that generated source from `packages/core/src/styles.css`; Tailwind compiles it
when producing the package CSS.

The vocabulary is deliberately independent of component recipes. Adding a
recipe that uses already-approved utilities requires no generator change.
Adding an unsupported utility requires a reviewed vocabulary update. The
generator must not import runtime/component recipes, discover classes from
components, or enumerate composed variants.

Current capability families cover:

| Concern | Supported vocabulary |
| --- | --- |
| Spacing | Token spacing steps and reviewed fractional steps on spacing and gap axes |
| Sizing | Token and half-step dimensions, reviewed intrinsic/full/viewport keywords, and max-size resets |
| Geometry | Token radii, 0–9px borders, explicit fixed-pixel Toggle geometry, and translation values |
| Layout | Display, flex direction/wrapping, alignment, grid tracks/flow, and reviewed grid templates |
| Typography | Token font sizes and line heights, alignment, wrapping, truncation, and resets |
| Position and media | Position, overflow, object fitting, and reviewed aspect ratios |

The exact candidates and their source of truth are the capability families in
`responsive-utilities.ts`. The table describes categories, not permission to
use every Tailwind utility or arbitrary value. Cosmetic, state, animation, and
semantic utilities are not made responsive by this generator.

## Size and verification

Generation deduplicates exact utility strings and emits only the base and
breakpoint forms. It does not merge utilities by CSS meaning or tree-shake
candidates for an individual consumer. The published stylesheet therefore
includes the complete approved vocabulary, including candidates unused by a
particular application; this bounded cost is intentional.

The controlled Tailwind fixture measured the final vocabulary with automatic
source scanning disabled (recorded 2026-10-18, before minification):

| Metric | Result |
| --- | ---: |
| Unique utility candidates | 713 |
| Breakpoint forms | 6 |
| Expanded candidates | 4,278 |
| Compiled CSS | 446,470 bytes |
| Compiled CSS gzip | 39,976 bytes |

When changing responsive behavior or vocabulary, verify both emitted classes
and compiled CSS:

- Focused component and CSS-pipeline tests prove responsive mappings, resets,
  compounds, and compilation of every approved candidate.
- `pnpm --filter @basic-ui/core check:layout-utilities` proves the generated
  source is current.
- `pnpm --filter @basic-ui/core type-check`, `lint`, and `build` cover the Core
  package and its generated stylesheet.

Core presentation must remain free of viewport subscriptions. The behavioral
`useBreakpoint` hook remains available in React utilities; the former
presentation-oriented `useResponsiveProps` API is removed.
