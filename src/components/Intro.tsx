import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { profile, trail } from '../data/content';
import { easeInOutSine, prefersReducedMotion } from '../lib/motion';
import { elevationAt } from '../lib/trail';
import { IntroScene, SUMMIT, TRAIL_POINTS } from './IntroScene';

export const INTRO_KEY = 'intro-seen';

/**
 * Pacing, in ms. Nothing moves on until the visitor presses "Start the hike"; then the camera
 * follows the hiker up the trail (about a second per stop), holds on the summit, and dives in.
 */
export const INTRO_TIMING = { hike: 6600, zoomIn: 900, summitHold: 1000, dive: 1000 };
export type IntroTiming = typeof INTRO_TIMING;

/** How close the camera follows the hiker. */
const FOLLOW_ZOOM = 2.1;
const DIVE_ZOOM = 7;

/** How far along the trail each stop sits (0 = trailhead, 1 = summit). */
export const STOP_AT = trail.map((_, i) => i / (trail.length - 1));

/** Which stop the hiker has reached for climb progress `t` in [0, 1], and the fraction to the next. */
export function climbAt(t: number) {
  const span = trail.length - 1;
  const exact = Math.min(1, Math.max(0, t)) * span;
  const index = Math.min(span, Math.floor(exact));
  return { index, fraction: index === span ? 0 : exact - index };
}

type Pt = { x: number; y: number };

/**
 * Camera transform that puts point `p` (in the scene's untransformed pixels) at `target`
 * on screen, zoomed by `scale`, with transform-origin at 0 0.
 */
export function cameraFor(p: Pt, target: Pt, scale: number) {
  return { x: target.x - scale * p.x, y: target.y - scale * p.y, scale };
}

/**
 * Keep the zoomed scene covering its frame: never pan past an edge and show blank paper.
 * The scene is `w` × `h` at scale 1, so at `scale` it may move between (w − scale·w) and 0.
 */
