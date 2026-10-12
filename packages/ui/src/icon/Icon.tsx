import { forwardRef, type CSSProperties, type HTMLAttributes, type SVGProps } from 'react';

import { classNames } from '../shared/classnames';
import { ICON_GLYPHS, type IconGlyphPart } from './glyph-data';
import { ICON_NODE_IDS, type IconName } from './names';

export type IconStrokeMode = 'auto' | 'fixed';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  strokeMode?: IconStrokeMode;
  strokeWidth?: number;
}

type IconStyle = CSSProperties & { '--mole-icon-stroke-width'?: string };

function getTransform([a, c, e, b, d, f]: IconGlyphPart['matrix']) {
  return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
}

function getStrokeLinecap(value: string | null): SVGProps<SVGPathElement>['strokeLinecap'] {
  if (value === 'ROUND') return 'round';
  if (value === 'SQUARE') return 'square';
  return 'butt';
}

function getStrokeLinejoin(value: string | null): SVGProps<SVGPathElement>['strokeLinejoin'] {
  if (value === 'ROUND') return 'round';
  if (value === 'BEVEL') return 'bevel';
  return 'miter';
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { className, name, size = 'md', strokeMode, strokeWidth, style, ...props },
  ref,
) {
  const hasLabel = Boolean(props['aria-label']);
  const resolvedStrokeMode = strokeMode ?? (strokeWidth === undefined ? 'auto' : 'fixed');
  const glyph = ICON_GLYPHS[ICON_NODE_IDS[name]]!;
  const resolvedStyle: IconStyle | undefined = strokeWidth === undefined
    ? style
    : { ...style, '--mole-icon-stroke-width': `${strokeWidth}px` };

  return (
    <span
      {...props}
      aria-hidden={hasLabel ? undefined : true}
      className={classNames('mole-icon', className)}
      data-name={name}
      data-size={size}
      data-stroke-mode={resolvedStrokeMode}
      ref={ref}
      role={hasLabel ? 'img' : undefined}
      style={resolvedStyle}
    >
      <span aria-hidden="true" className="mole-icon__glyph">
        <svg
          fill="none"
          focusable="false"
          height={glyph.height}
          overflow="visible"
          viewBox={`0 0 ${glyph.width} ${glyph.height}`}
          width={glyph.width}
          xmlns="http://www.w3.org/2000/svg"
        >
          {glyph.shapes.map((shape, index) => {
            const common = {
              fill: shape.fillOpacity === null ? 'none' : 'currentColor',
              fillOpacity: shape.fillOpacity ?? undefined,
              opacity: shape.opacity,
              stroke: shape.strokeOpacity === null ? 'none' : 'currentColor',
              strokeDasharray: shape.dashPattern.length ? shape.dashPattern.join(' ') : undefined,
              strokeLinecap: getStrokeLinecap(shape.strokeCap),
              strokeLinejoin: getStrokeLinejoin(shape.strokeJoin),
              strokeMiterlimit: shape.strokeMiterLimit ?? undefined,
              strokeOpacity: shape.strokeOpacity ?? undefined,
              strokeWidth: shape.strokeWidth === null
                ? undefined
                : resolvedStrokeMode === 'fixed'
                  ? 'var(--mole-icon-stroke-width, 1.5px)'
                  : shape.strokeWidth,
              transform: getTransform(shape.matrix),
              vectorEffect: resolvedStrokeMode === 'fixed' ? 'non-scaling-stroke' : undefined,
            } satisfies SVGProps<SVGPathElement>;

            if (shape.kind === 'rect') {
              return <rect height={shape.height} key={index} rx={shape.radius} width={shape.width} {...common} />;
            }

            if (shape.kind === 'ellipse') {
              return <ellipse cx={shape.width / 2} cy={shape.height / 2} key={index} rx={shape.width / 2} ry={shape.height / 2} {...common} />;
            }

            return (
              <path
                d={shape.d}
                fillRule={shape.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}
                key={index}
                {...common}
              />
            );
          })}
        </svg>
      </span>
    </span>
  );
});
