# Responsive CSS

## Purpose

Core responsive presentation is authored as ordinary mobile-first CSS utilities.
Components resolve their own responsive values to classes; Tailwind compiles a
finite, shared set of candidates into the public Core stylesheet, and the
shipped stylesheet self-registers the package dist so consumer builds discover
every component-authored class. Presentation does not depend on JavaScript
viewport subscriptions.

Use this model for adapting component geometry and flow to viewport width. It
is not a general API for making every visual or behavioral prop responsive.

## Responsive contract

`ResponsiveValue<T>` is either a scalar `T` or an object with a required `base`
value and optional `sm`, `md`, `lg`, `xl`, and `2xl` values:

```tsx
<Flex direction={{ base: "column", md: "row" }} />
<Icon size={{ base: "sm", md: "lg" }} />
```

The object form emits classes only for supplied breakpoints. The browser's
mobile-first cascade carries the latest declaration forward: at `lg`, the
first example still has `flex-row`. It does not replace an entire variant at
each breakpoint, and an empty class does not undo an earlier declaration. Use
a concrete reset value (`0`, `auto`, `visible`, or `none`, where supported).

Responsive values exist only on earned props — geometry sizes, flow and
alignment vocabularies, template presets, and text-flow state. Spacing,
sizing, position, display, and gap are authored in `className` with Tailwind's
own responsive prefixes (`md:p-4`); the library does not shadow them (see
[ADR-0001](../adr/0001-tailwind-first-primitives.md)). Keep cosmetic choices
(color, weight, rounding, severity), semantics, ARIA, interaction, and state
scalar. A property being visual or finite does not by itself make it
responsive.

## Authoring model

Each component owns its recipe and maps its public values to ordinary utility
classes. `getResponsiveClassNames` resolves each supplied value and prefixes
the resulting utilities; it does not read viewport state or enumerate recipe
combinations.

- Scalar props continue through their normal CVA recipes.
- Responsive props resolve the local recipe for each supplied value, using
  current scalar props where styles depend on them. For example, Button size
  can vary by breakpoint while its variant remains scalar.
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

Styling reaches a consumer build through two inputs:

1. **Runtime-constructed classes** — responsive props resolve utilities at
   runtime, so scanning can never discover them. They are registered by the
   generated safelist, which `responsive-utilities.ts` derives from the same
   cva tables and geometry maps the components render with. The safelist
   cannot drift from the components because it is computed from them.
2. **Component-authored literals** — every class written as a string in a
   variant table is discovered by the consumer's own Tailwind build through
   the shipped stylesheet's `@source "./"` self-registration, which points
   at the package dist (consumers never scan `node_modules` themselves).

The Core generator expands each approved utility at `base`, `sm`, `md`, `lg`,
`xl`, and `2xl`, then writes
`packages/core/src/generated/layout-utilities.generated.css`. Core imports
that generated source from `packages/core/src/styles.css`; Tailwind compiles it
when producing the package CSS.

The current families, derived from their component sources:

| Family | Source | Vocabulary |
| --- | --- | --- |
| `flex` | `flex.variants` | direction, wrap, and display values |
| `alignment` | `flex.variants` | justify and align values |
| `display` | shared | flex/grid display forms |
| `grid` | `grid.variants` | tracks, flow, auto sizes, alignment axes |
| `gridTemplates` | `grid.variants` | the seven template presets |
| `componentGeometry` | component size/geometry maps | button, icon, spinner, text, header, image, card, toggle, and divider classes |
| `textFlow` | `text-flow` | wrap, overflow, truncation, and restoration utilities |

Spacings, sizing, position, and generic display utilities are deliberately
absent: they are `className` concerns, and coverage tests pin them out of the
safelist. Cosmetic, state, animation, and semantic utilities are not made
responsive by this generator either; literals like `animate-spin` arrive
through the dist scan, not the safelist.

## Size and verification

Generation deduplicates exact utility strings and emits only the base and
breakpoint forms. It does not merge utilities by CSS meaning or tree-shake
candidates for an individual consumer. The published stylesheet therefore
includes the complete approved vocabulary, including candidates unused by a
particular application; this bounded cost is intentional — and the dist scan
similarly discovers every authored literal, including variants a consumer
never renders.

The controlled Tailwind fixture measured the final vocabulary with automatic
source scanning disabled (recorded 2026-10-21, before minification):

| Metric | Result |
| --- | ---: |
| Unique utility candidates | 170 |
| Breakpoint forms | 6 |
| Expanded candidates | 1,020 |
| Compiled CSS | 127,298 bytes |
| Compiled CSS gzip | 16,163 bytes |

When changing responsive behavior or vocabulary, verify both emitted classes
and compiled CSS:

- Focused component and CSS-pipeline tests prove responsive mappings, resets,
  compounds, and compilation of every approved candidate; the safelist
  coverage tests bind each family to its component source and pin
  spacing/sizing utilities out.
- `pnpm --filter @basic-ui/core check:layout-utilities` proves the generated
  source is current.
- `pnpm --filter @basic-ui/core verify:package` proves the consumer path
  end-to-end: the packed tarball's stylesheet generates the responsive
  vocabulary, component-authored literals, and the base `--spacing` token in a
  real Tailwind build.
- `pnpm --filter @basic-ui/core type-check`, `lint`, and `build` cover the Core
  package and its generated stylesheet.

Core presentation must remain free of viewport subscriptions. The behavioral
`useBreakpoint` hook remains available in React utilities; the former
presentation-oriented `useResponsiveProps` API is removed.
