# Text

One-line summary: Lightweight polymorphic text component for displaying styled typography with responsive variants and optional truncation.

```tsx
import { Text } from "@basic-ui/core";

// Basic example
<Text>Simple text</Text>;
```

## Overview

`Text` is a small, polymorphic component for rendering typographic content. It supports responsive variants for `size`, `weight`, `color`, `align`, `truncate`, and `wrap`. Consumers choose the semantic element via `as` (e.g., `p`, `span`, `div`). The component forwards unknown props to the underlying element.

## When to use

- Use for body copy, labels, and inline text that needs consistent styling across the app.
- Don't use for interactive controls (buttons/links) unless you also add keyboard handling, `role`, and focus management.

## Variants / Appearance

- `size`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- `weight`: `normal`, `medium`, `semibold`, `bold`
- `color`: built-in tokens (`inherit`, `default`, `muted`, `primary`, `secondary`, `error`, `success`, `warning`, `info`) or custom class string (e.g. `text-red-500`)
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

### Controlled vs Uncontrolled

`Text` is presentational only — there is no controlled state API. When used in places that require state (e.g., editable text), wrap or compose with appropriate input components.

## API

| **Prop**               | Type                 | Default | Description                                       |
| ---------------------- | -------------------- | ------- | ------------------------------------------------- | -------------------------------- | ----------------- | ----------------- | ----------------- |
| `as`                   | `"p"                 | "span"  | "div"`                                            | `p`                              | Element to render |
| `size`                 | Responsive `xs       | sm      | md                                                | lg                               | xl`               | `md`              | Font size variant |
| `weight`               | Responsive `normal   | medium  | semibold                                          | bold`                            | `normal`          | Font weight       |
| `color`                | Responsive `builtIn  | string` | `inherit`                                         | Text color token or custom class |
| `align`                | Responsive `left     | center  | right`                                            | `left`                           | Text alignment    |
| `truncate`             | Responsive `boolean` | `false` | Apply CSS truncation (ellipsis)                   |
| `wrap`                 | Responsive `nowrap   | wrap    | balance                                           | pretty`                          | `nowrap`          | Wrapping behavior |
| `children`             | `ReactNode`          | —       | Content to render                                 |
| `className`            | `string`             | —       | Additional classes forwarded to element           |
| `title` / `aria-label` | `string`             | —       | Accessibility labels (recommended when truncated) |

## Accessibility

- Truncation: when `truncate` is `true` and the consumer does not provide `title` or `aria-label`, the component automatically sets both `title` and `aria-label` to the `children` value if `children` is a string. This helps hover users and assistive tech access the full text. For non-string children, provide an explicit `aria-label` or `title` where necessary.
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
