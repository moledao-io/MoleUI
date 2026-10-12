import {
  cloneElement,
  useId,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { classNames } from '../shared/classnames';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

type TriggerProps = { 'aria-describedby'?: string };

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  align?: TooltipAlign;
  children: ReactElement<TriggerProps>;
  content: ReactNode;
  open?: boolean;
  placement?: TooltipPlacement;
}

export function Tooltip({
  align = 'center',
  children,
  className,
  content,
  onBlur,
  onFocus,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  open,
  placement = 'top',
  ...props
}: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isOpen = open ?? visible;
  const trigger = cloneElement(children, {
    'aria-describedby': [children.props['aria-describedby'], id].filter(Boolean).join(' '),
  });

  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setVisible(false);
    onBlur?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLSpanElement>) {
    setVisible(true);
    onFocus?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === 'Escape') setVisible(false);
    onKeyDown?.(event);
  }

  function handleMouseEnter(event: MouseEvent<HTMLSpanElement>) {
    setVisible(true);
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLSpanElement>) {
    if (!event.currentTarget.contains(document.activeElement)) setVisible(false);
    onMouseLeave?.(event);
  }

  return (
    <span
      {...props}
      className={classNames('mole-tooltip', className)}
      data-align={align}
      data-open={isOpen || undefined}
      data-placement={placement}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      <span aria-hidden={!isOpen} className="mole-tooltip__bubble" id={id} role="tooltip">
        {content}
        <span aria-hidden="true" className="mole-tooltip__arrow" />
      </span>
    </span>
  );
}
