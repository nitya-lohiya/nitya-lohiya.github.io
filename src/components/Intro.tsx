import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { profile, trail } from '../data/content';
import { easeInOutSine, prefersReducedMotion } from '../lib/motion';
import { elevationAt } from '../lib/trail';
import { IntroScene, SUMMIT, TRAIL_POINTS } from './IntroScene';

export const INTRO_KEY = 'intro-seen';

/**
 * Pacing, in ms. The climb takes about a second per stop, and then the intro waits at the
 * summit for as long as the visitor likes: it only leaves when they press "Start the hike".
 */
export const INTRO_TIMING = { climbStart: 2200, climbEnd: 8200, exitLength: 950 };
export type IntroTiming = typeof INTRO_TIMING;

/** How far along the trail each stop sits (0 = trailhead, 1 = summit). */
export const STOP_AT = trail.map((_, i) => i / (trail.length - 1));

/** Which stop the hiker has reached for climb progress `t` in [0, 1], and the fraction to the next. */
export function climbAt(t: number) {
  const span = trail.length - 1;
  const exact = Math.min(1, Math.max(0, t)) * span;
  const index = Math.min(span, Math.floor(exact));
  return { index, fraction: index === span ? 0 : exact - index };
}

function shouldPlay() {
  if (prefersReducedMotion()) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1';
  } catch {
    return true;
  }
}

type Marker = { x: number; y: number; label: string };
const fallbackMarkers = (): Marker[] =>
  STOP_AT.map((f, i) => {
    const p = TRAIL_POINTS[Math.round(f * (TRAIL_POINTS.length - 1))]!;
    return { x: p[0], y: p[1], label: trail[i]!.label };
  });

/**
 * The trailhead: a short opener for first-time visitors. A national-park style poster inks
 * itself, the route is laid out as an itinerary, a hiker climbs the trail ticking off each stop,
 * a flag goes up on the summit, and the scene pushes in to reveal the site.
 *
 * Once per session; "Start the hike" (or Escape/Enter) leaves at any moment; never with reduced motion.
 */
