import type { Meta, StoryObj } from '@storybook/react-vite';
import { ICON_NAMES, Icon } from 'moledao';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    'aria-label': '搜索',
    name: 'utility-search',
    size: 'md',
    strokeMode: 'auto',
  },
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    strokeMode: { control: 'select', options: ['auto', 'fixed'] },
    strokeWidth: { control: { min: 0.5, step: 0.25, type: 'number' } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}><Icon name="utility-search" size="sm" /><Icon name="utility-search" /><Icon name="utility-search" size="lg" /></div>,
};
export const StrokeWeight: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}>
        <strong style={{ width: 88 }}>自动描边</strong>
        <Icon name="utility-search" size="sm" />
        <Icon name="utility-search" />
        <Icon name="utility-search" size="lg" />
      </div>
      <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}>
        <strong style={{ width: 88 }}>固定 1.5px</strong>
        <Icon name="utility-search" size="sm" strokeMode="fixed" />
        <Icon name="utility-search" strokeMode="fixed" />
        <Icon name="utility-search" size="lg" strokeMode="fixed" />
      </div>
    </div>
  ),
};
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(6, minmax(100px, 1fr))', width: 820 }}>
      {ICON_NAMES.map((name) => (
        <div key={name} style={{ alignItems: 'center', display: 'grid', gap: 8, justifyItems: 'center', minWidth: 0 }}>
          <Icon name={name} />
          <span style={{ fontSize: 12, overflowWrap: 'anywhere', textAlign: 'center' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
