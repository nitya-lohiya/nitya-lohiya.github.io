import { experience as allExperience, projects as allProjects } from '../../data/content';
import { closestMatches, filterProjects, joinLabels } from './explorer';
import { skillLabel } from './labels';
import { useLens } from './LensContext';
import { ProjectCard } from './ProjectCard';

type Props = { projects?: typeof allProjects; experience?: typeof allExperience };

export function ProjectGallery({ projects = allProjects, experience = allExperience }: Props) {
  const { selected, set, clear } = useLens();
  const results = filterProjects(projects, selected);
  const labels = joinLabels(selected.map(skillLabel));

  if (results.length > 0) {
    return (
      <>
        {selected.length > 0 && (
          <p className="gallery-note">
            Showing projects that use <strong>{labels}</strong>.{' '}
            <button type="button" className="link-btn" onClick={clear}>
              Show all
            </button>
          </p>
        )}
        <ul className="project-grid" aria-label="Projects">
          {results.map((project) => (
            <ProjectCard key={project.id} project={project} wide={selected.length === 0 && Boolean(project.featured)} />
          ))}
        </ul>
      </>
    );
  }

  const atWork = filterProjects(experience, selected);
  return (
    <div className="empty-state" data-testid="empty-state">
      <p className="empty-state__title">No side project uses {labels}… yet.</p>
      {atWork.length > 0 ? (
        <p className="empty-state__text">
          But I’ve used it at work:{' '}
          {atWork.map((e, i) => (
            <span key={e.id}>
              {i > 0 && ', '}
              <a href={`#exp-${e.id}`} className="text-link">
                {e.org}
              </a>
            </span>
          ))}
          .
        </p>
      ) : (
        <p className="empty-state__text">Here’s what comes closest:</p>
      )}
      <ul className="empty-state__list">
        {closestMatches(projects, selected).map(({ project, shared }) => (
          <li key={project.id}>
            <span>
              <strong>{project.title}</strong> uses {joinLabels(shared.map(skillLabel))}
            </span>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => set(shared)}>
              Show {joinLabels(shared.map(skillLabel))}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--primary btn--sm" onClick={clear}>
        Clear the lens
      </button>
    </div>
  );
}
