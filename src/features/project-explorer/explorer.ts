/**
 * Pure logic for the project explorer ("skill graph"). Projects and skills form a bipartite
 * graph; selecting skills keeps only the projects connected to every selected skill.
 * Kept free of React so it can be tested directly.
 */

export type Explorable = { id: string; skills: readonly string[]; featured?: boolean };

/** Projects connected to *all* selected skills. No selection means everything matches. */
export function filterProjects<P extends Explorable>(projects: readonly P[], selected: readonly string[]): P[] {
  if (selected.length === 0) return [...projects];
  return projects.filter((p) => selected.every((s) => p.skills.includes(s)));
}

/**
 * For each skill, how many projects would match if it were part of the selection.
 * Lets the UI show, before a click, whether a skill narrows or empties the results.
 */
export function facetCounts(
  projects: readonly Explorable[],
  selected: readonly string[],
  skillIds: readonly string[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const id of skillIds) {
    const next = selected.includes(id) ? selected : [...selected, id];
    counts[id] = filterProjects(projects, next).length;
  }
  return counts;
}

/**
 * When nothing matches every selected skill, the projects sharing the most of them,
 * best first (ties keep featured projects ahead, then original order).
 */
export function closestMatches<P extends Explorable>(
  projects: readonly P[],
  selected: readonly string[],
  limit = 3,
): { project: P; shared: string[] }[] {
  return projects
    .map((project, index) => ({ project, index, shared: selected.filter((s) => project.skills.includes(s)) }))
    .filter((m) => m.shared.length > 0)
    .sort(
      (a, b) =>
        b.shared.length - a.shared.length ||
        Number(Boolean(b.project.featured)) - Number(Boolean(a.project.featured)) ||
        a.index - b.index,
    )
    .slice(0, limit)
    .map(({ project, shared }) => ({ project, shared }));
}

export function toggleSkill(selected: readonly string[], id: string): string[] {
  return selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
}

/** Human-readable list: "A", "A and B", "A, B, and C". */
export function joinLabels(labels: readonly string[]): string {
  if (labels.length <= 2) return labels.join(' and ');
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}
