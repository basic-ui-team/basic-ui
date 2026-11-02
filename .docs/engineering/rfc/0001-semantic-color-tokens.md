# RFC-0001: Semantic color tokens

| | |
|---|---|
| **Status** | Accepted 2026-10-22 — decisions in §9; naming vocabulary (§9.6) under discussion |
| **Date** | 2026-10-22 |
| **Supersedes** | Color recipes as the internal styling mechanism ([ideas/tailwind-color-recipes.md](../ideas/tailwind-color-recipes.md)); archived as [archive/color-cooking.md](../archive/color-cooking.md) |
| **Relates to** | [ADR-0001 Tailwind-first primitives](../adr/0001-tailwind-first-primitives.md), [core-design/color-system.md](../core-design/color-system.md) |

## 1. Summary

Retire color cooking and the palette ramps. Components style from a small
set of semantic tokens — a single brand color plus role and status tokens,
each an optional `-foreground` pair — owned by the consumer as plain CSS
custom properties in `:root` and `.dark`, bridged into Tailwind v4 utilities
with `@theme inline`. Interactive states derive from the consumer's tokens
at runtime through `@utility` shims and `color-mix`, so a consumer who
overrides one variable gets consistent hover/active ramps in both modes for
free. Everything the tokens and shims do not cover is the consumer's to
write as ordinary Tailwind classes; `cn()` merges with tailwind-merge, so
consumer classes reliably win conflicts.

The library's styling moves to the surface. Depth is spent on accessibility
and component behavior.

## 2. Background

### 2.1 Current state

The theme-engine epic (ADR-0001 lineage) moved the theme to authored CSS:
`theme.css` entry with palette, semantic, scales, shadows, dark, and
utility-shim parts; consumer overrides cascade with no rebuild and no
JavaScript. Two systems still stand on top of that base:

- **Brand palette ramps** — `primary`, `secondary`, `accent`, each 11
  shades, emitted `@theme static` in `theme/palette.css`.
- **Color cooking** — `colorRecipes.ts` (`cr()`), registry in
  `tokens/src/palette.ts`, generated `palette-static.css` (vendored
  Tailwind families), per-variant recipe tables, and `@source inline`
  safelist entries. Serves `color` props on ten components.

### 2.2 Evidence motivating this RFC

| Observation | Value | Source |
|---|---|---|
| Semantic tokens defined vs consumed by variants | 25 defined, 10 consumed | usage audit, `*.variants.ts` |
| Latent CSS bugs found by the audit of the old pipeline | 2 (`duration-*` utilities never generated; dark shadow overrides dead by inlining) | compile probes, production Storybook CSS |
| Pitfalls a consumer must be taught to override safely today | 5 (block choice, layering, static emission, class detection, import order) | `.docs/theme/getting-started.md` |
| JS bundle of `@basic-ui/tokens` before the CSS-first epic | 9.98 kB (now 0.45 kB, registry only) | build output |
| Consumer class conflicts resolvable | yes — `cn()` is clsx + tailwind-merge | `react-utilities/src/lib/cn/cn.ts` |

### 2.3 Historical context

