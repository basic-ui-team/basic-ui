---
"@basic-ui/core": minor
"@basic-ui/tokens": minor
---

Replace color cooking with semantic pair tokens (RFC-0001).

- Components style from a single brand color plus role and status
  tokens, each an optional `-foreground` partner, owned by the
  consumer as plain CSS variables in `:root`/`.dark` and bridged into
  Tailwind with `@theme inline`. Overrides apply at any scope with no
  rebuild and no JavaScript; `cn()` (twMerge) keeps the className
  escape hatch reliable.
- BREAKING: the `color` prop is removed from Button, Badge, Icon,
  Spinner, Text, Toggle, Divider, Header, Card, Pagination, and
  Alert. Button variants become default/destructive/outline/ghost/
  link (`solid` renamed to `default`); Alert severity `error` is
  renamed `destructive`. Custom colors are consumer `className`.
- Interactive states derive from one token via color-mix `@utility`
  shims and a mode-aware `--mix-pole`, so one override yields both-mode
  hover/active ramps. Browsers without color-mix degrade to the plain
  token through Tailwind's generated `@supports` fallback.
- Shipped defaults pass WCAG AA in both modes (contract-tested with
  OKLab contrast math, including derived hover surfaces); this fixes
  muted text contrast (previously ~3.5:1 on white).
- Cooking is retired with its archive record
  (engineering/archive/color-cooking.md): the palette registry, the
  generated vendored palette (~250 CSS variables leave every consumer
  build), recipe tables, and their safelist entries are deleted.
- BREAKING: `@basic-ui/tokens` is now a CSS-only package — no JavaScript
  export, no `palette-static.css`. Its single export is `./theme.css`.
