---
"@basic-ui/core": minor
"@basic-ui/tokens": minor
---

Move theming to Tailwind v4 CSS. Consumers can now re-theme components by
overriding CSS custom properties—no JavaScript theme setup or rebuild needed.

- The theme is authored in CSS using Tailwind's `@theme` namespaces. Its
  palette, semantic colors, scales, shadows, and dark-mode overrides are
  split into focused files. Semantic colors reference the palette, so a
  palette override updates every component. Dark mode uses a `.dark` class.
- Stylesheet imports have new paths: use `@basic-ui/tokens/theme.css` or
  `@basic-ui/tokens/palette-static.css` instead of the old
  `@basic-ui/tokens/styles/*` paths.
- The JavaScript theming API has been removed, including `ThemeConfig`,
  `lightTheme`/`darkTheme`, `createTheme`, `mergeTheme`, `resolveTheme`,
  theme serialization, and the generated `tokens.ts`/`darkTokens` mirrors.
  Update consumers to use the CSS theme and write complete class names in
  variant files so Tailwind can detect them. The palette registry remains:
  `PALETTE_FAMILIES`, `TAILWIND_PALETTE_FAMILIES`,
  `BRAND_PALETTE_FAMILIES`, and `PaletteColor`.
- CSS `@utility` shims provide `duration-*`, named `z-*` layers, named
  `opacity-*` states, and `shadow-s*` utilities. This restores utilities
  such as `duration-slow` and lets dark-mode shadow overrides take effect.
- `palette-static.css` now contains only vendored Tailwind palette families.
  The authored theme supplies brand ramps (including `accent`), neutral,
  white, and black, avoiding duplicate declarations.
