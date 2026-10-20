---
"@basic-ui/core": minor
"@basic-ui/tokens": minor
---

Rationalize component colors onto palette recipes and retire the
informational semantic tokens.

- Component color props accept palette families (any Tailwind ramp or the
  brand ramps) instead of semantic colors: Text, Header, CardTitle, and
  CardDescription take `"default" | "muted" | PaletteColor`; Spinner and
  Divider the same; Icon takes `"muted" | PaletteColor` and inherits the
  surrounding color when omitted; Button and Toggle take `PaletteColor`.
  The `| string` escape hatch on typography components is closed.
- Severities are curated recipes, not token-styled states. Alert keeps
  `severity` for the ARIA role and icon and maps it to a default palette
  family; a new `color` prop overrides the family. Badge's `"default"`
  color renders the slate family.
- Focus rings follow the recipe and are never manually colored:
  recipe-driven components read the recipe's focus variables
  (`focus-visible:ring-(--cr-*-focus)`), recipe-less components use
  `ring-current`, and ring offsets are themed (`ring-offset-bg-base`) so
  dark mode no longer paints a white gap. Elements that can never receive
  focus carry no focus utilities.
- Recipes emit color only: the border channel template no longer carries a
  width utility, so component-owned widths (the Spinner arc, Divider
  thickness, Alert and Card borders) cannot collide with recipe utilities.
- Card `selected` paints a structural inverted surface
  (`bg-bg-inverted text-fg-inverted`) instead of a success border.
  Pagination is color prop-ised with paired resting/active recipes; the
  shared view now passes the recipe variables through the page and
  control render callbacks.
- `BuiltInSemanticColors` and its guard are removed from core's public
  surface.
- tokens: the `error`/`warning`/`success`/`info` semantic states are
  retired from `SemanticState`, both themes, and the generated
  `theme.css`/`tokens.ts`. Tokens author brand ramps and structural
  neutrals only. There are no existing consumers, so these removals ship
  as the first released shape.
