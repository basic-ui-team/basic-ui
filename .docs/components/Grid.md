# Grid

Responsive layout container for arranging items in rows and columns.

```tsx
import { Grid } from "@basic-ui/core";

// Basic example
<Grid cols={3} gap="md">
  <div>Item A</div>
  <div>Item B</div>
  <div>Item C</div>
</Grid>;
```

## Overview

`Grid` is a presentational, polymorphic layout component that maps a small, well-typed set of props to Tailwind-based utility classes. It supports tokenized spacing (`gap`, `rowGap`, `columnGap`), responsive values, alignment controls, auto-placement options, and a set of `templatePreset` layouts for common patterns (masonry, card list, sidebar, hero, etc.).

## When to use

- Arrange a collection of items into a responsive grid (cards, gallery, dashboard tiles).
- Use `templatePreset` for common layout patterns (sidebar, hero, masonry).
- Avoid using `Grid` when you need fine-grained, content-aware grid-template areas — prefer explicit `style` or a dedicated CSS module instead.

## Variants / Appearance

- `templatePreset`: quick presets — `sidebar`, `hero`, `masonry`, `card-list`, `symmetric`, `asymmetric`.
- Alignment props: `alignItems`, `justifyItems`, `alignContent`, `justifyContent` (tokenized options).
- Spacing tokens: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`.

## Examples

### Basic

```tsx
<Grid cols={3} gap="md">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</Grid>
```

### Template preset (masonry)

```tsx
<Grid templatePreset="masonry" gap="md">
  <div className="h-40">Item 1</div>
  <div className="h-60">Item 2</div>
  <div className="h-48">Item 3</div>
</Grid>
```

### Responsive props

```tsx
<Grid cols={{ base: 1, md: 3 }} gap={{ base: "sm", md: "md" }}>
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>
```

### Controlled vs Uncontrolled

`Grid` is purely presentational and does not manage internal state — the controlled/uncontrolled pattern does not apply. Use responsive prop objects to drive responsive behavior from your app state if needed.

## API

| **Prop**         | Type                  | Default     | Description                                                               |
| ---------------- | --------------------- | ----------- | ------------------------------------------------------------------------- | ------------------------------------------------- | ----------- | --------------------------- | -------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------- | ----------------------------------------------- | ------------------ |
| `cols`           | `number (1-12)        | Responsive` | `undefined`                                                               | Number of columns (token 1-12) or responsive map. |
| `rows`           | `number (1-12)        | Responsive` | `undefined`                                                               | Number of rows (token 1-12) or responsive map.    |
| `gap`            | `"none"               | "xs"        | "sm"                                                                      | "md"                                              | "lg"        | "xl"                        | "2xl"                                                                      | "3xl"                                        | Responsive`                                         | `"none"`                                        | Gap between items. |
| `rowGap`         | same as `gap`         | `undefined` | Row-specific gap token.                                                   |
| `columnGap`      | same as `gap`         | `undefined` | Column-specific gap token.                                                |
| `autoFlow`       | `"row"                | "column"    | "dense"                                                                   | Responsive`                                       | `"row"`     | How auto-placed items flow. |
| `autoRows`       | `"min"                | "max"       | "fr"                                                                      | true                                              | Responsive` | `undefined`                 | Size rule for implicitly created rows. `true` maps to `auto-rows-auto`.    |
| `autoCols`       | `"min"                | "max"       | "fr"                                                                      | true                                              | Responsive` | `undefined`                 | Size rule for implicitly created columns. `true` maps to `auto-cols-auto`. |
| `alignItems`     | `"start"              | "end"       | "center"                                                                  | "stretch"                                         | Responsive` | `"stretch"`                 | Align items along the cross axis.                                          |
| `justifyItems`   | `"start"              | "end"       | "center"                                                                  | "stretch"                                         | Responsive` | `"stretch"`                 | Align items within their grid area along the inline axis.                  |
| `alignContent`   | `"start"              | "end"       | "center"                                                                  | "stretch"                                         | "between"   | "around"                    | "evenly"                                                                   | Responsive`                                  | `"stretch"`                                         | Align the grid's content along the block axis.  |
| `justifyContent` | `"start"              | "end"       | "center"                                                                  | "between"                                         | "around"    | "evenly"                    | "stretch"                                                                  | Responsive`                                  | `"start"`                                           | Align the grid's content along the inline axis. |
| `templatePreset` | `"sidebar"            | "hero"      | "masonry"                                                                 | "card-list"                                       | "symmetric" | "asymmetric"                | Responsive`                                                                | `undefined`                                  | Use a preset template; overrides `cols` and `rows`. |
| `as`             | `"div"                | "section"   | "article"                                                                 | "main"                                            | "aside"     | "nav"`                      | `"div"`                                                                    | Render as a different element (polymorphic). |
| `className`      | `string`              | `undefined` | Additional classes — escape hatch for custom tokens (e.g., `gap-8`).      |
| `style`          | `React.CSSProperties` | `undefined` | Inline styles; use for template-specific `gridTemplateColumns` if needed. |
| `children`       | `React.ReactNode`     | `undefined` | Grid contents.                                                            |

Notes:

- Defaults are primarily defined in the `gridVariants` defaults: `gap: "none"`, `autoFlow: "row"`, `alignItems: "stretch"`, `justifyItems: "stretch"`, `alignContent: "stretch"`, `justifyContent: "start"`.
- `templatePreset` uses Tailwind arbitrary values for `grid-template-columns` and will ignore `cols`/`rows` when present.

## Accessibility

- `Grid` is a layout container. It does not apply semantic roles by default — prefer semantic containers (`ul`/`li`) for lists, or add `role="list"` / `role="listitem"` to children when appropriate.
- Ensure focusable children manage keyboard navigation; `Grid` does not alter focus behavior.
- Use `normalizeProps` camelCase aliases like `ariaLabel` → `aria-label` when passing aria attributes to `Grid`.

## Stories

- See interactive examples and variants: [packages/core/src/components/Grid/Grid.stories.tsx](packages/core/src/components/Grid/Grid.stories.tsx)
  - `Basic`, `TemplatePreset`, `Responsive`, `AlignmentVariants`, `AutoFlowAutoColsRows`

## Source

- Component source: [packages/core/src/components/Grid/Grid.tsx](packages/core/src/components/Grid/Grid.tsx)
- Types & variants: [packages/core/src/components/Grid/grid.types.ts](packages/core/src/components/Grid/grid.types.ts), [packages/core/src/components/Grid/grid.variants.ts](packages/core/src/components/Grid/grid.variants.ts)

---

## Guidance

- Prefer token props (`gap`, `cols`, `rows`) for consistency. Use `className` as an escape hatch for arbitrary Tailwind utilities.
- Use `templatePreset` for common page-level layout patterns; use `style` for one-off `grid-template-*` rules when necessary.
- Add semantic roles or use semantic elements when the grid represents a list or navigation.

_Generated from the component template._
