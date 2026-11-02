import { defineConfig } from "vitest/config";

// Local config shadows the workspace root vitest config, whose setup file
// path is root-relative. The theme contract tests need no setup.
export default defineConfig({});
