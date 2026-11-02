# ADR-0002: Semantic pair tokens replace color cooking

| | |
|---|---|
| **Status** | Accepted 2026-10-22 |
| **Decision record** | [RFC-0001](../rfc/0001-semantic-color-tokens.md) — this ADR records the implementation decisions taken during execution |
| **Supersedes** | The color recipe system ([archived](../archive/color-cooking.md)) |

## Context

RFC-0001 was accepted on its five open questions (§9): full cooking
retirement with an archive, a single brand color, role props only where
semantically real, the full status set, and derived states via `@utility`
color-mix shims. Execution resolved the remaining implementation-time
decisions.

## Decisions

1. **Token shape.** Consumer-owned variables in plain `:root, :host` /
   `.dark` blocks, bridged by `@theme inline` — no `@theme static` for
   colors at all. Plain CSS always emits; inline utilities resolve the
   consumer variable at the element, so any scope can re-own a token.
2. **Naming.** `background`, `surface`, `overlay`, `muted`, `primary`,
   `border`, `ring`, `input`, and status pairs (`success`, `warning`,
   `destructive`, `info`, each with `-foreground` partners). Elevation
   scoped by audit (surface/overlay), no card/popover duplication, single
   brand color.
3. **Derived states.** `--mix-pole` (black in light, white in dark) +
   hand-authored `@utility` shims (`bg-primary-hover` =
   `color-mix(in oklab, var(--primary) 85%, var(--mix-pole))`, and
   bounded siblings). Tailwind wraps color-mix in `@supports` with the
   plain token fallback — free progressive enhancement. The tokens
   contract test verifies the foreground pair still clears AA on the
   mixed hover/active surfaces in both modes.
4. **Alert severity.** `error` renamed to `destructive` for token parity.
   `filled` uses the status pair; `outline`/`subtle` express status via
   border/tint while body text stays `foreground` — AA in both modes
   regardless of status color. Icons carry the status color except in
   `filled`, where they inherit the pair foreground.
5. **De-branded slots.** The former "secondary" emphasis level is not a
   Button variant; `outline`/`ghost` (muted-surface hover) cover the
   tier, and `className` is the answer for anything more. Toggle's
   checked state maps to `primary`; Badge is `primary`-styled with no
   color prop.
6. **Disabled styling.** The library's documented stance — disabled
   elements do not block pointer events (anchors with `aria-disabled`
   keep hover/toolips) — is preserved; no `pointer-events-none`.
7. **`@basic-ui/tokens` is a CSS-only package.** No JavaScript export, no
   codegen, no build step beyond copying. `package.json` exports
   `./theme.css` only.
8. **Safelist.** Component-authored semantic classes are literals, found
   by real builds through `@source "./"` scanning; the layout-utilities
   generator additionally carries them as fixed candidates for
   zero-scan builds and the responsive fixture. Drift is guarded by
   `pnpm check:layout-utilities`; the lib-level mirror tests were removed
   as redundant with that check.
9. **AA defaults.** The shipped pairs clear 4.5:1 in both modes
   (contract-tested with OKLab math), including on derived hover/active
   surfaces; ring clears 3:1 against the page. Notably the previous
   `fg-muted` (neutral-700 on white, ≈3.5:1) failed AA — this change
   fixes a real accessibility bug. `--warning` was darkened to
   `oklch(0.66 0.15 70)` so borders/icons clear the 3:1 non-text
   threshold in light mode.

## Consequences

- `color` props are gone from ten components; Button gains
  `destructive`, and `solid` is renamed `default`. Custom-colored
  components are consumer `className` (twMerge conflict resolution is
  contract-tested in `cn.test.ts`).
- Consumer CSS sheds the ~250-variable vendored palette; the tokens
  package ships no JS (bundle: 9.98 kB → 0).
- The guides and `implementation-notes.md` are revised to the pair-token
  override model (one block, plain CSS, any scope).
