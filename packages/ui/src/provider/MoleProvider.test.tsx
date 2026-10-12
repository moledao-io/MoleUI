import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MoleProvider } from './MoleProvider';

describe('MoleProvider', () => {
  it('exposes theme and density as style hooks', () => {
    render(
      <MoleProvider data-testid="provider" density="compact" theme="dark">
        content
      </MoleProvider>,
    );

    const provider = screen.getByTestId('provider');
    expect(provider).toHaveAttribute('data-mole-theme', 'dark');
    expect(provider).toHaveAttribute('data-mole-density', 'compact');
  });

  it('exposes explicit motion and locale settings without requiring runtime support', () => {
    render(
      <MoleProvider data-testid="provider" locale="zh-CN" motion="reduced">
        content
      </MoleProvider>,
    );

    const provider = screen.getByTestId('provider');
    expect(provider).toHaveAttribute('data-mole-motion', 'reduced');
    expect(provider).toHaveAttribute('lang', 'zh-CN');
  });
});
