import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders a labelled native input and forwards its ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input helperText="仅可输入数字" label="账户" placeholder="请输入账户" ref={ref} />);

    const input = screen.getByRole('textbox', { name: '账户' });
    expect(input).toHaveAttribute('placeholder', '请输入账户');
    expect(input).toHaveAttribute('aria-describedby');
    expect(screen.getByText('仅可输入数字').parentElement).toHaveAttribute('id', input.getAttribute('aria-describedby'));
    expect(ref.current).toBe(input);
  });

  it('updates value and clears an uncontrolled input', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onClear = vi.fn();
    render(<Input aria-label="昵称" clearable onClear={onClear} onValueChange={onValueChange} />);

    await user.type(screen.getByRole('textbox', { name: '昵称' }), 'Mole');
    expect(screen.getByRole('textbox', { name: '昵称' })).toHaveValue('Mole');
    await user.click(screen.getByRole('button', { name: '清空输入' }));
    expect(screen.getByRole('textbox', { name: '昵称' })).toHaveValue('');
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('supports controlled value changes and clearing', async () => {
    const user = userEvent.setup();
    function ControlledInput() {
      const [value, setValue] = useState('Mole');
      return <Input aria-label="搜索" clearable onValueChange={setValue} value={value} />;
    }
    render(<ControlledInput />);

    await user.click(screen.getByRole('button', { name: '清空输入' }));
    expect(screen.getByRole('textbox', { name: '搜索' })).toHaveValue('');
    await user.type(screen.getByRole('textbox', { name: '搜索' }), 'DAO');
    expect(screen.getByRole('textbox', { name: '搜索' })).toHaveValue('DAO');
  });

  it('toggles password visibility without changing its value', async () => {
    const user = userEvent.setup();
    render(<Input label="密码" showPasswordToggle type="password" defaultValue="secret" />);

    const input = screen.getByLabelText('密码');
    expect(input).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: '显示密码' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('secret');
    await user.click(screen.getByRole('button', { name: '隐藏密码' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('marks warnings, disabled and read-only states accessibly', () => {
    const { rerender } = render(<Input helperText="请填写必填项" label="邮箱" status="warning" />);
    expect(screen.getByRole('textbox', { name: '邮箱' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('请填写必填项');

    rerender(<Input disabled label="邮箱" />);
    expect(screen.getByRole('textbox', { name: '邮箱' })).toBeDisabled();

    rerender(<Input label="邮箱" readOnly value="dao@example.com" />);
    expect(screen.getByRole('textbox', { name: '邮箱' })).toHaveAttribute('readonly');
  });
});
