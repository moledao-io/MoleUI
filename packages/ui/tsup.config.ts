import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'button/index': 'src/button/index.ts',
    'deferred-render/index': 'src/deferred-render/index.ts',
    'icon/index': 'src/icon/index.ts',
    'input/index': 'src/input/index.ts',
    'lock-icon/index': 'src/lock-icon/index.ts',
    'provider/index': 'src/provider/index.ts',
    'runtime/index': 'src/runtime/index.ts',
    'spinner/index': 'src/spinner/index.ts',
    'toggle/index': 'src/toggle/index.ts',
    'tooltip/index': 'src/tooltip/index.ts',
    'typography/index': 'src/typography/index.ts',
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
  target: 'es2018',
  treeshake: true,
});
