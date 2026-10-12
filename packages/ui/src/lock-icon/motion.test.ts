import { describe, expect, it } from 'vitest';

import { LOCKED_POSE, UNLOCKED_POSE } from './geometry';
import { getMotionPose, LOCK_LAND_DAMPING } from './motion';

const lockMotion = { from: UNLOCKED_POSE, landDamping: LOCK_LAND_DAMPING, toAngle: LOCKED_POSE.angle };
const samples = Array.from({ length: 401 }, (_, index) => getMotionPose(lockMotion, index / 400));

describe('lock motion', () => {
  it('starts and ends exactly at the resting poses', () => {
    expect(getMotionPose(lockMotion, 0)).toEqual(UNLOCKED_POSE);
    expect(getMotionPose(lockMotion, 1)).toEqual(LOCKED_POSE);
  });

  it('overlaps the phases so the shackle never stops mid-way', () => {
    const still = samples.slice(1, -1).filter((pose, index) => {
      const previous = samples[index]!;
      return Math.abs(pose.angle - previous.angle) < 1e-6 && Math.abs(pose.lift - previous.lift) < 1e-6;
    });
    expect(still.length).toBeLessThan(4);
  });

  it('clicks into place with a small overshoot', () => {
    const lowest = Math.min(...samples.map((pose) => pose.lift));
    expect(lowest).toBeLessThan(0);
    expect(lowest).toBeGreaterThan(-0.15);
  });
});
