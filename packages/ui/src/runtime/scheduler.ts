import type { MoleScheduleOptions, MoleTaskPriority } from './types';

export function scheduleMoleTask(
  priority: MoleTaskPriority,
  task: () => void,
  options: MoleScheduleOptions = {},
) {
  if (priority === 'visual' && typeof requestAnimationFrame === 'function') {
    const handle = requestAnimationFrame(() => task());
    return () => cancelAnimationFrame(handle);
  }

  if (priority === 'background' && typeof window !== 'undefined') {
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(() => task(), {
        timeout: options.timeout ?? 250,
      });
      return () => window.cancelIdleCallback(handle);
    }
  }

  const handle = setTimeout(task, priority === 'visual' ? 16 : 0);
  return () => clearTimeout(handle);
}
