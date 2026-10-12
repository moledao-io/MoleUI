import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MoleProvider } from '../provider';
import { AnimatedIcon } from './AnimatedIcon';
import { getShacklePath, LOCKED_POSE, UNLOCKED_POSE } from './icons/lock/geometry';
import { LockIcon } from './LockIcon';
import { ANIMATED_ICON_NAMES } from './registry';

const getShackle = (container: HTMLElement) => container.querySelector('[data-part="shackle"]') as SVGPathElement;
const fakeFrames = () =>
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('AnimatedIcon', () => {
  it('lists the registered icons', () => {
    expect(ANIMATED_ICON_NAMES).toContain('lock');
  });

  it('is decorative by default and exposes an image role with a label', () => {
    const { container, rerender } = render(<AnimatedIcon active name="lock" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<AnimatedIcon active aria-label="已锁定" name="lock" />);
    const icon = screen.getByRole('img', { name: '已锁定' });
    expect(icon).toHaveAttribute('data-name', 'lock');
    expect(icon).toHaveAttribute('data-state', 'locked');
  });

  it('renders the resting pose for each state', () => {
    const { container, rerender } = render(<AnimatedIcon active={false} name="lock" />);
    expect(getShackle(container)).toHaveAttribute('d', getShacklePath(UNLOCKED_POSE));

    rerender(<AnimatedIcon active key="locked" name="lock" />);
    expect(getShackle(container)).toHaveAttribute('d', getShacklePath(LOCKED_POSE));
  });

  it('jumps to the new state when motion is reduced', () => {
    const onAnimationComplete = vi.fn();
    const tree = (active: boolean) => (
      <MoleProvider motion="reduced">
        <AnimatedIcon active={active} name="lock" onAnimationComplete={onAnimationComplete} sound={false} />
      </MoleProvider>
    );
    const { container, rerender } = render(tree(false));

    rerender(tree(true));
    expect(getShackle(container)).toHaveAttribute('d', getShacklePath(LOCKED_POSE));
    expect(onAnimationComplete).toHaveBeenCalledWith(true);
  });

  it('animates through intermediate poses before settling', () => {
    fakeFrames();
    const onAnimationComplete = vi.fn();
    const tree = (active: boolean) => (
      <MoleProvider motion="full">
        <AnimatedIcon active={active} duration={600} name="lock" onAnimationComplete={onAnimationComplete} sound={false} />
      </MoleProvider>
    );
    const { container, rerender } = render(tree(true));

    rerender(tree(false));
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
    fakeFrames();
    const onAnimationComplete = vi.fn();
    const tree = (active: boolean) => (
      <MoleProvider motion="full">
        <AnimatedIcon
          active={active}
          duration={600}
          name="lock"
          onAnimationComplete={onAnimationComplete}
          sound={false}
          speed={2}
        />
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

  it('plays the lock sound only when unlocking', () => {
    vi.spyOn(HTMLMediaElement.prototype, 'canPlayType').mockReturnValue('probably');
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const tree = (active: boolean, sound = true) => (
      <MoleProvider motion="reduced">
        <AnimatedIcon active={active} name="lock" sound={sound} />
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

  it('collapses the shackle to a rounded bar when edge-on', () => {
    const numbers = (getShacklePath({ angle: 90, lift: 1 }).match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const xs = numbers.filter((_, index) => index % 2 === 0);
    expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(2);
  });
});

describe('LockIcon', () => {
  it('is an alias for the lock animated icon', () => {
    const onAnimationComplete = vi.fn();
    const tree = (locked: boolean) => (
      <MoleProvider motion="reduced">
        <LockIcon locked={locked} onAnimationComplete={onAnimationComplete} sound={false} />
      </MoleProvider>
    );
    const { container, rerender } = render(tree(false));
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-name', 'lock');
    expect(svg).toHaveAttribute('data-state', 'unlocked');

    rerender(tree(true));
    expect(svg).toHaveAttribute('data-state', 'locked');
    expect(onAnimationComplete).toHaveBeenCalledWith(true);
  });
});
