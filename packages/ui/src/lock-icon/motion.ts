import type { ShacklePose } from './geometry';

/**
 * One continuous timeline instead of three back-to-back phases.
 * The phases overlap so the shackle never comes to a full stop mid-animation:
 *
 *   τ  0 ─────── 0.32                     lift (ease in-out)
 *          0.16 ─────────────── 0.74      turn (cos projection gives a natural 3D ease)
 *                         0.66 ───── 1    land (spring: zero start velocity, small overshoot)
 */
const RISE_END = 0.32;
const TURN_START = 0.16;
const TURN_END = 0.74;
const LAND_START = 0.66;
const SPRING_STIFFNESS = 7.5;

/** Spring damping for the landing: lower = bouncier. */
export const LOCK_LAND_DAMPING = 0.58; // a short "click" into the body
export const UNLOCK_LAND_DAMPING = 0.78; // softer settle when the open shackle drops

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

/** Damped spring step response, normalised so it ends exactly at 1 when u = 1. */
function spring(value: number, damping: number) {
  const t = clamp01(value);
  if (t === 0) return 0;

  const decay = damping * SPRING_STIFFNESS;
  const frequency = SPRING_STIFFNESS * Math.sqrt(1 - damping * damping);
  const response = (x: number) =>
    1 - Math.exp(-decay * x) * (Math.cos(frequency * x) + (decay / frequency) * Math.sin(frequency * x));

  return response(t) + (1 - response(1)) * smoothstep(t);
}

export interface LockMotion {
  /** Pose the animation starts from (a resting pose, or wherever an interrupted animation was). */
  from: ShacklePose;
  /** 0 to lock, 180 to unlock. */
  toAngle: number;
  landDamping: number;
}

/** Shackle pose at normalised time τ ∈ [0, 1]. */
export function getMotionPose({ from, landDamping, toAngle }: LockMotion, time: number): ShacklePose {
  const rise = smoothstep(time / RISE_END);
  const land = spring((time - LAND_START) / (1 - LAND_START), landDamping);
  const turn = clamp01((time - TURN_START) / (TURN_END - TURN_START));
  // Half linear, half smoothstep: cos() already slows the turn near 0°/180°,
  // so a full ease-in-out there would feel sticky at both ends.
  const turnEased = 0.5 * turn + 0.5 * smoothstep(turn);

  return {
    angle: from.angle + (toAngle - from.angle) * turnEased,
    lift: from.lift + (1 - from.lift) * rise - land,
  };
}

/** Duration share needed for a motion: shorter when there is less turning left to do. */
export function getMotionDurationScale(from: ShacklePose, toAngle: number) {
  return 0.45 + 0.55 * Math.min(Math.abs(toAngle - from.angle) / 180, 1);
}
