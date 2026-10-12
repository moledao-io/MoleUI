import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders with safe defaults', () => {
    render(<Button>创建项目</Button>);

    const button = screen.getByRole('button', { name: '创建项目' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button.querySelector('.mole-button__default-icon')).toBeInTheDocument();
  });

  it('calls the click handler', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>确认</Button>);

    await user.click(screen.getByRole('button', { name: '确认' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables interaction while loading', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading onClick={onClick}>
        提交
      </Button>,
    );

    const button = screen.getByRole('button', { name: '提交' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports the Figma variants and legacy aliases', () => {
    const { rerender } = render(<Button variant="destructive-secondary">移除</Button>);
    expect(screen.getByRole('button', { name: '移除' })).toHaveAttribute('data-variant', 'destructive-secondary');

    rerender(<Button variant="outline">取消</Button>);
    expect(screen.getByRole('button', { name: '取消' })).toHaveAttribute('data-variant', 'white-line');
  });

  it('renders a labelled icon-only button', () => {
    render(<Button aria-label="打开菜单" iconOnly size="sm" />);

    const button = screen.getByRole('button', { name: '打开菜单' });
    expect(button).toHaveAttribute('data-icon-only', 'true');
    expect(button.querySelector('.mole-button__default-icon')).toBeInTheDocument();
  });

  it('renders the link arrow and allows hiding the default icon', () => {
    const { rerender } = render(<Button variant="link">了解更多</Button>);
    expect(screen.getByRole('button', { name: '了解更多' }).querySelector('.mole-button__link-arrow')).toBeInTheDocument();

    rerender(<Button showIcon={false}>不带图标</Button>);
    expect(screen.getByRole('button', { name: '不带图标' }).querySelector('.mole-button__default-icon')).not.toBeInTheDocument();
  });

  it('keeps a visible loading indicator for the link variant', () => {
    render(<Button loading variant="link">加载更多</Button>);

    const button = screen.getByRole('button', { name: '加载更多' });
    expect(button).toBeDisabled();
    expect(button.querySelector('.mole-button__spinner')).toBeInTheDocument();
  });
});
