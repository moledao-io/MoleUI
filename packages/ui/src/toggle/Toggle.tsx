import { forwardRef, useState, type ButtonHTMLAttributes, type MouseEvent } from 'react';

import { classNames } from '../shared/classnames';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  label: string;
  offText?: string;
  onCheckedChange?: (checked: boolean) => void;
  onText?: string;
  showText?: boolean;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    className,
    defaultChecked = false,
    disabled,
    label,
    offText = 'No',
    onCheckedChange,
    onClick,
    onText = 'Yes',
    showText = false,
    ...props
  },
  ref,
) {
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const isChecked = checked ?? innerChecked;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (checked === undefined) setInnerChecked(!isChecked);
    onCheckedChange?.(!isChecked);
    onClick?.(event);
  }

  return (
    <button
      {...props}
      aria-checked={isChecked}
      aria-label={label}
      className={classNames('mole-toggle', className)}
      data-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      role="switch"
      type="button"
    >
      {showText && <span aria-hidden="true" className="mole-toggle__text">{isChecked ? onText : offText}</span>}
      <span aria-hidden="true" className="mole-toggle__thumb" />
    </button>
  );
});
