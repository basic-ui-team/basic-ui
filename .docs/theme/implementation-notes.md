# Theme docs — implementation notes for prose agent

Source of truth for everything below: `packages/tokens/src/theme.css` and its
parts, `packages/core/src/styles.css`, and compile-level tests
(`packages/tokens/src/theme.test.ts`, `packages/core/scripts/responsive-utilities.css.test.ts`).
Cascade claims marked [verified] were proven against Tailwind v4.3.0 through
the real compiler, not inferred. Do not soften or reinterpret these facts.

Audience for final prose: app developers using `@basic-ui/core` with their own
Tailwind CSS v4 setup. Tone: practical, short sections, working code blocks.

---

## Global architecture facts (apply to every doc)

- The theme is authored as CSS against Tailwind v4's `@theme` namespaces.
  There is NO JavaScript theme API. The only JS export is the palette
  registry (`PALETTE_FAMILIES`, `TAILWIND_PALETTE_FAMILIES`,
  `BRAND_PALETTE_FAMILIES`, `PaletteColor`) which most consumers never touch.
- What consumers import:
  - `@basic-ui/core/styles.css` — the one-import path. Pulls in the token
    theme, the vendored Tailwind palette, the component class safelist, and a
    `@source "./"` self-registration that makes every class basic-ui
    components author discoverable to the consumer's Tailwind build with
    zero configuration.
  - `@basic-ui/tokens/theme.css` and `@basic-ui/tokens/palette-static.css` —
    for consumers not using core components.
- Tailwind compiles our stylesheet in the CONSUMER's build. Utilities are
  generated there, not by us. Our stylesheets must be processed by a Tailwind
  v4 integration; a plain CSS bundler import will not produce utilities.
- Token layers, from raw to consumed:

  ```
  palette (raw scales)      --color-primary-500, --color-neutral-50, ...
        ↑ var() indirection
  semantic (roles)          --color-bg-base, --color-fg-muted, ...
        ↑ used by
  components (variants + color cooking)
  ```

  Because semantic tokens reference palette tokens with `var()`, overriding a
  palette shade re-themes everything that uses it — in light AND dark mode —
  with no rebuild and no JavaScript. [verified]
- Emission rules:
  - Everything the design system authors is `@theme static`: always emitted,
    regardless of utility usage. This is deliberate: color cooking and app
    CSS reference variables at runtime, invisible to the build scanner.
  - Tailwind tree-shakes unreferenced variables from plain (non-static)
    `@theme` blocks. This is the single most common surprise for consumers.
- Cascade mechanics — the load-bearing rules [all verified]:
  1. Authored theme values land in `@layer theme` on `:root`.
  2. The theme's `.dark` block is UNLAYERED and positioned with the theme.
  3. A consumer `@theme { ... }` block (after the import) also lands in the
     theme layer and wins by source order → light values change, dark values
     keep working. This is the correct form for overriding existing tokens.
  4. A consumer plain `:root { ... }` block is unlayered and comes after the
     theme → it beats BOTH the theme layer AND the `.dark` block. Overriding
     SEMANTIC tokens this way silently breaks dark mode for those tokens.
     Never show this form for semantic tokens.
  5. Overriding PALETTE tokens in plain `:root` IS safe: the `.dark` block
     re-points semantic tokens to palette tokens, resolved dynamically.
  6. A consumer `.dark { ... }` rule after the import has equal specificity
     with the authored one and wins by source order → the correct form for
     dark-mode customization.
- Namespaces where names need shims (we ship them for our tokens):
  `duration-*`, `z-*`, `opacity-*` accept bare numbers only in Tailwind v4,
  and `shadow-*` utilities inline theme values. Our theme provides
  `@utility` shims for `duration-fast|normal|slow`, `z-base..z-tooltip`,
  `opacity-base|muted|disabled|hover|overlay`, and `shadow-s1..s5`.
  Consumers adding NEW names in these families must either write their own
  `@utility` or use arbitrary-value syntax:
  `z-(--z-index-header)`, `duration-(--duration-toast)`, `bg-(--shadow-glow)`.
