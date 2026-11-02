# Theme token reference

## Stylesheet exports

| Import | Includes |
|---|---|
| `@basic-ui/core/styles.css` | Theme, component utilities, and source registration for Core components. Use this when building with `@basic-ui/core`. |
| `@basic-ui/tokens/theme.css` | Theme stylesheet. Use this directly when you need the theme without Core's component styles. |

Core's stylesheet imports `@basic-ui/tokens/theme.css`. The Tokens package exports this stylesheet only; it has no JavaScript API.

## Semantic variables

The theme exposes consumer-owned CSS custom properties. Override them directly in CSS; component styles and Tailwind utilities resolve these variables at the point of use.

| Role | Variables | Tailwind utility examples |
|---|---|---|
| Page | `--background`, `--foreground` | `bg-background`, `text-foreground` |
| Surface | `--surface`, `--surface-foreground` | `bg-surface`, `text-surface-foreground` |
| Overlay | `--overlay`, `--overlay-foreground` | `bg-overlay`, `text-overlay-foreground` |
| Muted | `--muted`, `--muted-foreground` | `bg-muted`, `text-muted-foreground` |
| Primary | `--primary`, `--primary-foreground` | `bg-primary`, `text-primary-foreground` |
| Border and focus | `--border`, `--input`, `--ring` | `border-border`, `border-input`, `ring-ring` |
| Status | `--success`, `--warning`, `--destructive`, `--info` and corresponding `-foreground` variables | `bg-success`, `text-warning-foreground`, etc. |

Surface and status foreground variables pair text and icon colors with their corresponding backgrounds. `--mix-pole` is also available for derived hover and active color utilities; the default is black in light mode and white in dark mode.

## Other tokens

| Token group | Names | Utility form |
|---|---|---|
| Radius | `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full` | `rounded-*` |
| Text size | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl` | `text-*` |
| Font weight | `normal`, `medium`, `semibold`, `bold` | `font-*` |
| Line height | `tight`, `snug`, `normal`, `relaxed`, `loose` | `leading-*` |
| Letter spacing | `tight`, `normal`, `wide` | `tracking-*` |
| Font family | `sans`, `heading`, `mono` | `font-*` |
| Duration | `fast`, `normal`, `slow` | `duration-*` |
| Easing | `in`, `out`, `spring` | `ease-*` |
| Z-index | `base`, `elevated`, `docked`, `dropdown`, `sticky`, `banner`, `overlay`, `modal`, `popover`, `toast`, `tooltip` | `z-*` |
| Opacity | `base`, `muted`, `disabled`, `hover`, `overlay` | `opacity-*` |
| Shadow | `s1`–`s5` | `shadow-s*` |

The theme also sets `--spacing` to `0.25rem`; spacing utilities multiply that value (`p-2` resolves to `calc(var(--spacing) * 2)`). Breakpoints are `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, and `2xl` 1536px.

The theme provides utility shims for named durations, z-index values, opacity values, and shadows. If you add new names to those groups, provide an `@utility` shim or use Tailwind arbitrary-value syntax.

## Default light and dark values

The theme defines semantic values for both modes. Add the `.dark` class to activate dark values; override variables directly in `:root` and `.dark`, or scope them to an application selector.

For override and emission behavior, see [Customizing a theme](../customizing.md).