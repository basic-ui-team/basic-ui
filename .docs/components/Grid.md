# Grid

A grid container with typed, responsive props for tracks, placement, alignment, and named templates.

```tsx
import { Grid } from "@basic-ui/core";

<Grid cols={3} className="gap-3">
  <div>Item A</div>
  <div>Item B</div>
  <div>Item C</div>
</Grid>;
```

## Overview

`Grid` renders a grid container and exposes the decisions that benefit from a typed, closable vocabulary: column and row counts, auto-placement, four alignment axes, and a set of named template presets. Gap, padding, and sizing are authored in `className` with Tailwind utilities.

Every prop accepts a [responsive value](./Layout.md): a single value or an object of breakpoints.

## API

| Prop             | Type                                                                                                        | Default     | Description                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `cols`           | `ResponsiveValue<1 \| 2 \| ... \| 12>`                                                                      | —           | Number of equal columns.                                            |
| `rows`           | `ResponsiveValue<1 \| 2 \| ... \| 12>`                                                                      | —           | Number of equal rows.                                               |
| `templatePreset` | `ResponsiveValue<"none" \| "sidebar" \| "hero" \| "masonry" \| "card-list" \| "symmetric" \| "asymmetric">` | —           | Named template. `"none"` restores the latest column and row counts. |
| `autoFlow`       | `ResponsiveValue<"row" \| "column" \| "dense">`                                                             | `"row"`     | How auto-placed items flow.                                         |
| `autoRows`       | `ResponsiveValue<"min" \| "max" \| "fr" \| true>`                                                           | —           | Size of implicitly created rows (`true` maps to `auto`).            |
| `autoCols`       | `ResponsiveValue<"min" \| "max" \| "fr" \| true>`                                                           | —           | Size of implicitly created columns.                                 |
| `alignItems`     | `ResponsiveValue<"start" \| "end" \| "center" \| "stretch">`                                                | `"stretch"` | Item alignment along the block axis.                                |
| `justifyItems`   | `ResponsiveValue<"start" \| "end" \| "center" \| "stretch">`                                                | `"stretch"` | Item alignment along the inline axis.                               |
| `alignContent`   | `ResponsiveValue<"start" \| "end" \| "center" \| "stretch" \| "between" \| "around" \| "evenly">`           | `"stretch"` | Track-group alignment along the block axis.                         |
| `justifyContent` | `ResponsiveValue<"start" \| "end" \| "center" \| "stretch" \| "between" \| "around" \| "evenly">`           | `"start"`   | Track-group alignment along the inline axis.                        |

`as` accepts `"div" | "section" | "article" | "main" | "aside" | "nav"`. `className`, `style`, and standard HTML props are forwarded; authored classes always win over the library's.

Gap between items is `className="gap-4"` (or `gap-x-*` / `gap-y-*`), not a prop — see [Box](./Box.md) for the styling principle.

## Examples

### Equal columns, responsive

```tsx
<Grid cols={{ base: 1, md: 3 }} className="gap-3">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>
```

Objects are mobile-first: omitted breakpoints inherit the last supplied value through the CSS cascade, with no viewport JavaScript and no rerender.

### Template preset

```tsx
<Grid templatePreset="masonry" className="gap-3">
  <div className="h-40">Item 1</div>
  <div className="h-60">Item 2</div>
  <div className="h-48">Item 3</div>
</Grid>
```

### Preset reset with restored counts

A preset applies at one breakpoint; returning to `"none"` restores the column and row counts in effect from your earlier values, carried forward per breakpoint:

```tsx
<Grid
  cols={{ base: 2, md: 4 }}
  rows={{ base: 2, md: 1 }}
  templatePreset={{ base: "none", sm: "sidebar", lg: "none" }}
  className="gap-2"
>
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</Grid>
```

### Auto-placement and alignment

```tsx
<Grid autoFlow="dense" alignContent="between" justifyContent="center">
  <div>1</div>
  <div>2</div>
</Grid>
```

See the [Grid Storybook examples](../../packages/core/src/components/Grid/Grid.stories.tsx).
