# Responsive CSS: bounded pre-1.0 migration

## Status and purpose

Migration implemented and verified against the acceptance criteria below.
Generation consumes shared capability families, not component recipes. Core
presentation no longer subscribes to viewport state; `useResponsiveProps` is
removed from React utilities, while behavioral `useBreakpoint` remains.

The four scoped delivery phases below are the original plan; implementation
was delivered incrementally in stage commits. The historical collector and
first-pass measurements are retained for comparison. Final component, compiler,
browser, package, and footprint evidence is recorded below; infrastructure tests
alone are not the acceptance proof.

The objective is a simpler library a solo developer can maintain, not a general
styling framework. This document restores the decisions reached during the
responsive architecture discussion and narrows them into executable scopes.

## Throughline

Responsiveness answers the different-user, different-viewport question through
component size and presentation layout. It is not a general solution for changing
styling.

- Size, spacing, dimensions, flow, alignment, and display are eligible.
- Cosmetic variants, colors, severity, semantics, ARIA, interaction, and state
  are scalar. Being visual and finite is not sufficient.
- Preserve the existing responsive object syntax. Do not add responsive arrays,
  range syntax, or container-query props in this migration.
- Use normal mobile-first CSS cascade, not whole-variant replacement. Empty
  strings do not undo earlier declarations.
- Keep literal responsive `className` values as the direct CSS escape hatch.
- Review existing APIs against this contract, rather than assuming their current
  types are authoritative. Badge size should become responsive; responsive
  cosmetic styling should be narrowed.

Every intentional API or default change must be documented and tested within
its owning PR. Do not hide those changes inside the infrastructure refactor.

## Ownership and compounds

Components own their recipes, not every child they accept.

- Button owns its root presentation. There is no built-in loading fallback.
  A supplied loading Icon owns its own size, including responsive size.
- Toggle owns its track and thumb. One public size selects coherent track
  dimensions, thumb dimensions, and checked travel. Do not expose independent
  track/thumb sizes.
- Decide how classes reach child elements case by case. Owned anatomy normally
  shares its parent's size; consumer-provided nodes own their presentation.
  Toggle is not a reason to prescribe a universal descendant-selector or slot
  system. A selector-prefixed utility needs its own CSS coverage.
- A shared prop name does not imply a shared recipe: Button `sm` and Icon `sm`
  need not mean the same thing. Reuse actual utility strings; extract recipes
  only when their styles and semantics genuinely match.

Preserve ordinary CVA compound authoring:

- Scalar by scalar: retain existing recipes unchanged.
- Responsive by scalar: supported. Evaluate the local size/layout recipe for
  each supplied responsive value with the current scalar inputs.
- Responsive by responsive: an explicit design-review exception, not a general
  capability to build now.

For example, the proposed use of a Toggle geometry recipe is:

```ts
getResponsiveClassNames(
  size ?? "md",
  (currentSize) => toggleGeometryVariants({ size: currentSize, checked }),
);
```

Only geometry belongs in that recipe. Do not prefix the entire component recipe,
including unrelated colors, focus styles, or scalar defaults. State selectors
are an option where readable, not a compulsory replacement for compounds.

Independent responsive props are not combinatorial merely because they coexist
or switch at different breakpoints. A dependency exists only where a styling rule
needs both effective values. Overlapping CSS properties require explicit
precedence, not automatically a combined resolver.

## Target generation structure

Components consume supported utility names; they do not author the Tailwind
source. Define finite shared capability families in
`packages/core/src/lib/responsive-utilities.ts`. These are build-only helpers;
scripts and generation tests import that module directly, not through the
runtime `lib/index.ts` barrel.

```text
Token names + approved utility families and values
  -> exact deduplication
  -> canonical base/breakpoint expansion
  -> generated Tailwind source

Component-local variant recipes
  -> resolve each public variant value into utilities
  -> prefix those utilities for the requested breakpoint
  -> render classes
```

For `size={{ base: "sm", md: "lg" }}`, the recipe's `lg` value might return
`h-6 w-6`; rendering emits `md:h-6 md:w-6`, not `md:lg`. Generation enables
individual utilities, not every static composition.

- The generator must not import component or runtime layout recipes.
- Reuse generated token names for token-backed families. Do not duplicate their
  unions or infer utility support from particular component recipes.
