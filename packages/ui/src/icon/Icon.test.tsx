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

  it('renders every icon from adjustable vector strokes', () => {
    const { container } = render(<>{ICON_NAMES.map((name) => <Icon key={name} name={name} />)}</>);
    expect(container.querySelectorAll('.mole-icon svg')).toHaveLength(ICON_NAMES.length);
    expect(container.querySelectorAll('path, rect, ellipse').length).toBeGreaterThan(ICON_NAMES.length);
  });

  it('scales the original stroke with the icon size by default', () => {
    const { container } = render(<Icon name="utility-search" size="sm" />);
    const icon = container.querySelector('.mole-icon');
    const path = container.querySelector('path');

    expect(icon).toHaveAttribute('data-stroke-mode', 'auto');
    expect(path).toHaveAttribute('stroke-width', '1.5');
    expect(path).not.toHaveAttribute('vector-effect');
  });

  it('keeps a fixed stroke width through the component variable', () => {
    const { container } = render(<Icon aria-label="搜索" name="utility-search" size="lg" strokeWidth={1.75} />);
    const icon = screen.getByRole('img', { name: '搜索' });
    const path = container.querySelector('path');

    expect(icon).toHaveAttribute('data-stroke-mode', 'fixed');
    expect(icon).toHaveStyle({ '--mole-icon-stroke-width': '1.75px' });
    expect(path).toHaveAttribute('stroke-width', 'var(--mole-icon-stroke-width, 1.5px)');
    expect(path).toHaveAttribute('vector-effect', 'non-scaling-stroke');
  });
});
