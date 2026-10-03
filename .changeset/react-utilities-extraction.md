---
"@basic-ui/core": major
"@basic-ui/react-utilities": minor
---

Add `@basic-ui/react-utilities` package and extract shared React utilities from core.

- New `@basic-ui/react-utilities` package with `cn`, `normalizeProps`, `getTruncateAccessibilityProps`, `forwardRefWithAs` and polymorphic prop types (`CommonProps`, `PropsWithAs`, `RestrictedPropsWithAs`, `PolymorphicRef`), plus the responsive hooks (`useBreakpoint`, `useResponsiveProps`, `ResponsiveValue` type, `BREAKPOINTS`)
- `@basic-ui/core` depends on it via `workspace:*` and imports from it directly; the utilities are no longer re-exported from `@basic-ui/core`
- **BREAKING**: `cn`, `forwardRefWithAs`, `normalizeProps`, `getTruncateAccessibilityProps`, `useBreakpoint`, `useResponsiveProps`, and the polymorphic prop types moved to `@basic-ui/react-utilities` — import them from there instead of `@basic-ui/core`
