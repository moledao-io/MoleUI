import type { Meta, StoryObj } from '@storybook/react-vite';
import { ICON_NAMES, Icon } from 'moledao';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    'aria-label': '搜索',
    name: 'utility-search',
    size: 'md',
  },
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}><Icon name="utility-search" size="sm" /><Icon name="utility-search" /><Icon name="utility-search" size="lg" /></div>,
};
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(6, minmax(100px, 1fr))', width: 820 }}>
      {ICON_NAMES.map((name) => (
        <div key={name} style={{ alignItems: 'center', display: 'grid', gap: 8, justifyItems: 'center', minWidth: 0 }}>
          <Icon name={name} />
          <span style={{ fontSize: 11, overflowWrap: 'anywhere', textAlign: 'center' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
