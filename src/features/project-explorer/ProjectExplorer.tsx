import { useId, useMemo, useState } from 'react';
import type { Project } from '../../data/content';
import { closestMatches, facetCounts, filterProjects, joinLabels, toggleSkill } from './explorer';
import { ProjectCard } from './ProjectCard';

type Taxonomy = readonly { group: string; skills: readonly { id: string; label: string }[] }[];

type Props = { projects: readonly Project[]; taxonomy: Taxonomy };

export function ProjectExplorer({ projects, taxonomy }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const headingId = useId();

  const labelOf = useMemo(() => {
    const map = new Map(taxonomy.flatMap((g) => g.skills.map((s) => [s.id, s.label] as const)));
    return (id: string) => map.get(id) ?? id;
  }, [taxonomy]);

  const allIds = useMemo(() => taxonomy.flatMap((g) => g.skills.map((s) => s.id)), [taxonomy]);
  const results = filterProjects(projects, selected);
  const counts = facetCounts(projects, selected, allIds);
  const selectedLabels = joinLabels(selected.map(labelOf));
  const plural = (n: number) => `${n} ${n === 1 ? 'project' : 'projects'}`;

  const status =
    selected.length === 0
      ? `Showing all ${plural(projects.length)}. Pick skills to see how my work connects.`
      : results.length === 0
        ? `No projects connect ${selectedLabels} yet.`
        : `${plural(results.length)} ${results.length === 1 ? 'connects' : 'connect'} ${selectedLabels}.`;

  return (
    <div className="explorer">
      <div className="explorer__panel" role="group" aria-labelledby={headingId}>
        <div className="explorer__intro">
          <h3 id={headingId} className="explorer__title">
            Explore by skill
          </h3>
          <p className="explorer__hint">
            Each skill is a node in my project graph. Select a few to keep only the projects connected to all of them.
            The number on each node is how many projects you would see next.
          </p>
        </div>

        <div className="explorer__groups">
          {taxonomy.map((group) => (
            <div key={group.group} className="explorer__group">
              <span className="explorer__group-label" aria-hidden="true">
                {group.group}
              </span>
              <ul className="chip-list" aria-label={group.group}>
                {group.skills.map((skill) => {
                  const pressed = selected.includes(skill.id);
                  const count = counts[skill.id] ?? 0;
                  return (
                    <li key={skill.id}>
                      <button
                        type="button"
                        className={`chip${pressed ? ' is-on' : ''}${!pressed && count === 0 ? ' is-dead' : ''}`}
                        aria-pressed={pressed}
                        aria-label={`${skill.label}, ${plural(count)}`}
                        onClick={() => setSelected((s) => toggleSkill(s, skill.id))}
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

        <div className="explorer__status">
          <p role="status" aria-live="polite" data-testid="explorer-status">
            {status}
          </p>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setSelected([])}
            disabled={selected.length === 0}
          >
            Reset
          </button>
        </div>
      </div>

      {results.length > 0 ? (
        <ul className="project-grid" aria-label="Projects">
          {results.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              matched={selected.map(labelOf)}
              wide={selected.length === 0 && Boolean(project.featured)}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state" data-testid="empty-state">
          <p className="empty-state__title">Nothing connects {selectedLabels}… yet.</p>
          <p className="empty-state__text">That is a combination I have not built. Here is what comes closest:</p>
          <ul className="empty-state__list">
            {closestMatches(projects, selected).map(({ project, shared }) => (
              <li key={project.id}>
                <span>
                  <strong>{project.title}</strong> shares {joinLabels(shared.map(labelOf))}
                </span>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSelected(shared)}>
                  Show {joinLabels(shared.map(labelOf))}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setSelected([])}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
