import { useEffect } from 'react';
import { hasFinePointer, prefersReducedMotion } from '../lib/motion';

const MAX_TILT = 4; // degrees

/**
 * One delegated pointer listener for the whole page, so effects cost nothing per element:
 *  - `.tilt` elements lean slightly toward the cursor and get a soft spotlight (--mx/--my).
 *  - `.hero-wrap` gets --px/--py (-1..1) for a gentle background parallax.
 * Skipped entirely on touch screens and with reduced motion.
 */
export function usePointerEffects() {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      const card = target?.closest<HTMLElement>('.tilt, .spot') ?? null;
      if (tilted && tilted !== card) reset(tilted);
      tilted = card;
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.setProperty('--rx', `${(0.5 - y) * MAX_TILT}deg`);
        card.style.setProperty('--ry', `${(x - 0.5) * MAX_TILT}deg`);
      }

      const hero = document.querySelector<HTMLElement>('.hero-wrap');
      if (hero) {
        const r = hero.getBoundingClientRect();
        if (e.clientY < r.bottom) {
          hero.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
          hero.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => tilted && reset(tilted);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);
}
