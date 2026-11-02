# Theme docs — implementation notes for prose agent

Source of truth: `packages/tokens/src/theme.css` and its parts,
`packages/core/src/styles.css`, and the compile-level tests
(`packages/tokens/src/theme.test.ts`,
`packages/core/scripts/responsive-utilities.css.test.ts`). Cascade and
contrast claims marked [verified] were proven against Tailwind v4.3.0
through the real compiler or computed with OKLab contrast math. Do not
soften or reinterpret these facts.

Audience: app developers using `@basic-ui/core` with their own Tailwind
CSS v4 setup. Tone: practical, short sections, working code blocks.

MAJOR CHANGE vs the previous notes: the palette ramps, color cooking,
`@theme` override blocks, and static-emission pitfalls are GONE. The
theme is now semantic pair tokens owned by the consumer as plain CSS.
Most of the old pitfalls section collapses — write the new simplicity
honestly instead of carrying old caveats forward.

---

## The model (one section to rule the docs)

- One import: `@import "@basic-ui/core/styles.css";` — brings the token
  theme, the component class safelist, and a `@source "./"`
  self-registration so every class components author works with zero
  configuration.
- Tokens are plain CSS custom properties in `:root, :host`, re-declared
  under `.dark`. Consumers own them: override anywhere, at any scope.
  A bridge (`@theme inline`) maps each to a complete Tailwind utility
  (`bg-primary`, `text-muted-foreground`, `bg-success/50`, ...). Inline
  means utilities resolve the consumer variable directly, so overrides
  apply wherever they are declared — including a marketing-section
  selector. [verified]
- Interactive states derive from the token itself through `@utility`
  color-mix shims and `--mix-pole` (black in light mode, white in dark).
  Override `--primary`, get correct hover/active in both modes, free.
  Browsers without color-mix degrade to the plain token via the
  generated `@supports` fallback. [verified]
- No JavaScript theming exists. The `className` escape hatch is
  reliable: the library's `cn()` uses tailwind-merge, so consumer
  classes win conflicts (contract-tested). A custom-colored component
  is a `className`, not a prop.

## Token set (the complete list — do not invent more)

Pairs (surface token + `-foreground` text/icon color on it):

| Token pair | Controls | Used by |
|---|---|---|
| `--background` / `--foreground` | page shell, default text | Button (outline/ghost), Text, Header, Pagination |
| `--surface` / `--surface-foreground` | raised surfaces | Card, Dialog |
| `--overlay` / `--overlay-foreground` | floating layers | Tooltip |
| `--muted` / `--muted-foreground` | subtle fills, secondary text | descriptions, Icon, ghost hover |
| `--primary` / `--primary-foreground` | the single brand color | default Button, checked Toggle, Badge |
| `--success` / `--success-foreground` | status | Alert |
| `--warning` / `--warning-foreground` | status | Alert |
| `--destructive` / `--destructive-foreground` | destructive actions, errors | destructive Button, Alert |
| `--info` / `--info-foreground` | status | Alert |

Unpaired: `--border`, `--ring` (focus rings), `--input` (form borders),
`--mix-pole` (derived-state direction, flip only with intent).

Non-color tokens unchanged from before: radius, text sizes, font
weights/leading/tracking/families, duration/ease, z-index, opacity,
spacing, breakpoints, shadows s1–s5.

## Overrides (what the guides should teach)

```css
@import "@basic-ui/core/styles.css";

:root {
  --primary: oklch(0.45 0.12 250);      /* re-brand */
  --muted-foreground: oklch(0.32 0 0);  /* retune secondary text */
}
.dark {
  --primary: oklch(0.8 0.1 250);
}
.theme-marketing {                      /* scoped re-theming */
  --surface: oklch(0.98 0.01 300);
}
```

Rules that remain true (the surviving "pitfalls"):
- Plain CSS declarations; `@theme` is not needed to override anything.
- `.dark` overrides must come after the import (source order decides
  equal-specificity rules). [verified]
- Dynamically assembled class names never generate utilities — use
  complete literal classes or arbitrary values like
  `bg-(--brand-surface)`.
- The stylesheet must be processed by the app's Tailwind v4 build; a
  plain CSS import yields tokens but no utilities.
- Adding a NEW color with utilities: declare the variable and add one
  bridge entry (`@theme inline { --color-warning: var(--warning); }`),
  or skip the bridge and use arbitrary-value syntax.
- Pairs are a contract: when overriding a surface, check its
  `-foreground` still meets WCAG AA (4.5:1) — the shipped defaults all
  pass in both modes [verified], including on derived hover surfaces.
- status `filled` styling uses the pair; Alert `outline`/`subtle` keep
  body text on `foreground` so AA holds for every status color.

## Component styling API (post-RFC-0001)

- No `color` props anywhere. Semantic props only: Button `variant`
  (default/destructive/outline/ghost/link), Alert `severity`
  (success/warning/destructive/info) + `variant` (filled/outline/subtle).
- Derived-state classes exist only as: `*-primary-hover`,
  `*-primary-active`, `*-destructive-hover/active`,
  `bg-muted-hover/active` (channels: bg/text/border where meaningful).
  They are library internals documented for completeness; consumers
  override the base token, not the derived class.
- Package exports: `@basic-ui/tokens/theme.css` (CSS-only package, one
  export) and `@basic-ui/core/styles.css` (everything).

## Things NOT to claim

- No palette ramps, shade scales, or "override the 50–950 ramp" — gone.
- No `@theme static`, no tree-shaking caveats for consumers — plain CSS
  always emits. (Consumer-ADDED tokens referenced only at runtime via
  var() need no static concern either: declare them in plain CSS.)
- No JS theme API, no `createTheme`, no recipes, no `--cr-*` variables.
- No color props; do not document `<Button color="teal">`.
- Do not suggest `pointer-events-none` on disabled elements — the
  library deliberately keeps pointer events (a11y stance, ADR-0002 §6).
- No historical consumers exist; no compat shims are implied anywhere.
