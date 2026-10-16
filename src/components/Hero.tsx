import { focusAreas, profile } from '../data/content';
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

      <div className="focus">
        <h2 className="focus__title">What I build</h2>
        <ul className="focus__list">
          {focusAreas.map((f) => (
            <li key={f.area}>
              <a href={f.href} className="focus-card">
                <span className="focus-card__metric">{f.metric}</span>
                <span className="focus-card__metric-label">{f.metricLabel}</span>
                <span className="focus-card__area">{f.area}</span>
                <span className="focus-card__detail">{f.detail}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
