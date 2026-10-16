import { experience as allExperience } from '../../data/content';
import { ArrowIcon } from '../../components/Icons';
import { filterProjects } from './explorer';
import { useLens } from './LensContext';

type Props = { experience?: typeof allExperience };

export function ExperienceTimeline({ experience = allExperience }: Props) {
  const { selected } = useLens();

  return (
    <ol className="timeline">
      {experience.map((e) => {
        const state = selected.length === 0 ? 'neutral' : filterProjects([e], selected).length > 0 ? 'lit' : 'dim';
        return (
          <li key={e.id} id={`exp-${e.id}`} className={`timeline__item reveal is-${state}`} data-state={state} data-testid="experience-item">
            <div className="timeline__when">
              <span>{e.dates}</span>
              <span className="timeline__where">{e.location}</span>
            </div>
            <article className="timeline__card" aria-labelledby={`exp-${e.id}-title`}>
              <header className="timeline__head">
                <div>
                  <h3 id={`exp-${e.id}-title`} className="timeline__role">
                    {e.role}
                    {e.current && <span className="badge badge--live">Now</span>}
                  </h3>
                  <p className="timeline__org">
                    {e.link ? (
                      <a href={e.link} target="_blank" rel="noreferrer" className="text-link">
                        {e.org}
                        <span className="sr-only"> (opens in a new tab)</span>
                        <ArrowIcon />
                      </a>
                    ) : (
                      e.org
                    )}
                    {e.orgNote && <span className="timeline__note"> · {e.orgNote}</span>}
                  </p>
                </div>
              </header>

              <p className="for-line">
                <span className="for-line__label">Built for</span>
                {e.audience}
              </p>

              <ul className="timeline__points">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              <div className="tech-row">
                <span className="tech-row__label">Tech</span>
                <ul className="tag-list" aria-label={`Tech used at ${e.org}`}>
                  {e.tech.map((t) => (
                    <li key={t} className="tag tag--tech">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
