import { navLinks, profile } from '../data/content';
import { Meadow } from './Wildflowers';

export function Footer() {
  return (
    <footer className="footer">
      <Meadow className="footer__meadow" seed={31} count={64} width={1200} height={46} />
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name} <span aria-hidden="true">·</span>{' '}
          <span className="footer__coords">40.12° N, 88.24° W</span> <span aria-hidden="true">·</span> Built with React,
          Vite, and TypeScript.
        </p>
        <nav aria-label="Footer">
          <ul className="footer__links">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            {profile.linkedin && (
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
