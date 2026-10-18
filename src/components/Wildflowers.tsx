/**
 * Hand-drawn wildflowers: daisies, poppies, lupine spikes, yarrow, and buds on thin stems.
 * A seeded random generator places them, so every patch looks natural but renders the same
 * way every time (no layout jumps, stable tests). Colors come from CSS (.wf--*).
 */

type Kind = 'daisy' | 'poppy' | 'lupine' | 'yarrow' | 'bud';
const KINDS: Kind[] = ['daisy', 'poppy', 'lupine', 'yarrow', 'daisy', 'bud'];
const TONES = ['gold', 'rose', 'blue', 'white'] as const;

/** Small deterministic PRNG (mulberry32). */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Stem = { x: number; h: number; lean: number; kind: Kind; tone: (typeof TONES)[number]; size: number };

/** Plan a patch of `count` flowers across `width`, between `minH` and `maxH` tall. */
export function planPatch(seed: number, count: number, width: number, minH: number, maxH: number): Stem[] {
  const rnd = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const slot = width / count;
    return {
      x: slot * i + slot * (0.2 + rnd() * 0.6),
      h: minH + rnd() * (maxH - minH),
      lean: (rnd() - 0.5) * 10,
      kind: KINDS[Math.floor(rnd() * KINDS.length)]!,
      tone: TONES[Math.floor(rnd() * TONES.length)]!,
      size: 0.75 + rnd() * 0.5,
    };
  });
}

function Head({ kind, x, y, s, tone }: { kind: Kind; x: number; y: number; s: number; tone: string }) {
  const cls = `wf__head wf--${tone}`;
  switch (kind) {
    case 'daisy':
      return (
        <g className={cls}>
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx={x} cy={y - 3.2 * s} rx={1.6 * s} ry={3 * s} transform={`rotate(${i * 60} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r={1.7 * s} className="wf__eye" />
        </g>
      );
    case 'poppy':
      return (
        <g className={cls}>
          <path
            d={`M${x - 4.5 * s} ${y - 1} Q${x - 5 * s} ${y - 7 * s} ${x} ${y - 6 * s} Q${x + 5 * s} ${y - 7 * s} ${x + 4.5 * s} ${y - 1} Q${x} ${y + 2.5 * s} ${x - 4.5 * s} ${y - 1} Z`}
          />
          <path d={`M${x} ${y - 6 * s} L${x} ${y}`} className="wf__vein" />
        </g>
      );
    case 'lupine':
      return (
        <g className={cls}>
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx={x + (i % 2 ? 1.6 : -1.6) * s} cy={y - i * 2.6 * s} rx={1.7 * s} ry={1.3 * s} />
          ))}
        </g>
      );
    case 'yarrow':
      return (
        <g className={cls}>
          {[-3.5, -1.5, 0.5, 2.5, -2.5, 1.5, -0.5].map((dx, i) => (
            <circle key={i} cx={x + dx * s} cy={y - (i < 4 ? 0 : 2) * s} r={1.2 * s} />
          ))}
        </g>
      );
    default:
      return (
        <g className={cls}>
          <ellipse cx={x} cy={y - 2 * s} rx={1.8 * s} ry={3 * s} />
        </g>
      );
  }
}

type PatchProps = { seed: number; count: number; width: number; ground: number; minH?: number; maxH?: number; x?: number };

/** A patch of wildflowers as an SVG group, for use inside another SVG (like the intro poster). */
export function WildflowerPatch({ seed, count, width, ground, minH = 14, maxH = 30, x = 0 }: PatchProps) {
  const stems = planPatch(seed, count, width, minH, maxH);
  return (
    <g className="wf" aria-hidden="true">
      {stems.map((st, i) => {
        const bx = x + st.x;
        const tx = bx + st.lean;
        const ty = ground - st.h;
        return (
          <g key={i} className="wf__stem" style={{ transformOrigin: `${bx}px ${ground}px`, animationDelay: `${(i % 7) * -0.7}s` }}>
            <path d={`M${bx} ${ground} Q${bx + st.lean * 0.2} ${ground - st.h * 0.5} ${tx} ${ty}`} className="wf__line" />
            {i % 3 === 0 && (
              <path
                d={`M${bx + st.lean * 0.1} ${ground - st.h * 0.35} q${4 * st.size} ${-2 * st.size} ${6 * st.size} ${-6 * st.size}`}
                className="wf__line wf__leaf"
              />
            )}
            <Head kind={st.kind} x={tx} y={ty} s={st.size} tone={st.tone} />
          </g>
        );
      })}
    </g>
  );
}

type MeadowProps = { seed?: number; count?: number; width?: number; height?: number; className?: string };

/** A standalone strip of wildflowers that sits on the bottom edge of its box. */
export function Meadow({ seed = 7, count = 9, width = 140, height = 44, className = '' }: MeadowProps) {
  return (
    <svg
      className={`meadow reveal ${className}`.trim()}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <WildflowerPatch seed={seed} count={count} width={width} ground={height - 1} minH={height * 0.35} maxH={height * 0.85} />
    </svg>
  );
}

/** A single pressed flower, flattened and taped into the scrapbook. */
export function PressedFlower({ className = '' }: { className?: string }) {
  return (
    <svg className={`pressed-flower ${className}`.trim()} viewBox="0 0 40 70" aria-hidden="true" focusable="false">
      <path d="M20 68 Q18 44 21 22" className="wf__line" />
      <path d="M19.5 50 q-8 -3 -11 -11 M20.5 40 q7 -2 10 -9" className="wf__line wf__leaf" />
      <Head kind="daisy" x={21} y={20} s={2.2} tone="white" />
    </svg>
  );
}
