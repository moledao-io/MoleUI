import { afterEach, describe, expect, it, vi } from 'vitest';

import { createMoleRuntime } from './createRuntime';

type MediaListener = (event: MediaQueryListEvent) => void;

function installMatchMedia(initial: Record<string, boolean> = {}) {
  const matches = new Map(Object.entries(initial));
  const listeners = new Map<string, Set<MediaListener>>();

  vi.stubGlobal('matchMedia', vi.fn((query: string) => {
    const queryListeners = listeners.get(query) ?? new Set<MediaListener>();
    listeners.set(query, queryListeners);

    return {
      get matches() {
        return matches.get(query) ?? false;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: MediaListener) => queryListeners.add(listener),
      removeEventListener: (_type: string, listener: MediaListener) => queryListeners.delete(listener),
      addListener: (listener: MediaListener) => queryListeners.add(listener),
      removeListener: (listener: MediaListener) => queryListeners.delete(listener),
      dispatchEvent: () => true,
    } as MediaQueryList;
  }));

  return {
    listenerCount() {
      return [...listeners.values()].reduce((total, queryListeners) => total + queryListeners.size, 0);
    },
    set(query: string, value: boolean) {
      matches.set(query, value);
      const event = { matches: value, media: query } as MediaQueryListEvent;
      listeners.get(query)?.forEach((listener) => listener(event));
    },
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('createMoleRuntime', () => {
  it('starts lazily, detects capabilities, and releases media listeners', () => {
    const media = installMatchMedia({
      '(hover: hover)': true,
      '(prefers-color-scheme: dark)': true,
      '(prefers-reduced-motion: reduce)': true,
    });
    vi.stubGlobal('CSS', { supports: () => true });
    vi.stubGlobal('IntersectionObserver', class IntersectionObserver {});
    vi.stubGlobal('ResizeObserver', class ResizeObserver {});
    const onDiagnostic = vi.fn();
    const runtime = createMoleRuntime({ onDiagnostic });
    const listener = vi.fn();

    expect(runtime.getSnapshot().ready).toBe(false);
    const unsubscribe = runtime.subscribe(listener);

    expect(runtime.getSnapshot()).toMatchObject({
      capabilities: {
        focusVisible: true,
        hover: true,
        intersectionObserver: true,
        resizeObserver: true,
      },
      compatibility: 'modern',
      preferences: {
        colorScheme: 'dark',
        reducedMotion: true,
      },
      ready: true,
    });
    expect(onDiagnostic).toHaveBeenCalledWith(expect.objectContaining({ type: 'runtime-ready' }));
    expect(media.listenerCount()).toBeGreaterThan(0);

    media.set('(prefers-reduced-motion: reduce)', false);
    expect(runtime.getSnapshot().preferences.reducedMotion).toBe(false);
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    expect(media.listenerCount()).toBe(0);
  });

  it('provides a stable conservative server snapshot', () => {
    const runtime = createMoleRuntime({ compatibility: 'auto' });
    const first = runtime.getServerSnapshot();

    expect(first).toBe(runtime.getServerSnapshot());
    expect(first).toMatchObject({ compatibility: 'compatible', ready: false });
    expect(first.capabilities.intersectionObserver).toBe(false);
  });

  it('schedules cancellable background work', () => {
    vi.useFakeTimers();
    const runtime = createMoleRuntime();
    const task = vi.fn();
    const cancel = runtime.schedule('background', task);

    cancel();
    vi.runAllTimers();
    expect(task).not.toHaveBeenCalled();

    runtime.schedule('background', task);
    vi.runAllTimers();
    expect(task).toHaveBeenCalledOnce();
  });
});
