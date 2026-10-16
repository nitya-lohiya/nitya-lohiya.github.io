import type { CSSProperties } from 'react';
import type { Project } from '../../data/content';
import { ArrowIcon } from '../../components/Icons';
import { useLens } from './LensContext';

type Props = { project: Project; wide: boolean; index?: number };

/**
 * A tiny version of the hero graph for each project: one node per skill around a center.
 * Nodes for skills in the active lens light up.
 */
function SkillGlyph({ skills }: { skills: readonly string[] }) {
  const { selected } = useLens();
  const r = 19;
  return (
    <svg className="glyph" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <circle cx="28" cy="28" r={r} className="glyph__ring" />
      {skills.map((s, i) => {
        const a = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
        const x = 28 + r * Math.cos(a);
        const y = 28 + r * Math.sin(a);
        const lit = selected.includes(s);
        return (
          <g key={s} className={lit ? 'is-lit' : undefined}>
            <line x1="28" y1="28" x2={x} y2={y} className="glyph__edge" />
            <circle cx={x} cy={y} r={lit ? 4 : 3} className="glyph__node" />
          </g>
        );
      })}
      <circle cx="28" cy="28" r="5" className="glyph__center" />
    </svg>
  );
}

export function ProjectCard({ project, wide, index = 0 }: Props) {
  const { caseStudy } = project;
  return (
    <li
      id={`project-${project.id}`}
      className={`project-card${wide ? ' project-card--wide' : ''}`}
      data-testid="project-card"
      style={{ '--i': index } as CSSProperties}
    >
      <article className="tilt" aria-labelledby={`project-${project.id}-title`}>
        <SkillGlyph skills={project.skills} />
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
