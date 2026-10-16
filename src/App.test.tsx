import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  it('keeps the animated name and count-up metrics readable by screen readers', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Nitya Lohiya');
    for (const value of ['119', '96%', '2.3→0.9ms', '8']) expect(screen.getByText(value, { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('marks every section with the temple-border divider', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('section.section > .temple-border').length).toBe(navLinks.length);
  });

  describe('with scroll reveals running', () => {
    // jsdom has no IntersectionObserver; fake one that reports every element as on screen.
    class VisibleObserver {
      constructor(private cb: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.cb([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      unobserve() {}
      disconnect() {}
    }
    afterEach(() => {
      vi.unstubAllGlobals();
      document.documentElement.classList.remove('js-reveal');
    });

    it('keeps revealed roles visible when the lens changes and after reset', async () => {
      vi.stubGlobal('IntersectionObserver', VisibleObserver);
      const user = userEvent.setup();
      const { container } = render(<App />);
      const rows = () => [...container.querySelectorAll('.timeline__row')];
      expect(rows().length).toBeGreaterThan(0);
      expect(rows().every((r) => r.classList.contains('is-visible'))).toBe(true);

      await user.click(screen.getAllByRole('button', { name: 'Applied ML' })[0]!);
      expect(rows().every((r) => r.classList.contains('is-visible'))).toBe(true);

      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(rows().every((r) => r.classList.contains('is-visible'))).toBe(true);
      expect(screen.getAllByTestId('experience-item').every((li) => li.dataset.state === 'neutral')).toBe(true);
    });
  });

  it('offers a resume download', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /download pdf/i })).toHaveAttribute('download');
  });
});
