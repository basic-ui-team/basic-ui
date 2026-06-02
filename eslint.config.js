import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig([
  globalIgnores(["dist", "build", "coverage", "node_modules", ".next", "storybook-static"]),
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      "jsx-a11y": jsxA11y,
    },
    rules: {},
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.config.{ts,tsx}", "**/*.d.ts", "vitest.setup.ts", "**/.storybook/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          "./tsconfig.json",
          "./packages/*/tsconfig.json",
          "./packages/*/tsconfig.scripts.json",
          "./apps/*/tsconfig.json",
        ],
      },
    },
    rules: {},
  },
]);
