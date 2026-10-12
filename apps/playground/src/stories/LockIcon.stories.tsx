import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, LockIcon } from 'moledao';
import { useState } from 'react';

const meta = {
  title: 'Components/LockIcon',
  component: LockIcon,
  args: {
    'aria-label': '锁',
    duration: 380,
    locked: true,
    size: 'lg',
    sound: true,
    soundVolume: 1,
    speed: 1,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 48, 96] },
    speed: { control: { type: 'range', min: 0.25, max: 4, step: 0.25 } },
  },
} satisfies Meta<typeof LockIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Locked: Story = {};
export const Unlocked: Story = { args: { locked: false } };

export const Interactive: Story = {
  args: { size: 96 },
  render: function InteractiveLock(args) {
    const [locked, setLocked] = useState(false);

    return (
      <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <LockIcon {...args} aria-label={locked ? '已锁定' : '未锁定'} locked={locked} />
        <Button onClick={() => setLocked((value) => !value)} showIcon={false} variant="secondary">
          {locked ? '解锁' : '上锁'}
        </Button>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
      <LockIcon {...args} size="sm" />
      <LockIcon {...args} size="md" />
      <LockIcon {...args} size="lg" />
      <LockIcon {...args} size={48} />
    </div>
  ),
};
