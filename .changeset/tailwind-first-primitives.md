---
"@basic-ui/core": minor
"@basic-ui/tokens": minor
---

Make the primitives Tailwind-first: className styling, a component-derived
safelist, and Tailwind's linear spacing scale.

- Primitives style through `className`. A component exposes a style prop
  only when it buys something a class cannot — a mix, a state, a default,
  or a semantic — never a 1:1 utility pass-through. Box is a pure
  polymorphic shell (`as`, `className`, `style`); Flex keeps
  direction/justify/align/wrap/display; Grid keeps
  cols/rows/templatePreset/auto-placement and its alignment axes. Gap
  trios and Divider's `inset`/`m`/`p` are removed (the `hr` margin reset
  moves into the variant base); Spinner, Skeleton, Icon, Image, and Card
  no longer inherit layout props. Text, Header, and Card sections keep
  their overflow props through a shared `TextFlowOverflowProps`. There
  are no external consumers, so this ships as the released shape.
- Zero-config consumer builds now generate every component-authored class.
  Tailwind never scans `node_modules`, so classes written as literals in
  variant tables (focus rings, transitions, animations, elevation) were
  previously absent from real consumer CSS while Storybook masked the gap
  by consuming workspace source. The shipped stylesheet now
  self-registers `@source "./"`, pointing consumer Tailwind builds at the
  package dist; `verify-package` asserts the consumer path end-to-end
  against the packed tarball.
- The responsive safelist is derived from the same cva tables and
  geometry maps the components render with, so it cannot drift from the
  implementation. It covers only the 170 runtime-constructed utilities
  (16.2 KB gzipped, previously 40.5 KB for a hand-authored vocabulary
  that still missed component-authored classes); coverage tests pin
  spacing and sizing utilities out of the safelist.
- Spacing adopts Tailwind's own linear scale. The 9-point geometric token
  scale is removed from `@basic-ui/tokens`, along with its configuration
  types, scale resolution, and merge special-casing (`mergeTheme` is a
  plain deep merge). The theme emits Tailwind's default base
  (`--spacing: 0.25rem`), so every bare numeric utility — fractionals
  like `p-1.5` included — resolves through `calc(var(--spacing) * N)`.
- The palette registry (`PALETTE_FAMILIES`, brand and Tailwind families)
  moves to `@basic-ui/tokens`, which now also generates the
  `@theme static` palette emission consumed by color recipes; core ships
  only `@source` directives, recipes, and components.
- Divider's label chip uses token utilities (`bg-bg-base`,
  `text-fg-muted`) instead of unstyled Tailwind classes, and its
  developer warning is production-gated. Tooltip renders non-element
  children without crashing, with a development-only warning, instead of
  throwing on `children.props`.
