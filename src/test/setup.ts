import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// The trailhead intro has its own tests; everywhere else, start as a returning visitor.
beforeEach(() => {
  sessionStorage.setItem('intro-seen', '1');
});

afterEach(() => {
  sessionStorage.clear();
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});
