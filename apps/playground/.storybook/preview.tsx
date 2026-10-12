import type { Preview } from '@storybook/react-vite';
import { MoleProvider } from 'moledao';

import 'moledao/styles.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MoleProvider style={{ padding: 24 }} theme="light">
        <Story />
      </MoleProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;
