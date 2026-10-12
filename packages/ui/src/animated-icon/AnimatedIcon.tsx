import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type SVGAttributes,
} from 'react';

import { classNames } from '../shared/classnames';
import { ANIMATED_ICONS, type AnimatedIconName } from './registry';
import { playSound, preloadSound } from './sound';
import type { AnimatedIconDefinition, AnimatedIconPose } from './types';

export interface AnimatedIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Which animated icon to render. */
  name: AnimatedIconName;
  /** Icon state (for `lock`: locked). Changing it plays the transition. */
  active: boolean;
  /** `sm` 16px, `md` 20px, `lg` 24px, or any pixel number. */
  size?: 'sm' | 'md' | 'lg' | number;
  /**
   * Playback speed multiplier: 2 plays twice as fast, 0.5 half as fast, 0 skips the animation.
   * The real length is `duration / speed`.
   */
  speed?: number;
  /** Base animation length in ms at `speed` 1. Defaults to the icon's own timing. */
  duration?: number;
  /** Play the icon's sound effect (if it has one) when `active` changes. */
  sound?: boolean;
  /** Sound volume, 0–1. */
  soundVolume?: number;
  /** Called when a transition finishes (or immediately when motion is reduced). */
  onAnimationComplete?: (active: boolean) => void;
}

function prefersReducedMotion(element: Element | null) {
  const mode = element?.closest('[data-mole-motion]')?.getAttribute('data-mole-motion');

  if (mode === 'reduced') return true;
  if (mode === 'full') return false;

  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

function isSamePose(a: AnimatedIconPose, b: AnimatedIconPose) {
  return Object.keys(b).every((key) => a[key] === b[key]);
}

type AnimatedIconInnerProps = Omit<AnimatedIconProps, 'name'> & {
  definition: AnimatedIconDefinition;
  name: AnimatedIconName;
};

const AnimatedIconInner = forwardRef<SVGSVGElement, AnimatedIconInnerProps>(function AnimatedIconInner(
  {
    active,
    className,
    definition,
    duration = definition.duration,
    name,
    onAnimationComplete,
    size = 'md',
    sound = true,
    soundVolume = 1,
    speed = 1,
    style,
    ...props
  },
  ref,
) {
  const id = `mole-ai-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const poseRef = useRef<AnimatedIconPose>(definition.restPose(active));
  const frameRef = useRef<number | null>(null);
  const wasActiveRef = useRef(active);
  const latestRef = useRef({ onAnimationComplete, sound, soundVolume });
  // Animated parts are driven imperatively after mount, so React only renders the first pose.
  const [content] = useState(() => definition.render({ id, pose: definition.restPose(active) }));

  useEffect(() => {
    latestRef.current = { onAnimationComplete, sound, soundVolume };
  });

  useEffect(() => {
    if (!sound) return;
    preloadSound(definition.sounds?.activate);
    preloadSound(definition.sounds?.deactivate);
  }, [definition, sound]);

  // Sound follows the state change itself, independent of motion settings or interrupted animations.
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (wasActive === active || !latestRef.current.sound) return;

    playSound(active ? definition.sounds?.activate : definition.sounds?.deactivate, latestRef.current.soundVolume);
  }, [active, definition]);

  const setRefs = useCallback(
    (node: SVGSVGElement | null) => {
      svgRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useEffect(() => {
    const svg = svgRef.current;
    const target = definition.restPose(active);

    const applyPose = (pose: AnimatedIconPose) => {
      poseRef.current = pose;
      if (svg) definition.applyPose(svg, pose);
    };

    // Already at rest in the requested state (first mount, Strict Mode re-run, timing change).
    if (frameRef.current === null && isSamePose(poseRef.current, target)) return undefined;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    svg?.setAttribute('data-animating', 'true');

    const finish = () => {
      frameRef.current = null;
      applyPose(target);
      svg?.removeAttribute('data-animating');
      latestRef.current.onAnimationComplete?.(active);
    };

    const length = speed > 0 && Number.isFinite(speed) ? duration / speed : 0;

    if (!(length > 0) || typeof requestAnimationFrame !== 'function' || prefersReducedMotion(svg)) {
      finish();
      return undefined;
    }

    // Start from wherever the icon is, so interrupted animations reverse smoothly.
    const motion = definition.motion(poseRef.current, active);
    const total = length * motion.durationScale;
    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / total, 1);

      applyPose(motion.poseAt(t));

      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else finish();
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [active, definition, duration, speed]);

  const hasLabel = Boolean(props['aria-label'] || props['aria-labelledby']);
  const pixelSize = typeof size === 'number' ? size : undefined;

  return (
    <svg
      aria-hidden={hasLabel ? undefined : true}
      fill="currentColor"
      focusable="false"
      role={hasLabel ? 'img' : undefined}
      viewBox={definition.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={classNames('mole-animated-icon', className)}
      data-name={name}
      data-size={pixelSize === undefined ? size : undefined}
      data-state={definition.states[active ? 1 : 0]}
      ref={setRefs}
      style={pixelSize === undefined ? style : { height: pixelSize, width: pixelSize, ...style }}
    >
      {content}
    </svg>
  );
});

/**
 * Icons that animate between two states, e.g. `<AnimatedIcon name="lock" active={locked} />`.
 * Speed, sound and reduced-motion handling are shared by every icon.
 */
export const AnimatedIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(function AnimatedIcon(props, ref) {
  // Remount when the icon changes so each icon starts from its own rest pose.
  return <AnimatedIconInner {...props} definition={ANIMATED_ICONS[props.name]} key={props.name} ref={ref} />;
});
