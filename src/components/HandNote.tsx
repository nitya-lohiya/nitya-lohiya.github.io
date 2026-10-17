import type { ReactNode } from 'react';

type Arrow = 'down' | 'right' | 'left' | 'up';

/** A loopy pen arrow, drawn once per direction. */
const arrows: Record<Arrow, string> = {
  down: 'M10 2 C 4 14, 18 18, 12 34 M6 27 L12 35 L17 27',
  right: 'M2 14 C 14 4, 22 22, 38 12 M30 7 L39 12 L31 18',
  left: 'M38 14 C 26 4, 18 22, 2 12 M10 7 L1 12 L9 18',
  up: 'M12 34 C 18 22, 4 18, 10 2 M5 9 L10 1 L16 9',
};

type Props = { children: ReactNode; arrow?: Arrow; className?: string };

/** A margin note in my handwriting style, optionally with an arrow pointing at something. */
export function HandNote({ children, arrow, className = '' }: Props) {
  return (
    <p className={`hand-note${arrow ? ` hand-note--${arrow}` : ''} ${className}`.trim()}>
      <span className="hand-note__text">{children}</span>
      {arrow && (
        <svg className="hand-note__arrow sketch" viewBox={arrow === 'down' || arrow === 'up' ? '0 0 24 36' : '0 0 40 24'} aria-hidden="true" focusable="false">
          <path d={arrows[arrow]} />
        </svg>
      )}
    </p>
  );
}
