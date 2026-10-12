import type {
  MoleCapabilities,
  MoleCompatibilityMode,
  MolePreferences,
  MoleRuntimeSnapshot,
} from './types';

const SERVER_CAPABILITIES: Readonly<MoleCapabilities> = Object.freeze({
  coarsePointer: false,
  focusVisible: false,
  hover: false,
  inert: false,
  intersectionObserver: false,
  resizeObserver: false,
});

const SERVER_PREFERENCES: Readonly<MolePreferences> = Object.freeze({
  colorScheme: 'light',
  contrast: 'normal',
  forcedColors: false,
  reducedMotion: false,
});

function matches(query: string) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;

  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

function supports(condition: string) {
  if (typeof window === 'undefined' || typeof window.CSS?.supports !== 'function') return false;

  try {
    return window.CSS.supports(condition);
  } catch {
    return false;
  }
}

function resolveCompatibility(
  requested: MoleCompatibilityMode,
  capabilities: MoleCapabilities,
): Exclude<MoleCompatibilityMode, 'auto'> {
  if (requested !== 'auto') return requested;

  return capabilities.intersectionObserver && capabilities.resizeObserver
    ? 'modern'
    : 'compatible';
}

export function createServerSnapshot(
  requested: MoleCompatibilityMode = 'auto',
): MoleRuntimeSnapshot {
  return Object.freeze({
    capabilities: SERVER_CAPABILITIES,
    compatibility: requested === 'modern' ? 'modern' : 'compatible',
    preferences: SERVER_PREFERENCES,
    ready: false,
  });
}

export const DEFAULT_SERVER_SNAPSHOT = createServerSnapshot();

export function detectRuntimeSnapshot(
  requested: MoleCompatibilityMode = 'auto',
): MoleRuntimeSnapshot {
  if (typeof window === 'undefined') return createServerSnapshot(requested);

  const capabilities: MoleCapabilities = {
    coarsePointer: matches('(pointer: coarse)'),
    focusVisible: supports('selector(:focus-visible)'),
    hover: matches('(hover: hover)'),
    inert: typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype,
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
  };
  const preferences: MolePreferences = {
    colorScheme: matches('(prefers-color-scheme: dark)') ? 'dark' : 'light',
    contrast: matches('(prefers-contrast: more)') ? 'more' : 'normal',
    forcedColors: matches('(forced-colors: active)'),
    reducedMotion: matches('(prefers-reduced-motion: reduce)'),
  };

  return Object.freeze({
    capabilities: Object.freeze(capabilities),
    compatibility: resolveCompatibility(requested, capabilities),
    preferences: Object.freeze(preferences),
    ready: true,
  });
}

const MEDIA_QUERIES = [
  '(forced-colors: active)',
  '(hover: hover)',
  '(pointer: coarse)',
  '(prefers-color-scheme: dark)',
  '(prefers-contrast: more)',
  '(prefers-reduced-motion: reduce)',
] as const;

export function watchRuntimeEnvironment(onChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;

  const cleanups: Array<() => void> = [];

  for (const query of MEDIA_QUERIES) {
    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia(query);
    } catch {
      continue;
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange);
      cleanups.push(() => mediaQuery.removeEventListener('change', onChange));
    } else {
      mediaQuery.addListener(onChange);
      cleanups.push(() => mediaQuery.removeListener(onChange));
    }
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}