This is not the first move between these poles. The library previously held
engine-owned semantic states, retired them in favor of cooking (see the
color-recipes record's non-goals), and now reverses again. The reversal is
justified because every failure mode of the earlier semantic layer is
structurally closed in the proposed model:

| Earlier semantic layer failure | Closed by |
|---|---|
| Tokens authored as JS-merge config shapes (`ThemeConfig`), flattened to literals by codegen | Tokens are plain CSS; the JS layer no longer exists |
| Vocabulary driven by config type, not component need | New vocabulary starts from the audited consumed set |
| No escape hatch — consumer classes lost to ours by CSS source order | `cn()` = twMerge; consumer classes win |
| Values aliased into `neutral`, so vendor drift rippled through all grays | Tokens own literal values; the vendored neutral ramp is deleted |
| Severity states with no token answer | Status pairs are first-class tokens (§5.1) |

## 3. Motivation

Stated library goals: **approachable** (simple, semantic APIs), **extensible**
(first-class customization), **accessible**. Cooking serves none of these
directly: it optimizes for prop-driven arbitrary-color flexibility at the
cost of a registry, a codegen pass, a safelist, recipe tables in every
variant file, and five consumer-facing pitfalls in the docs. The token
model serves all three: one import, one block of variables to override,
and a documented, verified escape hatch. The simplification also removes the
"neutral problem" root and branch: semantic roles reference a vendored,
version-drifting `neutral` ramp today; owning literal values ends that
dependency.

## 4. Goals and non-goals

**Goals**

- One color location for consumers: `:root` and `.dark` blocks of paired
  tokens.
- Utilities resolve consumer-owned variables directly, so overrides work at
  any scope (app, region, component).
- Zero JavaScript in the styling path; zero codegen for color.
- Component variant files contain only literal class names and cva tables.
- A consumer overriding one token gets consistent interactive-state styling
  in both modes without authoring anything extra.
- All components meet WCAG 2.1 AA against the shipped default pairs.
- Vocabulary scoped to what the components actually consume — fewer tokens
  than any ecosystem reference, not more.

**Non-goals**

- A JavaScript color API, ramp generator, or `@config`/`@plugin` vehicle
  (deferred with the style-recipe system).
- Adopting an external token table wholesale, or a token for every
  surface a component might ever render (§5.1 scoping rule).
- Runtime contrast checking.
- Supporting historical consumers; there are none (fresh-slate policy).

## 5. Proposed design

### 5.1 Token set

Surface/foreground pairs; the `-foreground` partner carries the text/icon
color guaranteed to sit on the surface. **One brand color** (§9.5): the
brand layer is `primary` alone. The scoping rule: a token exists only when
an audited consumer needs it; role props exist only where the semantic
distinction is real (severity on Alert, variant on Button) — not on
everything that once had a `color` prop.

Proposed vocabulary (naming finalized in §9.6):

| Token | Replaces | Audited consumers |
|---|---|---|
| `--background` / `--foreground` | `bg-base` / `fg-base` | page shell, Button, Text, Header, Pagination |
| `--surface` / `--surface-foreground` | `surface-*` | Card, Dialog |
| `--overlay` / `--overlay-foreground` | `surface-inverted` / `fg-inverted` | Tooltip, floating layers |
| `--muted` / `--muted-foreground` | `bg-muted` + `fg-muted` | descriptions, Icon, subtle fills |
| `--primary` / `--primary-foreground` | brand ramps + cooking | default Button, checked Toggle, emphasis |
| `--border` | `border-base` / `border-muted` | Divider, Card, Spinner |
| `--ring` | cooking focus channels + `ring-offset-bg-base` | focus rings everywhere |
| `--input` | (new) | Select / native controls |
| `--success` / `--success-foreground` | Alert severity `green` | Alert, validation |
| `--warning` / `--warning-foreground` | Alert severity `amber` | Alert |
| `--destructive` / `--destructive-foreground` | cooked `red` recipes | destructive actions, error emphasis |
| `--info` / `--info-foreground` | Alert severity `sky` | Alert |

### 5.2 CSS architecture

`theme/palette.css` is deleted; `theme/semantic.css` is replaced by two
blocks:

```css
/* Consumer-owned values: plain CSS, always emitted. */
:root,
:host {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... */
}

/* Bridge: utilities resolve the consumer var directly. */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... */
}
```

`theme/dark.css` re-declares the same variables under `.dark`. Consequences,
each consistent with cascade rules already probe-verified in
`tokens/src/theme.test.ts`:

- Plain-CSS values in `:root` are always emitted — no tree-shaking, no
  `@theme static` reasoning for consumers.
- `@theme inline` makes `bg-primary` emit `background-color: var(--primary)`,
  so overrides apply at any selector scope, including per-region themes.
- Dark mode keeps the existing unlayered, order-wins mechanics.
- Unchanged: the duration/z-index/opacity/shadow `@utility` shims,
  `scales.css`, `shadows.css`, breakpoints.

### 5.3 Interactive states — derived, not authored (§9.4)

Ramps previously gave structurally safe hover/active states by shade
selection. With one value per role, states derive at runtime through
`color-mix` behind `@utility` shims, using a mode-aware mix pole:

```css
:root {
  --mix-pole: #000;  /* light mode darkens toward black */
}
.dark {
  --mix-pole: #fff;  /* dark mode lightens toward white */
}

@utility bg-primary-hover {
  background-color: color-mix(in oklab, var(--primary) 85%, var(--mix-pole));
}
@utility bg-primary-active {
  background-color: color-mix(in oklab, var(--primary) 75%, var(--mix-pole));
}
/* ...same family per interactive role, per channel (bg/text/border) */
```

Variant files stay literal (`hover:bg-primary-hover` is a complete,
discoverable class), and a consumer who overrides `--primary` gets
consistent state ramps in both modes without authoring anything. The shim
family is hand-authored, bounded (channels × interactive roles × states),
and lives in `theme/utilities.css`. Mix percentages are the spike's to
verify against AA margins (§10.2); `--mix-pole` is a working name.

### 5.4 Component interface changes

- The `color` prop is removed from Button, Badge, Icon, Spinner, Text,
  Toggle, Divider, Header, Card, Pagination, and Alert. No replacement prop
  except where the distinction is semantic:
  - **Button**: `variant` — default (primary), outline, ghost, link,
    destructive.
  - **Alert**: `severity` — success, warning, destructive, info, mapped to
    status tokens.
  - Everything else styles from role tokens; a custom-colored anything is a
    consumer `className`.
- Focus rings use `--ring` directly.
- Variant mappings for the de-branded slots (a "secondary button" today)
  are an implementation-time decision recorded in the ADR (§10.4):
  candidates are a muted-surface variant or removal.

### 5.5 Removals and archives

Cooking is archived, not deleted from history:
[archive/color-cooking.md](../archive/color-cooking.md) records the
mechanism, the implementation map, and the retirement rationale. Removed
with it, along with their JS and CSS footprint:

- `colorRecipes.ts` + tests; recipe tables in all variant files
- `tokens/src/palette.ts` registry and the `PaletteColor` type;
  `@basic-ui/tokens` becomes a CSS-only package (no `.` JS export) unless
  §9.7 keeps an entry point
- `generate-palette-static.ts`, `palette-static.css`, its export and
  staging (~250 vendored color variables leave every consumer's CSS)
- recipe entries in `layout-utilities.generated.css` (regenerate) and
  recipe assertions in `responsive-utilities.css.test.ts` and
  `verify-package/styles.ts`
- brand ramps in `theme/palette.css`

## 6. Alternatives considered

- **A. Keep cooking as-is.** Rejected (§9.1): keeps the registry/codegen/
  safelist surface, the five consumer pitfalls, and the neutral aliasing
  problem.
- **B. Tokens internally, export `cr()` as an opt-in helper.** Rejected
  (§9.1): preserves a dual color model in the docs indefinitely, and
  `cr()` drags `palette-static.css` along for a hypothetical consumer.
  Re-addable later as a separate package if demand is demonstrated.
- **C. Full retirement with archive.** Accepted (§9.1).
- **Do nothing.** Rejected: the current state is a half-finished
  simplification — worst of both worlds (§2.2 evidence).

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Flat tokens lose ramp-safe hover/dark states | Derived-state shims with the mode-aware mix pole (§5.3); spike verifies AA margins and fallback is explicit state tokens |
| AA contrast becomes consumer responsibility when overriding pairs | Ship default pairs that pass; document the pair constraint and contrast guidance; no runtime checker |
| Perceived as a shadcn copy | Vocabulary scoped by our own audit, not theirs: single brand color (they keep three), no card/popover duplication (surface/overlay by elevation), no sidebar/chart tokens, our own state-derivation mechanism (color-mix shims) which they do not have; §9.6 confirms the vocabulary |
| Public TS surface shrinks (`color` props gone) | Fresh-slate window is open precisely because there are no consumers; changeset marks it breaking |
| Docs rewrite cost (guides in flight) | Sequence: revise `implementation-notes.md` first, then one prose pass |
| `color-mix` in shims misbehaves in some build or browser matrix | Spike gate (§10.2) covers compilation; `color-mix` is baseline since 2023 across evergreen targets |

## 8. Impact

Breaking changes: component props (10 components), token names and CSS
shape (palette/semantic removal), the `@basic-ui/tokens` JS export (§9.7),
and the `palette-static.css` export. Touches: all 11 variant files from the
semantic audit, their tests and stories, `verify-package`, the responsive
fixture, the complete `.docs/theme/*` set, and a new ADR superseding the
color-recipes record. Net: ~700+ lines of styling machinery deleted
against ~100 lines of token CSS and shims added; the tokens package drops
its JavaScript entirely.

## 9. Decision log (2026-10-22)

1. **Cooking: full retirement with an archive record** (option C, §5.5).
   Dependencies go with it; JS and CSS bundle sizes shrink.
2. **Brand layer: a single brand color** (`primary`), shadcn-style in
   mechanism, ours in scope. `secondary`/`accent` ramps and their recipes
   die; variant mappings for de-branded slots decided at implementation
   (§5.4).
3. **Role props only where semantically real** — severity on Alert,
   variant on Button — not on everything that once had a `color` prop.
   The className escape hatch is the universal answer.
4. **Status set: confirmed** — `success`, `warning`, `destructive`,
   `info`, each with a foreground partner (§5.1).
5. **State derivation via `@utility` confirmed** (§5.3): expands the
   consumer-override model — one token override yields both-mode ramps.
6. **Naming: open.** Constraints agreed: scoped to audited need, not a
   wholesale adoption of any ecosystem's table, and recognizably ours.
   The §5.1 vocabulary is the working proposal (surface/overlay by
   elevation; single brand color). Counter-proposals welcome.
7. **`@basic-ui/tokens` JS export removal** — recommendation: yes, the
   package becomes CSS-only; confirm during implementation.

## 10. Rollout plan

1. **Decision** — resolve §9.6 (naming) and §9.7 (JS export).
2. **Spike** (half day, branch): `@theme inline` bridge, `.dark`, scoped
   override, twMerge conflict, color-mix shims with `--mix-pole`, AA
   margins on default pairs; compile assertions extended in
   `theme.test.ts`.
3. **Execute** (one breaking epic): tokens → 11 variant files → removals
   (§5.5) → `verify-package`/fixture updates → regenerate safelist →
   archive record finalized with measured bundle deltas.
4. **Document**: ADR-0002 superseding the color-recipes record; revise
   `implementation-notes.md`; single prose pass over `.docs/theme/*`;
   changeset.
5. **Acceptance**: default pairs pass AA in both modes; every component
   renders from tokens with zero `cr()` references; `pnpm generate` for
   palette is gone; the tokens package ships no JavaScript; the token
   count in the reference equals the audited, consumed set; the shim
   family is bounded and literal; compile-contract tests green.

## 11. References

- Archived cooking record: [archive/color-cooking.md](../archive/color-cooking.md)
- Standing record for cooking (historical):
  [ideas/tailwind-color-recipes.md](../ideas/tailwind-color-recipes.md)
- shadcn/ui theming (token table, `@theme inline` convention): ui.shadcn.com/docs/theming
- Cascade rules verification: `packages/tokens/src/theme.test.ts`
- The research record that preceded this RFC (probe evidence, ecosystem
  survey) was deleted at RFC acceptance; §2.2 and §2.3 carry its
  findings, and the git history of the ideas directory retains the text.
