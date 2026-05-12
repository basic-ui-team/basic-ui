/**
 * basic-ui Package Structure
 *
 * This monorepo uses pnpm workspaces and Turborepo for build orchestration.
 *
 * Workspace packages:
 * - @basic-ui/core          — Components, hooks, utilities
 * - @basic-ui/tokens        — Design tokens and theming
 * - @basic-ui/icons         — Icon registry
 * - @basic-ui/storybook     — Storybook dev environment
 * - @basic-ui/docs          — Documentation (Astro + Starlight)
 *
 * Key files:
 * - pnpm-workspace.yaml     — Workspace root config
 * - tsconfig.json           — Root TypeScript config
 * - vitest.config.ts        — Testing configuration
 * - eslint.config.js        — Linting configuration
 *
 * Development:
 * $ pnpm install            — Install all dependencies
 * $ pnpm storybook          — Start Storybook dev server
 * $ pnpm build              — Build all packages
 * $ pnpm test               — Run all tests
 * $ pnpm lint               — Lint all packages
 *
 * Publishing:
 * Packages are published to npm under the @basic-ui scope:
 * - https://npm.im/@basic-ui/core
 * - https://npm.im/@basic-ui/tokens
 * - https://npm.im/@basic-ui/icons
 */

export default {};
