import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { navLinks, profile } from '../data/content';
import { useActiveSection } from '../hooks/useActiveSection';
import { useTheme } from '../hooks/useTheme';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';

const ids = navLinks.map((l) => l.id);

export function Nav() {
  const active = useActiveSection(ids);
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  // Slide the highlight pill under whichever link matches the section in view.
  useLayoutEffect(() => {
    const link = active ? listRef.current?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    setPill(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="nav">
      <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <nav className="nav__inner container" aria-label="Main">
        <a href="#top" className="nav__logo" aria-label={`${profile.name}, back to top`}>
          <span className="nav__mark" aria-hidden="true">
            n
          </span>
          {profile.name}
        </a>

        <ul id="nav-menu" ref={listRef} className={`nav__links${open ? ' is-open' : ''}`}>
          <li
            className="nav__pill"
            aria-hidden="true"
            style={pill ? { transform: `translateX(${pill.left}px)`, width: pill.width, opacity: 1 } : { opacity: 0 }}
          />
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={active === l.id ? 'is-active' : undefined}
                aria-current={active === l.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
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
