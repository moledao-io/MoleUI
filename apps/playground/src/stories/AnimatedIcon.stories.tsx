import type { Meta, StoryObj } from '@storybook/react-vite';
import { ANIMATED_ICON_NAMES, AnimatedIcon, Button } from 'moledao';
import { useState } from 'react';

const meta = {
  title: 'Components/AnimatedIcon',
  component: AnimatedIcon,
  args: {
    active: true,
    name: 'lock',
    size: 'lg',
    sound: true,
    soundVolume: 1,
    speed: 1,
  },
  argTypes: {
    name: { control: 'select', options: ANIMATED_ICON_NAMES },
    size: { control: 'select', options: ['sm', 'md', 'lg', 48, 96] },
    speed: { control: { type: 'range', min: 0.25, max: 4, step: 0.25 } },
  },
} satisfies Meta<typeof AnimatedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};
export const Inactive: Story = { args: { active: false } };

export const Interactive: Story = {
  args: { size: 96 },
  render: function InteractiveIcon(args) {
    const [active, setActive] = useState(false);

    return (
      <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <AnimatedIcon {...args} active={active} aria-label={`${args.name}: ${active ? 'on' : 'off'}`} />
        <Button onClick={() => setActive((value) => !value)} showIcon={false} variant="secondary">
          切换
        </Button>
      </div>
    );
  },
};

export const AllIcons: Story = {
  render: function AllIcons(args) {
    const [active, setActive] = useState(false);

    return (
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {ANIMATED_ICON_NAMES.map((name) => (
          <button
            key={name}
            onClick={() => setActive((value) => !value)}
            style={{ background: 'none', border: 0, cursor: 'pointer' }}
            type="button"
          >
            <AnimatedIcon {...args} active={active} aria-label={name} name={name} size={48} />
          </button>
        ))}
      </div>
    );
  },
};
