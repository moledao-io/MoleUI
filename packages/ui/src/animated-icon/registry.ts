import { lockIcon } from './icons/lock';
import type { AnimatedIconDefinition } from './types';

/**
 * Every animated icon, keyed by name. To add one: create `icons/<name>/index.tsx`
 * with `defineAnimatedIcon(...)` and register it here.
 */
export const ANIMATED_ICONS = {
  lock: lockIcon,
} satisfies Record<string, AnimatedIconDefinition>;

export type AnimatedIconName = keyof typeof ANIMATED_ICONS;

export const ANIMATED_ICON_NAMES = Object.keys(ANIMATED_ICONS) as AnimatedIconName[];
