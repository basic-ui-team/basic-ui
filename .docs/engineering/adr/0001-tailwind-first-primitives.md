# ADR-0001: Tailwind-first primitives — className styling, a component-derived safelist, and token-owned values

- **Status:** Accepted
- **Date:** 2026-10-21
- **Supersedes:** the primitives-and-structurals epic plan (scraped)

## Context

The primitives (`Box`, `Flex`, `Grid`) were styled through a layout-props
engine: `ResponsiveValue` props resolved at runtime into Tailwind utility
classes, a hand-authored safelist registered those classes for consumer
builds, and a custom 9-point geometric spacing scale (`--spacing-0..9`,
base 4px, ratio √2) backed the values.

Three problems surfaced together:

1. **The props duplicated Tailwind's own API.** `<Box p={2}>` was a 1:1
   shadow of `className="p-2"`, in a parallel vocabulary the library had
   to keep in sync (a ~267-line cva table encoding the same vocabulary
   the safelist also encoded).
2. **The zero-config promise was silently broken.** Tailwind never scans
   `node_modules`, so a real consumer's build generated no CSS for
   classes the components authored as literals. Measured in a real Vite
   consumer build of the published package: `focus-visible:ring-2`,
   `animate-spin`, `opacity-65`, `z-modal`, `duration-slow`,
   `cursor-not-allowed`, and `ring-offset-bg-base` were all **absent**.
   Storybook masked the gap because it consumes the library from
   workspace source, which Tailwind scans.
3. **The custom spacing scale fought Tailwind.** Named steps 0–9
   overrode Tailwind's linear scale for those values, while everything
   else (`p-10`, `p-0.5`) fell through to Tailwind's default
   `calc(var(--spacing) * N)` — a second, inconsistent scale hiding
   behind the first, and any widening of the prop API forced the safelist
   to grow accordingly.

## Decision

The library is **Tailwind-first**. Five linked decisions:

1. **Primitives style through `className`.** A component exposes a style
   prop only when it buys something a class cannot: a mix, a state, a
   default, or a semantic. `Box` is a pure polymorphic shell; `Flex`
   keeps direction/justify/align/wrap/display; `Grid` keeps
   tracks/presets/auto-placement/alignment. Spacing, sizing, position,
   display, gap, and overflow are authored as Tailwind utilities.
2. **The shipped stylesheet self-registers.** `@source "./"` inside
   `@basic-ui/core/styles.css` makes every consumer Tailwind build scan
   the package's own dist, so component-authored literals are discovered
   with zero consumer configuration. `@source` paths resolve relative to
   the declaring stylesheet, so only the package can make this
   registration.
3. **The safelist covers only runtime-constructed classes, derived from
   the same cva tables and geometry maps the components render with.**
   One source of truth per family; the safelist cannot drift from the
   components because it is computed from them.
4. **Tailwind's linear spacing is the spacing system.** The 9-point
   scale is removed; the tokens theme emits Tailwind's own default base
   (`--spacing: 0.25rem`), so every bare numeric utility — fractionals
   included — resolves through `calc(var(--spacing) * N)`.
5. **Tokens owns all values and emission policy; core owns directives
   and components.** The palette registry and the `@theme static`
   emission live in `@basic-ui/tokens`; core ships only `@source`
   directives, recipes, and components.

## Considered alternatives

### A. Keep the layout props, close the value types

Make `SpacingStep` a finite union so "everything that type-checks
renders." This keeps the ergonomic `p={{ base: 2, md: 4 }}` API.

- Rejected: the props still shadow Tailwind, the community has moved on
  (Chakra v3 removed style props; the shadcn/copy-source ecosystem is
  className-only), and every value the union admits must be safelisted —
  the API surface defines the CSS cost forever. Usage evidence: of 211
  layout-prop usages in the codebase, exactly **one** was in production
  component code (Divider's inset — a mix that belonged in its variant
  table anyway); the rest were tests and stories exercising the API
  itself.

### B. The scan-me consumer model (NextUI/Tremor)

