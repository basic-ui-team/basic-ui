# Archived: color cooking

| | |
|---|---|
| **Status** | Retired 2026-10-22 by [RFC-0001](../rfc/0001-semantic-color-tokens.md) |
| **Lived** | 2025 → 2026-10 (accepted record: [ideas/tailwind-color-recipes.md](../ideas/tailwind-color-recipes.md)) |
| **Where to find the code** | Git history, tag/commit preceding the RFC-0001 execution epic |

## What it was

Color cooking let any component accept a `color` prop naming a registered
palette family (`red`, `teal`, `primary`, ...) and derive a complete
interactive state set — base, hover, active, focus, dark-mode alternates —
as inline CSS custom properties, while emitting only a fixed set of
complete, static Tailwind utility candidates.

## How the implementation worked

```
packages/core/src/lib/colorRecipes/colorRecipes.ts   cr(): family + recipe → {className, style}
packages/core/src/components/*/  *.variants.ts       recipe tables (shade/state per channel, dark sets)
packages/tokens/src/palette.ts                       family registry (22 Tailwind + 3 brand families)
packages/tokens/scripts/generate-palette-static.ts   @theme static emission of every cookable family
packages/tokens/src/generated/styles/palette-static.css
packages/core/src/generated/layout-utilities...css   @source inline(...) safelist of recipe utilities
```

The mechanism respected the hard Tailwind v4 constraint that decided its
shape — Tailwind scans source as text and never evaluates runtime string
construction. Utilities were fixed literals reading variables
(`bg-(--cr-bg)`, `hover:bg-(--cr-bg-hover)`); only the variable *values*
were constructed at runtime from the consumer-chosen family, with opacity
encoded as `color-mix` and dark states as separate variable sets. CSS
output stayed bounded by the recipe classes, never by palette size.

## Why it was retired

The engineering was sound; the allocation was wrong. The evidence that
accumulated:

- **Served a prop nobody needed**: ten components carried `color` props,
  but the goal alignment review (RFC-0001 §3) found the library's value
  proposition is behavior and accessibility, not prop-driven styling
  fluency. The className escape hatch (`cn` = clsx + tailwind-merge,
  verified) covers custom colors without any of this machinery.
- **Infrastructure debt outlived its benefit**: a registry, a codegen pass
  with fail-fast family checks, a generated ~250-variable vendored palette
  stylesheet, per-variant recipe tables, and `@source inline` safelist
  entries — all to avoid consumers writing a class name.
- **Coupling side effects**: the vendored `neutral` ramp that the semantic
  layer aliased into (the "neutral problem") existed to serve cooking's
  runtime family references; retiring cooking dissolved it.
- **Docs cost**: five consumer-facing pitfalls existed largely to make
  override forms safe around the machinery (RFC-0001 §2.2).

## What replaced it

Semantic pair tokens — one brand color plus role and status tokens,
consumer-owned in `:root`/`.dark` and bridged with `@theme inline` — with
interactive states derived at runtime through `@utility` color-mix shims.
The replacement keeps the one genuinely good idea (runtime variable values
behind static utility candidates) and drops the registry, the codegen, the
palette, and the props.

## Bundle effect of retirement

- `@basic-ui/tokens` JavaScript: 9.98 kB (pre-epic) → 0.45 kB (registry
  only) → 0 (CSS-only package).
- Consumer CSS: the ~250-variable `palette-static.css` block leaves every
  consumer build.
- Exact post-retirement deltas are measured and recorded in the RFC-0001
  execution epic.

## If it is ever needed again

`cr()` was a pure, dependency-light helper (static class strings + inline
custom properties). If demonstrated consumer demand appears, it can return
as a separate opt-in package; the RFC explicitly leaves that door open
(§6, alternative B).
