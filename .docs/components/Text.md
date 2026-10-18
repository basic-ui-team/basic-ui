# Text

One-line summary: Lightweight polymorphic text component for displaying styled typography with responsive variants and optional truncation.

```tsx
import { Text } from "@basic-ui/core";

// Basic example
<Text>Simple text</Text>;
```

## Overview

`Text` is a small, polymorphic component for rendering typographic content. Size, alignment, truncation, and wrapping support responsive CSS values. Weight and color are scalar. Consumers choose the semantic element via `as` (e.g., `p`, `span`, `div`). The component forwards unknown props to the underlying element.

## When to use

- Use for body copy, labels, and inline text that needs consistent styling across the app.
- Don't use for interactive controls (buttons/links) unless you also add keyboard handling, `role`, and focus management.

## Variants / Appearance

- `size`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- `weight`: `normal`, `medium`, `semibold`, `bold`
- `color`: built-in tokens (`default`, `muted`, `primary`, `secondary`, `error`, `success`, `warning`, `info`) or custom class string (e.g. `text-red-500`)
- `align`: `left`, `center`, `right`
- `truncate`: `true | false` (applies CSS truncation)
- `wrap`: `nowrap`, `wrap`, `balance`, `pretty`

## Examples

### Basic

```tsx
<Text size="md">This is a paragraph of text.</Text>
```

### Advanced

```tsx
<Text as="span" weight="semibold" color="primary">Highlighted</Text>

// Custom color via Tailwind class
<Text color="text-red-500">Error</Text>
```

### Responsive Layout

```tsx
<Text
  size={{ base: "sm", md: "md", lg: "lg" }}
  truncate={{ base: true, md: false }}
  wrap="pretty"
>
  Full text that can wrap on wider screens.
</Text>
```

Truncation forces single-line ellipsis while active. When it turns off, the
latest requested wrapping and overflow values are restored. Overflow defaults
to visible when unspecified; use `"visible"` for an explicit reset. Consumer
`className` overrides remain last.

### Controlled vs Uncontrolled

`Text` is presentational only — there is no controlled state API. When used in places that require state (e.g., editable text), wrap or compose with appropriate input components.

## API

| **Prop** | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `"p" \| "span" \| "div"` | `p` | Element to render |
| `size` | Responsive `xs \| sm \| md \| lg \| xl \| 2xl \| 3xl` | `md` | Font size variant |
| `weight` | `normal \| medium \| semibold \| bold` | `normal` | Scalar font weight |
| `color` | Built-in semantic color or class string | `default` | Scalar text color |
| `align` | Responsive `left \| center \| right` | `left` | Text alignment for block elements |
| `truncate` | Responsive `boolean` | `false` | Single-line ellipsis |
| `wrap` | Responsive `nowrap \| wrap \| balance \| pretty` | `wrap` | Wrapping behavior |
| `children` | `ReactNode` | — | Content to render |
| `className` | `string` | — | Additional classes forwarded to element |
| `title` / `aria-label` | `string` | — | Accessibility labels (recommended when truncated) |

## Accessibility

- Truncation: when `truncate` is enabled at any breakpoint and neither `title` nor `aria-label` is provided, the component supplies both attributes from string children. These attributes stay stable across viewport changes. For non-string children, provide an explicit `aria-label` or `title` where necessary.
- Keyboard & interactive usage: `Text` is non-interactive by default. If used as an interactive control, consumers must add `role`, `tabIndex`, and keyboard handlers (e.g., `onKeyDown` handling Enter/Space) to meet operable requirements.
- Color contrast: built-in color tokens map to design tokens/classes. Ensure those tokens meet WCAG contrast ratios (4.5:1 for normal text, 3:1 for large text) across supported themes.

## Stories

- See Storybook stories (if present) for interactive examples.

## Source

Source: [packages/core/src/components/Text/Text.tsx](packages/core/src/components/Text/Text.tsx)

---

## Guidance

- Prefer providing an explicit `aria-label` or `title` when truncation is used with non-string content.
- When making text interactive, document and implement keyboard handlers and focus styles.
- Add an Axe accessibility check in tests to assert there are no obvious a11y violations for common variants.