export function clampCamera(cam: { x: number; y: number; scale: number }, w: number, h: number) {
  const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
  return { x: clamp(cam.x, w - cam.scale * w), y: clamp(cam.y, h - cam.scale * h), scale: cam.scale };
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

type Phase = 'off' | 'ready' | 'hike' | 'summit' | 'exit';

/**
 * The trailhead. A national-park style poster inks itself and a field-guide card lays out the
 * route. When the visitor presses "Start the hike", the camera follows a hiker up the trail
 * through every stop, the card ticks each one off, a flag goes up on the summit, and the camera
 * dives into the peak to reveal the site.
 *
 * Once per session; Escape goes straight to the site; never plays with reduced motion.
 */
export function Intro({ timing = INTRO_TIMING }: { timing?: IntroTiming }) {
  // Depend on the numbers, not the object, so a new `timing` object each render can't restart the clock.
  const { hike, zoomIn, summitHold, dive } = timing;
  const [phase, setPhase] = useState<Phase>(() => (shouldPlay() ? 'ready' : 'off'));
  const open = phase !== 'off';
  const [t, setT] = useState(0);
  const [hiker, setHiker] = useState<Pt>({ x: TRAIL_POINTS[0]![0], y: TRAIL_POINTS[0]![1] });
  const [markers, setMarkers] = useState<Marker[]>(fallbackMarkers);
  const trailRef = useRef<SVGPathElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const camera = useRef({ x: 0, y: 0, scale: 1 });

  const start = useCallback(() => setPhase((p) => (p === 'ready' ? 'hike' : p)), []);
  const leave = useCallback(() => setPhase((p) => (p === 'off' || p === 'exit' ? p : 'exit')), []);

  // Place the trail markers exactly on the drawn path, once it exists.
  useLayoutEffect(() => {
    const path = trailRef.current;
    if (!open || !path || typeof path.getTotalLength !== 'function') return;
    const len = path.getTotalLength();
    if (!len) return;
    setMarkers(STOP_AT.map((f, i) => ({ ...pointAt(path, f * len), label: trail[i]!.label })));
  }, [open]);

  // Seen as soon as it shows, so a reload goes straight to the site.
  useEffect(() => {
    if (phase !== 'ready') return;
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
  }, [phase]);

  /** Scene coordinates → the scene container's own (untransformed) pixels. */
  const toScreen = useRef<((p: Pt) => Pt) | null>(null);

  const applyCamera = useCallback((cam: { x: number; y: number; scale: number }, smooth = false) => {
    camera.current = cam;
    const el = sceneRef.current;
    if (!el) return;
    el.style.transition = smooth ? `transform ${dive}ms cubic-bezier(0.55, 0, 0.75, 0.2)` : 'none';
    el.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`;
  }, [dive]);

  // The hike: climb the trail with the camera following, then hold on the summit.
  useEffect(() => {
    if (phase !== 'hike') return;
    const path = trailRef.current;
    const el = sceneRef.current;
    const len = path && typeof path.getTotalLength === 'function' ? path.getTotalLength() : 0;

    // On phones the card sits below the poster; bring the poster back into view for the hike.
    rootRef.current?.scrollTo?.({ top: 0 });

    // Measure once, with the camera at rest, how scene coordinates land on screen.
    const ctm = path && 'getScreenCTM' in path ? path.getScreenCTM() : null;
    const box = el?.getBoundingClientRect();
    toScreen.current =
      ctm && box
        ? (p) => {
            const s = new DOMPoint(p.x, p.y).matrixTransform(ctm);
            return { x: s.x - box.left, y: s.y - box.top };
          }
        : null;
    const target = box ? { x: box.width * (box.width > 900 ? 0.64 : 0.5), y: box.height * 0.56 } : { x: 0, y: 0 };

    const begin = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const elapsed = now - begin;
      const climb = Math.min(1, elapsed / hike);
      setT(climb);
      if (path && len) {
        const p = pointAt(path, easeInOutSine(climb) * len);
        setHiker(p);
        const screen = toScreen.current?.(p);
        if (screen) {
          // Ease the zoom in at the trailhead, then follow at a steady distance.
          const z = 1 + (FOLLOW_ZOOM - 1) * easeInOutSine(Math.min(1, elapsed / zoomIn));
          const cam = cameraFor(screen, target, z);
          // Blend from "no camera" to "following" during the zoom so the first frame doesn't jump.
          const k = easeInOutSine(Math.min(1, elapsed / zoomIn));
          applyCamera(clampCamera({ x: cam.x * k, y: cam.y * k, scale: z }, box!.width, box!.height));
        }
      }
      if (climb < 1) frame = requestAnimationFrame(tick);
      else setPhase('summit');
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, hike, zoomIn, applyCamera]);

  useEffect(() => {
    if (phase !== 'summit') return;
    const id = window.setTimeout(() => setPhase('exit'), summitHold);
    return () => window.clearTimeout(id);
  }, [phase, summitHold]);

  // The dive: fly into the summit, then get out of the way.
  useEffect(() => {
    if (phase !== 'exit') return;
    const el = sceneRef.current;
    const summit = toScreen.current?.(SUMMIT);
    if (el && summit) {
      const box = el.getBoundingClientRect();
      applyCamera(cameraFor(summit, { x: box.width / 2, y: box.height / 2 }, DIVE_ZOOM), true);
    }
    const id = window.setTimeout(() => setPhase('off'), dive);
    return () => window.clearTimeout(id);
  }, [phase, dive, applyCamera]);

  // While it's up: hold the page still, hide it from assistive tech, and listen for keys.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const behind = [...document.querySelectorAll<HTMLElement>('header.nav, main, footer')];
    root.classList.add('intro-open');
    behind.forEach((el) => el.setAttribute('inert', ''));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') leave();
      if (e.key === 'Enter') start();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.classList.remove('intro-open');
      behind.forEach((el) => el.removeAttribute('inert'));
      window.removeEventListener('keydown', onKey);
    };
  }, [open, leave, start]);

  if (phase === 'off') return null;

  const hiking = phase !== 'ready';
  const eased = easeInOutSine(t);
  const { index, fraction } = climbAt(eased);
  const elevation = elevationAt(trail, index, fraction);
  const atSummit = phase === 'summit' || phase === 'exit';
  const reached = (i: number) => hiking && (eased >= STOP_AT[i]! - 0.001 || atSummit);

  return (
    <div
      ref={rootRef}
      className={`intro-screen is-${phase}`}
      data-testid="intro"
      data-phase={phase}
      role="dialog"
      aria-label="Intro"
    >
      <div className="intro-screen__viewport">
        <div className="intro-screen__scene" ref={sceneRef}>
          <IntroScene
            ref={trailRef}
            markers={markers.map((m, i) => ({ ...m, up: reached(i) }))}
            summit={atSummit}
            progress={hiking ? eased : 0}
          />
          <svg className="intro-screen__hiker-layer" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <circle className="intro-screen__hiker" cx={hiker.x} cy={hiker.y} r="9" style={{ opacity: atSummit ? 0 : 1 }} />
            <circle className="intro-screen__summit-dot" cx={SUMMIT.x} cy={SUMMIT.y} r="9" style={{ opacity: atSummit ? 1 : 0 }} />
          </svg>
        </div>
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
            <span>{atSummit ? 'Summit reached' : hiking ? trail[index]!.stop : 'At the trailhead'}</span>
          </span>
        </div>

        <div className={`intro-screen__go${hiking ? ' is-hiking' : ''}`}>
          <button type="button" className="btn btn--primary" onClick={start} disabled={hiking}>
            {atSummit ? 'Here we go' : hiking ? 'Hiking…' : 'Start the hike'} <span aria-hidden="true">→</span>
          </button>
          <span className="intro-screen__go-note" aria-hidden="true">
            {atSummit ? 'made it!' : hiking ? 'follow the trail ↗' : 'six stops to the summit'}
          </span>
        </div>
        <button type="button" className="intro-screen__skip" onClick={leave}>
          Skip to the site
        </button>
      </div>
    </div>
  );
}

function pointAt(path: SVGPathElement, at: number): Pt {
  const p = path.getPointAtLength(at);
  return { x: p.x, y: p.y };
}
