/** Shared motion switches. Every animated effect checks these before running. */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

/** Mouse/trackpad users only: tilt and parallax are skipped on touch screens. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches);

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
