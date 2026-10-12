import { createContext } from 'react';

import type { MoleRuntime } from './types';

export const MoleRuntimeContext = createContext<MoleRuntime | null>(null);
