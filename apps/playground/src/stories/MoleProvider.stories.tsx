import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Input, MoleProvider } from 'moledao';

const meta = {
  title: 'Foundations/MoleProvider',
  component: MoleProvider,
  args: {
    children: null,
    density: 'comfortable',
    theme: 'light',
  },
  render: ({ density, theme }) => (
    <MoleProvider density={density} style={{ background: 'var(--mole-color-surface)', display: 'grid', gap: 16, padding: 24 }} theme={theme}>
      <Input label="项目名称" placeholder="输入名称" />
      <Button>开始探索</Button>
    </MoleProvider>
  ),
} satisfies Meta<typeof MoleProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = { args: { theme: 'dark' } };
export const Compact: Story = { args: { density: 'compact' } };
