# Semantic color tokens — research RFC

Status
------
Proposed — research record for the decision on distilling the color layer to
shadcn-style semantic tokens. Positions against
[tailwind-color-recipes.md](./tailwind-color-recipes.md) (the standing record
for cooking) and supersedes the neutral-vendoring discussion.

Summary
-------
Drop the brand palette ramps and color cooking as the library's internal
styling mechanism. Components style from a small set of semantic tokens —
surface/foreground pairs — owned by the consumer as plain CSS custom
properties and bridged into Tailwind with `@theme inline`, the shadcn/ui v4
model. The className escape hatch (already verified: `cn` is clsx +
twMerge, so consumer classes win conflicts) covers everything the tokens
don't. The library's styling sits at the surface; Tailwind stays in reach.

Historical context — why this is not the same decision twice
------------------------------------------------------------
The library already moved semantic → cooking once. The color-recipes RFC
explicitly retired engine-owned semantic states ("a severity is a curated
recipe over a palette family, not a token-styled state"). That move was
correct for the world it lived in:

| Why the old semantic layer failed | What's different now |
|---|---|
| Tokens lived in the JS merge pipeline (`createTheme`, flattened literals, `ThemeConfig` shapes) | Tokens are plain CSS; the JS layer is deleted |
| States were authored to fill a config type, not component need (variants use 10 of 25 defined) | The usage audit exists; the new set starts from consumed roles |
| No reliable escape hatch — a consumer class conflicted with ours by CSS source order | `cn` is verified clsx + twMerge: consumer classes win |
| Semantic values were aliases into `neutral`, so vendor drift rippled everywhere (the current neutral pain) | The new tokens own literal values in `:root`/`.dark`; vendored neutral dies with the palette |
| Severities as cooked recipes (green/red/amber/sky) | Status pairs as first-class tokens — the one place cooking had no token-shaped answer |

The shadcn model, verified from current docs
---------------------------------------------
shadcn ships exactly this shape with Tailwind v4:

- Consumer-owned vars in plain `:root` / `.dark` blocks — ordinary CSS,
  always emitted (no tree-shaking, no `@theme static` needed for them).
- A bridge block: `@theme inline { --color-primary: var(--primary); }` —
  utilities resolve the consumer var directly (`bg-primary` emits
  `background-color: var(--primary)`), so overrides work at ANY scope,
  including per-region themes.
- Pair convention: every surface token has a `-foreground` partner
  (`primary` / `primary-foreground`); background suffix omitted on the
  surface side.
- Token set: background, card, popover, primary, secondary, muted, accent
  (each + foreground), destructive, border, input, ring, chart-1..5,
  sidebar family, single `--radius` with a derived calc scale.
- Dark mode: same var names re-declared under `.dark`. Identical mechanics
  to our current `dark.css` (unlayered, order-wins — already probe-verified
  in our cascade rules).

Their distribution model differs from ours in one decisive way: shadcn
ships source code into the consumer's repo, so their escape hatch is "edit
the file." Ours cannot be. Ours is className + twMerge — which we have,
verified. That difference, not taste, is why their components have no
`color` prop at all.

Proposed token set (the "6 colors" plus what components actually consume)
-------------------------------------------------------------------------
Core brand pairs (the user's 6):

| Token pair | Replaces | Used by |
|---|---|---|
| `--primary` / `--primary-foreground` | primary ramp + cooking | default Button, active Toggle, brand surfaces |
| `--secondary` / `--secondary-foreground` | secondary ramp + cooking | secondary Button, Badge |
| `--accent` / `--accent-foreground` | accent ramp + cooking | ghost/hover surfaces (shadcn semantics) |

Gray/neutral roles (already semantic in our theme, renamed to the pair
convention, pruned to the audited used set):

| Token | Replaces | Audited consumers |
|---|---|---|
| `--background` / `--foreground` | bg-base / fg-base | page shell, Button, Text, Header, Pagination |
| `--muted` / `--muted-foreground` | bg-muted + fg-muted + surface-base | Dialog, Card, Icon, Text descriptions |
| `--border` | border-base / border-muted | Divider, Card, Spinner |
| `--ring` | cooking's `--cr-*-focus` + ring-offset-bg-base | focus rings everywhere |
| `--input` (optional) | — | Select/native controls (we have few today) |
| `--destructive` + status pairs | Alert's cooked severities | Alert, future validation UI |

Naming is an open decision (background/card vs bg/surface vocabulary);
the mechanism is identical either way.

What dies, what stays
---------------------
Dies (per option below):
- brand ramps in `theme/palette.css` (33 tokens)
- `colorRecipes.ts` + tests (~300 lines) — the `color` prop on 10 components
- `palette-static.css` + `generate-palette-static.ts` + family registries +
  fail-fasts — existed solely for cooking
- the `@source inline` recipe safelist entries in `layout-utilities.generated.css`
- vendored `neutral` — the entire neutral pain, dissolved (roles own values)
- the layout-utilities responsive safelist keeps existing entries only

Stays (verified compatible with the new model):
- `@theme inline` bridge + plain `:root`/`.dark` (same cascade rules we
  probe-verified; `@theme inline` utilities resolve the consumer var, so
  scoped themes work — an upgrade over current `@theme static` indirection)
- the `@utility` shims (duration/z/opacity/shadow) — orthogonal
- the dark block mechanics, scales.css, shadows.css
- our distribution model (compiled package, no source shipping)

Options for cooking
-------------------
A. Keep as-is internally. Rejected: this is the status quo the proposal
   argues against; the neutral pain and the recipe tables in every variant
   file remain.
B. Drop internally, export `cr()` as an opt-in consumer helper. The library
   styles from tokens; consumers who want prop-driven arbitrary-family
   colors can still cook. Open cost: `cr()` needs palette vars to exist
   (its `@theme static` palette); either `palette-static.css` survives as
   an optional import documented alongside `cr()`, or `cr()` works only
   with families the consumer's own theme emits.
C. Full drop. Cleanest; consumers needing a custom-colored button write
   `className="bg-teal-700 hover:bg-teal-600 ..."` (twMerge-verified) or
   define their own token pair.

Recommendation: C, with B as a documented escape if real demand appears.
Every internal use case has a token or className answer; keeping a second
color system for hypothetical demand is the "fighting the natural way"
the library keeps losing to.

What we do NOT adopt from shadcn
--------------------------------
- Sidebar/chart token families (scope creep; add when those features exist).
- Source-code distribution (different product).
- The single `--radius` derived scale: genuinely attractive, but a separate,
  small decision — do not couple it to this one.

Decision points
---------------
1. Cooking: A / B / C (recommend C).
2. Token names: background/card/popover vocabulary vs bg/surface/overlay
   (recommend the shadcn names — consumers coming from that ecosystem get
   zero-translation transfer, and the guides read familiar).
3. Status tokens: destructive only, or success/warning/destructive/info
   pairs from day one (Alert needs an answer; recommend full set — it
   replaces the Alert severity recipes directly).
4. State pruning: the audited 10-of-25 gap says prune; confirm against
   Badge/Alert variant needs before fixing the final list.
5. `--radius` derived scale: separate follow-up.

Blast radius (beyond the earlier semantic-redesign tier list)
-------------------------------------------------------------
- Delete: `colorRecipes.ts` (+test), `palette.ts` registry, 
  `generate-palette-static.ts`, `palette-static.css`, recipe entries in
  variant files across 10 components, recipe assertions in
  `responsive-utilities.css.test.ts` and `verify-package/styles.ts`.
- Rewrite: `theme/palette.css` → deleted or reduced to white/black;
  `theme/semantic.css` → pair tokens in `:root` + `@theme inline` bridge;
  `theme/dark.css` → pair overrides; `theme.test.ts` contract.
- Rewrite ALL theme docs: the guides currently being written assume palette
  ramps, cooking, and the customization decision table. **This decision
  should land before the prose pass on `.docs/theme/*`**, or the docs get
  written twice.
- ADR: this reverses an accepted RFC (color recipes); needs an ADR next to
  0001 and a changeset; it is the largest breaking change of the library
  so far (public `color` props disappear from 10 components).

Sequencing
----------
1. Commit the current theme epic (Phases 0–2) as-is — this decision builds
   on it and should not block it.
2. Decide the five points above.
3. Spike the `@theme inline` bridge in a branch: token pairs + `.dark` +
   scoped override + twMerge conflict resolution, compiled through the real
   Tailwind (extend `theme.test.ts`).
4. Then execute: tokens → components (the 10-variant-file list) → deletions
   → docs rewrite.
