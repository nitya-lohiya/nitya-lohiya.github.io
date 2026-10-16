import { useEffect } from 'react';

/**
 * Fades `.reveal` elements in as they scroll into view. Containers marked `data-stagger`
 * reveal their children one after another (each child gets --i for its delay).
 * Without IntersectionObserver (or with reduced motion, handled in CSS) everything is visible.
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal, [data-stagger]');
    document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
      Array.from(group.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)));
    });
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
