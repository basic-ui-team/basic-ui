# Layout

Build page structure with [Box](./Box.md), [Flex](./Flex.md), and
[Grid](./Grid.md). Choose a primitive for how content relates, then use
Tailwind utilities in `className` for spacing, sizing, and other styling.

```tsx
import { Box, Flex, Grid } from "@basic-ui/core";

<Flex as="main" direction="column" className="gap-6 p-4">
  <Box as="header" className="text-xl font-semibold">
    Projects
  </Box>
  <Grid cols={{ base: 1, md: 3 }} className="gap-4">
    <Box className="rounded-lg border border-border-base p-4">Project one</Box>
    <Box className="rounded-lg border border-border-base p-4">Project two</Box>
    <Box className="rounded-lg border border-border-base p-4">Project three</Box>
  </Grid>
</Flex>;
```

## Choose a primitive

| Primitive | Use it for |
| --- | --- |
| [Box](./Box.md) | A semantic or generic wrapper. Choose its element with `as`; Box adds no layout styles. |
| [Flex](./Flex.md) | Arranging items along a row or column, with focused props for direction, alignment, wrapping, and display. |
| [Grid](./Grid.md) | Arranging items in rows and columns, with props for track counts, alignment, and named template presets. |

See each guide for its full API and examples. Standard HTML attributes are
accepted; `as` is unrestricted on Box and limited to supported elements on
Flex and Grid.

## How props and classes fit together

Flex and Grid expose focused props for structural choices, such as direction,
alignment, and tracks. These describe how content is arranged. Common spacing,
sizing, and margin values are styling concerns, so use Tailwind utilities in
`className` rather than maintaining a parallel set of component props.

This does not mean that components never have style props. Higher-level
components use props when they express intent or select a coordinated recipe:
[Button](./Button.md)'s `variant` and `size` choose bundled styles, while
`loading` changes behavior. [Alert](./Alert.md)'s `severity` conveys meaning
and affects its appearance and semantic role. These focused choices complement
Tailwind; open-ended styling such as margins, gaps, and widths stays in
`className`.

## Responsive layouts

Flex and Grid props accept responsive values, for example:

```tsx
<Flex direction={{ base: "column", md: "row" }} className="gap-2 md:gap-4">
  {/* content */}
</Flex>
```

Use Tailwind's responsive prefixes in `className`; Box uses these classes for
responsive styling too. See Tailwind's
[responsive design](https://tailwindcss.com/docs/responsive-design) guide.

## Tailwind v4 references

For the utilities used in `className`, see Tailwind's documentation for
[display](https://tailwindcss.com/docs/display),
[flex direction](https://tailwindcss.com/docs/flex-direction),
[flex wrapping](https://tailwindcss.com/docs/flex-wrap),
[alignment](https://tailwindcss.com/docs/align-items),
[justification](https://tailwindcss.com/docs/justify-content),
[grid columns](https://tailwindcss.com/docs/grid-template-columns),
[gap](https://tailwindcss.com/docs/gap),
[padding](https://tailwindcss.com/docs/padding),
[margin](https://tailwindcss.com/docs/margin),
[width](https://tailwindcss.com/docs/width), and
[maximum width](https://tailwindcss.com/docs/max-width).
