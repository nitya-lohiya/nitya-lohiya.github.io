import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trail } from '../data/content';
import { INTRO_KEY, Intro, climbAt } from './Intro';

describe('climbAt', () => {
  it('starts at the trailhead and ends on the summit', () => {
    expect(climbAt(0)).toEqual({ index: 0, fraction: 0 });
    expect(climbAt(1)).toEqual({ index: trail.length - 1, fraction: 0 });
  });

  it('moves through every stop in order, and clamps out-of-range progress', () => {
    const half = climbAt(0.5);
    expect(half.index).toBe(Math.floor((trail.length - 1) / 2));
    expect(climbAt(-3)).toEqual(climbAt(0));
    expect(climbAt(7)).toEqual(climbAt(1));
  });
});

describe('<Intro />', () => {
  beforeEach(() => sessionStorage.removeItem(INTRO_KEY));
  afterEach(() => vi.unstubAllGlobals());

  it('plays on a first visit, previews every stop, and holds the page still', () => {
    render(<Intro />);
    expect(screen.getByTestId('intro')).toBeInTheDocument();
    expect(screen.getByText(/about to hike through my work/i)).toBeInTheDocument();
    for (const stop of trail) expect(screen.getByText(stop.label)).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('intro-open');
  });

  it('can be skipped with the button, and is remembered for the session', async () => {
    const user = userEvent.setup();
    render(<Intro />);
    expect(sessionStorage.getItem(INTRO_KEY)).toBe('1');
    await user.click(screen.getByRole('button', { name: /skip the hike/i }));
    expect(sessionStorage.getItem(INTRO_KEY)).toBe('1');
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 2000 });
    expect(document.documentElement).not.toHaveClass('intro-open');
  });

  it('can be skipped with Escape', async () => {
    render(<Intro />);
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 2000 });
  });

  it('finishes on its own and gets out of the way', async () => {
    render(<Intro />);
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 5000 });
    expect(sessionStorage.getItem(INTRO_KEY)).toBe('1');
  });

  it('does not play again in the same session', () => {
    sessionStorage.setItem(INTRO_KEY, '1');
    render(<Intro />);
    expect(screen.queryByTestId('intro')).toBeNull();
  });

  it('never plays for visitors who prefer reduced motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    render(<Intro />);
    expect(screen.queryByTestId('intro')).toBeNull();
  });
});
