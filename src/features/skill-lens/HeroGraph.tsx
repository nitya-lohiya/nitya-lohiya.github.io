import type { CSSProperties } from 'react';
import { experience as allExperience, heroSkills, projects as allProjects } from '../../data/content';
import { filterProjects, joinLabels } from './explorer';
import { countLabel, skillLabel } from './labels';
import { HandNote } from '../../components/HandNote';
import { notes } from '../../data/content';
import { useLens } from './LensContext';

// Hexagon around the center, in a 400×400 space. Index matches `heroSkills`.
const positions = [
  { x: 200, y: 50 },
  { x: 330, y: 125 },
  { x: 330, y: 275 },
  { x: 200, y: 350 },
  { x: 70, y: 275 },
  { x: 70, y: 125 },
];
const C = { x: 200, y: 200 };

type Props = { skills?: readonly string[]; experience?: typeof allExperience; projects?: typeof allProjects };

/** The hero's interactive graph: each node is a skill, and clicking one switches on the site-wide lens. */
export function HeroGraph({ skills = heroSkills, experience = allExperience, projects = allProjects }: Props) {
  const { selected, toggle, touched } = useLens();
  const nodes = skills.slice(0, positions.length).map((id, i) => ({ id, ...positions[i]! }));
  const roles = filterProjects(experience, selected).length;
  const work = filterProjects(projects, selected).length;

  return (
    <figure className="hero-graph" aria-labelledby="hero-graph-caption">
      {!touched && (
        <HandNote arrow="down" className="hero-graph__hint">
          {notes.hero}
        </HandNote>
      )}
      <div className="hero-graph__stage">
        <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
          {nodes.map((n, i) => {
            const next = nodes[(i + 1) % nodes.length]!;
            return (
              <line
                key={`ring-${n.id}`}
                x1={n.x}
                y1={n.y}
                x2={next.x}
                y2={next.y}
                className="edge edge--ring"
                style={{ '--i': i } as CSSProperties}
              />
            );
          })}
          {nodes.map((n, i) => (
            <line
              key={n.id}
              x1={C.x}
              y1={C.y}
              x2={n.x}
              y2={n.y}
              className={`edge${selected.includes(n.id) ? ' is-lit' : ''}`}
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </svg>
        <span className="hero-graph__center" aria-hidden="true">
          Core
        </span>
        {nodes.map((n, i) => {
          const on = selected.includes(n.id);
          return (
            <button
              key={n.id}
              type="button"
              className={`graph-node${on ? ' is-on' : ''}`}
              style={{ left: `${n.x / 4}%`, top: `${n.y / 4}%`, '--i': i } as CSSProperties}
              aria-pressed={on}
              onClick={() => toggle(n.id)}
            >
              <span className="graph-node__dot" aria-hidden="true" />
              {skillLabel(n.id)}
            </button>
          );
        })}
      </div>
      <figcaption id="hero-graph-caption" className="hero-graph__caption">
        {selected.length === 0 ? (
          <span>
            <span className="hero-graph__fig">Fig. 1</span> Tap a skill to light up where I’ve used it.
          </span>
        ) : (
          <span>
            <strong>{joinLabels(selected.map(skillLabel))}</strong>: {countLabel(roles, 'role', 'roles')} ·{' '}
            {countLabel(work, 'project', 'projects')}.{' '}
            <a href="#experience" className="text-link">
              See them
            </a>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