- Color cooking: component `color` props (`Button`, `Icon`, `Spinner`,
  `Toggle`, ...) accept any palette family and construct
  `var(--color-<family>-<shade>)` at runtime, including per-state shades and
  dark-mode alternates. Cookable families: the 22 standard Tailwind families
  (vendored, version-synced with the installed Tailwind) plus the authored
  brand ramps `primary`, `secondary`, `accent`.
- `neutral` is vendored from the installed Tailwind theme (pure grays in
  Tailwind v4.3). The semantic layer points at it, so overriding neutral
  shades re-tints every gray surface, border, and text in both modes.
- Peer dependencies of `@basic-ui/core`: `react >=18`, `react-dom >=18`,
  `tailwindcss >=4`. npm 7+ and pnpm 8+ auto-install peers, so
  `npm install @basic-ui/core` is sufficient there; Yarn requires listing
  peers explicitly. Do NOT suggest bundling these into core — React must be a
  single copy per app, and the Tailwind compiler must be the app's own.

---

## Per-doc notes

### getting-started.md (exists — needs the corrections below)

- Keep the current flow: prerequisites → install → load stylesheet → first
  change → dark mode → check the result.
- Install section: simplify to the one-liners with the auto-install note:

  ```bash
  npm install @basic-ui/core    # npm 7+ auto-installs peer deps
  pnpm add @basic-ui/core       # pnpm 8+ auto-installs peer deps
  yarn add @basic-ui/core react react-dom tailwindcss
  ```

  Keep the sentence that `@basic-ui/tokens` never needs a separate install
  when using core.
- "Make a first override" → retitle to something like "Make a first change"
  and cover BOTH override and addition in one block:

  ```css
  @import "@basic-ui/core/styles.css";

  @theme {
    /* override existing semantic tokens */
    --color-bg-base: #f7f8fa;
    --color-fg-base: #182230;
    --color-border-base: #d7dce2;

    /* add a new color: bg-brand-surface, text-brand-surface, ... exist now */
    --color-brand-surface: #eef2ff;
  }
  ```

  Required sentence, whatever the prose: overrides of existing tokens go in
  `@theme` AFTER the import (order matters); a plain `:root` block must NOT
  be used for semantic tokens because it defeats the dark-mode overrides.
- Add the dark-mode troubleshooting line to "Check the result": if light
  overrides show up but dark mode looks wrong, the overrides were probably
  written in a plain `:root` block — move them to `@theme`.

### index.md (overview page — exists, mostly fine)

- Keep the two-bucket framing (palette vs semantic) and the "no JavaScript
  theme setup" promise. Add one sentence: overrides are plain CSS custom
  property declarations, processed by the app's own Tailwind v4 build.
- Link list: getting-started, concepts, customizing, dark-mode, recipes,
  token reference.

### concepts.md (TODO stub)

Sections planned in the stub, with the facts for each:

- Theme layers: palette ← semantic ← components (diagram above). Key point:
  semantic tokens are references, not copies — palette overrides cascade
  through them at runtime. [verified]
- Palette tokens: authored brand ramps (`primary`, `secondary`, `accent`,
  each 50–950) plus white/black live in the theme; the 22 standard Tailwind
  families including `neutral` are vendored from the installed Tailwind and
  regenerated on `pnpm generate` (version-synced). Explain static emission:
  cooking references any family/shade at runtime, so the palette must exist
  in emitted CSS regardless of utility usage.
- Semantic tokens: roles bg/fg/surface/border with states
  base/muted/hover/active/disabled/inverted (+ fg.skeleton). Components
  consume ONLY semantic tokens (plus cooking channels), never raw palette
  shades directly.
- Component color recipes: `color` props accept a palette family; the recipe
  derives base/hover/active/focus/dark shades as custom properties
  (`--cr-*`) consumed by fixed utility classes. CSS output stays bounded by
  the recipe classes, never by palette size. This is why runtime
  string-constructed classes are unnecessary.
- Tailwind CSS v4 relationship: `@theme` namespaces generate utilities that
  resolve `var(...)` at runtime (color, radius, text, leading, tracking,
  font, ease) — that is what keeps every token overridable. Two exceptions
  and their consequences: bare-number-only namespaces (duration/z/opacity)
  and value-inlining (shadow) — both handled by our `@utility` shims, which
  is why `duration-slow` and dark-mode shadows work.
