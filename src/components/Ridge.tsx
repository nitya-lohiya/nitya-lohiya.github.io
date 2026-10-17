import type { CSSProperties } from 'react';
import { trail } from '../data/content';
import { RIDGE_H, RIDGE_W, positionOnTrail, ridgePoints, toPolyline, walkedPoints } from '../lib/trail';

const points = ridgePoints(trail);
const pct = (p: { x: number; y: number }) => ({ left: `${(p.x / RIDGE_W) * 100}%`, top: `${(p.y / RIDGE_H) * 100}%` });
const ft = (n: number) => `${n.toLocaleString('en-US')} ft`;

type Props = { index: number; fraction: number; onNavigate?: () => void };

/**
 * The trail navigator: a mountain ridge with a flag for every section. A hiker walks the ridge
 * as you scroll, the walked part of the trail darkens, and every flag is a link to its section.
 */
export function Ridge({ index, fraction, onNavigate }: Props) {
  const hiker = positionOnTrail(points, index, fraction);

  return (
    <div className="ridge" data-testid="ridge">
      <div className="ridge__track">
        <svg className="ridge__svg" viewBox={`0 0 ${RIDGE_W} ${RIDGE_H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <polyline className="ridge__line" points={toPolyline(points)} vectorEffect="non-scaling-stroke" />
          <polyline className="ridge__walked" points={toPolyline(walkedPoints(points, index, fraction))} vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="ridge__stops">
          {trail.map((stop, i) => {
            const at = points[i * 2]!;
            const state = i < index ? ' is-passed' : i === index ? ' is-here' : '';
            return (
              <li key={stop.id} className="ridge__item" style={{ left: pct(at).left } as CSSProperties}>
                <a
                  href={`#${stop.id}`}
                  className={`ridge__stop${state}`}
                  style={{ '--flag-top': pct(at).top } as CSSProperties}
                  aria-current={i === index ? 'location' : undefined}
                  aria-label={`${stop.label}: ${stop.stop}, ${ft(stop.elevation)}`}
                  data-tip={`${stop.stop} · ${ft(stop.elevation)}`}
                  onClick={onNavigate}
                >
                  <span className="ridge__flag" aria-hidden="true" />
                  <span className="ridge__label" aria-hidden="true">
                    {stop.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        <span className="ridge__hiker" style={pct(hiker)} aria-hidden="true" />
      </div>
    </div>
  );
}
