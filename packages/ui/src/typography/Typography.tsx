import { createElement, type HTMLAttributes, type ReactNode } from 'react';

import { classNames } from '../shared/classnames';

export type TypographyLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-large' | 'body' | 'body-small' | 'caption';
export type TypographyState = 'default' | 'secondary' | 'success' | 'warning' | 'disabled' | 'mark' | 'link' | 'delete';
export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'a';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: TypographyElement;
  children: ReactNode;
  href?: string;
  level?: TypographyLevel;
  rel?: string;
  state?: TypographyState;
  target?: string;
}

const defaultElements: Record<TypographyLevel, TypographyElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'body-large': 'p',
  body: 'p',
  'body-small': 'p',
  caption: 'span',
};

export function Typography({
  as,
  children,
  className,
  href,
  level = 'body',
  rel,
  state = 'default',
  target,
  ...props
}: TypographyProps) {
  const element = as ?? (state === 'link' && href ? 'a' : defaultElements[level]);
  const content = state === 'mark' ? (
    <mark className="mole-typography__mark">{children}</mark>
  ) : state === 'delete' ? (
    <del className="mole-typography__delete">{children}</del>
  ) : state === 'link' ? (
    <>
      <span className="mole-typography__content">{children}</span>
      <span aria-hidden="true" className="mole-typography__arrow">→</span>
    </>
  ) : children;

  return createElement(element, {
    ...props,
    className: classNames('mole-typography', className),
    'data-level': level,
    'data-state': state,
    ...(element === 'a' ? { href, rel, target } : {}),
  }, content);
}
