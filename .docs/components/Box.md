# Box

The polymorphic primitive: renders any element, passes your classes through verbatim.

```tsx
import { Box } from "@basic-ui/core";

<Box className="p-4 rounded-lg border border-border-base bg-surface-base">
  Anything you like
</Box>;
```

## Overview

`Box` is a thin, polymorphic wrapper: choose the rendered element with `as`, and author styling with Tailwind utilities in `className`. It adds no classes of its own and passes `className` through unchanged. The standard React `style` prop is also forwarded. Use Box for semantic structure and ad-hoc layout; use [Flex](./Flex.md) or [Grid](./Grid.md) when their focused layout props are useful.

## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | `"div"` | The element to render. Any element is allowed. |

Standard HTML and React props—including `children`, `className`, `style`, and event handlers—are accepted and forwarded to the rendered element.

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
