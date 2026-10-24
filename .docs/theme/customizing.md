# Customizing a theme

Choose the token layer based on what you want to change:

| Goal | Tokens | Where to override |
|---|---|---|
| Change brand colors, including component `color` props | `--color-primary-*`, `--color-secondary-*`, `--color-accent-*` | `@theme static` |
| Change the grays used throughout the interface | `--color-neutral-*` | `@theme` or `@theme static` |
| Change surfaces, text, or borders without changing brand ramps | Semantic tokens | `@theme` for light values and `.dark` for dark values |
| Add a one-off color utility | A new `--color-*` token | `@theme`; use `@theme static` if plain CSS or runtime code also reads it |

For setup and package installation, see [Getting started](./getting-started.md).

## Change a brand ramp

Override the shades in an `@theme static` block after the core stylesheet import. A complete ramp gives component color recipes a consistent set of values to use. You can override only selected shades; the other shades keep their defaults.

```css
@import "@basic-ui/core/styles.css";

@theme static {
  --color-primary-50:  oklch(0.97 0.02 250);
  --color-primary-100: oklch(0.94 0.04 250);
  --color-primary-200: oklch(0.89 0.08 250);
  --color-primary-300: oklch(0.83 0.12 250);
  --color-primary-400: oklch(0.75 0.16 250);
  --color-primary-500: oklch(0.66 0.19 250);
  --color-primary-600: oklch(0.55 0.17 250);
  --color-primary-700: oklch(0.45 0.13 250);
  --color-primary-800: oklch(0.37 0.09 250);
  --color-primary-900: oklch(0.31 0.06 250);
  --color-primary-950: oklch(0.21 0.04 250);
}
```

The ramp is mode-independent. Components using a palette family select their own shades for dark mode. See [Change the brand colors](./recipes/brand-colors.md) for a component-focused check list.

You can also override `--color-neutral-*`. Semantic grays refer to the neutral ramp, so changing it re-tints those surfaces, borders, and text in both modes.

## Change semantic colors

Use `@theme` for light values and `.dark` for dark values:

```css
@import "@basic-ui/core/styles.css";

@theme {
  --color-surface-base: #f0f4f8;
  --color-fg-muted: #465365;
  --color-border-base: #cbd5e1;
}

.dark {
  --color-surface-base: #10161d;
  --color-fg-muted: #aab6c5;
  --color-border-base: #354151;
}
```

Put the `@theme` block after the import. Do not override semantic tokens in a plain `:root` block: it outranks the theme's `.dark` rules and prevents those dark values from taking effect. More examples are in [Customize semantic colors](./recipes/semantic-colors.md).

## Add a color

Add a new `--color-*` token to create a corresponding utility:

```css
@theme {
  --color-brand-surface: #eef2ff;
}
```

Use a complete, literal class such as `bg-brand-surface` in your app. If plain CSS also needs the variable, declare it in `@theme static` so Tailwind does not remove it as unused.

## Scope a theme

`@theme` tokens are global. To change values only within part of your app, declare custom properties on a selector around that region:

```css
.theme-marketing {
  --color-bg-base: #fff8f0;
  --color-fg-base: #43281c;
}
```

Utilities resolve their variables on the element where they are used, so descendants inherit the scoped values. If the scoped section also needs different dark values, add a selector for that dark-mode combination.

## Common pitfalls

- **Overrides do not take effect:** put them after the core stylesheet import. Earlier declarations lose by source order.
- **Dark mode ignores a semantic override:** use `@theme` for the light value and `.dark` for the dark value. A plain `:root` semantic override beats both.
- **A custom variable is missing from the output:** tokens in regular `@theme` blocks can be tree-shaken when no utility uses them. Use `@theme static` when referencing a token through plain CSS or runtime code.
- **A dynamically assembled utility has no styles:** Tailwind needs complete class names it can detect. Use literal class names or arbitrary-value syntax such as `bg-(--color-brand-surface)`.
- **Tokens exist but utilities do not:** make sure the stylesheet is processed by your app's Tailwind CSS v4 integration.