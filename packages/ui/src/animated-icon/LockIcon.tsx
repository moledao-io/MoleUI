import { forwardRef } from 'react';

import { AnimatedIcon, type AnimatedIconProps } from './AnimatedIcon';

export interface LockIconProps extends Omit<AnimatedIconProps, 'name' | 'active' | 'onAnimationComplete'> {
  locked: boolean;
  onAnimationComplete?: (locked: boolean) => void;
}

/** Shorthand for `<AnimatedIcon name="lock" active={locked} />`. */
export const LockIcon = forwardRef<SVGSVGElement, LockIconProps>(function LockIcon({ locked, ...props }, ref) {
  return <AnimatedIcon {...props} active={locked} name="lock" ref={ref} />;
});
