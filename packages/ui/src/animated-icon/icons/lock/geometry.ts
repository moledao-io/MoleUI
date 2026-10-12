/**
 * Lock geometry traced from Figma "Moledao.io Web Compontes" node 61:1838.
 * Coordinates are relative to the lock body (body spans x 0–149.45).
 *
 * The shackle is drawn as a stroked centre line so it can be "rotated" around
 * its left leg (Y axis) by projecting x with cos(angle). At 90° the projection
 * collapses into the single rounded bar seen in the middle Figma frame.
 */
export const LOCK_BODY_PATH =
  'M136.26 87.31C139.86 87.31 142.95 88.61 145.55 91.21C148.15 93.81 149.45 96.9 149.45 100.5V162.44C149.45 166.04 148.82 169.4 147.55 172.53C146.28 175.66 144.55 178.39 142.36 180.72C140.16 183.05 137.56 184.88 134.57 186.21C131.57 187.54 128.28 188.21 124.68 188.21H23.78C20.18 188.21 16.92 187.54 13.99 186.21C11.06 184.88 8.56 183.11 6.5 180.92C4.44 178.72 2.84 176.16 1.7 173.23C0.57 170.3 0 167.17 0 163.84V100.5C0 96.9 1.27 93.81 3.8 91.21C6.33 88.61 9.39 87.31 12.99 87.31H136.26Z';

/** Square viewBox covering every pose: open shackle (x −49.65) and lifted shackle (y −20). */
export const LOCK_VIEW_BOX = '-54.2 -20 208.21 208.21';

const AXIS_X = 37.565; // centre of the leg the shackle pivots around
const RADIUS_X = 37.31; // half the distance between leg centres
const ARC_TOP_Y = 12.59; // centre line at the top of the arc
const ARC_START_Y = 48.75; // where the straight legs meet the arc
const RADIUS_Y = ARC_START_Y - ARC_TOP_Y;
const LEG_END_Y = 130; // legs run into the body; hidden by the clip below
const KAPPA = 0.5523; // cubic Bézier approximation of a quarter ellipse
const MIN_PROJECTION = 0.02; // keeps the edge-on pose a rounded bar, not a degenerate line

export const SHACKLE_STROKE_WIDTH = 25.17;
export const SHACKLE_LIFT = 20;
/** Shackle is only visible above this line, leaving the gap above the body. */
export const SHACKLE_CLIP_Y = 75.33;

export type ShacklePose = {
  /** 0 = angle 0° (closed over the body), 180 = swung out to the left (open). */
  angle: number;
  /** 0 = resting, 1 = lifted by SHACKLE_LIFT units. */
  lift: number;
};

export const LOCKED_POSE: ShacklePose = { angle: 0, lift: 0 };
export const UNLOCKED_POSE: ShacklePose = { angle: 180, lift: 0 };

const round = (value: number) => Math.round(value * 100) / 100;

export function getShacklePath({ angle, lift }: ShacklePose) {
  let projection = Math.cos((angle * Math.PI) / 180);

  if (Math.abs(projection) < MIN_PROJECTION) {
    projection = projection < 0 ? -MIN_PROJECTION : MIN_PROJECTION;
  }

  const dy = -lift * SHACKLE_LIFT;
  const x = (offset: number) => round(AXIS_X + offset * projection);
  const y = (value: number) => round(value + dy);
  const rx = RADIUS_X;
  const ry = RADIUS_Y;

  return [
    `M${x(0)} ${y(LEG_END_Y)}`,
    `L${x(0)} ${y(ARC_START_Y)}`,
    `C${x(0)} ${y(ARC_START_Y - KAPPA * ry)} ${x(rx - KAPPA * rx)} ${y(ARC_TOP_Y)} ${x(rx)} ${y(ARC_TOP_Y)}`,
    `C${x(rx + KAPPA * rx)} ${y(ARC_TOP_Y)} ${x(2 * rx)} ${y(ARC_START_Y - KAPPA * ry)} ${x(2 * rx)} ${y(ARC_START_Y)}`,
    `L${x(2 * rx)} ${y(LEG_END_Y)}`,
  ].join('');
}
