# Flex

A flex container with typed, responsive props for direction, alignment, and wrapping.

```tsx
import { Flex } from "@basic-ui/core";

<Flex direction="column" className="gap-3">
  <div>First</div>
  <div>Second</div>
</Flex>;
```

## Overview

`Flex` renders a flex container and exposes the handful of flexbox decisions that benefit from a typed, closable vocabulary: direction, justification, alignment, wrapping, and display. Everything else — gap, padding, sizing — is authored in `className` with Tailwind utilities, because a prop for those would only shadow the class you can already write.

Every prop accepts a [responsive value](./Layout.md): a single value or an object of breakpoints.

## API

| Prop        | Type                                                                                        | Default     | Description                                        |
| ----------- | ------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------- |
| `direction` | `ResponsiveValue<"row" \| "column" \| "row-reverse" \| "column-reverse">`                  | `"row"`     | Main-axis direction.                               |
| `justify`   | `ResponsiveValue<"start" \| "end" \| "center" \| "between" \| "around" \| "evenly" \| "stretch">` | `"start"` | Main-axis distribution of items.        |
| `align`     | `ResponsiveValue<"start" \| "end" \| "center" \| "stretch">`                                | `"stretch"` | Cross-axis alignment of items.                    |
| `wrap`      | `ResponsiveValue<"nowrap" \| "wrap" \| "reverse">`                                         | `"nowrap"`  | Wrapping behavior (`reverse` maps to `wrap-reverse`). |
| `display`   | `ResponsiveValue<"flex" \| "inline-flex">`                                                 | `"flex"`    | The container's display mode — part of its identity, with a default. |

`as` accepts `"div" | "section" | "article" | "nav" | "header" | "footer"`. `className`, `style`, and standard HTML props are forwarded; authored classes always win over the library's.

Spacing between items is `className="gap-4"` (or `gap-x-*` / `gap-y-*`), not a prop — see [Box](./Box.md) for the styling principle.

## Examples

### Direction and gap

```tsx
<Flex direction="column" className="gap-3">
  <div>First</div>
  <div>Second</div>
</Flex>
```

### Alignment

```tsx
<Flex align="center" justify="between">
  <span>Left</span>
  <span>Right</span>
</Flex>
```

### Responsive direction

```tsx
<Flex
  direction={{ base: "column", md: "row" }}
  className="gap-2 md:gap-4"
>
  <div>1</div>
  <div>2</div>
</Flex>
```

Objects are mobile-first: omitted breakpoints inherit the last supplied value through the CSS cascade, with no viewport JavaScript and no rerender.

See the [Flex Storybook examples](../../packages/core/src/components/Flex/Flex.stories.tsx).
