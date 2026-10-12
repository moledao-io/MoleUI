import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { Tooltip } from './Tooltip';

afterEach(cleanup);

describe('Tooltip', () => {
  it('reveals its description on hover and hides it afterwards', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="复制链接" placement="right"><button type="button">复制</button></Tooltip>);
    const button = screen.getByRole('button', { name: '复制' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    await user.hover(button);
    expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    expect(tooltip.parentElement).toHaveAttribute('data-placement', 'right');
    await user.unhover(button);
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports keyboard focus and Escape', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="帮助"><button type="button">说明</button></Tooltip>);
    const tooltip = screen.getByText('帮助');
    await user.tab();
    expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    await user.keyboard('{Escape}');
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
  });
});
