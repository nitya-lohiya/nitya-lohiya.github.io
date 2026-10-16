import { describe, expect, it } from 'vitest';
import { experience, navLinks, profile, projects, skillTaxonomy } from './content';

const skillIds = skillTaxonomy.flatMap((g) => g.skills.map((s) => s.id));

describe('site content', () => {
  it('has unique project ids', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses skills defined in the taxonomy', () => {
    for (const p of projects) for (const s of p.skills) expect(skillIds, `${p.id} uses ${s}`).toContain(s);
  });

  it('gives every taxonomy skill at least one project, so no filter is a dead end by default', () => {
    for (const id of skillIds) expect(projects.some((p) => p.skills.includes(id)), id).toBe(true);
  });

  it('uses https for every external link', () => {
    const links = [
      ...projects.flatMap((p) => p.links.map((l) => l.href)),
      ...experience.flatMap((e) => (e.link ? [e.link] : [])),
      profile.github,
      ...(profile.linkedin ? [profile.linkedin] : []),
    ];
    for (const href of links) expect(href).toMatch(/^https:\/\//);
  });

  it('never ships an unfilled [ADD: ...] placeholder as visible text', () => {
    const visible = JSON.stringify({ projects, experience, profile });
    expect(visible).not.toMatch(/\[ADD/);
  });

  it('features the strongest work first', () => {
    expect(projects[0]?.featured).toBe(true);
  });

  it('links the resume from /public', () => {
    expect(profile.resume).toMatch(/^\/.+\.pdf$/);
    expect(navLinks.map((l) => l.id)).toContain('resume');
  });
});
