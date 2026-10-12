import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { scheduleMoleTask } from '../runtime/scheduler';
import { classNames } from '../shared/classnames';

export interface DeferredRenderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  disabled?: boolean;
  fallback?: ReactNode;
  minHeight?: CSSProperties['minHeight'];
  onVisible?: () => void;
  rootMargin?: string;
  ssr?: 'content' | 'fallback';
  threshold?: number | number[];
}

export function DeferredRender({
  children,
  className,
  disabled = false,
  fallback = null,
  minHeight,
  onVisible,
  rootMargin = '200px 0px',
  ssr = 'fallback',
  style,
  threshold = 0,
  ...props
}: DeferredRenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(disabled || ssr === 'content');

  useEffect(() => {
    if (rendered) return;

    function reveal() {
      setRendered(true);
      onVisible?.();
    }

    if (disabled || typeof IntersectionObserver === 'undefined') {
      return scheduleMoleTask('visual', reveal);
    }

    const container = containerRef.current;
    if (!container) return;

    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        reveal();
      }, { rootMargin, threshold });
      observer.observe(container);
    } catch {
      return scheduleMoleTask('visual', reveal);
    }

    return () => observer.disconnect();
  }, [disabled, onVisible, rendered, rootMargin, threshold]);

  return (
    <div
      {...props}
      aria-busy={rendered ? undefined : true}
      className={classNames('mole-deferred-render', className)}
      data-mole-rendered={rendered}
      ref={containerRef}
      style={{ minHeight: rendered ? undefined : minHeight, ...style }}
    >
      {rendered ? children : fallback}
    </div>
  );
}
