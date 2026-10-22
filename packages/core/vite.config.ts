import { existsSync, readdirSync } from "node:fs";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const componentsDirectory = path.resolve(__dirname, "src/components");

// Derive public component entries from the components/<Name>/index.ts convention.
const componentEntries = Object.fromEntries(
  readdirSync(componentsDirectory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(path.resolve(componentsDirectory, entry.name, "index.ts")),
    )
    .map((entry) => [
      `components/${entry.name}/index`,
      path.resolve(componentsDirectory, entry.name, "index.ts"),
    ]),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@basic-ui/icons": path.resolve(__dirname, "../icons/src"),
      "@basic-ui/react-utilities": path.resolve(__dirname, "../react-utilities/src"),
      "@basic-ui/tokens": path.resolve(__dirname, "../tokens/src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/test-utils/**", "**/dist/**", "**/node_modules/**"],
    setupFiles: ["../../vitest.setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        global: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
      },
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/vitest.setup.ts",
        "**/test-utils/**",
      ],
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        ...componentEntries,
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [
        /^react(?:\/|$)/,
        /^react-dom(?:\/|$)/,
        "tailwindcss",
        "@basic-ui/react-utilities",
      ],
    },
    minify: "esbuild",
    sourcemap: true,
  },
});
