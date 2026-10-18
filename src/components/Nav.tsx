import { useEffect, useState } from 'react';
import { navLinks, profile, trail } from '../data/content';
import { useTheme } from '../hooks/useTheme';
import { useTrailProgress } from '../hooks/useTrailProgress';
import { elevationAt } from '../lib/trail';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';
import { Ridge } from './Ridge';

const ids = trail.map((t) => t.id);

export function Nav() {
  const { index, fraction } = useTrailProgress(ids);
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const here = trail[index] ?? trail[0];
  const elevation = elevationAt(trail, index, fraction);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="nav">
      <nav className="nav__inner container" aria-label="Main">
        <a href="#top" className="nav__logo" aria-label={`${profile.name}, back to the trailhead`}>
          {profile.name}
        </a>

        <Ridge index={index} fraction={fraction} />

        <ul id="nav-menu" className={`nav__links${open ? ' is-open' : ''}`}>
          {navLinks.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} aria-current={here.id === l.id ? 'location' : undefined} onClick={() => setOpen(false)}>
                {l.label}
                <span className="nav__links-stop">{trail.find((t) => t.id === l.id)?.stop}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <p className="nav__elev" aria-hidden="true" data-testid="elevation">
            <span>
              <span className="nav__elev-num">{elevation.toLocaleString('en-US')}</span> ft
            </span>
            <span className="nav__elev-stop">{here.stop}</span>
          </p>
          <button
            type="button"
            className="icon-btn"
            onClick={() => toggle()}
            aria-label={`Switch to ${nextTheme} mode`}
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="icon-btn nav__menu-btn"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
    </header>
  );
}
