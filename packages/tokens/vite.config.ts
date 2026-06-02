import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        "pkg/index": path.resolve(__dirname, "src/pkg/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
    copyPublicDir: false,
    minify: "esbuild",
    sourcemap: true,
  },
});
