import { defineAnimatedIcon } from '../../types';
import {
  getShacklePath,
  LOCK_BODY_PATH,
  LOCK_VIEW_BOX,
  LOCKED_POSE,
  SHACKLE_CLIP_Y,
  SHACKLE_STROKE_WIDTH,
  type ShacklePose,
  UNLOCKED_POSE,
} from './geometry';
import {
  getMotionDurationScale,
  getMotionPose,
  LOCK_LAND_DAMPING,
  UNLOCK_LAND_DAMPING,
} from './motion';
import { UNLOCK_SOUND } from './sound-data';

/**
 * Lock — Figma "Moledao.io Web Compontes" node 61:1838.
 * `active` = locked. The shackle lifts, swings 180° around its left leg and drops back in.
 */
export const lockIcon = defineAnimatedIcon<ShacklePose>({
  viewBox: LOCK_VIEW_BOX,
  duration: 380,
  states: ['unlocked', 'locked'],
  restPose: (active) => (active ? LOCKED_POSE : UNLOCKED_POSE),
  motion: (from, active) => {
    const motion = {
      from,
      landDamping: active ? LOCK_LAND_DAMPING : UNLOCK_LAND_DAMPING,
      toAngle: active ? LOCKED_POSE.angle : UNLOCKED_POSE.angle,
    };

    return {
      durationScale: getMotionDurationScale(from, motion.toAngle),
      poseAt: (t) => getMotionPose(motion, t),
    };
  },
  render: ({ id, pose }) => (
    <>
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id={`${id}-clip`}>
          <rect height={SHACKLE_CLIP_Y + 100} width="400" x="-150" y="-100" />
        </clipPath>
      </defs>
      <path
        clipPath={`url(#${id}-clip)`}
        d={getShacklePath(pose)}
        data-part="shackle"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={SHACKLE_STROKE_WIDTH}
      />
      <path d={LOCK_BODY_PATH} data-part="body" />
    </>
  ),
  applyPose: (svg, pose) => {
    svg.querySelector('[data-part="shackle"]')?.setAttribute('d', getShacklePath(pose));
  },
  sounds: { deactivate: UNLOCK_SOUND },
});
