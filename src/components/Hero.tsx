import { highlights, profile } from '../data/content';
import { GitHubIcon, LinkedInIcon } from './Icons';

/** Nodes of "my graph": the threads that run through my work, joined at the center. */
const nodes = [
  { label: 'Full-stack', x: 200, y: 52 },
  { label: 'Applied ML', x: 338, y: 132 },
  { label: 'LLM systems', x: 330, y: 292 },
  { label: 'Statistics', x: 196, y: 352 },
  { label: 'Teaching', x: 62, y: 282 },
  { label: 'Bharatanatyam', x: 72, y: 120 },
];
const crossEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 3],
  [4, 5],
  [0, 4],
];

function HeroGraph() {
  return (
    <svg className="hero-graph" viewBox="0 0 400 400" role="img" aria-labelledby="hero-graph-title">
      <title id="hero-graph-title">
        A small graph of what I do: full-stack engineering, applied ML, LLM systems, statistics, teaching, and
        Bharatanatyam, all connected to me.
      </title>
      <g className="hero-graph__edges">
        {crossEdges.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={nodes[a]!.x} y1={nodes[a]!.y} x2={nodes[b]!.x} y2={nodes[b]!.y} className="edge edge--soft" />
        ))}
        {nodes.map((n, i) => (
          <line key={n.label} x1={200} y1={200} x2={n.x} y2={n.y} className="edge" style={{ animationDelay: `${i * 0.6}s` }} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <g key={n.label} className="node" style={{ animationDelay: `${i * 0.4}s` }}>
          <circle cx={n.x} cy={n.y} r={7} />
          <text x={n.x} y={n.y + (n.y > 200 ? 26 : -16)} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}
      <g className="node node--center">
        <circle cx={200} cy={200} r={34} />
        <text x={200} y={207} textAnchor="middle">
          Nits
        </text>
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero container" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">
          {profile.role} · Class of 2028
        </p>
        <h1 id="hero-title" className="hero__title">
          {profile.name}
          <span className="hero__nick"> (Nits)</span>
        </h1>
        <p className="hero__tagline">{profile.tagline}</p>
        <p className="hero__lede">{profile.positioning}</p>

        <div className="hero__ctas">
          <a href="#projects" className="btn btn--primary">
            View projects
          </a>
          <a href="#resume" className="btn btn--ghost">
            Resume
          </a>
          <a href="#contact" className="btn btn--ghost">
            Contact
          </a>
          <span className="hero__socials">
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

        <p className="hero__now">
          <span className="pulse" aria-hidden="true" />
          <span>
            <strong>Currently</strong> {profile.currently}
          </span>
        </p>
      </div>

      <div className="hero__art">
        <HeroGraph />
      </div>

      <ul className="highlights" aria-label="Highlights">
        {highlights.map((h) => (
          <li key={h.label}>
            <span className="highlights__value">{h.value}</span>
            <span className="highlights__label">{h.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
