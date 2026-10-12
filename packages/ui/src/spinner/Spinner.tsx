import type { HTMLAttributes } from 'react';

import { classNames } from '../shared/classnames';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text announced to assistive technologies. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'current' | 'brand';
}

export function Spinner({
  className,
  label = '加载中',
  size = 'md',
  tone = 'current',
  ...props
}: SpinnerProps) {
  return (
    <span
      aria-live="polite"
      className={classNames('mole-spinner', className)}
      data-size={size}
      data-tone={tone}
      role="status"
      {...props}
    >
      <span aria-hidden="true" className="mole-spinner__indicator" />
      <span className="mole-sr-only">{label}</span>
    </span>
  );
}