Document one config line —
`@source "../node_modules/@basic-ui/core/dist"` — and let cva literals
be discovered by scanning the package.

- Rejected as *the model*: it surrenders zero-config for a one-line
  gain, and still needs the safelist for runtime-constructed responsive
  forms. The winning move was realizing `@source` resolves relative to
  the declaring stylesheet: the package can ship the scan of itself
  (decision 2), getting this alternative's benefit with no consumer
  action.

### C. An own-CSS system (Radix Themes / DaisyUI model)

Ship compiled component classes (`rt-*`-style) and sidestep utility
discovery entirely; ~same stylesheet size (Radix Themes is in the same
tens-of-KB-gzip class as our result).

- Rejected: it abandons the Tailwind substrate — utility merging,
  `className` as the extension path, consumers' existing tooling and
  Intellisense — and is a full rewrite of the styling layer rather than
  a correction.

### D. Keep the geometric spacing scale in tokens

Preserve the designed 4/6/8/11/16/23/32/45/64px ramp as the system's
spacing identity.

- Rejected: half of every value already resolved through Tailwind's
  linear fallback (the `p-9` = 64px vs `p-10` = 40px seam), so the scale
  was not one system but two indistinguishable ones. Adopting Tailwind's
  scale removes the seam and the machinery at once.

## Evidence

All figures were measured during the decision process, in this
repository:

| Measurement | Before | After |
| --- | --- | --- |
| Safelisted utilities (runtime-constructed) | 764 | **170** |
| Safelist-only compiled CSS | 490.1 KB raw / 45.5 KB gzip | **127.3 KB raw / 16.2 KB gzip** |
| Generated safelist file | 272 lines | **4 lines / 2.9 KB** |
| Consumer build, component-authored classes (`ring-2`, `animate-spin`, `z-modal`) | absent | **present** |

Key experiments behind the numbers:

- **Consumer-build A/B:** the same Vite consumer app, importing the
  published dist and stylesheet, with and without dist scanning — the
  only difference being one `@source` directive. Without it, the
  focus ring, spinner animation, and dialog elevation generate no CSS;
  with it, they generate, at ~+27 KB raw.
- **The safelist-before/after:** the hand-authored generic-family
  safelist compiled to 45.5 KB gzip while *failing to include* the
  ~110 component-authored classes outside its families (Button's states,
  Dialog's overlay, Badge's positioning, Spinner's animation). The
  component-derived safelist is 16.2 KB gzip and covers both
  responsibilities: scan-discovered literals plus 170
  runtime-constructed utilities at every breakpoint.
- **Community signal:** Chakra v3 (2024) removed style props; shadcn,
  Catalyst, and Park UI are className/copy-source; Radix Themes,
  Mantine, DaisyUI, and NextUI expose semantic component props with
  className for layout. The props-on-primitives model is the previous
  generation, and its defining library abandoned it.

## Consequences

**Positive.** Zero-config consumers are now *actually* correct and
permanently regression-tested (`verify-package` asserts component
classes and the responsive vocabulary in a real consumer build of the
packed tarball). The vocabulary cannot drift from the components because
it is computed from them. Styling docs reduce to "write Tailwind." The
library's value proposition is coherent: styled components plus headless
hooks, Tailwind underneath.

**Accepted costs.** Every spacing value shifted (linear scale: `p-4` is
now 16px, was 11px geometric) — variant tables need a deliberate tuning
pass. Scanning the dist discovers every authored literal including
variants a consumer never renders (bounded by the closed variant
tables). The typed responsive-object syntax exists only on earned props;
in `className`, users write Tailwind's `md:p-4` prefixes.

**Guards.** The safelist coverage tests bind families to their component
sources and pin spacing/sizing utilities *out* of the safelist;
`check:layout-utilities` and the generated-file freshness test pin the
generated artifact; `verify-package` phase 5 asserts the consumer path
end-to-end; the tokens generation fail-fast checks pin the palette
registry to the installed Tailwind theme.
