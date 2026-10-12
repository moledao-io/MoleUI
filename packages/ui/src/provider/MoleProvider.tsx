import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../shared/classnames';

export interface MoleProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  density?: 'comfortable' | 'compact';
  theme?: 'light' | 'dark' | 'system';
}

export function MoleProvider({
  children,
  className,
  density = 'comfortable',
  theme = 'system',
  ...props
}: MoleProviderProps) {
  return (
    <div
      className={classNames('mole-provider', className)}
      data-mole-density={density}
      data-mole-theme={theme}
      {...props}
    >
      {children}
    </div>
  );
}
