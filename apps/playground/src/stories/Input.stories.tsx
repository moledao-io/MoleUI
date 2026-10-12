import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from 'moledao';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: '账户名称',
    placeholder: 'Focus in',
    size: 'lg',
    status: 'default',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Medium: Story = { args: { size: 'md' } };
export const WithLabelAndHelper: Story = { args: { helperText: '仅可输入字母和数字' } };
export const WithLeftIcon: Story = {
  args: {
    startContent: <span aria-hidden="true" className="mole-input-icon mole-input-icon--user" />,
  },
};
export const WithBothIcons: Story = {
  args: {
    startContent: <span aria-hidden="true" className="mole-input-icon mole-input-icon--user" />,
    endContent: <span aria-hidden="true" className="mole-input-icon mole-input-icon--copy" />,
  },
};
export const Password: Story = {
  args: {
    label: '密码',
    placeholder: '输入密码',
    showPasswordToggle: true,
    type: 'password',
  },
};
export const Success: Story = { args: { defaultValue: 'Moledao', status: 'success' } };
export const Warning: Story = {
  args: {
    defaultValue: 'Moledao',
    helperText: '请填写必填项',
    status: 'warning',
  },
};
export const Disabled: Story = { args: { defaultValue: '不可输入', disabled: true } };
export const ReadOnly: Story = { args: { defaultValue: '不可修改', readOnly: true } };

function ClearableExample() {
  const [value, setValue] = useState('Moledao');
  return <Input clearable label="可清空输入" onValueChange={setValue} value={value} />;
}

export const Clearable: Story = {
  render: () => <ClearableExample />,
};
