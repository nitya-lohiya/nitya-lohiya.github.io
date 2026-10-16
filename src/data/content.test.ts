import { describe, expect, it } from 'vitest';
import { audiences, experience, heroSkills, navLinks, profile, projects, skillTaxonomy } from './content';

const skillIds: string[] = skillTaxonomy.flatMap((g) => g.skills.map((s) => s.id));
const work = [...experience, ...projects];

describe('site content', () => {
  it('has unique ids across experience and projects', () => {
    const ids = [...experience.map((e) => `exp-${e.id}`), ...projects.map((p) => `project-${p.id}`)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses skills defined in the taxonomy', () => {
    for (const w of work) for (const s of w.skills) expect(skillIds, `${w.id} uses ${s}`).toContain(s);
    for (const s of heroSkills) expect(skillIds).toContain(s);
  });

  it('connects every taxonomy skill to at least one piece of work', () => {
    for (const id of skillIds) expect(work.some((w) => (w.skills as string[]).includes(id)), id).toBe(true);
  });

  it('gives every role an audience, real detail, and a tech stack', () => {
    for (const e of experience) {
      expect(e.audience.length, e.id).toBeGreaterThan(10);
      expect(e.points.length, e.id).toBeGreaterThan(0);
      expect(e.tech.length, e.id).toBeGreaterThan(0);
    }
  });

  it('does not repeat work experience as a project', () => {
    const orgs = experience.map((e) => e.org.toLowerCase());
    for (const p of projects) for (const org of orgs) expect(p.title.toLowerCase()).not.toContain(org);
    expect(projects.map((p) => p.id)).not.toContain('nobe-lottery');
  });

  it('points every audience card at a real section anchor', () => {
    const anchors = new Set([...experience.map((e) => `#exp-${e.id}`), ...projects.map((p) => `#project-${p.id}`)]);
    for (const a of audiences) expect(anchors, a.href).toContain(a.href);
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

  it('never ships an unfilled [ADD: ...] placeholder or the old nickname as visible text', () => {
    const visible = JSON.stringify({ projects, experience, profile, audiences });
    expect(visible).not.toMatch(/\[ADD/);
    expect(visible).not.toMatch(/\bNits\b/);
  });

  it('links the resume from /public', () => {
    expect(profile.resume).toMatch(/^\/.+\.pdf$/);
    expect(navLinks.map((l) => l.id)).toContain('resume');
  });
});
