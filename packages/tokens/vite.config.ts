import { defineConfig, type Plugin } from 'vite';
import path from 'path';
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const copyThemeCss = (): Plugin => ({
  name: 'copy-theme-css',
  closeBundle() {
    const destDir = path.resolve(__dirname, 'dist/styles');
    mkdirSync(destDir, { recursive: true });
    copyFileSync(
      path.resolve(__dirname, 'src/styles/theme.css'),
      path.resolve(destDir, 'theme.css'),
    );
  },
});

export default defineConfig({
  plugins: [copyThemeCss()],
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
    copyPublicDir: false,
    minify: 'esbuild',
    sourcemap: true,
  },
});
