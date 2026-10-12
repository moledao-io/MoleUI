import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DeferredRender } from './DeferredRender';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('DeferredRender', () => {
  it('renders its fallback until the container approaches the viewport', () => {
    let notify: IntersectionObserverCallback | undefined;
    const disconnect = vi.fn();
    const observe = vi.fn();

    vi.stubGlobal('IntersectionObserver', class MockIntersectionObserver {
      disconnect = disconnect;
      observe = observe;

      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
    });

    render(
      <DeferredRender fallback={<span>loading</span>} minHeight={120}>
        <span>expensive content</span>
      </DeferredRender>,
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.queryByText('expensive content')).not.toBeInTheDocument();
    expect(observe).toHaveBeenCalledOnce();

    act(() => {
      notify?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    expect(screen.getByText('expensive content')).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
  });

  it('can render content immediately for server-rendered sections', () => {
    render(
      <DeferredRender fallback="loading" ssr="content">
        visible content
      </DeferredRender>,
    );

    expect(screen.getByText('visible content')).toBeInTheDocument();
    expect(screen.queryByText('loading')).not.toBeInTheDocument();
  });
});
