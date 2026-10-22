# Layout primitives

Three primitives cover structural layout in Basic UI:

- [Box](./Box.md) — the polymorphic shell. Renders any element, styles nothing, passes your classes through.
- [Flex](./Flex.md) — a flex container with typed props for direction, alignment, wrapping, and display.
- [Grid](./Grid.md) — a grid container with typed props for tracks, placement, alignment axes, and named template presets.

```tsx
import { Box, Flex, Grid } from "@basic-ui/core";

<Flex direction="column" className="gap-4">
  <Box as="header" className="p-4">Header</Box>
  <Grid cols={{ base: 1, md: 3 }} className="gap-3">
    <Box className="p-4 rounded-lg border border-border-base">Card</Box>
    <Box className="p-4 rounded-lg border border-border-base">Card</Box>
    <Box className="p-4 rounded-lg border border-border-base">Card</Box>
  </Grid>
</Flex>;
```

## The design principle: Tailwind first

Basic UI is Tailwind-first. Utility classes authored in `className` are the
styling layer — including spacing, sizing, position, display, gap, and
overflow. The theme's base `--spacing` token makes every bare numeric
utility resolve, fractionals included (`p-1.5` works out of the box).

The primitives deliberately do **not** expose 1:1 pass-through props for
those utilities: a `p` prop would only shadow the `p-4` class you can
already write, in a parallel vocabulary users must learn and the library
must keep in sync.

A primitive earns a style prop only when it buys something a class cannot:

- **A mix** — one intent composing several classes (`templatePreset`,
  truncation flow).
- **A state** — behavior wiring, not styling.
- **A default** — the prop carries the component's identity (`Flex`
  defaults to `display="flex"`; `Badge` defaults its position to
  `top-right`).
- **A semantic** — a closed, named vocabulary (`direction`, `severity`).

Everything else stays in `className`, and user-authored classes always win
over the library's own.

## Responsive values

Earned props accept either a single value or a responsive object:

```tsx
<Flex direction={{ base: "column", md: "row" }} />
```

- `base` is required; the other breakpoints (`sm`, `md`, `lg`, `xl`,
  `2xl`) are optional and inherit the last supplied value.
- Resolution is pure CSS: a mobile-first cascade of breakpoint-prefixed
  utilities, with no viewport JavaScript, no listeners, and no rerender.
- In `className`, use Tailwind's own responsive prefixes instead:
  `className="gap-2 md:gap-4"`.
