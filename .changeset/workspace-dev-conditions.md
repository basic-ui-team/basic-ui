---
"@basic-ui/react-utilities": minor
"@basic-ui/tokens": minor
"@basic-ui/icons": minor
---

Add a workspace-only `dev` export condition to every workspace package,
matching `@basic-ui/core`.

- The condition maps to `src/index.ts` and is local-only: `src/` is not
  published (`files: ["dist"]`), so published/default consumers always
  resolve `dist/` and are unaffected.
- Local tooling that opts into the condition (Storybook appends `dev` to
  Vite's default resolve conditions) now resolves workspace packages to
  source without per-package aliases, keeping package exports validated.