- Approve values per CSS capability; do not cross every token category with
  every property. Border widths are pixels, not spacing tokens.
- Adding or changing a recipe within the supported vocabulary needs no source
  registration. An unsupported utility requires a reviewed vocabulary change
  or a recipe change.
- Keep source authoring and formatting in existing build tooling. No new package,
  plugin, AST extraction, automatic discovery, or runtime styling engine.
- Keep the existing responsive-class helper and ordinary CVA compositions.

### First-pass capability matrix

The initial source is a fresh capability selection, not a frozen historical
candidate list. Public responsive APIs are still reviewed independently.

| Family | First-pass vocabulary | Consumers / disposition |
| --- | --- | --- |
| Spacing | Token steps 0-9 for padding/margin axes and gap/gap-x/gap-y | Layout, Grid, Divider insets, Card section compact/default spacing |
| Dimensions | Token steps 0-9 and reviewed intrinsic/full/viewport keywords; min/max forms | Layout, component sizes, Skeleton's existing dimensions |
| Border width | Whole pixel widths 0-9, all and axis/side forms | Spinner size composition and Divider thickness; no color/style expansion |
| Radius | Token radius names | Supporting size compositions, not a responsive rounding API |
| Translation | Token steps, half, full on x/y axes | Spatial geometry; child targeting decided per component |
| Display and flex | Block/inline/hidden/flex/grid forms; directions and wrapping | Layout and Flex |
| Alignment | Existing flex/grid item and content alignment/distribution | Flex, Grid |
| Grid | Tracks 1-12/none; implicit sizing; row/column/dense flow | Grid; bespoke preset templates remain a migration decision |
| Typography | Token font sizes and line heights; alignment, wrapping, truncation and reset utilities | Text, Header, Card.Title/Description |
| Position and overflow | Existing position choices; visible/hidden/auto/scroll, all/x/y | Explicit layout/containment exceptions |
| Media | Existing object-fit choices and auto/square/video/4:3/3:4 ratios | Explicit fitting exception and proportional sizing |

Colors, weights, shadows, animation, severity, interaction, state, and semantics
remain scalar. Divider direction becomes scalar because it also controls ARIA
orientation. Typography truncation needs stable accessibility handling and
explicit resets; existing heading recipes already contain breakpoint styles and
must not be mechanically prefixed again.

Card section compact/default variants are spacing and remain eligible. Card root
variants are cosmetic and become scalar. Dialog size/fullWidth, Badge placement,
and footer stickiness are valid spatial candidates but new responsive support
is deferred. Badge size remains the agreed addition.

### Card responsive authoring

Card root `variant`, Title/Description `weight` and `color`, Image `rounded`,
and Footer `sticky` are scalar. Section `default`/`compact` variants are padding
presets and accept responsive values independently on Header, Body, and Footer.

Title sizes are fixed visual mappings (`h1` through `h6` map to `text-3xl`,
`text-2xl`, `text-xl`, `text-lg`, `text-md`, and `text-sm`).
They no longer scale automatically at `md` and `lg`; express that explicitly:

```tsx
<Card.Title size={{ base: "h4", md: "h3", lg: "h2" }} as="h2">
  Card title
</Card.Title>
```

The heading element remains independent of visual size. Title retains its
existing default visual size of `h2`; Description retains `md` and `default`
color. Both support responsive size, alignment, wrapping, and truncation.

Truncation uses single-line ellipsis and owns whitespace and overflow while
active. When it turns off, the latest requested wrapping and overflow values
are restored, with visible overflow when unspecified. Use `"visible"` for an
explicit overflow reset. Consumer
`className` overrides remain last. For string children, enabling truncation at
any breakpoint supplies stable full-text `title` and `aria-label` attributes
unless either attribute was explicitly provided; these do not depend on the
viewport.

Image fitting and aspect ratio remain responsive. Use `aspectRatio="auto"` at a
later breakpoint to restore intrinsic proportions; image rounding stays scalar.

### Standalone Header, Text, and Image

Header and Text use the same responsive/scalar split as Card typography:
size, alignment, wrapping, and truncation are responsive; weight and color are
scalar. Their shared text-flow helper also handles Card typography, keeping
truncation resets and stable full-text attributes consistent.

