import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig, type Plugin } from 'vite';

const aiDocuments = [
  {
    contentType: 'text/plain; charset=utf-8',
    fileName: 'llms.txt',
    source: fileURLToPath(new URL('../../llms.txt', import.meta.url)),
  },
  {
    contentType: 'application/json; charset=utf-8',
    fileName: 'component-manifest.json',
    source: fileURLToPath(new URL('../../docs/ai/component-manifest.json', import.meta.url)),
  },
] as const;

function aiDocumentsPlugin(): Plugin {
  return {
    name: 'mole-ai-documents',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = request.url?.split('?')[0]?.replace(/^\//, '');
        const document = aiDocuments.find(({ fileName }) => fileName === pathname);
        if (!document) return next();

        response.setHeader('Content-Type', document.contentType);
        response.setHeader('Cache-Control', 'no-cache');
        response.end(readFileSync(document.source, 'utf8'));
      });
    },
    generateBundle() {
      for (const document of aiDocuments) {
        this.emitFile({
          fileName: document.fileName,
          source: readFileSync(document.source, 'utf8'),
          type: 'asset',
        });
      }
    },
  };
}

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
  plugins: [
    react(),
    legacy(),
    aiDocumentsPlugin(),
  ],
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
