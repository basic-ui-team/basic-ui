---
"@basic-ui/core": minor
"@basic-ui/react-utilities": minor
---

Complete the pre-1.0 migration from viewport-selected presentation to static,
mobile-first responsive CSS delivered by `@basic-ui/core/styles.css`.

Breaking API changes:

- Remove `useResponsiveProps` from `@basic-ui/react-utilities`. Use responsive
  component props or `getResponsiveClassNames` for presentation. `useBreakpoint`
  remains available for behavioral viewport decisions.
- Icon's semantic `variant` is now `color`; remove the former light/dark `color`
  override. Omitted `color` inherits the surrounding foreground.
- Button renders a supplied `loadingIcon` directly, without sizing or a wrapper.
  There is no built-in fallback spinner; supply a styled Icon or Spinner when
  needed. `loadingIcon` is optional without an explicit `false` union.
- Card root variant, typography weight/color, image rounding, and Divider
  direction/appearance/color are scalar. Keep responsive values for reviewed
  sizing and layout concerns.
- Header and Card.Title use fixed visual h1-h6 sizes; implicit md/lg heading
  scaling is removed. Express scaling explicitly with responsive `size`.
- Text and Card typography use single-line truncation with explicit wrapping and
  overflow restoration. Full-text accessibility attributes remain stable across
  viewports when truncation is enabled at any breakpoint.

Omitted breakpoints retain the latest CSS value, not the base value. Use
`aspectRatio="auto"` to restore intrinsic image proportions. See the companion
layout, Grid/Divider, Badge, and Toggle notes for their API and geometry changes.

The Button hover/active gating and broader color/theming redesign remain deferred.
