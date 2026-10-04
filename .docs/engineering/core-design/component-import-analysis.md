# Cross-component import analysis — issue #60

Status: analysis complete, refactor pending. Target release: v1.0.0 (pre-release; breaking changes allowed).

## Scope

All imports under `packages/core/src/components/**` were audited for component-to-component
dependencies. Imports of utilities (`@basic-ui/react-utilities`), icons (`@basic-ui/icons`),
theme (`@core/theme`), and layout internals (`lib/layout`) are out of scope — #60 targets
component-to-component coupling only.

## Full dependency matrix (current state)

Edge = "importer imports target". `|` marks a type-only import.

| Importer        | Box | Flex | Text | Spinner | Icon | Header | Image | Notes |
| --------------- | --- | ---- | ---- | ------- | ---- | ------ | ----- | ----- |
| Alert           | x   |      |      |         | x    |        |       | Icon used for severity glyph + close button |
| Badge           | x   |      |      |         |      |        |       | |
| Box             | —   |      |      |         |      |        |       | Leaf; depends only on `lib/layout` |
| Button          | x   | x    | x    | x       |      |        |       | Hotspot — see below |
| Card (root)     | x   |      |      |         |      |        |       | |
| Card.Body       | x   |      |      |         |      |        |       | |
| Card.Footer     | x   |      |      |         |      |        |       | |
| Card.Header     | x   |      |      |         |      |        |       | |
| Card.Unstyled   | x   |      |      |         |      |        |       | |
| Card.Title      |     |      |      |         |      | x      |       | Wraps Header |
| Card.Description|     |      | x    |         |      |        |       | Wraps Text |
| Card.Image      |     |      |      |         |      |        | x     | Wraps Image |
| Card (types)    | x\| |      | x\| |         |      | x\|     | x\|    | card.types.ts re-exports Box/Header/Text/Image prop types |
| Divider         | x   |      |      |         |      |        |       | |
| Flex            | x   |      |      |         |      |        |       | |
| Grid            | x   |      |      |         |      |        |       | |
| Header          | x   |      |      |         |      |        |       | |
| Icon            | x   |      |      |         |      |        |       | |
| Image           | x   |      |      |         |      |        |       | |
| Pagination (shared) | x |    |      |         |      |        |       | |
| LinkPagination  | x   |      |      |         | x    |        |       | Icon renders chevron glyphs |
| TablePagination | x   |      |      |         | x    |        |       | Icon renders chevron glyphs |
| Skeleton        | x   |      |      |         |      |        |       | |
| Spinner         | x   |      |      |         |      |        |       | |
| Text            | x   |      |      |         |      |        |       | |
| Select          | —   |      |      |         |      |        |       | No component imports |

## Classification of edges

Three distinct kinds of coupling exist, and they warrant different rules:

### 1. Box-as-primitive (15 importers) — acceptable, formalize it

Nearly every component imports `Box` as its base render element. This mirrors Radix's
`@radix-ui/react-primitive`: a single styled-element layer everything sits on. It is not
component-to-component coupling in the problematic sense; it is the foundation layer.

**Rule: keep.** Document Box (with `Flex`/`Text` eventually) as the primitive layer other
components may import. Consistency fix needed: imports today use four different specifiers
(`../Box`, `@core/components/Box`, `@core/components`, `../Box` inside package-relative paths);
standardize on one (`../Box`).

### 2. Sibling-component composition (the actual debt) — refactor

| Component | Imports | Used for |
| --------- | ------- | -------- |
| Button | Spinner, Flex, Text | `renderLoader()`: Flex wrapper + Box + optional Text for `loadingText` |
| Alert | Icon | Severity glyph and close button |
| LinkPagination / TablePagination | Icon | Chevron glyphs in nav buttons |
| Card.Title / Card.Description / Card.Image | Header / Text / Image | Anatomy parts wrap public siblings |

These are hidden composition: a component silently renders another public component. Per the
competitor analysis (Radix primitives + Chakra v3 snippets), the industry direction is to make
composition explicit — via props/slots/children — or to inline trivial styling.

