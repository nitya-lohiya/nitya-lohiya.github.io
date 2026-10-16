import { audiences, profile } from '../data/content';
import { HeroGraph } from '../features/skill-lens/HeroGraph';
import { GitHubIcon, LinkedInIcon } from './Icons';

export function Hero() {
  return (
    <section id="top" className="hero container" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">{profile.role}</p>
        <h1 id="hero-title" className="hero__title">
          {profile.name}
        </h1>
        <p className="hero__tagline">
          I build technology that makes <em>people’s lives</em> better.
        </p>
        <p className="hero__lede">{profile.positioning}</p>

        <div className="hero__ctas">
          <a href="#experience" className="btn btn--primary">
            See my experience
          </a>
          <a href="#projects" className="btn btn--ghost">
            Projects
          </a>
          <a href="#resume" className="btn btn--ghost">
            Resume
          </a>
          <span className="hero__socials">
            <a href={`mailto:${profile.email}`} className="icon-btn" aria-label={`Email ${profile.email}`}>
              <span aria-hidden="true">@</span>
            </a>
            <a href={profile.github} className="icon-btn" target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)">
              <GitHubIcon />
            </a>
            {profile.linkedin && (
              <a href={profile.linkedin} className="icon-btn" target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)">
                <LinkedInIcon />
              </a>
            )}
          </span>
        </div>
      </div>

      <div className="hero__art">
        <HeroGraph />
      </div>

      <div className="audiences">
        <h2 className="audiences__title">Who I build for</h2>
        <ul className="audiences__list">
          {audiences.map((a, i) => (
            <li key={a.who}>
              <a href={a.href} className="audience">
                <span className="audience__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="audience__who">{a.who}</span>
                <span className="audience__what">{a.what}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
