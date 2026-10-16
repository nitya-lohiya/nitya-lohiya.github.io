import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { Experience, Project } from '../../data/content';
import { ExperienceTimeline } from './ExperienceTimeline';
import { HeroGraph } from './HeroGraph';
import { LensProvider } from './LensContext';
import { LensPanel } from './LensPanel';
import { ProjectGallery } from './ProjectGallery';

const project = (id: string, title: string, skills: string[], featured = false): Project => ({
  id,
  title,
  summary: '',
  description: '',
  audience: 'someone',
  role: '',
  context: '',
  stack: [],
  skills: skills as Project['skills'],
  links: [],
  featured,
  caseStudy: { problem: '', built: '', decisions: [], outcome: '' },
});

const role = (id: string, org: string, skills: string[]): Experience => ({
  id,
  role: `Engineer at ${org}`,
  org,
  dates: '2026',
  location: '',
  audience: 'someone',
  points: [],
  tech: [],
  skills: skills as Experience['skills'],
});

const projects = [
  project('kg', 'Knowledge Graph', ['python', 'llm'], true),
  project('api', 'License API', ['python', 'fastapi']),
  project('app', 'Mobile App', ['dart', 'flutter']),
];
const experience = [role('lab', 'Research Lab', ['python', 'llm', 'statistics']), role('shop', 'Web Shop', ['react', 'docker'])];

function setup() {
  const user = userEvent.setup();
  render(
    <LensProvider>
      <HeroGraph skills={['python', 'llm', 'docker']} experience={experience} projects={projects} />
      <LensPanel experience={experience} projects={projects} />
      <ExperienceTimeline experience={experience} />
      <ProjectGallery projects={projects} experience={experience} />
    </LensProvider>,
  );
  const panel = within(screen.getByRole('group', { name: /skill lens/i }));
  const chip = (name: RegExp) => panel.getByRole('button', { name });
  const projectTitles = () =>
    screen.queryAllByTestId('project-card').map((c) => within(c).getByRole('heading').textContent);
  const roleStates = () => screen.getAllByTestId('experience-item').map((li) => li.dataset.state);
  const status = () => screen.getByTestId('lens-status');
  return { user, chip, projectTitles, roleStates, status };
}

describe('skill lens', () => {
  it('starts with everything visible and nothing dimmed', () => {
    const { projectTitles, roleStates, status } = setup();
    expect(projectTitles()).toEqual(['Knowledge Graph', 'License API', 'Mobile App']);
    expect(roleStates()).toEqual(['neutral', 'neutral']);
    expect(status()).toHaveTextContent('Showing everything');
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('lights up matching roles and filters projects when a skill is picked', async () => {
    const { user, chip, projectTitles, roleStates, status } = setup();
    await user.click(chip(/^Python/));
    expect(chip(/^Python/)).toHaveAttribute('aria-pressed', 'true');
    expect(roleStates()).toEqual(['lit', 'dim']);
    expect(projectTitles()).toEqual(['Knowledge Graph', 'License API']);
    expect(status()).toHaveTextContent('1 role and 2 projects use Python.');
  });

  it('requires every picked skill and updates the counts on each chip', async () => {
    const { user, chip, projectTitles, status } = setup();
    expect(chip(/^Python/)).toHaveAccessibleName('Python, 3 matches');
    await user.click(chip(/^Python/));
    expect(chip(/^LLM systems/)).toHaveAccessibleName('LLM systems, 2 matches');
    expect(chip(/^Flutter/)).toHaveAccessibleName('Flutter, 0 matches');
    await user.click(chip(/^LLM systems/));
    expect(projectTitles()).toEqual(['Knowledge Graph']);
    expect(status()).toHaveTextContent('1 role and 1 project use Python and LLM systems.');
  });

  it('shows an empty state that points to work experience when no project matches', async () => {
    const { user, chip, roleStates } = setup();
    await user.click(chip(/^Docker/));
    const empty = screen.getByTestId('empty-state');
    expect(screen.queryAllByTestId('project-card')).toHaveLength(0);
    expect(empty).toHaveTextContent('No side project uses Docker');
    expect(within(empty).getByRole('link', { name: 'Web Shop' })).toHaveAttribute('href', '#exp-shop');
    expect(roleStates()).toEqual(['dim', 'lit']);
  });

  it('handles a combination nothing uses, and offers closest matches', async () => {
    const { user, chip, roleStates, status } = setup();
    await user.click(chip(/^Flutter/));
    await user.click(chip(/^LLM systems/));
    expect(status()).toHaveTextContent('Nothing I’ve built uses Flutter and LLM systems together yet.');
    expect(roleStates()).toEqual(['dim', 'dim']);
    const empty = screen.getByTestId('empty-state');
    expect(within(empty).getByText('Mobile App')).toBeInTheDocument();
    expect(within(empty).getByText('Knowledge Graph')).toBeInTheDocument();
  });

  it('jumps from a closest match to a working lens', async () => {
    const { user, chip, projectTitles } = setup();
    await user.click(chip(/^Flutter/));
    await user.click(chip(/^LLM systems/));
    await user.click(screen.getByRole('button', { name: 'Show Flutter' }));
    expect(projectTitles()).toEqual(['Mobile App']);
    expect(chip(/^LLM systems/)).toHaveAttribute('aria-pressed', 'false');
  });

  it('resets from the panel, the empty state, and the gallery note', async () => {
    const { user, chip, projectTitles, roleStates } = setup();
    await user.click(chip(/^Docker/));
    await user.click(screen.getByRole('button', { name: 'Clear the lens' }));
    expect(projectTitles()).toHaveLength(3);

    await user.click(chip(/^Python/));
    await user.click(screen.getByRole('button', { name: 'Show all' }));
    expect(projectTitles()).toHaveLength(3);

    await user.click(chip(/^Python/));
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(roleStates()).toEqual(['neutral', 'neutral']);
  });

  it('shares one selection between the hero graph and the panel', async () => {
    const { user, chip, roleStates } = setup();
    const graphNode = screen.getAllByRole('button', { name: 'Python' })[0]!;
    await user.click(graphNode);
    expect(graphNode).toHaveAttribute('aria-pressed', 'true');
    expect(chip(/^Python/)).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('figure')).toHaveTextContent('Python: 1 role · 2 projects.');
    expect(roleStates()).toEqual(['lit', 'dim']);

    await user.click(chip(/^Python/));
    expect(graphNode).toHaveAttribute('aria-pressed', 'false');
  });

  it('works from the keyboard', async () => {
    const { user, chip, projectTitles } = setup();
    chip(/^FastAPI/).focus();
    await user.keyboard('{Enter}');
    expect(projectTitles()).toEqual(['License API']);
    await user.keyboard(' ');
    expect(projectTitles()).toHaveLength(3);
  });
});
