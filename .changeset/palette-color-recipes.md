---
"@basic-ui/core": minor
"@basic-ui/tokens": minor
---

Add palette color recipes and make Button recipe-only.

- Color recipes combine a validated palette family with per-variant shade,
  state, and theme mappings. Recipe utilities are static Tailwind candidates
  reading CSS custom properties, so CSS output stays bounded by the recipe
  channels, theme changes apply through the cascade without a rerender, and
  recipes support distinct light and dark paint sets.
- Button: the `color` prop now accepts a palette family (any Tailwind ramp or
  the brand ramps) instead of semantic colors, applied through per-variant
  light/dark recipes. There are no existing consumers, so this ships as the
  first released shape.
- The generated stylesheet registers the recipe channel utilities (light and
  dark) in its safelist and emits the supported palette ramps as
  `@theme static` variables, extracted at generation time from the installed
  Tailwind theme and the tokens generated theme. Without the static block,
  Tailwind tree-shakes unused palette variables and recipes referencing those
  families render colorless.
- The tokens generated theme now declares a class-based dark custom variant
  (`dark` matches `.dark` on an ancestor). Previously all `dark:` utilities
  followed the OS color-scheme preference instead of the toggled theme class.
