import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'BasicUITokens',
      fileName: 'index',
      formats: ['es'],
    },
    copyPublicDir: true,
    minify: 'esbuild',
    sourcemap: true,
  },
});
