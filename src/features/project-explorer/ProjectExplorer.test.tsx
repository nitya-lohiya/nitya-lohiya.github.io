import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { Project } from '../../data/content';
import { projects as realProjects, skillTaxonomy } from '../../data/content';
import { ProjectExplorer } from './ProjectExplorer';

const make = (id: string, title: string, skills: string[], featured = false): Project => ({
  id,
  title,
  summary: `${title} summary`,
  description: '',
  role: '',
  context: '',
  stack: [],
  skills: skills as Project['skills'],
  links: [],
  featured,
});

const fixtures = [
  make('kg', 'Knowledge Graph', ['python', 'llm'], true),
  make('api', 'License API', ['python', 'fastapi']),
  make('app', 'Mobile App', ['dart', 'flutter']),
];

const taxonomy = [
  {
    group: 'Test',
    skills: [
      { id: 'python', label: 'Python' },
      { id: 'llm', label: 'LLMs' },
      { id: 'fastapi', label: 'FastAPI' },
      { id: 'flutter', label: 'Flutter' },
      { id: 'dart', label: 'Dart' },
    ],
  },
];

const setup = () => {
  const user = userEvent.setup();
  render(<ProjectExplorer projects={fixtures} taxonomy={taxonomy} />);
  const chip = (name: RegExp) => screen.getByRole('button', { name });
  const titles = () => screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent).filter((t) => t !== 'Explore by skill');
  return { user, chip, titles };
};

describe('ProjectExplorer', () => {
  it('shows every project before any filter is chosen', () => {
    const { titles } = setup();
    expect(titles()).toEqual(['Knowledge Graph', 'License API', 'Mobile App']);
    expect(screen.getByTestId('explorer-status')).toHaveTextContent('Showing all 3 projects');
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('filters to projects connected to the selected skill', async () => {
    const { user, chip, titles } = setup();
    await user.click(chip(/^Python/));
    expect(chip(/^Python/)).toHaveAttribute('aria-pressed', 'true');
    expect(titles()).toEqual(['Knowledge Graph', 'License API']);
    expect(screen.getByTestId('explorer-status')).toHaveTextContent('2 projects connect Python.');
  });

  it('narrows further when skills are combined, and updates node counts', async () => {
    const { user, chip, titles } = setup();
    await user.click(chip(/^Python/));
    expect(chip(/^LLMs/)).toHaveAccessibleName('LLMs, 1 project');
    expect(chip(/^Flutter/)).toHaveAccessibleName('Flutter, 0 projects');
    await user.click(chip(/^LLMs/));
    expect(titles()).toEqual(['Knowledge Graph']);
    expect(screen.getByTestId('explorer-status')).toHaveTextContent('1 project connects Python and LLMs.');
  });

  it('shows a helpful empty state with closest matches when nothing connects', async () => {
    const { user, chip } = setup();
    await user.click(chip(/^Flutter/));
    await user.click(chip(/^LLMs/));

    const empty = screen.getByTestId('empty-state');
    expect(screen.queryAllByTestId('project-card')).toHaveLength(0);
    expect(empty).toHaveTextContent('Nothing connects Flutter and LLMs');
    expect(within(empty).getByText('Mobile App')).toBeInTheDocument();
    expect(within(empty).getByText('Knowledge Graph')).toBeInTheDocument();
    expect(screen.getByTestId('explorer-status')).toHaveTextContent('No projects connect Flutter and LLMs yet.');
  });

  it('lets a closest match jump to a working filter', async () => {
    const { user, chip, titles } = setup();
    await user.click(chip(/^Flutter/));
    await user.click(chip(/^LLMs/));
    await user.click(screen.getByRole('button', { name: 'Show Flutter' }));
    expect(titles()).toEqual(['Mobile App']);
    expect(chip(/^LLMs/)).toHaveAttribute('aria-pressed', 'false');
  });

  it('resets back to every project', async () => {
    const { user, chip, titles } = setup();
    await user.click(chip(/^Flutter/));
    await user.click(chip(/^LLMs/));
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(titles()).toHaveLength(3);

    await user.click(chip(/^Python/));
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(titles()).toHaveLength(3);
    expect(chip(/^Python/)).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles a skill off when clicked twice', async () => {
    const { user, chip, titles } = setup();
    await user.click(chip(/^Dart/));
    expect(titles()).toEqual(['Mobile App']);
    await user.click(chip(/^Dart/));
    expect(titles()).toHaveLength(3);
  });

  it('works from the keyboard', async () => {
    const { user, chip, titles } = setup();
    chip(/^FastAPI/).focus();
    await user.keyboard('{Enter}');
    expect(titles()).toEqual(['License API']);
  });

  it('renders the real site data without crashing', () => {
    render(<ProjectExplorer projects={realProjects} taxonomy={skillTaxonomy} />);
    expect(screen.getAllByTestId('project-card')).toHaveLength(realProjects.length);
  });
});