Header uses the fixed visual size mappings listed above for Card.Title.
Automatic `md`/`lg` scaling is removed; supply responsive `size` values instead.
Its existing default element (`h1`) and default visual size (`h2`) are preserved.
Text retains its `p` element, `md` size, `default` color, and `wrap` defaults.
Its existing inline-span alignment behavior is unchanged.

Image keeps object fitting and aspect ratio responsive, but rounding is scalar.
For a picture element, aspect ratio and rounding belong to the wrapper, while
object fitting belongs to the inner image. Each resolver emits only its own
utilities, so default fitting, ratio, or rounding cannot leak into another axis.
The `auto` ratio explicitly resets a previous breakpoint's ratio.

Off-scale recipe values, bespoke Grid templates, and descendant/state selector
forms are not automatically harvested into the source. The reviewed additions
are finite numeric/half-step dimensions, fractional spacing, fixed-pixel geometry,
and the six existing literal Grid templates. They live in shared capabilities,
not a recipe registry. Toggle applies geometry directly to its thumb; responsive
descendant selectors are unnecessary.

## Bloat boundary

The source deliberately includes complete approved ranges, including utilities
unused by today's recipes. Deduplicate complete candidates in deterministic
first-seen order, then expand canonical breakpoint prefixes.

- Deduplicate identical strings, not CSS meaning.
- Keep `h-4`, `h-5`, and `[&_[data-slot=thumb]]:h-4` distinct.
- Never use `tailwind-merge` during source generation. Values, components, and states
  need all their alternatives available.
- Generate only the existing base/breakpoint forms. No speculative state,
  variant, range, or container cross-products.
- Recipe compositions are never enumerated. No component-specific source lists.

Deduplication is not tree shaking. The public stylesheet enables all approved
responsive candidates, including ones a particular application does not use.
Accept a bounded vocabulary; do not claim zero unused CSS.

### Baseline recorded before PR 1

Historical layout/Flex-only source, measured on 2026-10-17:

| Metric | Baseline |
| --- | ---: |
| Unique utility candidates | 227 |
| Base/breakpoint forms | 6 |
| Expanded candidates | 1,362 |
| Generated source bytes (LF) | 1,758 |

Source bytes and candidate counts are not compiled CSS measurements. The
controlled consumer fixture establishes compiled CSS raw/gzip baselines with
automatic source scanning disabled.

For later PRs, record candidate and compiled CSS deltas against that baseline.
Every new candidate must belong to an approved capability and value range. Review those
deltas rather than introducing arbitrary size ceilings or a monitoring system.

### Original collector PR 1 verification (historical)

Measured with Tailwind CSS 4.3.0, the current Tokens theme, and only the public
Core stylesheet plus Tailwind imported with `source(none)`. These are compiler
output sizes before minification, not an application's total CSS footprint.

| Metric | Before | After |
| --- | ---: | ---: |
| Unique utility candidates | 227 | 227 |
| Expanded candidates | 1,362 | 1,362 |
| Generated source bytes (LF) | 1,758 | 1,758 |
| Compiled CSS bytes | 124,616 | 124,616 |
| Compiled CSS gzip bytes | 13,576 | 13,576 |

The rebuilt public CSS is byte-identical before and after the refactor:

```text
SHA-256: 3194d90293301dc89f4fbeb1ed6a2355b68c8a32f50bf233fc8918e77ccb791e
```

Verification completed:

- 42 targeted tests passed across generation, controlled CSS compilation, Flex,
  and shared layout.
- Core's normal lint and type-check commands passed and now include scripts.
- `check:layout-utilities` and the production Core build passed.
- Generated stylesheet content is unchanged.

The freshness check now accepts LF and CRLF output equivalently; stale content
and missing output still fail. Inline-source serialization is tested with
compound-only classes, state/dark/descendant modifiers, quoted selectors, and
comma-containing arbitrary values. The formatter rejects a single utility
containing both quote types rather than silently changing its contents.

### Phase 1 first-pass verification

Measured with the same Tailwind 4.3.0 controlled public-CSS fixture and current
Tokens theme. This deliberately expands shared capabilities rather than retaining
the old layout/Flex-only set. Measurements are before minification.

