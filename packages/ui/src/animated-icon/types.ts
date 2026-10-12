import type { ReactNode } from 'react';

/** A pose is a flat set of numbers the icon interpolates between (angles, offsets, progress…). */
export type AnimatedIconPose = Readonly<Record<string, number>>;

export interface AnimatedIconSound {
  /** Data URI or URL of the clip. */
  src: string;
  /** MIME type used with `canPlayType`; unsupported browsers stay silent. */
  type: string;
}

export interface AnimatedIconMotion<P extends AnimatedIconPose> {
  /** Share of the base duration this motion needs (e.g. less when reversing half-way). */
  durationScale: number;
  /** Pose at normalised time t ∈ [0, 1]. */
  poseAt: (t: number) => P;
}

export interface AnimatedIconRenderContext<P extends AnimatedIconPose> {
  /** Unique, CSS-safe id prefix for defs such as clip paths. */
  id: string;
  /** Pose to render on mount; later frames are applied with `applyPose`. */
  pose: P;
}

export interface AnimatedIconDefinition<P extends AnimatedIconPose = AnimatedIconPose> {
  viewBox: string;
  /** Base animation length in ms at `speed` 1. */
  duration: number;
  /** `data-state` values for `active={false}` and `active={true}`. */
  states: readonly [inactive: string, active: string];
  restPose: (active: boolean) => P;
  motion: (from: P, active: boolean) => AnimatedIconMotion<P>;
  /** Renders the SVG children once; animated parts should carry `data-part` attributes. */
  render: (context: AnimatedIconRenderContext<P>) => ReactNode;
  /** Writes a pose straight to the DOM every frame (no React re-render). */
  applyPose: (svg: SVGSVGElement, pose: P) => void;
  sounds?: {
    /** Played when `active` turns true. */
    activate?: AnimatedIconSound;
    /** Played when `active` turns false. */
    deactivate?: AnimatedIconSound;
  };
}

/** Keeps each icon's own pose type while storing all icons in one registry. */
export function defineAnimatedIcon<P extends AnimatedIconPose>(
  definition: AnimatedIconDefinition<P>,
): AnimatedIconDefinition {
  return definition as unknown as AnimatedIconDefinition;
}
