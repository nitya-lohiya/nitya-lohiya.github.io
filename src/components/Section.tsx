import type { ReactNode } from 'react';
import { TempleBorder } from './TempleBorder';

type Props = { id: string; index: string; eyebrow: string; title: string; intro?: string; children: ReactNode };

export function Section({ id, index, eyebrow, title, intro, children }: Props) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <TempleBorder />
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">
            <span className="eyebrow__index">{index}</span> {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="section__title">
            {title}
          </h2>
          {intro && <p className="section__intro">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