- State the emission rule plainly: plain `@theme` vars are tree-shaken when
  no utility references them; `@theme static` always emits. Consumers only
  need `@theme static` when adding NEW tokens that something references
  outside utilities (`var(...)` in plain CSS, cooking-style lookups).

### customizing.md (TODO stub)

- Choose what to customize, as a decision table:

  | Want | Override | Where |
  |---|---|---|
  | New brand colors everywhere (incl. component `color` props) | `--color-primary-*` etc. | `@theme static` (full 11-step ramp) |
  | Different grays/tint across the app | `--color-neutral-*` | any block form; re-tints all semantic grays both modes |
  | Change surfaces/text/borders without touching ramps | semantic tokens | `@theme` (light) + `.dark` (dark) |
  | A one-off color | new `--color-*` | `@theme` (utilities only) or `@theme static` (also referenced as `var()`) |

- Override palette values — complete brand ramp example (recommend
  `@theme static` because cooking references every shade at runtime):

  ```css
  @import "@basic-ui/core/styles.css";

  @theme static {
    --color-primary-50:  oklch(0.97 0.02 250);
    --color-primary-100: oklch(0.94 0.04 250);
    --color-primary-200: oklch(0.89 0.08 250);
    --color-primary-300: oklch(0.83 0.12 250);
    --color-primary-400: oklch(0.75 0.16 250);
    --color-primary-500: oklch(0.66 0.19 250);
    --color-primary-600: oklch(0.55 0.17 250);
    --color-primary-700: oklch(0.45 0.13 250);
    --color-primary-800: oklch(0.37 0.09 250);
    --color-primary-900: oklch(0.31 0.06 250);
    --color-primary-950: oklch(0.21 0.04 250);
  }
  ```

  Partial overrides are fine (unoverridden shades keep ours), but never
  present it as required to override all 11.
- Override semantic roles — light in `@theme`, dark in `.dark`:

  ```css
  @theme { --color-surface-base: #f0f4f8; }
  .dark { --color-surface-base: #10161d; }
  ```

- Scope a theme: custom property declarations are ordinary CSS — put them
  under any selector to theme a region, and utilities follow because they
  resolve `var(...)` at each element:

  ```css
  .theme-marketing {
    --color-bg-base: #fff8f0;
    --color-fg-base: #43281c;
  }
  ```

  Caveat to state: `@theme` blocks are global (`:root`); scoped theming uses
  plain selector blocks, which is another reason the plain-`:root`-for-
  semantic rule needs the dark-mode warning at page level.
- Common pitfalls (each must appear):
  1. Overrides placed BEFORE the `@import` lose to the authored values
     (same layer, source order). Always after.
  2. Plain `:root` semantic overrides defeat `.dark`. Use `@theme` /
     `.dark`.
  3. New tokens referenced only as `var(...)` in plain CSS vanish unless
     declared `@theme static` (tree-shaking).
  4. Classes built by runtime string construction never generate utilities —
     author complete literal class names, or use arbitrary-value syntax
     like `bg-(--color-brand-surface)`.
  5. Importing the stylesheet through a non-Tailwind pipeline yields no
     utilities; tokens exist but classes don't.

### dark-mode.md (TODO stub)

- Activate: put `class="dark"` on `<html>` or ANY ancestor of the components
  (the variant is `&:where(.dark, .dark *)`; the theme ships the
  class-based `@custom-variant dark` — no OS-preference following).
- Toggle integration: flipping the class is the entire mechanism — any
  React state, `data-theme` attribute wiring, or persistence is app
  territory. Theme switch pattern: store a string, apply
  `classList.toggle("dark", isDark)` on the root element. Storybook uses
  `@storybook/addon-themes` `withThemeByClassName` the same way.
- Override semantics for dark: a consumer `.dark` block after the import
  wins by source order [verified]. Only semantic tokens and shadows need
  dark values; palette ramps are mode-agnostic and cooking picks darker
  shades per mode on its own.
- Shadows: light-mode shadows are black-based; the `.dark` block switches
  them to white-based (light-tinted elevation). Overridable the same way
  (`--shadow-s1` ... `--shadow-s5` are plain custom properties).
- Accessibility checklist for the section: verify fg/bg pairs in BOTH modes
  (base text, muted text, disabled text), hover/active states on interactive
  components, focus-visible rings (they come from color cooking — check
  `Button` variants), skeleton contrast, and that borders remain visible on
  dark surfaces.

