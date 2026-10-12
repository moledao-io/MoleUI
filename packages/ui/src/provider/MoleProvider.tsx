import { useState, useSyncExternalStore, type HTMLAttributes, type ReactNode } from 'react';

import { createMoleRuntime } from '../runtime/createRuntime';
import { MoleRuntimeContext } from '../runtime/context';
import type { MoleMotionMode, MoleRuntime } from '../runtime/types';
import { classNames } from '../shared/classnames';

export interface MoleProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  density?: 'comfortable' | 'compact';
  locale?: string;
  motion?: MoleMotionMode;
  runtime?: MoleRuntime;
  theme?: 'light' | 'dark' | 'system';
}

export function MoleProvider({
  children,
  className,
  density = 'comfortable',
  lang,
  locale,
  motion = 'system',
  runtime,
  theme = 'system',
  ...props
}: MoleProviderProps) {
  const [fallbackRuntime] = useState(() => createMoleRuntime());
  const activeRuntime = runtime ?? fallbackRuntime;
  const snapshot = useSyncExternalStore(
    activeRuntime.subscribe,
    activeRuntime.getSnapshot,
    activeRuntime.getServerSnapshot,
  );
  const resolvedMotion = motion === 'system'
    ? (snapshot.preferences.reducedMotion ? 'reduced' : 'full')
    : motion;

  return (
    <MoleRuntimeContext.Provider value={activeRuntime}>
      <div
        className={classNames('mole-provider', className)}
        data-mole-color-scheme={snapshot.preferences.colorScheme}
        data-mole-compatibility={snapshot.compatibility}
        data-mole-density={density}
        data-mole-forced-colors={snapshot.preferences.forcedColors}
        data-mole-motion={resolvedMotion}
        data-mole-pointer={snapshot.capabilities.coarsePointer ? 'coarse' : 'fine'}
        data-mole-runtime-ready={snapshot.ready}
        data-mole-theme={theme}
        lang={locale ?? lang}
        {...props}
      >
        {children}
      </div>
    </MoleRuntimeContext.Provider>
  );
}
