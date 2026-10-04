---
"@basic-ui/core": patch
---

Formalize `Box` as the ancestral primitive of `core` (#84).

- Decision documented in CONVENTIONS.md: `Box` stays in `@basic-ui/core` at `components/Box` by convention — the composition rule plus the CI check provide the structural guarantee; a separate package was considered and rejected as overhead without behavioral benefit
- All `Box` imports standardized to the relative form (`../Box`, depth-adjusted); the `@core/components`, `@core/components/Box` alias forms are gone from `components/**`
- The composition check now also fails on non-relative `Box` imports, keeping the primitive dependency explicit and refactor-safe
- No public API changes
