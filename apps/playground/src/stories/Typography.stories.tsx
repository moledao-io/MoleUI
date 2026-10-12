import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, type TypographyLevel, type TypographyState } from 'moledao';

const levels: { level: TypographyLevel; label: string }[] = [
  { level: 'h1', label: 'H1 · 28px / Bold' },
  { level: 'h2', label: 'H2 · 26px / Bold' },
  { level: 'h3', label: 'H3 · 24px / Bold' },
  { level: 'h4', label: 'H4 · 22px / Medium' },
  { level: 'h5', label: 'H5 · 20px / Medium' },
  { level: 'h6', label: 'H6 · 18px / Medium' },
  { level: 'body-large', label: 'Body Large · 16px / Regular' },
  { level: 'body', label: 'Body Regular · 14px / Regular' },
  { level: 'body-small', label: 'Body Small · 12px / Regular' },
  { level: 'caption', label: 'Caption · 12px / Regular' },
];

const states: { state: TypographyState; label: string }[] = [
  { state: 'default', label: 'Default' },
  { state: 'secondary', label: 'Secondary' },
  { state: 'success', label: 'Success' },
  { state: 'warning', label: 'Warning' },
  { state: 'disabled', label: 'Disabled' },
  { state: 'mark', label: 'Mark' },
  { state: 'link', label: 'Link' },
  { state: 'delete', label: 'Delete' },
];

const meta = {
  title: 'Foundations/Typography',
  component: Typography,
  args: {
    children: 'Moledao 设计系统 · Design System',
    level: 'body',
    state: 'default',
  },
  argTypes: {
    level: { control: 'select', options: levels.map(({ level }) => level) },
    state: { control: 'select', options: states.map(({ state }) => state) },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TypeScale: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, minWidth: 360 }}>
      {levels.map(({ level, label }) => (
        <div key={level} style={{ display: 'grid', gap: 5 }}>
          <span style={{ color: '#858891', fontSize: 12 }}>{label}</span>
          <Typography level={level}>Moledao 设计系统 · Design System</Typography>
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, minWidth: 320 }}>
      {states.map(({ state, label }) => (
        <div key={state} style={{ display: 'grid', gap: 4 }}>
          <span style={{ color: '#858891', fontSize: 12 }}>{label}</span>
          <Typography href={state === 'link' ? '#typography' : undefined} level="h3" state={state}>Moledao 文字示例</Typography>
        </div>
      ))}
    </div>
  ),
};
