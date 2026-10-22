# Box

The polymorphic primitive: renders any element, passes your classes through verbatim.

```tsx
import { Box } from "@basic-ui/core";

<Box className="p-4 rounded-lg border border-border-base bg-surface-base">
  Anything you like
</Box>;
```

## Overview

`Box` is a thin, unopinionated shell. It renders the element you choose (via `as`), merges nothing, and styles nothing — all styling is authored in `className` with Tailwind utilities, exactly as you would write it anywhere else in your app. Use it for semantic structure and ad-hoc layout; reach for [Flex](./Flex.md) or [Grid](./Grid.md) when their typed props earn their place.

`Box` carries no style props by design: a padding or margin prop would only shadow the Tailwind utility you can already write. The theme's base `--spacing` token makes every bare numeric utility resolve, including fractionals (`p-1.5`) and values beyond the common steps.

## API

| Prop        | Type              | Default   | Description                                                       |
| ----------- | ----------------- | --------- | ----------------------------------------------------------------- |
| `as`        | `ElementType`     | `"div"`   | The element to render. Any element is allowed.                    |
| `children`  | `React.ReactNode` | —         | Content.                                                          |
| `className` | `string`          | —         | Tailwind utilities, passed through verbatim.                      |
| `style`     | `React.CSSProperties` | —    | Inline styles.                                                    |

Standard HTML attributes and event handlers for the rendered element are accepted and forwarded.

## Examples

### Semantic elements

Change the element without changing the styling approach:

```tsx
<Box as="article" className="p-4 rounded-lg border border-border-base">
  <Box as="header" className="mb-3 font-semibold">Release notes</Box>
  <Box as="ul" className="mt-2 list-disc pl-4">
    <Box as="li">Use an element appropriate to the content.</Box>
    <Box as="li">Add layout without an extra wrapper.</Box>
  </Box>
</Box>
```

### Spacing, sizing, and position

All authored as Tailwind utilities:

```tsx
<Box className="relative p-4">
  <Box className="absolute right-2 top-2 rounded bg-sky-100 px-2 py-1">
    Pinned
  </Box>
</Box>
```

### Responsive behavior

Breakpoints use Tailwind's own prefixes — no prop layer in between:

```tsx
<Box className="block md:inline-block p-2 md:p-4">
  Scales with the viewport
</Box>
```

See the [Box Storybook examples](../../packages/core/src/components/Box/Box.stories.tsx).
