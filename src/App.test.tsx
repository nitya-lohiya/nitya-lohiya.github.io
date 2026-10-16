import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { navLinks } from './data/content';

describe('App', () => {
  it('renders one h1 and a section for every nav link', () => {
    const { container } = render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const link of navLinks) expect(container.querySelector(`section#${link.id}`), link.id).not.toBeNull();
  });

  it('toggles and remembers the color theme', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'light');
    render(<App />);
    await user.click(screen.getByTestId('theme-toggle'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByTestId('theme-toggle')).toHaveAccessibleName('Switch to light mode');
  });

  it('opens and closes the mobile menu with an accessible state', async () => {
    const user = userEvent.setup();
    render(<App />);
    const btn = screen.getByRole('button', { name: 'Open menu' });
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('lights up experience from the hero graph and clears from the floating pill', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByTestId('lens-pill')).toBeNull();
    const node = screen.getAllByRole('button', { name: 'Knowledge graphs' })[0]!;
    await user.click(node);
    const lit = screen.getAllByTestId('experience-item').filter((li) => li.dataset.state === 'lit');
    expect(lit.map((li) => li.id)).toEqual(['exp-itqan']);
    expect(screen.getByTestId('lens-pill')).toHaveTextContent('Knowledge graphs');
    await user.click(screen.getByRole('button', { name: 'Clear skill lens' }));
    expect(screen.queryByTestId('lens-pill')).toBeNull();
  });

  it('offers a resume download', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /download pdf/i })).toHaveAttribute('download');
  });
});
