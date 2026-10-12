import { fileURLToPath, URL } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../public'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: './storybook-only.config.ts',
      },
    },
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: [
          {
            find: 'moledao/styles.css',
            replacement: fileURLToPath(new URL('../../../packages/ui/src/styles/index.css', import.meta.url)),
          },
          {
            find: /^moledao$/,
            replacement: fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url)),
          },
        ],
      },
    });
  },
};

export default config;
