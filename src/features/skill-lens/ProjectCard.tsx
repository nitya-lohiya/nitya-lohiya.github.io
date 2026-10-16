import type { Project } from '../../data/content';
import { ArrowIcon } from '../../components/Icons';

type Props = { project: Project; wide: boolean };

export function ProjectCard({ project, wide }: Props) {
  const { caseStudy } = project;
  return (
    <li id={`project-${project.id}`} className={`project-card${wide ? ' project-card--wide' : ''}`} data-testid="project-card">
      <article aria-labelledby={`project-${project.id}-title`}>
        <div className="project-card__meta">
          <span>{project.context}</span>
          {project.featured && <span className="badge badge--accent">Featured</span>}
          {project.status && <span className="badge">{project.status}</span>}
        </div>
        <h3 id={`project-${project.id}-title`} className="project-card__title">
          {project.title}
        </h3>
        <p className="project-card__summary">{project.summary}</p>
        <p className="project-card__desc">{project.description}</p>
        <p className="for-line">
          <span className="for-line__label">Built for</span>
          {project.audience}
        </p>
        <p className="project-card__role">
          <span className="sr-only">My role: </span>
          {project.role}
        </p>

        {caseStudy && (
          <details className="case-study">
            <summary>How I built it</summary>
            <dl>
              <dt>The problem</dt>
              <dd>{caseStudy.problem}</dd>
              <dt>What I built</dt>
              <dd>{caseStudy.built}</dd>
              <dt>Decisions</dt>
              <dd>
                <ul>
                  {caseStudy.decisions.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </dd>
              <dt>Outcome</dt>
              <dd>{caseStudy.outcome}</dd>
            </dl>
          </details>
        )}

        <ul className="tag-list" aria-label="Tech stack">
          {project.stack.map((t) => (
            <li key={t} className="tag tag--tech">
              {t}
            </li>
          ))}
        </ul>

        {project.links.length > 0 && (
          <div className="project-card__links">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-link">
                {l.label}
                <span className="sr-only"> for {project.title} (opens in a new tab)</span>
                <ArrowIcon />
              </a>
            ))}
          </div>
        )}
      </article>
    </li>
  );
}
