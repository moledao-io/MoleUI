import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('switches state and announces the checked value', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle label="通知" onCheckedChange={onCheckedChange} showText />);
    const toggle = screen.getByRole('switch', { name: '通知' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveTextContent('No');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(toggle).toHaveTextContent('Yes');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled and disabled states', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle checked disabled label="只读通知" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole('switch', { name: '只读通知' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
