import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Meadow, planPatch, seeded } from './Wildflowers';

describe('wildflowers', () => {
  it('plans the same patch every time for a given seed (no layout jumps between renders)', () => {
    expect(planPatch(3, 8, 100, 10, 20)).toEqual(planPatch(3, 8, 100, 10, 20));
    expect(planPatch(3, 8, 100, 10, 20)).not.toEqual(planPatch(4, 8, 100, 10, 20));
  });

  it('keeps every flower inside its patch and within the height range', () => {
    for (const st of planPatch(9, 20, 200, 12, 30)) {
      expect(st.x).toBeGreaterThanOrEqual(0);
      expect(st.x).toBeLessThanOrEqual(200);
      expect(st.h).toBeGreaterThanOrEqual(12);
      expect(st.h).toBeLessThanOrEqual(30);
    }
  });

  it('spreads flowers left to right instead of clumping', () => {
    const xs = planPatch(1, 10, 100, 10, 20).map((s) => s.x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  });

  it('generates numbers in [0, 1)', () => {
    const rnd = seeded(42);
    for (let i = 0; i < 100; i++) {
      const n = rnd();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it('renders one stem per flower and hides the decoration from screen readers', () => {
    const { container } = render(<Meadow count={6} />);
    expect(container.querySelectorAll('.wf__stem')).toHaveLength(6);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