### 3. Intra-anatomy imports (Card parts ↔ Card root/context) — acceptable

`Card.Header` imports `CardContext` and shared `card.types`/`card.variants`. These are files
within one component's own folder structure, not cross-component coupling. Keep.

## Refactor plan (per component)

### Button — the headline fix

`renderLoader()` (`Button.tsx:94-113`) renders `<Flex justify gap>` + `<Box>` + `<Text>` +
`<Spinner>`. Four imports for a loading indicator.

- Inline the layout: the Flex wrapper is `display:flex; align-items:center; justify-content:center; gap`. Add a `buttonLoaderVariants` to `button.variants.ts` and render a plain `<Box>` (or the base element) with those classes.
- Inline the label: `<Text color="inherit" weight="medium">` becomes a `<Box as="span">` (or plain span with the same classes from variants).
- Spinner: two options:
  1. Keep the `Spinner` import — it is arguably part of the primitive layer (a semantic status element).
  2. Inline a minimal spinner (border + `animate-spin` classes in variants).
  Recommendation: keep `Spinner` only if we classify it as primitive; otherwise inline. Decide during implementation; both are breaking-change-safe pre-1.0.
- Net: Button drops from 4 component imports to at most 1 (Box, allowed).

### Alert — icon via existing slot

`Alert` already accepts `icon` and `iconMap` props. The `Icon` component import is used to
render the mapped glyph. Replace with rendering the raw icon component from `@basic-ui/icons`
directly (which `Icon` itself wraps), or keep an explicit `icon` slot contract. Check whether
`Icon` adds sizing/color semantics; if trivial, bypass it.

### Pagination — same treatment as Alert

`LinkPagination`/`TablePagination` use `<Icon icon={...} size="sm"/>` for chevrons. The chevron
SVGs come from `@basic-ui/icons` already (`Pagination.tsx:11`). Render the icon component
directly and apply the existing `buttonIconVariants`-style classes, dropping the `Icon` import.

### Card anatomy parts — explicit composition props

`Card.Title` wraps `Header`, `Card.Description` wraps `Text`, `Card.Image` wraps `Image`; and
`card.types.ts` re-exports their prop types. This is legitimate wrapper composition (like
Chakra snippets), but it imports siblings. Options:

- **A (recommended):** keep wrappers, but have each part own its styling fully via
  `card.variants.ts` on a `Box` base rather than delegating to the sibling's variant system.
  `Card.Title` becomes `<Box as="h3">` with header classes — no Header import.
- **B:** drop the parts; consumers compose `Header`/`Text`/`Image` into `Card.Body` directly
  (Chakra-v3 snippet direction). More breaking; only if we want a smaller public API.

Follow option A: it preserves the documented Card API (`.docs/components/*.md`) with minimal churn.

### Type-only re-exports

`card.types.ts` imports `BoxProps`, `HeaderProps`, `TextProps`, `ImageProps`. After option A,
parts' props extend `BoxProps` only; sibling prop types drop out naturally.

## Convention to document (CONVENTIONS.md addition)

1. **Primitive layer:** `Box` (and `Flex`/`Text` once promoted) is the styled-element foundation.
   Any component may import it. Everything else is off-limits by default.
2. **No sibling imports:** a component in `components/**` may not import another public
   component except `Box`. Composition of richer components happens via explicit props
   (render slots like `Alert.icon`, `Button.loadingIcon`) or children — never hidden internal
   renders.
3. **Own anatomy is fine:** files within a component's own folder (context, variants, types,
   parts) may import each other freely.
4. **Shared internals** go to `@basic-ui/react-utilities` (#54), not into another component.

## Enforcement

Add a lint/CI check (simple script or ESLint `no-restricted-imports` per-directory config)
that fails when a component imports a sibling other than `Box`. Suggested follow-up issue.

## Suggested order of work

1. CONVENTIONS.md composition rule (this analysis documents the rationale).
2. Button refactor (biggest win, unblocks the rule).
3. Alert + Pagination icon inlining.
4. Card parts option A.
5. Import-path standardization for Box.
6. Enforcement script + CI wiring.
