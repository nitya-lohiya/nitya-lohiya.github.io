import type { CSSProperties } from 'react';
import { focusAreas, profile } from '../data/content';
import { HeroGraph } from '../features/skill-lens/HeroGraph';
import { CountUp } from './CountUp';
import { GitHubIcon, LinkedInIcon } from './Icons';

/** The name, one letter at a time. Screen readers get the plain name from aria-label. */
function RevealName({ text }: { text: string }) {
  return (
    <span className="hero__name" aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={i} className="hero__char" style={{ '--i': i } as CSSProperties}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero-wrap" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-bg__blob hero-bg__blob--a" />
        <span className="hero-bg__blob hero-bg__blob--b" />
        <span className="hero-bg__blob hero-bg__blob--c" />
        <span className="hero-bg__grid" />
      </div>

      <div className="hero container">
        <div className="hero__copy">
          <p className="eyebrow intro intro--1">{profile.role}</p>
          <h1 id="hero-title" className="hero__title" aria-label={profile.name}>
            <RevealName text={profile.name} />
          </h1>
          <p className="hero__tagline intro intro--2">
            I build technology that makes <em>people’s lives</em> better.
          </p>
          <p className="hero__lede intro intro--3">{profile.positioning}</p>

          <div className="hero__ctas intro intro--4">
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
          <ul className="focus__list" data-stagger>
            {focusAreas.map((f) => (
              <li key={f.area}>
                <a href={f.href} className="focus-card tilt">
                  <CountUp value={f.metric} className="focus-card__metric" />
                  <span className="focus-card__metric-label">{f.metricLabel}</span>
                  <span className="focus-card__area">{f.area}</span>
                  <span className="focus-card__detail">{f.detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
