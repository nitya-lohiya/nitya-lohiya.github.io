/**
 * Geometry for the trail navigator. The ridge is drawn in a 1000 × 56 box: one point per stop
 * (higher elevation = higher on the ridge) with a shoulder or dip between each pair, so the
 * line reads as a mountain profile rather than a straight ramp. Pure functions, no DOM.
 */

export type Stop = { elevation: number };
export type Point = { x: number; y: number };

export const RIDGE_W = 1000;
export const RIDGE_H = 56;
const PAD_X = 28;
const TOP = 14; // room above the summit for its flag
const BOTTOM = 12; // keep the trailhead clear of the labels

/** Ridge vertices: stops at even indices, the dips/shoulders between them at odd indices. */
export function ridgePoints(stops: readonly Stop[]): Point[] {
  if (stops.length === 0) return [];
  const els = stops.map((s) => s.elevation);
  const min = Math.min(...els);
  const span = Math.max(...els) - min || 1;
  const yOf = (e: number) => RIDGE_H - BOTTOM - ((e - min) / span) * (RIDGE_H - TOP - BOTTOM);
  const step = stops.length > 1 ? (RIDGE_W - 2 * PAD_X) / (stops.length - 1) : 0;

  const points: Point[] = [];
  stops.forEach((s, i) => {
    points.push({ x: PAD_X + i * step, y: yOf(s.elevation) });
    const next = stops[i + 1];
    if (next) {
      // Alternate deep saddles and false summits so the profile reads as a mountain, not a ramp.
      const wobble = [11, -7, 9, -5, 8, -4][i % 6]!;
      const mid = yOf((s.elevation + next.elevation) / 2) + wobble;
      points.push({ x: PAD_X + (i + 0.5) * step, y: Math.min(RIDGE_H - 1, Math.max(2, mid)) });
    }
  });
  return points;
}

/** Which stop the reader is at, and how far along to the next one (0..1). */
export function progressAt(sectionTops: readonly number[], y: number): { index: number; fraction: number } {
  if (sectionTops.length === 0) return { index: 0, fraction: 0 };
  if (y <= sectionTops[0]!) return { index: 0, fraction: 0 };
  for (let i = 0; i < sectionTops.length - 1; i++) {
    const a = sectionTops[i]!;
    const b = sectionTops[i + 1]!;
    if (y < b) return { index: i, fraction: b > a ? (y - a) / (b - a) : 0 };
  }
  return { index: sectionTops.length - 1, fraction: 0 };
}

/** The hiker's spot on the ridge for a stop index and fraction toward the next stop. */
export function positionOnTrail(points: readonly Point[], index: number, fraction: number): Point {
  const lerp = (a: Point, b: Point, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  const at = points[index * 2];
  if (!at) return points[points.length - 1] ?? { x: 0, y: 0 };
  const dip = points[index * 2 + 1];
  const next = points[index * 2 + 2];
  if (!dip || !next) return at;
  const f = Math.min(1, Math.max(0, fraction));
  return f < 0.5 ? lerp(at, dip, f * 2) : lerp(dip, next, (f - 0.5) * 2);
}

/** Elevation readout between two stops, rounded to the nearest 10 ft like a trail sign. */
export function elevationAt(stops: readonly Stop[], index: number, fraction: number): number {
  const a = stops[index];
  if (!a) return 0;
  const b = stops[index + 1] ?? a;
  const f = Math.min(1, Math.max(0, fraction));
  return Math.round((a.elevation + (b.elevation - a.elevation) * f) / 10) * 10;
}

/** Ridge vertices up to the hiker, for drawing the part of the trail already walked. */
export function walkedPoints(points: readonly Point[], index: number, fraction: number): Point[] {
  const hiker = positionOnTrail(points, index, fraction);
  const passed = points.slice(0, index * 2 + 1 + (fraction >= 0.5 ? 1 : 0));
  return [...passed, hiker];
}

export const toPolyline = (points: readonly Point[]) => points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