### recipes/brand-colors.md (TODO stub)

- Goal: replace the three brand ramps so every component, including `color`
  prop usage (`<Button color="primary">`), follows.
- Steps: import core stylesheet → override ramps in `@theme static` (full
  ramp example; see customizing notes) → optionally add `.dark` tweak? Not
  needed: ramps are mode-agnostic; cooking selects darker shades in dark
  mode automatically.
- Validation list: Button in all four variants (solid/ghost/outline/link)
  with `color="primary"` in both modes; focus rings; Toggle/Spinner/Icon with
  brand colors; direct utilities `bg-primary-600`, `text-accent-500`.

### recipes/semantic-colors.md (TODO stub)

- When semantic beats palette: re-skinning the "feel" (page background,
  card surfaces, borders) without disturbing brand ramps or cooking.
- Example: light in `@theme`, dark in `.dark`, same token set (surface-base
  + fg-muted + border-base shown in both modes).
- Validation: Card sections, Dialog/Tooltip surfaces, Divider borders,
  Skeleton, disabled and hover states in both modes.

### reference/tokens.md (TODO stub)

- Stylesheet exports table:

  | Import | Purpose |
  |---|---|
  | `@basic-ui/core/styles.css` | everything: theme + palette + component classes + source self-registration |
  | `@basic-ui/tokens/theme.css` | the authored theme only (brand ramps, semantic, scales, dark, shims) |
  | `@basic-ui/tokens/palette-static.css` | vendored standard Tailwind families, static for cooking |

- Palette tokens: white, black; `primary`/`secondary`/`accent` 50–950
  (authored); 22 standard Tailwind families 50–950 (vendored, includes
  `neutral`). All statically emitted. Utility form: `bg-<family>-<shade>`,
  plus `/opacity` modifiers via color-mix.
- Semantic color tokens (with utility stems):
  - `--color-bg-*`: base, muted, hover, active, disabled, inverted → `bg-bg-*`
  - `--color-fg-*`: base, muted, hover, active, disabled, inverted, skeleton → `text-fg-*`
  - `--color-surface-*`: base, hover, active, disabled, inverted → `bg-surface-*`
  - `--color-border-*`: base, muted, hover, active, disabled, inverted → `border-border-*`
  Note for prose: the doubled stem (`bg-bg-base`) is correct — first `bg` is
  the utility, second is the token family.
- Other tokens (utility mapping):
  - radius: none/sm/md/lg/xl/2xl/full → `rounded-*`
  - text: xs/sm/md/lg/xl/2xl/3xl/4xl/5xl → `text-*`
  - font-weight: normal/medium/semibold/bold → `font-*`
  - leading: tight/snug/normal/relaxed/loose → `leading-*`
  - tracking: tight/normal/wide → `tracking-*`
  - font: sans/heading/mono → `font-*`
  - duration: fast/normal/slow → `duration-*` (shim)
  - ease: in/out/spring → `ease-*`
  - z-index: base/elevated/docked/dropdown/sticky/banner/overlay/modal/popover/toast/tooltip → `z-*` (shim)
  - opacity: base/muted/disabled/hover/overlay → `opacity-*` (shim)
  - shadows: s1–s5 → `shadow-s*` (shim; values are plain custom properties)
  - spacing: `--spacing: 0.25rem` base multiplier (`p-2` = `calc(var(--spacing) * 2)`)
  - breakpoints: sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536 (compile-time)
- State the default light/dark semantic mappings? Optional; the theme's
  default is: light semantic → white/near-black over neutral grays; dark
  semantic → inverted neutrals with white-based shadows. Keep this summary,
  not a full table.

---

## Things NOT to claim (common traps)

- Do not show plain `:root` blocks overriding semantic tokens anywhere.
- Do not claim runtime class construction works; it never generates utilities.
- Do not imply `@theme` blocks can be scoped to a selector (they are global).
- Do not suggest installing or bundling `react`/`react-dom`/`tailwindcss`
  inside the library; they are peers by design.
- Do not reference a JavaScript theme API, `createTheme`, `mergeTheme`,
  theme presets, or `tokens.ts` — all removed; the CSS is the API.
- Do not document `--color-brand-*` families beyond the three slots;
  cooking only accepts registered families.
