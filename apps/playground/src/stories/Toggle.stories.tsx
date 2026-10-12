import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from 'moledao';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: {
    label: '接收通知',
    showText: false,
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const WithText: Story = { args: { showText: true } };
export const Disabled: Story = { args: { disabled: true } };

export const States: Story = {
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', gap: 28 }}>
      <Toggle label="关闭" />
      <Toggle defaultChecked label="开启" />
      <Toggle label="关闭并显示文字" showText />
      <Toggle defaultChecked label="开启并显示文字" showText />
    </div>
  ),
};
