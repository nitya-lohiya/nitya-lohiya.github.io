import { useEffect, useRef, useState } from 'react';
import { metricAt } from '../lib/countUp';
import { easeOutCubic, prefersReducedMotion } from '../lib/motion';

type Props = { value: string; duration?: number; className?: string };

/**
 * Counts a metric up the first time it scrolls into view. Screen readers always get the
 * final value; with reduced motion (or no IntersectionObserver) the final value shows at once.
 */
export function CountUp({ value, duration = 1400, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const animate = typeof IntersectionObserver !== 'undefined' && !prefersReducedMotion();
  const [text, setText] = useState(() => (animate ? metricAt(value, 0) : value));

  useEffect(() => {
    if (!animate || !ref.current) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setText(metricAt(value, easeOutCubic(t)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [animate, duration, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
