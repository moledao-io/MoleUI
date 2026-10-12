import {
  createServerSnapshot,
  detectRuntimeSnapshot,
  watchRuntimeEnvironment,
} from './capabilities';
import { scheduleMoleTask } from './scheduler';
import type {
  MoleCapabilities,
  MoleRuntime,
  MoleRuntimeEvent,
  MoleRuntimeOptions,
  MoleRuntimeSnapshot,
} from './types';

function now() {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}

function snapshotsEqual(left: MoleRuntimeSnapshot, right: MoleRuntimeSnapshot) {
  return left.ready === right.ready
    && left.compatibility === right.compatibility
    && left.capabilities.coarsePointer === right.capabilities.coarsePointer
    && left.capabilities.focusVisible === right.capabilities.focusVisible
    && left.capabilities.hover === right.capabilities.hover
    && left.capabilities.inert === right.capabilities.inert
    && left.capabilities.intersectionObserver === right.capabilities.intersectionObserver
    && left.capabilities.resizeObserver === right.capabilities.resizeObserver
    && left.preferences.colorScheme === right.preferences.colorScheme
    && left.preferences.contrast === right.preferences.contrast
    && left.preferences.forcedColors === right.preferences.forcedColors
    && left.preferences.reducedMotion === right.preferences.reducedMotion;
}

const DIAGNOSTIC_CAPABILITIES: ReadonlyArray<keyof MoleCapabilities> = [
  'focusVisible',
  'inert',
  'intersectionObserver',
  'resizeObserver',
];

export function createMoleRuntime(options: MoleRuntimeOptions = {}): MoleRuntime {
  const requestedCompatibility = options.compatibility ?? 'auto';
  const serverSnapshot = createServerSnapshot(requestedCompatibility);
  const listeners = new Set<() => void>();
  let snapshot = serverSnapshot;
  let cleanupEnvironment: (() => void) | undefined;
  let active = false;
  let manuallyStarted = false;

  function diagnose(event: MoleRuntimeEvent) {
    try {
      options.onDiagnostic?.(event);
    } catch {
      // Diagnostics must never break UI rendering.
    }
  }

  function refresh() {
    const nextSnapshot = detectRuntimeSnapshot(requestedCompatibility);
    if (snapshotsEqual(snapshot, nextSnapshot)) return;
    snapshot = nextSnapshot;
    listeners.forEach((listener) => listener());
  }

  function activate() {
    if (active || typeof window === 'undefined') return;
    const startedAt = now();
    active = true;
    refresh();
    cleanupEnvironment = watchRuntimeEnvironment(refresh);
    diagnose({ duration: now() - startedAt, type: 'runtime-ready' });

    for (const capability of DIAGNOSTIC_CAPABILITIES) {
      if (!snapshot.capabilities[capability]) {
        diagnose({ capability, type: 'capability-missing' });
      }
    }
  }

  function deactivate() {
    if (!active) return;
    cleanupEnvironment?.();
    cleanupEnvironment = undefined;
    active = false;
  }

  return Object.freeze({
    getServerSnapshot: () => serverSnapshot,
    getSnapshot: () => snapshot,
    schedule: scheduleMoleTask,
    start() {
      manuallyStarted = true;
      activate();
    },
    stop() {
      manuallyStarted = false;
      if (listeners.size === 0) deactivate();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      activate();

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && !manuallyStarted) deactivate();
      };
    },
  });
}
