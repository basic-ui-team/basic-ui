// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig([
  globalIgnores(["dist", "build", "coverage", "node_modules", ".next", "storybook-static"]),
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    ...jsxA11y.configs.recommended,
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ...jsxA11y.configs.recommended.languageOptions,
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.config.{ts,tsx}", "**/*.d.ts", "vitest.setup.ts"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
  ...storybook.configs["flat/recommended"],
]);
