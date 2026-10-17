import { describe, expect, it } from 'vitest';
import { elevationAt, positionOnTrail, progressAt, ridgePoints, walkedPoints, RIDGE_H } from './trail';

const stops = [{ elevation: 700 }, { elevation: 1500 }, { elevation: 2300 }];

describe('ridgePoints', () => {
  it('places one vertex per stop plus one between each pair', () => {
    expect(ridgePoints(stops)).toHaveLength(5);
    expect(ridgePoints([])).toEqual([]);
  });

  it('draws higher elevations higher up (smaller y) and keeps everything in the box', () => {
    const p = ridgePoints(stops);
    expect(p[0]!.y).toBeGreaterThan(p[2]!.y);
    expect(p[2]!.y).toBeGreaterThan(p[4]!.y);
    for (const pt of p) {
      expect(pt.y).toBeGreaterThanOrEqual(0);
      expect(pt.y).toBeLessThanOrEqual(RIDGE_H);
    }
  });

  it('runs left to right from the first stop to the last', () => {
    const xs = ridgePoints(stops).map((pt) => pt.x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  });
});

describe('progressAt', () => {
  const tops = [0, 1000, 3000];

  it('starts at the trailhead before the first section', () => {
    expect(progressAt(tops, -50)).toEqual({ index: 0, fraction: 0 });
  });

  it('reports the current stop and how far toward the next one', () => {
    expect(progressAt(tops, 500)).toEqual({ index: 0, fraction: 0.5 });
    expect(progressAt(tops, 2000)).toEqual({ index: 1, fraction: 0.5 });
  });

  it('stays at the summit past the last section', () => {
    expect(progressAt(tops, 9999)).toEqual({ index: 2, fraction: 0 });
  });

  it('handles no sections', () => {
    expect(progressAt([], 100)).toEqual({ index: 0, fraction: 0 });
  });
});

describe('positionOnTrail', () => {
  const p = ridgePoints(stops);

  it('sits exactly on a stop at fraction 0, and on the dip halfway', () => {
    expect(positionOnTrail(p, 1, 0)).toEqual(p[2]);
    expect(positionOnTrail(p, 0, 0.5)).toEqual(p[1]);
  });

  it('reaches the next stop at fraction 1', () => {
    const at = positionOnTrail(p, 0, 1);
    expect(at.x).toBeCloseTo(p[2]!.x);
    expect(at.y).toBeCloseTo(p[2]!.y);
  });

  it('stays on the summit when there is no next stop, and survives a bad index', () => {
    expect(positionOnTrail(p, 2, 0.7)).toEqual(p[4]);
    expect(positionOnTrail(p, 99, 0)).toEqual(p[4]);
  });
});

describe('elevationAt', () => {
  it('interpolates between stops and rounds to 10 ft', () => {
    expect(elevationAt(stops, 0, 0)).toBe(700);
    expect(elevationAt(stops, 0, 0.5)).toBe(1100);
    expect(elevationAt(stops, 1, 0.333)).toBe(1770);
  });

  it('holds at the summit and clamps the fraction', () => {
    expect(elevationAt(stops, 2, 0.9)).toBe(2300);
    expect(elevationAt(stops, 0, 5)).toBe(1500);
  });
});

describe('walkedPoints', () => {
  it('ends at the hiker and includes every vertex already passed', () => {
    const p = ridgePoints(stops);
    const walked = walkedPoints(p, 1, 0.25);
    expect(walked.slice(0, 3)).toEqual(p.slice(0, 3));
    expect(walked[walked.length - 1]).toEqual(positionOnTrail(p, 1, 0.25));
  });
});
