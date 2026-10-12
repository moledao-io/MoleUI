import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'button/index': 'src/button/index.ts',
    'provider/index': 'src/provider/index.ts',
    'spinner/index': 'src/spinner/index.ts',
    styles: 'src/styles/index.css',
  },
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  minify: true,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  sourcemap: true,
  splitting: false,
  treeshake: true,
});
