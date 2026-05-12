import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const commonPlugins = {
  "react-hooks": reactPlugin,
  "react-refresh": reactRefresh,
};

const commonLanguageOptions = {
  ecmaVersion: 2020,
  sourceType: "module",
  globals: globals.browser,
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
};

export default [
  { ignores: ["dist", "build", "coverage", "node_modules", ".next", "storybook-static"] },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: commonLanguageOptions,
    rules: {
      ...js.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "warn",
    },
    plugins: commonPlugins,
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.config.{ts,tsx}", "**/*.d.ts"],
    languageOptions: {
      ...commonLanguageOptions,
      parser: tsParser,
      parserOptions: { ...commonLanguageOptions.parserOptions, project: true },
    },
    plugins: { ...commonPlugins, "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["**/*.config.{ts,tsx}", "**/*.d.ts"],
    languageOptions: {
      ...commonLanguageOptions,
      parser: tsParser,
    },
    plugins: { ...commonPlugins, "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
