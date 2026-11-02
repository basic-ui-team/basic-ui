# Customizing a theme

Choose the variables that match the part of the interface you want to change:

| Goal | Variables |
|---|---|
| Change the brand color and its foreground | `--primary`, `--primary-foreground` |
| Change page colors | `--background`, `--foreground` |
| Change component surfaces and their text | `--surface`, `--surface-foreground` |
| Change muted surfaces and text | `--muted`, `--muted-foreground` |
| Change borders, inputs, or focus rings | `--border`, `--input`, `--ring` |
| Change status colors | `--success`, `--warning`, `--destructive`, `--info` and their `-foreground` pairs |

For setup and package installation, see [Getting started](./getting-started.md).

## Change the brand color

```css
@import "@basic-ui/core/styles.css";

:root {
  --primary: oklch(0.55 0.2 250);
  --primary-foreground: white;
}
```

Components use the same `primary` semantic color; there are no palette ramps or per-component palette-family props. See [Change the brand color](./recipes/brand-colors.md) for a checklist.

## Change semantic colors

Set the default values on `:root` and provide dark values under `.dark`:

```css
@import "@basic-ui/core/styles.css";

:root {
  --surface: #f0f4f8;
  --muted-foreground: #465365;
  --border: #cbd5e1;
}

.dark {
  --surface: #10161d;
  --muted-foreground: #aab6c5;
  --border: #354151;
}
```

These are ordinary CSS custom properties, so you can also set them on a selector to scope the theme. More examples are in [Customize semantic colors](./recipes/semantic-colors.md).

## Scope a theme

Set the variables on a selector around the part of your app you want to theme:

```css
.theme-marketing {
  --background: #fff8f0;
  --foreground: #43281c;
  --primary: #7a351d;
  --primary-foreground: #fff8f0;
}
```

Utilities resolve their variables on the element where they are used, so descendants inherit the scoped values. To change the scoped theme in dark mode, add a `.dark .theme-marketing` rule.

## Common pitfalls

- **Overrides do not take effect:** put them after the core stylesheet import.
- **Dark values do not apply:** make sure the values are declared under `.dark` and that the `.dark` class is on an ancestor of the component.
- **A dynamically assembled utility has no styles:** Tailwind needs complete class names it can detect. Use literal class names or arbitrary-value syntax such as `bg-(--primary)`.
- **Tokens exist but utilities do not:** make sure the stylesheet is processed by your app's Tailwind CSS v4 integration.