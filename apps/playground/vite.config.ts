import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        docs: fileURLToPath(new URL('./docs.html', import.meta.url)),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'moledao/styles.css',
        replacement: fileURLToPath(
          new URL('../../packages/ui/src/styles/index.css', import.meta.url),
        ),
      },
      {
        find: /^moledao$/,
        replacement: fileURLToPath(
          new URL('../../packages/ui/src/index.ts', import.meta.url),
        ),
      },
    ],
  },
});
