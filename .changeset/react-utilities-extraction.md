---
"@basic-ui/core": minor
"@basic-ui/react-utilities": minor
---

Add `@basic-ui/react-utilities` package and extract shared React utilities from core.

- New `@basic-ui/react-utilities` package with `cn`, `normalizeProps`, `getTruncateAccessibilityProps`, `forwardRefWithAs` and polymorphic prop types (`CommonProps`, `PropsWithAs`, `RestrictedPropsWithAs`, `PolymorphicRef`), plus the responsive hooks (`useBreakpoint`, `useResponsiveProps`, `ResponsiveValue` type, `BREAKPOINTS`)
- `@basic-ui/core` now depends on `@basic-ui/react-utilities` and re-exports all moved APIs from the same entry points, so existing imports keep working
