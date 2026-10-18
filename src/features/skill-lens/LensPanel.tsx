import { useId } from 'react';
import { experience as allExperience, projects as allProjects, skillTaxonomy } from '../../data/content';
import { facetCounts, filterProjects, joinLabels } from './explorer';
import { allSkillIds, countLabel, skillLabel } from './labels';
import { useLens } from './LensContext';

type Props = {
  experience?: typeof allExperience;
  projects?: typeof allProjects;
};

export function lensSummary(selected: string[], roles: number, projects: number) {
  const labels = joinLabels(selected.map(skillLabel));
  if (selected.length === 0) return 'Showing everything. Pick a skill to light up where I’ve used it.';
  if (roles + projects === 0) return `Nothing I’ve built uses ${labels} together yet.`;
  return `${countLabel(roles, 'role', 'roles')} and ${countLabel(projects, 'project', 'projects')} use ${labels}.`;
}

/** The chip panel: every skill in the taxonomy, with how many pieces of work it would leave lit. */
export function LensPanel({ experience = allExperience, projects = allProjects }: Props) {
  const { selected, toggle, clear } = useLens();
  const headingId = useId();
  const work = [...experience, ...projects];
  const counts = facetCounts(work, selected, allSkillIds);
  const roles = filterProjects(experience, selected).length;
  const projectCount = filterProjects(projects, selected).length;

  return (
    <div className="lens-panel" role="group" aria-labelledby={headingId}>
      <div className="lens-panel__intro">
        <h3 id={headingId} className="lens-panel__title">
          <span className="lens-panel__icon" aria-hidden="true" />
          <span>
            Skill lens: <span className="lens-panel__sub">pick a trail</span>
          </span>
        </h3>
        <p className="lens-panel__hint">
          Every skill is a trail blaze. Pick one (or a few) and the roles and projects on that trail get marked,
          while the rest fade back. The number on each blaze is how many you’d see.
        </p>
      </div>

      <div className="lens-panel__groups">
        {skillTaxonomy.map((group) => (
          <div key={group.group} className="lens-panel__group">
            <span className="lens-panel__group-label" aria-hidden="true">
              {group.group}
            </span>
            <ul className="chip-list" aria-label={group.group} data-stagger>
              {group.skills.map((skill) => {
                const pressed = selected.includes(skill.id);
                const count = counts[skill.id] ?? 0;
                return (
                  <li key={skill.id}>
                    <button
                      type="button"
                      className={`chip${pressed ? ' is-on' : ''}${!pressed && count === 0 ? ' is-dead' : ''}`}
                      aria-pressed={pressed}
                      aria-label={`${skill.label}, ${countLabel(count, 'match', 'matches')}`}
                      onClick={() => toggle(skill.id)}
                    >
                      <span className="chip__dot" aria-hidden="true" />
                      {skill.label}
                      <span className="chip__count" aria-hidden="true">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="lens-panel__status">
        <p role="status" aria-live="polite" data-testid="lens-status">
          {lensSummary(selected, roles, projectCount)}
        </p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={clear} disabled={selected.length === 0}>
          Reset
        </button>
      </div>
    </div>
  );
}
