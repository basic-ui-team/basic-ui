# Container-query foundation

## Status and priority

This is a planned standalone feature, not work for the current Core responsive
utilities and Box modernization stack.

**Priority:** lower than component modernization. Revisit after the current
component modernization work has established its next priorities.

> **Note (2026-10-21):** this proposal predates
> [ADR-0001](../adr/0001-tailwind-first-primitives.md) and was designed
> against the since-removed `LayoutProps` engine. Revisit the design —
> container roots will most likely become a `className` recipe rather than
> a shared layout prop — before implementing anything from this document.

## Goal

Provide native CSS container-query foundations without JavaScript measurement:

1. tokenized container thresholds;
2. a shared layout prop for creating query-container roots;
3. child container-query styling through literal Tailwind `className` values.

This keeps components portable: their internal layout responds to their
available space rather than only to the viewport.

## Public API

`containerType` belongs to shared `LayoutProps`, so every layout-aware primitive
can expose the same root capability.

```ts
export type ContainerType = "inline-size" | "size";

interface LayoutProps {
  containerType?: ContainerType;
}
```

| Value | Tailwind utility | Behavior |
| --- | --- | --- |
| `"inline-size"` | `@container` | Descendant queries respond to available inline width. |
| `"size"` | `@container-size` | Descendant queries respond to both dimensions. |

The prop is deliberately not responsive. Query-root containment is structural
CSS behavior, not a viewport-adaptive visual property.

Initial Box usage:

```tsx
<Box containerType="inline-size">
  <Box className="flex flex-col gap-4 @md:flex-row">
    ...
  </Box>
</Box>
```

## Container threshold tokens

The container scale is independent from viewport breakpoints, while retaining
Tailwind's familiar names:

| Token | Value | Pixels | Intended use |
| --- | ---: | ---: | --- |
| `sm` | `24rem` | 384px | Compact cards and controls |
| `md` | `36rem` | 576px | One-to-two-column component transition |
| `lg` | `48rem` | 768px | Larger composite layouts |
| `xl` | `64rem` | 1024px | Wide embedded or page-like regions |

The distinction remains clear in use:

```tsx
<Box className="sm:grid-cols-2 @md:grid-cols-2" />
```

- `sm:` is a viewport query.
- `@md:` queries the nearest container root.

The token API should be:

```ts
export type ContainerTokens = "sm" | "md" | "lg" | "xl";

interface ThemeConfig {
  container?: Partial<Record<ContainerTokens, string>>;
}
```

The theme stylesheet should serialize the defaults in Tailwind's namespace:

```css
@theme {
  --container-sm: 24rem;
  --container-md: 36rem;
  --container-lg: 48rem;
  --container-xl: 64rem;
}
```

These thresholds are build-time Tailwind configuration. Runtime CSS theme
switching cannot change compiled container-query conditions.

## Implementation boundary

Root prop rendering and utility-source ownership remain separate:

```text
LayoutProps
  -> layoutVariants (matching public prop names)
  -> layout class generation

Shared responsive utility vocabulary
  -> generated Tailwind candidate matrix
```

Expected changes:

1. Add `ContainerType` and `containerType` to
   `packages/core/src/lib/layout.types.ts`.
2. Add the `@container` and `@container-size` mappings to
   `packages/core/src/lib/layout.variants.ts`.
3. Add the public prop name to `LAYOUT_PROP_NAMES` in
   `packages/core/src/lib/layout-utils.ts`; variant keys already match prop names.
4. Add the root utility names to the shared source in
   `packages/core/src/lib/responsive-utilities.ts` and regenerate
   `packages/core/src/generated/layout-utilities.generated.css`.
5. Add container token support to the Tokens theme types, defaults, serializer,
   and generated stylesheet.
6. Add a Box Storybook example that visibly responds to its parent container.

Only `@container` and `@container-size` need adding to Core's utility
source. Child classes such as `@md:flex-row` remain literal consumer
`className` values that Tailwind scans normally.

## Regression proof

### Tokens

- Container token types accept only `sm`, `md`, `lg`, and `xl`.
- Resolved defaults include all four values.
- Partial overrides preserve omitted defaults.
- Generated theme CSS contains the expected `--container-*` declarations.

### Layout primitives

- `"inline-size"` emits `@container`.
- `"size"` emits `@container-size`.
- Omitting the prop emits neither utility.
- `containerType` is never forwarded to the DOM.
- Layout-aware primitives accept the shared prop, with explicit local omissions
  only where a component has a genuine prop collision.

### Stylesheets and documentation

- `generate:layout-utilities` regenerates the committed candidate source.
- `check:layout-utilities` verifies it is current.
- A production Tailwind or Storybook build proves root utilities and a literal
  `@md:` child query compile.
- Box stories show parent-container resizing rather than a viewport-only demo.

## Explicitly deferred

- Named-container props or arbitrary container names.
- A typed container-responsive object API for layout props.
- ResizeObserver, JavaScript measurement, and runtime query hooks.
- `@max-*` and range-specific APIs.
- Container-relative sizing unit props such as `cqi` and `cqb`.

Named containers remain available through literal `className` utilities until a
finite, tokenized naming model has a demonstrated need.
