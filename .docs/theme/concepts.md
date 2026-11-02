# Theme concepts

The theme is a set of CSS custom properties with a Tailwind CSS v4 bridge:

```text
consumer-owned semantic variables
  -> Tailwind utility bridge
    -> component styles
```

There is no palette registry, runtime color recipe, or JavaScript theme API. The `@basic-ui/tokens` package exports a stylesheet only.

## Semantic variables

The variables describe interface roles rather than palette shades. Surface and text colors are provided as pairs so each surface can have a corresponding foreground color:

| Role | Variables |
|---|---|
| Page | `--background`, `--foreground` |
| Surface | `--surface`, `--surface-foreground` |
| Overlay | `--overlay`, `--overlay-foreground` |
| Muted | `--muted`, `--muted-foreground` |
| Primary | `--primary`, `--primary-foreground` |
| Status | `--success` / `--success-foreground`, `--warning` / `--warning-foreground`, `--destructive` / `--destructive-foreground`, `--info` / `--info-foreground` |
| Borders and focus | `--border`, `--input`, `--ring` |

Components consume these shared variables. Changing a value updates the styles that use it without rebuilding utility classes or adding JavaScript theme logic.

## Tailwind utilities

The theme's `@theme inline` block maps the semantic variables into Tailwind's color namespace. For example, `--primary` powers `bg-primary`, while `--primary-foreground` powers `text-primary-foreground`. The utility resolves the variable where it is used, so CSS overrides can be scoped to `:root`, `.dark`, or an application selector.

The theme also provides `@utility` shims for named duration, z-index, opacity, and shadow utilities. If you add new names in those groups, provide a matching `@utility` or use Tailwind arbitrary-value syntax.

The theme stylesheet must be processed by the app's Tailwind CSS v4 integration to generate utilities. Complete class names also need to be visible to Tailwind; class names assembled dynamically at runtime do not generate utilities.