export type MoleCompatibilityMode = 'auto' | 'modern' | 'compatible';
export type MoleMotionMode = 'system' | 'full' | 'reduced';
export type MoleTaskPriority = 'visual' | 'background';

export interface MoleCapabilities {
  coarsePointer: boolean;
  focusVisible: boolean;
  hover: boolean;
  inert: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
}

export interface MolePreferences {
  colorScheme: 'light' | 'dark';
  contrast: 'normal' | 'more';
  forcedColors: boolean;
  reducedMotion: boolean;
}

export interface MoleRuntimeSnapshot {
  capabilities: Readonly<MoleCapabilities>;
  compatibility: Exclude<MoleCompatibilityMode, 'auto'>;
  preferences: Readonly<MolePreferences>;
  ready: boolean;
}

export type MoleRuntimeEvent =
  | { duration: number; type: 'runtime-ready' }
  | { capability: keyof MoleCapabilities; type: 'capability-missing' }
  | { component: string; feature: string; type: 'fallback-used' }
  | { error: unknown; source: string; type: 'runtime-error' };

export interface MoleScheduleOptions {
  timeout?: number;
}

export interface MoleRuntimeOptions {
  compatibility?: MoleCompatibilityMode;
  onDiagnostic?: (event: MoleRuntimeEvent) => void;
}

export interface MoleRuntime {
  getServerSnapshot: () => MoleRuntimeSnapshot;
  getSnapshot: () => MoleRuntimeSnapshot;
  schedule: (
    priority: MoleTaskPriority,
    task: () => void,
    options?: MoleScheduleOptions,
  ) => () => void;
  start: () => void;
  stop: () => void;
  subscribe: (listener: () => void) => () => void;
}
