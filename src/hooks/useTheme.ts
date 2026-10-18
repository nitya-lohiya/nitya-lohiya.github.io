import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark';
export const THEME_KEY = 'theme';

/** A visitor's saved choice first; otherwise the site opens in dark mode. Storage can throw in private modes. */
export function getInitialTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Switches theme. Where the View Transitions API exists, the new theme sweeps in as a
   * circle growing from the toggle (origin passed as x/y); elsewhere colors cross-fade.
   */
  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const flip = () =>
      setTheme((t) => {
        const next = t === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          /* ignore */
        }
        return next;
      });

    const root = document.documentElement;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduced) {
      root.classList.add('theme-fade');
      flip();
      window.setTimeout(() => root.classList.remove('theme-fade'), 450);
      return;
    }
    if (origin) {
      root.style.setProperty('--vt-x', `${origin.x}px`);
      root.style.setProperty('--vt-y', `${origin.y}px`);
    }
    document.startViewTransition(() => flushSync(flip));
  }, []);

  return { theme, toggle };
}
