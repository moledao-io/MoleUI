import { useContext, useSyncExternalStore } from 'react';

import { DEFAULT_SERVER_SNAPSHOT } from './capabilities';
import { MoleRuntimeContext } from './context';
import type { MoleCapabilities, MolePreferences, MoleRuntimeSnapshot } from './types';

const emptySubscribe = () => () => undefined;
const getDefaultSnapshot = () => DEFAULT_SERVER_SNAPSHOT;

export function useMoleRuntime(): MoleRuntimeSnapshot {
  const runtime = useContext(MoleRuntimeContext);

  return useSyncExternalStore(
    runtime?.subscribe ?? emptySubscribe,
    runtime?.getSnapshot ?? getDefaultSnapshot,
    runtime?.getServerSnapshot ?? getDefaultSnapshot,
  );
}

export function useMoleCapability(name: keyof MoleCapabilities) {
  const runtime = useContext(MoleRuntimeContext);

  return useSyncExternalStore(
    runtime?.subscribe ?? emptySubscribe,
    runtime
      ? () => runtime.getSnapshot().capabilities[name]
      : () => DEFAULT_SERVER_SNAPSHOT.capabilities[name],
    runtime
      ? () => runtime.getServerSnapshot().capabilities[name]
      : () => DEFAULT_SERVER_SNAPSHOT.capabilities[name],
  );
}

export function useMolePreference<K extends keyof MolePreferences>(name: K) {
  const runtime = useContext(MoleRuntimeContext);

  return useSyncExternalStore(
    runtime?.subscribe ?? emptySubscribe,
    runtime
      ? () => runtime.getSnapshot().preferences[name]
      : () => DEFAULT_SERVER_SNAPSHOT.preferences[name],
    runtime
      ? () => runtime.getServerSnapshot().preferences[name]
      : () => DEFAULT_SERVER_SNAPSHOT.preferences[name],
  );
}
