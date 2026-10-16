import { experience, projects } from '../../data/content';
import { filterProjects, joinLabels } from './explorer';
import { countLabel, skillLabel } from './labels';
import { useLens } from './LensContext';

/** Floating reminder of the active lens, so it can be cleared from anywhere on the page. */
export function LensPill() {
  const { selected, clear } = useLens();
  if (selected.length === 0) return null;
  const roles = filterProjects(experience, selected).length;
  const work = filterProjects(projects, selected).length;
  return (
    <div className="lens-pill" role="region" aria-label="Active skill lens" data-testid="lens-pill">
      <span className="lens-pill__icon" aria-hidden="true" />
      <span className="lens-pill__text">
        <strong>{joinLabels(selected.map(skillLabel))}</strong>
        <span className="lens-pill__counts">
          {countLabel(roles, 'role', 'roles')} · {countLabel(work, 'project', 'projects')}
        </span>
      </span>
      <a href="#experience" className="lens-pill__link">
        View
      </a>
      <button type="button" className="lens-pill__clear" onClick={clear} aria-label="Clear skill lens">
        ×
      </button>
    </div>
  );
}
