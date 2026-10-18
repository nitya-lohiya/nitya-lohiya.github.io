import type { ReactNode } from 'react';
import { trail } from '../data/content';
import { HandNote } from './HandNote';
import { TempleBorder } from './TempleBorder';
import { Meadow } from './Wildflowers';

type Props = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** A small hand-drawn sketch for the margin rail. */
  sketch?: ReactNode;
  /** A handwritten margin note under the sketch. */
  note?: string;
  children: ReactNode;
};

/**
 * Every section shares one layout: a narrow rail on the left with the trail stop, its elevation,
 * and a sketch, and the content on the right. The rail sticks while the section scrolls.
 */
export function Section({ id, index, eyebrow, title, intro, sketch, note, children }: Props) {
  const stop = trail.find((t) => t.id === id);
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <TempleBorder />
      <div className="container section__grid">
        <aside className="section__rail reveal">
          <p className="eyebrow">
            <span className="eyebrow__index">{index}</span> {eyebrow}
          </p>
          {stop && (
            <p className="section__stop">
              {stop.stop} <span aria-hidden="true">·</span> elev. {stop.elevation.toLocaleString('en-US')} ft
            </p>
          )}
          {sketch && (
            <div className="section__sketch">
              {sketch}
              <Meadow className="section__tuft" seed={id.length * 13 + index.charCodeAt(1)} count={5} width={64} height={30} />
            </div>
          )}
          {note && <HandNote className="section__note">{note}</HandNote>}
        </aside>
        <div className="section__body">
          <header className="section__head reveal">
            <h2 id={`${id}-title`} className="section__title">
              {title}
            </h2>
            {intro && <p className="section__intro">{intro}</p>}
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