export function Intro({ timing = INTRO_TIMING }: { timing?: IntroTiming }) {
  // Depend on the numbers, not the object, so a new `timing` object each render can't restart the clock.
  const { climbStart, climbEnd, exitLength } = timing;
  const [phase, setPhase] = useState<'off' | 'play' | 'exit'>(() => (shouldPlay() ? 'play' : 'off'));
  const [t, setT] = useState(0);
  const [hiker, setHiker] = useState({ x: TRAIL_POINTS[0]![0], y: TRAIL_POINTS[0]![1] });
  const [markers, setMarkers] = useState<Marker[]>(fallbackMarkers);
  const trailRef = useRef<SVGPathElement>(null);

  const finish = useCallback(() => setPhase((p) => (p === 'play' ? 'exit' : p)), []);

  // Place the trail markers exactly on the drawn path, once it exists.
  useLayoutEffect(() => {
    const path = trailRef.current;
    if (phase === 'off' || !path || typeof path.getTotalLength !== 'function') return;
    const len = path.getTotalLength();
    if (!len) return;
    setMarkers(
      STOP_AT.map((f, i) => {
        const p = path.getPointAtLength(f * len);
        return { x: p.x, y: p.y, label: trail[i]!.label };
      }),
    );
  }, [phase]);

  // Seen as soon as it starts, so a reload mid-climb goes straight to the site.
  useEffect(() => {
    if (phase !== 'play') return;
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
  }, [phase]);

  // The clock: drives the climb, then stops at the summit and waits for the visitor.
  useEffect(() => {
    if (phase !== 'play') return;
    const start = performance.now();
    const path = trailRef.current;
    const len = path && typeof path.getTotalLength === 'function' ? path.getTotalLength() : 0;
    let frame = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      const raw = (elapsed - climbStart) / (climbEnd - climbStart);
      const climb = Math.min(1, Math.max(0, raw));
      setT(climb);
      if (path && len) {
        const p = path.getPointAtLength(easeInOutSine(climb) * len);
        setHiker({ x: p.x, y: p.y });
      }
      if (climb < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, climbStart, climbEnd]);

  useEffect(() => {
    if (phase !== 'exit') return;
    const id = window.setTimeout(() => setPhase('off'), exitLength);
    return () => window.clearTimeout(id);
  }, [phase, exitLength]);

  // While it plays: hold the page still, hide it from assistive tech, and listen for skips.
  useEffect(() => {
    if (phase === 'off') return;
    const root = document.documentElement;
    const behind = [...document.querySelectorAll<HTMLElement>('header.nav, main, footer')];
    root.classList.add('intro-open');
    behind.forEach((el) => el.setAttribute('inert', ''));
    const onKey = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && finish();
    window.addEventListener('keydown', onKey);
    return () => {
      root.classList.remove('intro-open');
      behind.forEach((el) => el.removeAttribute('inert'));
      window.removeEventListener('keydown', onKey);
    };
  }, [phase, finish]);

  if (phase === 'off') return null;

  const eased = easeInOutSine(t);
  const { index, fraction } = climbAt(eased);
  const elevation = elevationAt(trail, index, fraction);
  const atSummit = t >= 1;
  const reached = (i: number) => t > 0 && eased >= STOP_AT[i]! - 0.001;

  return (
    <div className={`intro-screen${phase === 'exit' ? ' is-leaving' : ''}`} data-testid="intro" role="dialog" aria-label="Intro">
      <div className="intro-screen__scene">
        <IntroScene
          ref={trailRef}
          markers={markers.map((m, i) => ({ ...m, up: reached(i) }))}
          summit={atSummit}
          progress={eased}
        />
        <svg className="intro-screen__hiker-layer" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <circle className="intro-screen__hiker" cx={hiker.x} cy={hiker.y} r="9" style={{ opacity: t > 0 && !atSummit ? 1 : 0 }} />
          <circle className="intro-screen__summit-dot" cx={SUMMIT.x} cy={SUMMIT.y} r="9" style={{ opacity: atSummit ? 1 : 0 }} />
        </svg>
      </div>

      <div className="intro-screen__guide">
        <p className="intro-screen__coords eyebrow">
          <span className="intro-screen__type">40.12° N, 88.24° W · Trailhead</span>
        </p>
        <h2 className="intro-screen__name">{profile.name}</h2>
        <p className="intro-screen__hand">a field guide to my work</p>

        <div className="intro-screen__route">
          <p className="intro-screen__route-title">The route</p>
          <ol>
            {trail.map((stop, i) => (
              <li key={stop.id} className={reached(i) ? 'is-done' : undefined} style={{ animationDelay: `${0.7 + i * 0.09}s` }}>
                <span className="intro-screen__check" aria-hidden="true" />
                <span className="intro-screen__stop">{stop.stop}</span>
                <span className="intro-screen__section">{stop.label}</span>
                <span className="intro-screen__ft">{stop.elevation.toLocaleString('en-US')} ft</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="intro-screen__readout" aria-hidden="true">
          <span className="intro-screen__elev">{elevation.toLocaleString('en-US')}</span>
          <span className="intro-screen__unit">
            ft
            <span>{atSummit ? 'Summit reached' : t > 0 ? trail[index]!.stop : 'Lacing up…'}</span>
          </span>
        </div>

        <div className={`intro-screen__go${atSummit ? ' is-ready' : ''}`}>
          <button type="button" className="btn btn--primary" onClick={finish}>
            Start the hike <span aria-hidden="true">→</span>
          </button>
          <span className="intro-screen__go-note" aria-hidden="true">
            {atSummit ? 'made it! ready when you are' : 'or watch the climb'}
          </span>
        </div>
      </div>
    </div>
  );
}
