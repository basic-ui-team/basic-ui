# @basic-ui/icons

## 0.1.0

### Minor Changes

- 262c7eb: Add a workspace-only `dev` export condition to every workspace package,
  matching `@basic-ui/core`.

  - The condition maps to `src/index.ts` and is local-only: `src/` is not
    published (`files: ["dist"]`), so published/default consumers always
    resolve `dist/` and are unaffected.
  - Local tooling that opts into the condition (Storybook appends `dev` to
    Vite's default resolve conditions) now resolves workspace packages to
    source without per-package aliases, keeping package exports validated.

## 0.0.3

### Patch Changes

- 1aaf6c3: [icons] add sideEffects property to package.json for better tree-shaking

## 0.0.2

### Patch Changes

- 1f998f5: [lint] Added lint scripts to all packages while simplifying the root configuration. This allows for consistent code quality checks across the entire monorepo and makes it easier for developers to run linting on their code before committing changes. By using ESLint with caching enabled, we can improve the performance of linting by only checking files that have changed since the last linting run, which helps to speed up the development workflow and maintain a clean codebase.

  [typescript] Enforced stronger typing across the codebase by enabling the noImplicitAny TypeScript compiler option and fix resulting errors.

  [accesibility] Brought jsx-a11y rules into package configs and fixed violations across the codebase. This improvement ensures that our components adhere to accessibility best practices, making them more inclusive and usable for all users, including those with disabilities.