| Metric | Original layout/Flex source | Shared first pass |
| --- | ---: | ---: |
| Unique utility candidates | 227 | 496 |
| Base/breakpoint forms | 6 | 6 |
| Expanded candidates | 1,362 | 2,976 |
| Compiled CSS bytes | 124,616 | 304,905 |
| Compiled CSS gzip bytes | 13,576 | 29,646 |

The gzip increase is 16,070 bytes. It is the explicit cost of the wider approved
vocabulary, not recipe-combination enumeration or consumer-specific tree shaking.
Review capability ranges as migrations proceed; do not claim this source is
minimal CSS for a particular application.

- 34 focused tests passed across source generation, controlled CSS compilation,
  shared layout, and Flex.
- Every one of the 2,976 candidates has an emitted selector with source scanning
  disabled. Representative declarations and excluded cosmetic candidates are
  also asserted.
- Core/script type checks, lint, freshness, and the production Core build passed.
- No runtime components or public props changed in this pass.
- Child targeting, off-scale recipe values, bespoke Grid presets, and component
  vocabulary-compliance tests remain decisions for their owning migrations.

### Box/Flex integration cleanup

The Box/Flex cleanup at the start of phase 2 restores direct CVA declarations,
without separately exported variant configs.

- Layout recipe keys match public props directly. One explicit prop-name list
  drives class generation and prop splitting, without an alias map or a separate
  resolver call for every prop.
- Prop splitting uses one shared key set and does not mutate the input.
- Flex uses one responsive resolver call per axis and declares defaults once,
  in component props. Base-value extraction and a second defaults resolver are
  unnecessary.
- The per-axis Flex recipe has no unconditional base class or CVA defaults:
  otherwise resolving direction at `md` could inject `md:flex` and overwrite an
  independently chosen display mode.
- Box/Flex public props, defaults, class override precedence, ref forwarding,
  layout ordering, and omitted-value behavior stayed unchanged in this cleanup.
  The later reset stage removes `unset`; see the final contract below.

## Four-PR delivery plan

### PR 1 / phase 1: shared vocabulary and generation only

**Goal:** make the shared vocabulary the author of responsive CSS availability.
Breaking changes are allowed pre-1.0, but no component migration is hidden here.

Scope:

- Remove component-recipe registration and collection entirely.
- Define the first-pass capability matrix as shared utility families and ranges.
- Reuse generated token names instead of repeating token scales.
- Preserve current commands, output location, stylesheet import path,
  breakpoint set, and runtime component behavior.
- Preserve write and `--check` failure behavior. Keep test imports free of
  generation side effects.
- Move/update generator tests and relevant contribution instructions.
- Add the controlled Tailwind compilation fixture and baseline measurements.

Exit criteria:

- No component or runtime variant imports in production generation.
- Tests cover complete approved ranges, deduplication, exact breakpoint forms,
  quoting, and stale/missing output.
- Every approved base/breakpoint utility emits actual CSS through the public
  entry with source scanning disabled. Unsupported candidates fail explicitly.
- Scalar cosmetic utilities are not expanded. Record the new candidate and
  raw/gzip compiled CSS footprint rather than preserving the old count.
- Core and script type checks pass, and existing relevant tests pass.

Out of scope: component APIs, defaults, size recipes, reset behavior changes,
hook removal, generated filename renaming, styling redesign, or new tooling.

**Stop when these criteria pass.** This PR must not become the first migration.

### PR 2: independent size and layout mappings together

**Goal:** migrate the straightforward cases as one batch.

Scope:

- Simplify Flex's existing CSS integration using the shared mechanism.
- Migrate Icon and Spinner size and Button-owned size output.
- Migrate eligible Image/Card.Image fit and aspect-ratio layout mappings.
- Keep consumer-supplied Icon sizing independent of Button size. Review existing
  size-dependent loading-icon wrapper behavior explicitly; any change is an
  intentional composition correction, not an infrastructure necessity.
- Classify image rounding as scalar styling. Define aspect-ratio `auto` resets.
- Compose shared supported utilities; move conflicting size defaults out of
  scalar class generation. No recipe registration.
- Migrate Card section compact/default spacing without renaming its API.

