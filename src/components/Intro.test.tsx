import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trail } from '../data/content';
import { INTRO_KEY, INTRO_TIMING, Intro, STOP_AT, climbAt } from './Intro';

// A sped-up clock so the tests don't sit through the whole hike.
const fast = { climbStart: 20, climbEnd: 80, exitAt: 120, exitLength: 30 };

describe('climbAt', () => {
  it('starts at the trailhead and ends on the summit', () => {
    expect(climbAt(0)).toEqual({ index: 0, fraction: 0 });
    expect(climbAt(1)).toEqual({ index: trail.length - 1, fraction: 0 });
  });

  it('moves through every stop in order, and clamps out-of-range progress', () => {
    expect(climbAt(0.5).index).toBe(Math.floor((trail.length - 1) / 2));
    expect(climbAt(-3)).toEqual(climbAt(0));
    expect(climbAt(7)).toEqual(climbAt(1));
  });

  it('spaces the stops evenly from trailhead to summit', () => {
    expect(STOP_AT[0]).toBe(0);
    expect(STOP_AT[STOP_AT.length - 1]).toBe(1);
  });
});

describe('pacing', () => {
  it('gives the climb enough time to read (about half a second per stop) and stays short overall', () => {
    const climb = INTRO_TIMING.climbEnd - INTRO_TIMING.climbStart;
    expect(climb / (trail.length - 1)).toBeGreaterThanOrEqual(450);
    expect(INTRO_TIMING.exitAt).toBeLessThanOrEqual(8000);
  });
});

// These wait on real animation frames, so give slow CI machines plenty of room.
describe('<Intro />', { timeout: 15000 }, () => {
  beforeEach(() => sessionStorage.removeItem(INTRO_KEY));
  afterEach(() => vi.unstubAllGlobals());

  it('plays on a first visit, lays out the whole route, and holds the page still', () => {
    render(
      <>
        <Intro />
        <main>site</main>
      </>,
    );
    expect(screen.getByRole('dialog', { name: 'Intro' })).toBeInTheDocument();
    expect(screen.getByText(/a field guide to my work/i)).toBeInTheDocument();
    for (const stop of trail) expect(screen.getByText(stop.stop)).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('intro-open');
    expect(document.querySelector('main')).toHaveAttribute('inert');
  });

  it('ticks off every stop and offers "Start the hike" at the summit', async () => {
    render(<Intro timing={{ ...fast, exitAt: 5000 }} />);
    await waitFor(() => expect(screen.getByText('Summit reached')).toBeInTheDocument(), { timeout: 8000 });
    expect(document.querySelectorAll('.intro-screen__route li.is-done')).toHaveLength(trail.length);
    expect(screen.getByRole('button', { name: /start the hike/i })).toBeInTheDocument();
  });

  it('can be skipped with the button, and is remembered for the session', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Intro />
        <main>site</main>
      </>,
    );
    expect(sessionStorage.getItem(INTRO_KEY)).toBe('1');
    await user.click(screen.getByRole('button', { name: /skip intro/i }));
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 8000 });
    expect(document.documentElement).not.toHaveClass('intro-open');
    expect(document.querySelector('main')).not.toHaveAttribute('inert');
  });

  it('can be skipped with Escape or Enter', async () => {
    const { unmount } = render(<Intro />);
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 8000 });
    unmount();
    sessionStorage.removeItem(INTRO_KEY);
    render(<Intro />);
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 8000 });
  });

  it('finishes on its own and gets out of the way', async () => {
    render(<Intro timing={fast} />);
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 8000 });
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
