import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from './Icon';
import { ICON_NAMES } from './names';

describe('Icon', () => {
  it('exposes the Figma icon set and renders a named icon', () => {
    expect(ICON_NAMES).toHaveLength(48);
    render(<Icon aria-label="搜索" name="utility-search" size="lg" />);
    expect(screen.getByRole('img', { name: '搜索' })).toHaveAttribute('data-size', 'lg');
    expect(screen.getByRole('img')).toHaveAttribute('data-name', 'utility-search');
  });

  it('keeps decorative icons out of the accessibility tree', () => {
    const { container } = render(<Icon name="operation-close" />);
    expect(container.querySelector('.mole-icon')).toHaveAttribute('aria-hidden', 'true');
  });
});