Exit criteria:

- Local definitions and normal helper calls suffice; no generator registration.
- Ref forwarding, element selection, image source ownership, loading behavior,
  and independently sized supplied content remain correct.
- Defaults are preserved except explicitly documented changes.
- Computed styles work across breakpoints; image ratio resets are proved.
- Record candidate and compiled CSS deltas.

Out of scope: generalized slot APIs, universal size scales, compound engines,
typography redesign, or making scalar colors responsive.

### PR 3: compound-dependent geometry and layout

**Goal:** prove and apply the normal responsive-by-scalar pattern.

Scope:

- Make Badge size responsive, conditioned on scalar count/dot variant.
- Migrate Toggle geometry as one size recipe conditioned on scalar checked
  state. Preserve readable compound definitions.
- Migrate Grid layout axes with explicit template-versus-column/row precedence.
- Make Divider direction scalar to preserve semantic consistency; migrate only
  reviewed size/layout concerns. Classify thickness, inset, and appearance
  explicitly rather than blanket-migrating all existing responsive props.

Exit criteria:

- Badge works in both scalar variants across responsive sizes.
- Toggle track/thumb/travel remain coherent in both states, including state
  changes at different widths.
- Grid precedence and Divider orientation/ARIA are tested.
- Existing scalar styling compounds remain usable.
- No component-specific generator branches or combined responsive-state engine.
- Record intentional API changes and CSS deltas.

If these cases need new shared machinery, stop and review the specific blocker.
Do not expand the architecture merely to preserve an existing implementation.

### PR 4: typography, scalar narrowing, and completion

**Goal:** finish the migration and remove the permanent dual contract.

Scope:

- Migrate typography size and eligible layout for Text, Header, Card.Title, and
  Card.Description.
- Define how existing implicit heading breakpoint scales are preserved or
  intentionally changed before implementing them. Do not mechanically prefix
  classes that already contain viewport modifiers.
- Make cosmetic weight/color/variant concerns scalar, including Card root
  variant and its context value.
- Verify Card section compact/default remains a spacing adaptation, distinct
  from scalar Card root styling.
- Resolve truncation/wrapping eligibility and accessibility behavior explicitly.
- Finish shared layout reset/precedence cases.
- Remove remaining viewport-selected presentation from Core. Decide and document
  the public `useResponsiveProps` export (decision: remove it); behavioral
  viewport hooks are a separate capability.
- Update component docs, stories, contribution conventions, and release notes.

Exit criteria:

- Every affected prop is classified; intentional API changes are listed.
- No Core presentation path depends on viewport subscriptions.
- No hidden semantic exception remains behind a responsive type.
- Existing heading scales, resets, consumer overrides, and accessibility
  behavior have explicit proof.
- Run relevant package suites, type checks, and production builds.
- Record the final vocabulary and compiled CSS footprint.

Do not redesign typography, truncation measurement, theming, or component APIs
beyond what this contract requires. An unresolved decision is a blocker to name,
not permission to grow the PR.

## Verification and acceptance

### Final completion evidence

Verified on 2026-10-18 with Tailwind 4.3.0. The public stylesheet fixture disables
automatic source scanning and measures compiler output before minification.

| Metric | Shared first pass | Final |
| --- | ---: | ---: |
| Unique utility candidates | 496 | 713 |
| Base/breakpoint forms | 6 | 6 |
| Expanded candidates | 2,976 | 4,278 |
| Compiled CSS bytes | 304,905 | 446,470 |
| Compiled CSS gzip bytes | 29,646 | 39,976 |

The migration adds 217 utilities / 1,302 candidates and 10,330 gzip bytes over
the shared first pass. This includes the reviewed fixed-pixel Toggle correction
(23 utilities / 138 candidates / 1,216 gzip bytes). These are bounded availability
costs, not per-application tree-shaken sizes.

- Public CSS tests cover actual Icon, Spinner, Button, Header, Text, Image,
  Card, and text-wrap maps; Badge count/dot compounds; Toggle track/thumb/checked
  compounds; every Grid and Flex axis; shared layout and text-flow resets; and
  both Divider orientations. These test-only imports do not author generation.
