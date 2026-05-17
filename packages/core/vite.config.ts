import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src"),
      "@tokens": path.resolve(__dirname, "../tokens/src"),
      "@icons": path.resolve(__dirname, "../icons/src"),
      "@basic-ui/icons": path.resolve(__dirname, "../icons/src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
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
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "BasicUI",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    minify: "esbuild",
    sourcemap: true,
  },
});
