import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MoleProvider } from '../provider';
import { getShacklePath, LOCKED_POSE, UNLOCKED_POSE } from './geometry';
import { LockIcon } from './LockIcon';

const getShackle = (container: HTMLElement) =>
  container.querySelector('.mole-lock-icon__shackle') as SVGPathElement;

describe('LockIcon', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('is decorative by default and exposes an image role with a label', () => {
    const { container, rerender } = render(<LockIcon locked />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<LockIcon aria-label="已锁定" locked />);
    expect(screen.getByRole('img', { name: '已锁定' })).toHaveAttribute('data-state', 'locked');
  });

  it('renders the resting pose for each state', () => {
    const { container, rerender } = render(<LockIcon locked={false} />);
    expect(getShackle(container)).toHaveAttribute('d', getShacklePath(UNLOCKED_POSE));

    rerender(<LockIcon key="locked" locked />);
    expect(getShackle(container)).toHaveAttribute('d', getShacklePath(LOCKED_POSE));
  });

  it('jumps to the new state when motion is reduced', () => {
    const onAnimationComplete = vi.fn();
    const { container, rerender } = render(
      <MoleProvider motion="reduced">
        <LockIcon locked={false} onAnimationComplete={onAnimationComplete} />
      </MoleProvider>,
    );

    rerender(
      <MoleProvider motion="reduced">
        <LockIcon locked onAnimationComplete={onAnimationComplete} />
      </MoleProvider>,
    );

    expect(getShackle(container)).toHaveAttribute('d', getShacklePath(LOCKED_POSE));
    expect(onAnimationComplete).toHaveBeenCalledWith(true);
  });

  it('animates through lift, rotate and drop before settling', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const onAnimationComplete = vi.fn();
    const { container, rerender } = render(
      <MoleProvider motion="full">
        <LockIcon duration={600} locked onAnimationComplete={onAnimationComplete} />
      </MoleProvider>,
    );

    rerender(
      <MoleProvider motion="full">
        <LockIcon duration={600} locked={false} onAnimationComplete={onAnimationComplete} />
      </MoleProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });
    const midway = getShackle(container).getAttribute('d');
    expect(midway).not.toBe(getShacklePath(LOCKED_POSE));
    expect(midway).not.toBe(getShacklePath(UNLOCKED_POSE));
    expect(container.querySelector('svg')).toHaveAttribute('data-animating', 'true');

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(getShackle(container)).toHaveAttribute('d', getShacklePath(UNLOCKED_POSE));
    expect(container.querySelector('svg')).not.toHaveAttribute('data-animating');
    expect(onAnimationComplete).toHaveBeenCalledWith(false);
  });

  it('scales the animation length with speed', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const onAnimationComplete = vi.fn();
    const tree = (locked: boolean) => (
      <MoleProvider motion="full">
        <LockIcon duration={600} locked={locked} onAnimationComplete={onAnimationComplete} sound={false} speed={2} />
      </MoleProvider>
    );
    const { rerender } = render(tree(true));

    rerender(tree(false));
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(onAnimationComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(onAnimationComplete).toHaveBeenCalledWith(false);
  });

  it('collapses to a rounded bar when edge-on', () => {
    const path = getShacklePath({ angle: 90, lift: 1 });
    const numbers = (path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const xs = numbers.filter((_, index) => index % 2 === 0);
    expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(2);
  });
});

describe('LockIcon sound', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('plays only when changing from locked to unlocked', () => {
    vi.spyOn(HTMLMediaElement.prototype, 'canPlayType').mockReturnValue('probably');
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const tree = (locked: boolean, sound = true) => (
      <MoleProvider motion="reduced">
        <LockIcon locked={locked} sound={sound} />
      </MoleProvider>
    );

    const { rerender } = render(tree(true));
    expect(play).not.toHaveBeenCalled();

    rerender(tree(false));
    expect(play).toHaveBeenCalledTimes(1);

    rerender(tree(true));
    expect(play).toHaveBeenCalledTimes(1);

    rerender(tree(false, false));
    expect(play).toHaveBeenCalledTimes(1);
  });
});
