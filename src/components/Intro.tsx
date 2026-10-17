import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { profile, trail } from '../data/content';
import { prefersReducedMotion } from '../lib/motion';
import { RIDGE_H, RIDGE_W, elevationAt, positionOnTrail, ridgePoints, toPolyline, walkedPoints } from '../lib/trail';

export const INTRO_KEY = 'intro-seen';

/** How the intro is paced, in ms. The climb is the middle stretch. */
export const INTRO_TIMING = { climbStart: 450, climbEnd: 1850, exitAt: 2250, gone: 2950 };

const points = ridgePoints(trail);
const pct = (p: { x: number; y: number }) => ({ left: `${(p.x / RIDGE_W) * 100}%`, top: `${(p.y / RIDGE_H) * 100}%` });

/** Where the hiker is on the trail for a climb progress `t` in [0, 1]. */
export function climbAt(t: number) {
  const span = trail.length - 1;
  const exact = Math.min(1, Math.max(0, t)) * span;
  const index = Math.min(span, Math.floor(exact));
  const fraction = index === span ? 0 : exact - index;
  return { index, fraction };
}

function shouldPlay() {
  if (prefersReducedMotion()) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1';
  } catch {
    return true;
  }
}

/**
 * The trailhead: a 2–3 second intro that previews the route (every section is a flag on the
 * ridge), climbs it, and then lifts away like a map to reveal the site. Plays once per session,
 * can be skipped with a click, the button, or Escape, and never plays with reduced motion.
 */
export function Intro() {
  const [phase, setPhase] = useState<'off' | 'climb' | 'exit'>(() => (shouldPlay() ? 'climb' : 'off'));
  const [t, setT] = useState(0);

  const finish = useCallback(() => setPhase((p) => (p === 'off' ? p : 'exit')), []);

  // Mark it seen as soon as it starts, so a reload mid-climb doesn't replay it.
  useEffect(() => {
    if (phase !== 'climb') return;
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
  }, [phase]);

  // Drive the climb, then lift the card away.
  useEffect(() => {
    if (phase !== 'climb') return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      const { climbStart, climbEnd, exitAt } = INTRO_TIMING;
      const raw = (elapsed - climbStart) / (climbEnd - climbStart);
      setT(Math.min(1, Math.max(0, raw)));
      if (elapsed >= exitAt) finish();
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, finish]);

  useEffect(() => {
    if (phase !== 'exit') return;
    const id = window.setTimeout(() => setPhase('off'), INTRO_TIMING.gone - INTRO_TIMING.exitAt);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Hold the page still while the intro is up, and let Escape skip it.
  useEffect(() => {
    if (phase === 'off') return;
    const root = document.documentElement;
    root.classList.add('intro-open');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish();
    window.addEventListener('keydown', onKey);
    return () => {
      root.classList.remove('intro-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [phase, finish]);

  if (phase === 'off') return null;

  const { index, fraction } = climbAt(t);
  const hiker = positionOnTrail(points, index, fraction);
  const elevation = elevationAt(trail, index, fraction);
  const here = trail[index] ?? trail[0];
  const atSummit = t >= 1;

  return (
    <div
      className={`intro-screen${phase === 'exit' ? ' is-leaving' : ''}`}
      data-testid="intro"
      onClick={finish}
      role="presentation"
    >
      <div className="intro-screen__topo" aria-hidden="true" />

      <div className="intro-screen__card container">
        <p className="intro-screen__coords eyebrow">
          <span className="intro-screen__type">40.12° N, 88.24° W · Trailhead</span>
        </p>
        <p className="intro-screen__name">{profile.name}</p>
        <p className="intro-screen__line">
          You’re about to hike through my work. <span className="intro-screen__soft">{trail.length - 1} stops to the summit.</span>
        </p>

        <div className="intro-screen__ridge" aria-hidden="true">
          <svg viewBox={`0 0 ${RIDGE_W} ${RIDGE_H}`} preserveAspectRatio="none">
            <polyline className="intro-screen__line-base" points={toPolyline(points)} vectorEffect="non-scaling-stroke" />
            <polyline
              className="intro-screen__line-walked"
              points={toPolyline(walkedPoints(points, index, fraction))}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {trail.map((stop, i) => {
            const at = points[i * 2]!;
            const reached = i < index || (i === index && (fraction > 0 || i === 0)) || atSummit;
            return (
              <span
                key={stop.id}
                className={`intro-screen__flag${reached ? ' is-up' : ''}${i === trail.length - 1 ? ' is-summit' : ''}`}
                style={{ ...pct(at), '--i': i } as CSSProperties}
              >
                <span className="intro-screen__flag-label">{stop.label}</span>
              </span>
            );
          })}
          <span className="intro-screen__hiker" style={pct(hiker)} />
        </div>

        <div className="intro-screen__readout" aria-hidden="true">
          <span>
            <span className="intro-screen__elev">{elevation.toLocaleString('en-US')}</span> ft
          </span>
          <span className="intro-screen__stop">{atSummit ? 'Summit' : here.stop}</span>
        </div>

        <p className={`intro-screen__go${atSummit ? ' is-shown' : ''}`} aria-hidden="true">
          the summit’s waiting. let’s go ↓
        </p>
      </div>

      <button
        type="button"
        className="intro-screen__skip"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
      >
        Skip the hike <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
