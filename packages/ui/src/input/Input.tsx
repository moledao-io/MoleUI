import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { classNames } from '../shared/classnames';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  clearable?: boolean;
  endContent?: ReactNode;
  fullWidth?: boolean;
  helperText?: string;
  label?: string;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  showPasswordToggle?: boolean;
  size?: 'md' | 'lg';
  startContent?: ReactNode;
  status?: 'default' | 'success' | 'warning';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    clearable = false,
    defaultValue,
    disabled,
    endContent,
    fullWidth = false,
    helperText,
    id,
    label,
    onChange,
    onClear,
    onValueChange,
    readOnly,
    showPasswordToggle = false,
    size = 'lg',
    startContent,
    status = 'default',
    type = 'text',
    value,
    ...props
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? `mole-input-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [innerValue, setInnerValue] = useState(String(defaultValue ?? ''));
  const [passwordVisible, setPasswordVisible] = useState(false);
  const currentValue = value === undefined ? innerValue : String(value ?? '');
  const canTogglePassword = type === 'password' && showPasswordToggle;
  const canClear = clearable && currentValue.length > 0 && !disabled && !readOnly;
  const describedBy = [props['aria-describedby'], helperText && helperId].filter(Boolean).join(' ') || undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) setInnerValue(event.target.value);
    onChange?.(event);
    onValueChange?.(event.target.value);
  }

  function handleClear() {
    if (value === undefined) setInnerValue('');
    onValueChange?.('');
    onClear?.();
    inputRef.current?.focus();
  }

  return (
    <div
      className={classNames('mole-input-field', className)}
      data-disabled={disabled || undefined}
      data-full-width={fullWidth || undefined}
      data-read-only={readOnly || undefined}
      data-size={size}
      data-status={status}
    >
      {label && <label className="mole-input-field__label" htmlFor={inputId}>{label}</label>}
      <div className="mole-input-field__control">
        {startContent && <span className="mole-input-field__adornment">{startContent}</span>}
        <input
          {...props}
          aria-describedby={describedBy}
          aria-invalid={status === 'warning' || undefined}
          className="mole-input-field__input"
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          readOnly={readOnly}
          ref={(node) => {
            inputRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          type={canTogglePassword && passwordVisible ? 'text' : type}
          value={currentValue}
        />
        {endContent && <span className="mole-input-field__adornment">{endContent}</span>}
        {canClear && (
          <button aria-label="清空输入" className="mole-input-field__action" onClick={handleClear} type="button">
            <span aria-hidden="true" className="mole-input-field__icon mole-input-field__icon--clear" />
          </button>
        )}
        {canTogglePassword && (
          <button
            aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
            aria-pressed={passwordVisible}
            className="mole-input-field__action"
            disabled={disabled}
            onClick={() => setPasswordVisible((visible) => !visible)}
            type="button"
          >
            <span aria-hidden="true" className={`mole-input-field__icon mole-input-field__icon--${passwordVisible ? 'eye-closed' : 'eye'}`} />
          </button>
        )}
      </div>
      {helperText && (
        <div className="mole-input-field__helper" id={helperId} role={status === 'warning' ? 'alert' : undefined}>
          {status === 'warning' && <span aria-hidden="true" className="mole-input-field__icon mole-input-field__icon--error" />}
          <span>{helperText}</span>
        </div>
      )}
    </div>
  );
});
