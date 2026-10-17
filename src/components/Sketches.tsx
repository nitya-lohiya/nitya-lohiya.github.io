/**
 * Hand-drawn line sketches for the section margins. They are plain SVG paths with a slight
 * wobble from the shared #rough filter (see <SketchFilter />), and inherit the text color.
 */

type Props = { className?: string };
const base = (className = '') => ({
  className: `sketch ${className}`.trim(),
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

/** Defines the wobble filter once for the whole page. */
export function SketchFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="2.2" />
      </filter>
    </svg>
  );
}

const pine = 'M0 0 L-7 12 L-3 12 L-9 22 L-4 22 L-11 33 L11 33 L4 22 L9 22 L3 12 L7 12 Z M0 33 L0 39';

export function Pines({ className }: Props) {
  return (
    <svg viewBox="0 0 120 90" {...base(className)}>
      <path d="M4 82 Q 40 76 64 80 T 116 79" />
      <path d={pine} transform="translate(34 40) scale(1.05)" />
      <path d={pine} transform="translate(62 26) scale(1.4)" />
      <path d={pine} transform="translate(90 46) scale(0.9)" />
      <path d="M16 70 q 3 -4 6 0 M100 72 q 2 -3 4 0" />
    </svg>
  );
}

export function TrailSign({ className, lines }: Props & { lines: [string, string] }) {
  return (
    <svg viewBox="0 0 120 90" {...base(className)}>
      <path d="M38 86 L38 30 M82 86 L82 30" />
      <path d="M18 30 L98 30 L106 42 L98 54 L18 54 Z" />
      <text x="60" y="40" textAnchor="middle" className="sketch__text">
        {lines[0]}
      </text>
      <text x="60" y="49.5" textAnchor="middle" className="sketch__text">
        {lines[1]}
      </text>
      <path d="M6 86 Q 60 82 114 87" />
    </svg>
  );
}

export function Compass({ className }: Props) {
  return (
    <svg viewBox="0 0 120 90" {...base(className)}>
      <circle cx="60" cy="46" r="30" />
      <circle cx="60" cy="46" r="24" strokeDasharray="1.5 4" />
      <path d="M60 22 L66 46 L60 70 L54 46 Z" />
      <path d="M54 46 L66 46" />
      <text x="60" y="13" textAnchor="middle" className="sketch__text">
        N
      </text>
    </svg>
  );
}

export function Pack({ className }: Props) {
  return (
    <svg viewBox="0 0 120 90" {...base(className)}>
      <path d="M40 30 Q 40 22 48 22 L72 22 Q 80 22 80 30 L82 80 L38 80 Z" />
      <path d="M40 40 Q 60 50 80 40" />
      <rect x="49" y="55" width="22" height="15" rx="3" />
      <path d="M51 22 Q 51 11 60 11 Q 69 11 69 22" />
      <path d="M36 52 L30 54 L32 74 L38 76 M84 52 L90 54 L88 74 L82 76" />
    </svg>
  );
}

export function TrailMap({ className }: Props) {
  return (
    <svg viewBox="0 0 120 90" {...base(className)}>
      <path d="M12 22 L42 14 L76 22 L108 14 L108 72 L76 80 L42 72 L12 80 Z" />
      <path d="M42 14 L42 72 M76 22 L76 80" strokeDasharray="2 3" />
      <path d="M22 66 Q 36 40 56 52 T 94 30" strokeDasharray="3 4" />
      <path d="M90 26 L98 34 M98 26 L90 34" />
    </svg>
  );
}

export function Summit({ className }: Props) {
  return (
    <svg viewBox="0 0 160 110" {...base(className)}>
      <path d="M4 104 L50 46 L64 60 L84 28 L156 104" />
      <path d="M74 44 L84 28 L94 44 Q 89 40 84 46 Q 79 40 74 44" />
      <path d="M84 28 L84 8 M84 8 L100 13 L84 18" />
      <path d="M30 104 Q 70 96 100 104 M110 104 L120 94 L128 104" />
      <circle cx="132" cy="22" r="7" />
    </svg>
  );
}
