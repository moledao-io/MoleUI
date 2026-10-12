import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Typography } from './Typography';

describe('Typography', () => {
  it('uses a semantic heading and the matching typography level', () => {
    render(<Typography level="h2">组件标题</Typography>);
    expect(screen.getByRole('heading', { level: 2, name: '组件标题' })).toHaveAttribute('data-level', 'h2');
  });

  it('supports the added heading levels without changing body semantics', () => {
    render(<><Typography level="h5">小标题</Typography><Typography level="h6">辅助标题</Typography><Typography level="caption">备注</Typography></>);
    expect(screen.getByRole('heading', { level: 5, name: '小标题' })).toHaveAttribute('data-level', 'h5');
    expect(screen.getByRole('heading', { level: 6, name: '辅助标题' })).toHaveAttribute('data-level', 'h6');
    expect(screen.getByText('备注')).toHaveAttribute('data-level', 'caption');
  });

  it('uses an accessible link when href is provided', () => {
    render(<Typography href="/docs.html" level="body" state="link">查看文档</Typography>);
    expect(screen.getByRole('link', { name: '查看文档' })).toHaveAttribute('href', '/docs.html');
    expect(screen.getByRole('link')).toHaveAttribute('data-state', 'link');
  });

  it('preserves mark and delete semantics', () => {
    const { container } = render(
      <>
        <Typography level="h3" state="mark">重点文字</Typography>
        <Typography state="delete">旧价格</Typography>
      </>,
    );
    expect(container.querySelector('mark')).toHaveTextContent('重点文字');
    expect(container.querySelector('del')).toHaveTextContent('旧价格');
  });
});
