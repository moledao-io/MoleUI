import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'moledao';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: '开始探索',
    size: 'md',
    variant: 'primary',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Destructive: Story = { args: { variant: 'destructive' } };
export const WhiteLine: Story = { args: { variant: 'white-line' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const DestructiveSecondary: Story = { args: { variant: 'destructive-secondary' } };
export const Link: Story = { args: { variant: 'link' } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true, size: 'sm', variant: 'white-line' } };
export const IconOnly: Story = { args: { 'aria-label': '打开菜单', children: undefined, iconOnly: true } };
