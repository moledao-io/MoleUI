import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { classNames } from '../shared/classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  endContent?: ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  startContent?: ReactNode;
  variant?:
    | 'primary'
    | 'destructive'
    | 'white-line'
    | 'secondary'
    | 'destructive-secondary'
    | 'link'
    | 'solid'
    | 'outline'
    | 'ghost'
    | 'danger';
}

const legacyVariants = {
  solid: 'primary',
  outline: 'white-line',
  ghost: 'link',
  danger: 'destructive',
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      disabled,
      endContent,
      fullWidth = false,
      iconOnly = false,
      loading = false,
      size = 'md',
      showIcon = true,
      startContent,
      type = 'button',
      variant = 'primary',
      ...props
    },
    ref,
  ) {
    const resolvedVariant = variant in legacyVariants
      ? legacyVariants[variant as keyof typeof legacyVariants]
      : variant;
    const isLink = resolvedVariant === 'link';
    const icon = loading ? (
      <span aria-hidden="true" className="mole-button__spinner" />
    ) : startContent ? (
      <span aria-hidden="true" className="mole-button__content">{startContent}</span>
    ) : endContent && iconOnly ? (
      <span aria-hidden="true" className="mole-button__content">{endContent}</span>
    ) : showIcon ? (
      <span
        aria-hidden="true"
        className={isLink ? 'mole-button__link-icon' : 'mole-button__default-icon'}
      />
    ) : null;

    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        className={classNames('mole-button', className)}
        data-full-width={fullWidth || undefined}
        data-icon-only={iconOnly || undefined}
        data-loading={loading || undefined}
        data-size={size}
        data-variant={resolvedVariant}
        disabled={disabled || loading}
        type={type}
        {...props}
      >
        {(!isLink || iconOnly || startContent || loading) && icon}
        {iconOnly ? (
          children && <span className="mole-sr-only">{children}</span>
        ) : (
          <span className="mole-button__label">{children}</span>
        )}
        {!iconOnly && (endContent ? (
          <span aria-hidden="true" className="mole-button__content">{endContent}</span>
        ) : isLink && showIcon && !loading ? (
          <span aria-hidden="true" className="mole-button__link-arrow" />
        ) : null)}
      </button>
    );
  },
);
