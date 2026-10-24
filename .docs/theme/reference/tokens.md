# Theme token reference

## Stylesheet exports

| Import | Includes |
|---|---|
| `@basic-ui/core/styles.css` | Theme, palette, component classes, and source registration for Core components. Use this when building with `@basic-ui/core`. |
| `@basic-ui/tokens/theme.css` | Authored palette ramps, semantic tokens, scales, dark overrides, and utility shims. |
| `@basic-ui/tokens/palette-static.css` | Standard Tailwind color families, emitted for runtime palette lookups. |

Core's stylesheet imports both token stylesheets. When using Core, you do not need to import them separately.

## Palette tokens

Color variables use the `--color-<family>-<shade>` form:

- Authored ramps: `primary`, `secondary`, and `accent`, shades 50–950.
- Standard Tailwind families: 22 families, including `neutral`, shades 50–950. These are vendored from the installed Tailwind theme.
- `white` and `black`.

The palette is emitted statically so component color recipes can look up any family and shade at runtime. Standard palette utilities use names such as `bg-primary-600` and `text-accent-500`; Tailwind also supports color opacity modifiers.

Component `color` props accept the 22 standard families and the three authored brand ramps. For the recipe behavior, see [Theme concepts](../concepts.md).

## Semantic color tokens

Semantic variables name common interface roles and states:

| Token family | States | Utility example |
|---|---|---|
| `--color-bg-*` | `base`, `muted`, `hover`, `active`, `disabled`, `inverted` | `bg-bg-base` |
| `--color-fg-*` | `base`, `muted`, `hover`, `active`, `disabled`, `inverted`, `skeleton` | `text-fg-muted` |
| `--color-surface-*` | `base`, `hover`, `active`, `disabled`, `inverted` | `bg-surface-base` |
| `--color-border-*` | `base`, `muted`, `hover`, `active`, `disabled`, `inverted` | `border-border-base` |

The repeated `bg` in `bg-bg-base` is intentional: the first `bg` is the utility and the second is the token family.

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

Light semantic tokens use white and neutral grays. Dark tokens invert those grays and use white-based shadows. The palette ramps themselves are mode-independent; color recipes select the appropriate shades.

For override and emission behavior, see [Customizing a theme](../customizing.md).