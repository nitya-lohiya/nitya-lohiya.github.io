import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trail } from '../data/content';
import { INTRO_KEY, INTRO_TIMING, Intro, STOP_AT, cameraFor, clampCamera, climbAt } from './Intro';

// A sped-up clock so the tests don't sit through the whole hike.
const fast = { hike: 80, zoomIn: 20, summitHold: 40, dive: 30 };
const done = () => document.querySelectorAll('.intro-screen__route li.is-done').length;

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

describe('cameraFor', () => {
  it('puts the followed point exactly on the target', () => {
    const cam = cameraFor({ x: 300, y: 200 }, { x: 640, y: 450 }, 2);
    expect(cam.x + cam.scale * 300).toBe(640);
    expect(cam.y + cam.scale * 200).toBe(450);
  });

  it('is the identity when the point is already on target at scale 1', () => {
    expect(cameraFor({ x: 10, y: 20 }, { x: 10, y: 20 }, 1)).toEqual({ x: 0, y: 0, scale: 1 });
  });
});

describe('clampCamera', () => {
  it('never pans past an edge of the scene', () => {
    // 1000 × 600 frame at 2×: the scene may move between -1000…0 horizontally and -600…0 vertically
    expect(clampCamera({ x: 200, y: 50, scale: 2 }, 1000, 600)).toEqual({ x: 0, y: 0, scale: 2 });
    expect(clampCamera({ x: -5000, y: -5000, scale: 2 }, 1000, 600)).toEqual({ x: -1000, y: -600, scale: 2 });
  });

  it('leaves a camera that is already inside the scene alone', () => {
    expect(clampCamera({ x: -300, y: -200, scale: 2 }, 1000, 600)).toEqual({ x: -300, y: -200, scale: 2 });
  });
});

describe('pacing', () => {
  it('gives each stop of the hike about a second', () => {
    expect(INTRO_TIMING.hike / (trail.length - 1)).toBeGreaterThanOrEqual(900);
  });
});

// These wait on real animation frames, so give slow CI machines plenty of room.
describe('<Intro />', { timeout: 15000 }, () => {
  beforeEach(() => sessionStorage.removeItem(INTRO_KEY));
  afterEach(() => vi.unstubAllGlobals());

  it('lays out the whole route on a first visit and holds the page still', () => {
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
    expect(sessionStorage.getItem(INTRO_KEY)).toBe('1');
  });

  it('waits at the trailhead until the visitor starts the hike', async () => {
    render(<Intro timing={fast} />);
    await new Promise((r) => setTimeout(r, 300));
    expect(screen.getByTestId('intro')).toHaveAttribute('data-phase', 'ready');
    expect(done()).toBe(0);
    expect(screen.getByText('At the trailhead')).toBeInTheDocument();
  });

  it('starting the hike climbs through every stop, reaches the summit, and leads to the site', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Intro timing={fast} />
        <main>site</main>
      </>,
    );
    await user.click(screen.getByRole('button', { name: /start the hike/i }));
    await waitFor(() => expect(done()).toBe(trail.length), { timeout: 8000 });
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 8000 });
    expect(document.documentElement).not.toHaveClass('intro-open');
    expect(document.querySelector('main')).not.toHaveAttribute('inert');
  });

  it('starts the hike with Enter', async () => {
    render(<Intro timing={fast} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => expect(screen.getByTestId('intro').dataset.phase).not.toBe('ready'), { timeout: 8000 });
  });

  it('goes straight to the site with Escape or "Skip to the site"', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Intro timing={fast} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByTestId('intro')).toBeNull(), { timeout: 8000 });
    unmount();
    sessionStorage.removeItem(INTRO_KEY);
    render(<Intro timing={fast} />);
    await user.click(screen.getByRole('button', { name: /skip to the site/i }));
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