- Browser checks passed below, at, and above `md` and `lg` for Toggle in both
  states, Badge count/dot/ping, and Divider thickness/insets with stable ARIA.
  Grid additionally passed around `sm`, with preset/count restoration and
  spacing/max-width/overflow resets in both viewport directions.
- Earlier component stages proved typography truncation, fixed heading mappings,
  consumer overrides, image ratio resets, and supplied loading-icon ownership.
- A no-application-JavaScript HTML fixture compiled from built public package CSS
  with `source(none)` kept base geometry at 767, 768, and 899px, then applied
  `md` geometry at 900 and 901px with a custom `--breakpoint-md: 900px`.
- A source search found no `useResponsiveProps`, `useBreakpoint`, or `matchMedia`
  references in Core. Built React-utilities exports omit `useResponsiveProps`
  and retain `useBreakpoint`.

Final commands and results:

| Command | Result |
| --- | --- |
| `pnpm --filter @basic-ui/core exec vitest run --reporter=dot` | Passed: 525 tests, 32 files |
| `pnpm --filter @basic-ui/react-utilities exec vitest run --reporter=dot` | Passed: 170 tests, 18 files |
| `pnpm --filter @basic-ui/core type-check` | Passed, including scripts and stories |
| `pnpm --filter @basic-ui/react-utilities type-check` | Passed |
| `pnpm --filter @basic-ui/core lint` | Passed |
| `pnpm --filter @basic-ui/react-utilities lint` | Passed |
| `pnpm --filter @basic-ui/core check:layout-utilities` | Passed |
| `pnpm --filter @basic-ui/core build` | Passed |
| `pnpm --filter @basic-ui/react-utilities build` | Passed |
| `git diff --check` | Passed |

Intentional final contracts:

- Omitted breakpoint entries retain the latest CSS value, not the base value.
- `unset` is removed. Use `0`, `"auto"`, `"visible"`, or maximum-size `"none"`
  for concrete resets. Maximum dimensions no longer accept unsupported `"auto"`.
- Active Grid presets override columns and rows; preset `"none"` restores the
  latest requested counts, or implicit tracks when counts are omitted.
- Divider direction, appearance, and color are scalar; thickness and inset
  remain responsive. Vertical inset uses vertical margins.
- Toggle uses coherent fixed-pixel track/thumb/travel geometry instead of mixing
  nonlinear spacing tokens with Tailwind's default numeric scale. Both checked
  edges have 2px horizontal clearance; thumbs remain vertically centered.
- Release notes list the Icon color rename/inheritance, Button fallback removal,
  scalar narrowing, and explicit heading scaling decisions.

Deferred: Button hover/active gating and color/theming redesign; new responsive
Dialog sizing, Badge placement, footer stickiness, and container-query APIs.
Existing React-utilities anchor-positioning tests emit `act` warnings; the Grid
reset story exposes an existing `normalizeProps` warning for `wMax`, although
layout classes and DOM filtering remain correct. Neither warning is suppressed
or claimed fixed here.

### Acceptance rules

Use existing tooling. Keep checks focused per PR and escalate to package-wide
tests/builds at completion.

- Existing `generate:layout-utilities` and `check:layout-utilities` commands remain
  the generation interface.
- Test effective CSS, not only emitted class strings: below, at, and above
  relevant breakpoints, including a custom CSS breakpoint.
- Prove state/descendant modifier composition where an owning component adopts
  it, explicit resets, and consumer class/style override behavior.
- Presentation must not need hydration to select viewport styling once CSS
  loads. React continues to own state, semantics, and interaction.
- A new responsive recipe consumes the shared vocabulary without registration.
  Component tests must verify its actual compositions have CSS coverage. The
  freshness check proves source freshness, not component vocabulary compliance.

Accept and freeze the architecture only when Icon, Badge, and Toggle prove its
representative cases and CSS delivery works through the public stylesheet entry.
The full migration is complete when the four PRs' criteria pass.

After acceptance, reopen the architecture for a demonstrated correctness,
accessibility, or measured performance problem, not another styling preference.

## Non-goals

No library rebuild, new styling framework, automatic registration discovery,
new packages, standalone precompiled CSS distribution, universal size tokens,
responsive cosmetic variants, general responsive-by-responsive engine, runtime
breakpoint synchronization, or container-query feature work.
