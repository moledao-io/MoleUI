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
import {
  getShacklePath,
  LOCK_BODY_PATH,
  LOCK_VIEW_BOX,
  LOCKED_POSE,
  SHACKLE_CLIP_Y,
  SHACKLE_STROKE_WIDTH,
  UNLOCKED_POSE,
  type ShacklePose,
} from './geometry';
import {
  getMotionDurationScale,
  getMotionPose,
  LOCK_LAND_DAMPING,
  UNLOCK_LAND_DAMPING,
} from './motion';
import { playUnlockSound, preloadUnlockSound } from './sound';

export interface LockIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Lock state. Changing it plays the lock / unlock animation. */
  locked: boolean;
  /** `sm` 16px, `md` 20px, `lg` 24px, or any pixel number. */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Base animation length in milliseconds (at `speed` 1). */
  duration?: number;
  /**
   * Playback speed multiplier: 2 plays twice as fast, 0.5 half as fast.
   * The real length is `duration / speed`; 0 skips the animation.
   */
  speed?: number;
  /** Play the unlock sound when `locked` changes to `false`. */
  sound?: boolean;
  /** Unlock sound volume, 0–1. */
  soundVolume?: number;
  /** Called when an animation finishes (or immediately when motion is reduced). */
  onAnimationComplete?: (locked: boolean) => void;
}

function prefersReducedMotion(element: Element | null) {
  const mode = element?.closest('[data-mole-motion]')?.getAttribute('data-mole-motion');

  if (mode === 'reduced') return true;
  if (mode === 'full') return false;

  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

export const LockIcon = forwardRef<SVGSVGElement, LockIconProps>(function LockIcon(
  {
    className,
    duration = 380,
    locked,
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
  const clipId = `mole-lock-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const shackleRef = useRef<SVGPathElement>(null);
  const poseRef = useRef<ShacklePose>(locked ? LOCKED_POSE : UNLOCKED_POSE);
  const frameRef = useRef<number | null>(null);
  const completeRef = useRef(onAnimationComplete);
  // The shackle path is driven imperatively after mount, so React only renders the first pose.
  const [initialPath] = useState(() => getShacklePath(locked ? LOCKED_POSE : UNLOCKED_POSE));

  const wasLockedRef = useRef(locked);
  const soundRef = useRef({ enabled: sound, volume: soundVolume });

  useEffect(() => {
    completeRef.current = onAnimationComplete;
    soundRef.current = { enabled: sound, volume: soundVolume };
  });

  useEffect(() => {
    if (sound) preloadUnlockSound();
  }, [sound]);

  // Sound follows the state change itself, independent of motion settings or interrupted animations.
  useEffect(() => {
    const wasLocked = wasLockedRef.current;
    wasLockedRef.current = locked;

    if (wasLocked && !locked && soundRef.current.enabled) playUnlockSound(soundRef.current.volume);
  }, [locked]);

  const setRefs = useCallback(
    (node: SVGSVGElement | null) => {
      svgRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const applyPose = (pose: ShacklePose) => {
    poseRef.current = pose;
    shackleRef.current?.setAttribute('d', getShacklePath(pose));
  };

  useEffect(() => {
    const target = locked ? LOCKED_POSE : UNLOCKED_POSE;
    const svg = svgRef.current;
    const current = poseRef.current;

    // Already at rest in the requested state (first mount, Strict Mode re-run, timing change).
    if (frameRef.current === null && current.angle === target.angle && current.lift === target.lift) {
      return undefined;
    }

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    svg?.setAttribute('data-animating', 'true');

    const finish = () => {
      frameRef.current = null;
      applyPose(target);
      svg?.removeAttribute('data-animating');
      completeRef.current?.(locked);
    };

    const length = speed > 0 && Number.isFinite(speed) ? duration / speed : 0;

    if (!(length > 0) || typeof requestAnimationFrame !== 'function' || prefersReducedMotion(svg)) {
      finish();
      return undefined;
    }

    // Start from wherever the shackle is, so interrupted animations reverse smoothly.
    const motion = {
      from: poseRef.current,
      landDamping: locked ? LOCK_LAND_DAMPING : UNLOCK_LAND_DAMPING,
      toAngle: target.angle,
    };
    const total = length * getMotionDurationScale(motion.from, motion.toAngle);
    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / total, 1);

      applyPose(getMotionPose(motion, t));

      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else finish();
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [duration, locked, speed]);

  const hasLabel = Boolean(props['aria-label'] || props['aria-labelledby']);
  const pixelSize = typeof size === 'number' ? size : undefined;

  return (
    <svg
      aria-hidden={hasLabel ? undefined : true}
      fill="currentColor"
      focusable="false"
      role={hasLabel ? 'img' : undefined}
      viewBox={LOCK_VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={classNames('mole-lock-icon', className)}
      data-size={pixelSize === undefined ? size : undefined}
      data-state={locked ? 'locked' : 'unlocked'}
      ref={setRefs}
      style={pixelSize === undefined ? style : { height: pixelSize, width: pixelSize, ...style }}
    >
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id={clipId}>
          <rect height={SHACKLE_CLIP_Y + 100} width="400" x="-150" y="-100" />
        </clipPath>
      </defs>
      <path
        className="mole-lock-icon__shackle"
        clipPath={`url(#${clipId})`}
        d={initialPath}
        fill="none"
        ref={shackleRef}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={SHACKLE_STROKE_WIDTH}
      />
      <path className="mole-lock-icon__body" d={LOCK_BODY_PATH} />
    </svg>
  );
});
