import { skillTaxonomy } from '../../data/content';

const map = new Map<string, string>(skillTaxonomy.flatMap((g) => g.skills.map((s) => [s.id, s.label] as const)));

export const allSkillIds: string[] = [...map.keys()];
export const skillLabel = (id: string) => map.get(id) ?? id;
export const countLabel = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
