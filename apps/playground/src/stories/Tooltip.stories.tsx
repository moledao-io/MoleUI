import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Tooltip } from 'moledao';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    children: <Button variant="secondary">悬停或聚焦</Button>,
    content: 'Tooltip',
    placement: 'top',
    align: 'center',
    open: true,
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Interactive: Story = { args: { open: undefined } };
export const Placements: Story = {
  render: () => (
    <div style={{ alignItems: 'center', display: 'grid', gap: 100, gridTemplateColumns: 'repeat(2, 140px)', justifyItems: 'center', padding: 50 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <Tooltip content={placement} key={placement} open placement={placement}>
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
