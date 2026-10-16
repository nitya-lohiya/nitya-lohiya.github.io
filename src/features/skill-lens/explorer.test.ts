import { describe, expect, it } from 'vitest';
import { closestMatches, facetCounts, filterProjects, joinLabels, toggleSkill } from './explorer';

const projects = [
  { id: 'a', skills: ['python', 'ml'], featured: false },
  { id: 'b', skills: ['python', 'llm'], featured: true },
  { id: 'c', skills: ['react', 'node'] },
  { id: 'd', skills: ['python', 'ml', 'llm'] },
];
const ids = (ps: { id: string }[]) => ps.map((p) => p.id);

describe('filterProjects', () => {
  it('returns every project when nothing is selected', () => {
    expect(ids(filterProjects(projects, []))).toEqual(['a', 'b', 'c', 'd']);
  });

  it('keeps projects that have a single selected skill', () => {
    expect(ids(filterProjects(projects, ['python']))).toEqual(['a', 'b', 'd']);
  });

  it('requires every selected skill (AND, not OR)', () => {
    expect(ids(filterProjects(projects, ['python', 'llm']))).toEqual(['b', 'd']);
    expect(ids(filterProjects(projects, ['ml', 'llm']))).toEqual(['d']);
  });

  it('returns an empty list when no project connects the selection', () => {
    expect(filterProjects(projects, ['react', 'ml'])).toEqual([]);
  });

  it('returns an empty list for a skill no project uses', () => {
    expect(filterProjects(projects, ['cobol'])).toEqual([]);
  });

  it('does not mutate its input', () => {
    const copy = structuredClone(projects);
    filterProjects(projects, ['python']);
    expect(projects).toEqual(copy);
  });
});

describe('facetCounts', () => {
  it('counts how many projects each skill would leave', () => {
    expect(facetCounts(projects, [], ['python', 'react', 'llm'])).toEqual({ python: 3, react: 1, llm: 2 });
  });

  it('accounts for the current selection', () => {
    expect(facetCounts(projects, ['python'], ['ml', 'react', 'python'])).toEqual({ ml: 2, react: 0, python: 3 });
  });
});

describe('closestMatches', () => {
  it('ranks by shared skills, featured first on ties, and skips zero overlap', () => {
    const result = closestMatches(projects, ['react', 'llm', 'ml']);
    expect(result.map((m) => [m.project.id, m.shared])).toEqual([
      ['d', ['llm', 'ml']],
      ['b', ['llm']],
      ['a', ['ml']],
    ]);
  });

  it('respects the limit', () => {
    expect(closestMatches(projects, ['python'], 2)).toHaveLength(2);
  });

  it('returns nothing when no project shares any selected skill', () => {
    expect(closestMatches(projects, ['cobol'])).toEqual([]);
  });
});

describe('helpers', () => {
  it('toggleSkill adds and removes', () => {
    expect(toggleSkill(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleSkill(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('joinLabels reads naturally', () => {
    expect(joinLabels(['A'])).toBe('A');
    expect(joinLabels(['A', 'B'])).toBe('A and B');
    expect(joinLabels(['A', 'B', 'C'])).toBe('A, B, and C');
  });
});
