import { useEffect, useState } from 'react';
import { progressAt } from '../lib/trail';

/**
 * Where the reader is on the trail: the section whose top has passed a line a third of the way
 * down the screen, and how far they are toward the next one. Throttled to one read per frame.
 */
export function useTrailProgress(ids: readonly string[]) {
  const [progress, setProgress] = useState({ index: 0, fraction: 0 });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      const atBottom =
        window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const next = atBottom
        ? { index: ids.length - 1, fraction: 0 }
        : progressAt(tops, window.scrollY + Math.min(window.scrollY, window.innerHeight * 0.33));
      setProgress((p) => (p.index === next.index && Math.abs(p.fraction - next.fraction) < 0.005 ? p : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids]);

  return progress;
}
