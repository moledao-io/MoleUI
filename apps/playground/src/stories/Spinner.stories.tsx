import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from 'moledao';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: {
    label: '加载中',
    size: 'md',
    tone: 'brand',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const CurrentColor: Story = { args: { tone: 'current' } };
