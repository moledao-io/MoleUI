import { forwardRef, type HTMLAttributes } from 'react';

import { classNames } from '../shared/classnames';
import type { IconName } from './names';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { className, name, size = 'md', ...props },
  ref,
) {
  const hasLabel = Boolean(props['aria-label']);

  return (
    <span
      {...props}
      aria-hidden={hasLabel ? undefined : true}
      className={classNames('mole-icon', className)}
      data-name={name}
      data-size={size}
      ref={ref}
      role={hasLabel ? 'img' : undefined}
    >
      <span aria-hidden="true" className="mole-icon__glyph" />
    </span>
  );
});
