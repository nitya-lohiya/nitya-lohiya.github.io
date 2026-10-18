import { forwardRef } from 'react';
import { WildflowerPatch } from './Wildflowers';

/**
 * The intro's poster: a hand-inked mountain scene in the style of an old national-park print.
 * Every layer is drawn as an outline first (pathLength="1" lets CSS animate each stroke from 0
 * to 1) and then painted in. Coordinates are in a 1200 × 700 box.
 */

export const SCENE_W = 1200;
export const SCENE_H = 700;

/** Where the trail starts, every switchback, and the summit. */
export const TRAIL_POINTS: [number, number][] = [
  [392, 580],
  [520, 588],
  [452, 560],
  [610, 540],
  [530, 500],
  [660, 470],
  [610, 432],
  [700, 410],
  [668, 380],
  [752, 356],
  [790, 304],
  [815, 262],
  [840, 198],
];
export const SUMMIT = { x: 840, y: 190 };
export const trailD = `M${TRAIL_POINTS.map(([x, y]) => `${x} ${y}`).join(' L')}`;

const FAR = 'M0 430 L120 380 L210 405 L330 330 L430 370 L560 300 L700 350 L860 280 L980 330 L1100 300 L1200 340 L1200 700 L0 700 Z';
const MAIN =
  'M140 700 L330 520 L400 545 L520 420 L585 450 L700 300 L760 330 L840 190 L905 260 L960 240 L1060 380 L1120 360 L1200 430 L1200 700 Z';
const NEAR = 'M0 610 Q150 570 300 605 T600 598 T900 624 T1200 604 L1200 700 L0 700 Z';
const ROCK = 'M840 190 L806 292 L818 352 M840 190 L878 286 M700 300 L688 372 M520 420 L512 470 M960 240 L990 300';

// Pines along the foreground ridge: [x, ground y, scale]
const PINES: [number, number, number][] = [
  [40, 600, 1.1],
  [78, 594, 0.8],
  [180, 586, 1.3],
  [232, 594, 0.9],
  [905, 622, 1.2],
  [955, 620, 0.85],
  [1010, 614, 1.4],
  [1068, 608, 1],
  [1120, 604, 1.25],
  [1168, 604, 0.9],
];
const pine = (x: number, y: number, s: number) =>
  `M${x} ${y - 62 * s} L${x - 12 * s} ${y - 40 * s} L${x - 6 * s} ${y - 40 * s} L${x - 17 * s} ${y - 20 * s} L${x - 9 * s} ${y - 20 * s} L${x - 21 * s} ${y} L${x + 21 * s} ${y} L${x + 9 * s} ${y - 20 * s} L${x + 17 * s} ${y - 20 * s} L${x + 6 * s} ${y - 40 * s} L${x + 12 * s} ${y - 40 * s} Z`;

type Props = { markers: { x: number; y: number; label: string; up: boolean }[]; summit: boolean; progress: number };

export const IntroScene = forwardRef<SVGPathElement, Props>(function IntroScene({ markers, summit, progress }, trailRef) {
  return (
    <svg
      className="scene"
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* reveals the dashed trail progressively, following the hiker */}
        <mask id="trail-reveal">
          <path d={trailD} className="scene__trail-mask" pathLength={1} style={{ strokeDashoffset: 1 - progress }} />
        </mask>
      </defs>

      <circle className="scene__sun" cx="985" cy="168" r="58" />
      <g className="scene__sun-rays">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={985 + Math.cos(a) * 74}
              y1={168 + Math.sin(a) * 74}
              x2={985 + Math.cos(a) * 90}
              y2={168 + Math.sin(a) * 90}
            />
          );
        })}
      </g>

      {/* two slow clouds, so the scene stays alive while it waits at the summit */}
      <g className="scene__cloud scene__cloud--a">
        <path d="M250 150 q10 -26 38 -18 q14 -22 40 -8 q30 -6 30 20 q18 4 12 18 l-128 0 q-8 -10 8 -12 z" />
      </g>
      <g className="scene__cloud scene__cloud--b">
        <path d="M600 110 q8 -18 28 -12 q12 -16 30 -4 q22 -2 20 14 q12 4 8 12 l-92 0 q-6 -8 6 -10 z" />
      </g>

      <g className="scene__layer scene__layer--far">
        <path d={FAR} className="scene__fill" />
        <path d={FAR} className="scene__ink" pathLength={1} />
      </g>
      <g className="scene__layer scene__layer--main">
        <path d={MAIN} className="scene__fill" />
        <path d={MAIN} className="scene__ink" pathLength={1} />
        <path d={ROCK} className="scene__ink scene__ink--rock" pathLength={1} />
      </g>

      <g className="scene__layer scene__layer--near">
        <path d={NEAR} className="scene__fill" />
        <path d={NEAR} className="scene__ink" pathLength={1} />
        {PINES.map(([x, y, s], i) => (
          <path key={i} d={pine(x, y, s)} className="scene__pine" style={{ animationDelay: `${1.1 + i * 0.05}s` }} />
        ))}
        <g className="scene__flowers">
          <WildflowerPatch seed={11} count={18} width={330} x={262} ground={609} minH={14} maxH={30} />
          <WildflowerPatch seed={23} count={14} width={250} x={632} ground={614} minH={12} maxH={26} />
          <WildflowerPatch seed={5} count={7} width={110} x={1052} ground={611} minH={12} maxH={22} />
        </g>
      </g>

      {/* the trail, its markers, and the summit flag sit on top of every layer */}
      <path d={trailD} className="scene__trail" mask="url(#trail-reveal)" />
      <path d={trailD} ref={trailRef} className="scene__trail-guide" />

      {markers.map((m, i) => (
        <g key={m.label} className={`scene__marker${m.up ? ' is-up' : ''}`} style={{ transformOrigin: `${m.x}px ${m.y}px` }}>
          <rect x={m.x - 5} y={m.y - 5} width="10" height="10" transform={`rotate(45 ${m.x} ${m.y})`} />
          <text x={m.x + (i % 2 === 1 ? 16 : -16)} y={m.y + 4} textAnchor={i % 2 === 1 ? 'start' : 'end'}>
            {m.label}
          </text>
        </g>
      ))}

      <g className={`scene__flag${summit ? ' is-up' : ''}`} style={{ transformOrigin: `${SUMMIT.x}px ${SUMMIT.y}px` }}>
        <line x1={SUMMIT.x} y1={SUMMIT.y} x2={SUMMIT.x} y2={SUMMIT.y - 58} />
        <path d={`M${SUMMIT.x} ${SUMMIT.y - 58} L${SUMMIT.x + 34} ${SUMMIT.y - 48} L${SUMMIT.x} ${SUMMIT.y - 38} Z`} />
      </g>
    </svg>
  );
});
