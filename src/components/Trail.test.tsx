import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { trail } from '../data/content';
import { LENS_TOUCHED_KEY } from '../features/skill-lens/LensContext';
import { Ridge } from './Ridge';

describe('trail navigator', () => {
  it('has a flag link for every stop, pointing at a real section', () => {
    const { container } = render(<App />);
    const ridge = within(screen.getByTestId('ridge'));
    for (const stop of trail) {
      const link = ridge.getByRole('link', { name: new RegExp(`^${stop.label}: ${stop.stop}`) });
      expect(link).toHaveAttribute('href', `#${stop.id}`);
      expect(container.querySelector(`#${stop.id}`), stop.id).not.toBeNull();
    }
  });

  it('starts at the trailhead, 740 ft', () => {
    render(<App />);
    expect(screen.getByTestId('elevation')).toHaveTextContent('740 ft');
    expect(screen.getByTestId('elevation')).toHaveTextContent('Trailhead');
  });

  it('marks the stop you are at, and the ones you have passed', () => {
    render(<Ridge index={2} fraction={0.4} />);
    const links = screen.getAllByRole('link');
    expect(links[2]).toHaveAttribute('aria-current', 'location');
    expect(links[0]).toHaveClass('is-passed');
    expect(links[1]).toHaveClass('is-passed');
    expect(links[3]).not.toHaveClass('is-passed');
    expect(links.filter((l) => l.hasAttribute('aria-current'))).toHaveLength(1);
  });
});

describe('"pick a skill" hint', () => {
  it('shows on a first visit and goes away once the visitor uses the lens', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText(/I’ll show you the trail/)).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Statistics' })[0]!);
    expect(screen.queryByText(/I’ll show you the trail/)).toBeNull();
    expect(localStorage.getItem(LENS_TOUCHED_KEY)).toBe('1');
  });

  it('stays hidden for returning visitors', () => {
    localStorage.setItem(LENS_TOUCHED_KEY, '1');
    render(<App />);
    expect(screen.queryByText(/I’ll show you the trail/)).toBeNull();
  });
});
