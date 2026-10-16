import { useState } from 'react';
import { beyond, bio, education, experience, profile, projects, quickFacts, skillTaxonomy, skills } from '../data/content';
import { ProjectExplorer } from '../features/project-explorer/ProjectExplorer';
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';
import { Section } from './Section';

export function About() {
  return (
    <Section id="about" index="01" eyebrow="About" title="Builder first, curious always.">
      <div className="about">
        <div className="about__bio reveal">
          {bio.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <aside className="about__side reveal">
          <div className="portrait">
            {profile.photo ? (
              <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={320} height={320} loading="lazy" />
            ) : (
              <span className="portrait__mono" aria-hidden="true">
                NL
              </span>
            )}
          </div>
          <dl className="facts">
            {quickFacts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className="education reveal">
        <div>
          <p className="education__school">{education.school}</p>
          <p className="education__degree">
            {education.degree}
          </p>
          <ul className="tag-list" aria-label="Honors">
            {education.honors.map((h) => (
              <li key={h} className="tag tag--accent">
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="education__label">Relevant coursework</p>
          <ul className="education__courses">
            {education.coursework.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title="Where I’ve been building."
      intro="Internships, research, and the teams I’ve worked on and led."
    >
      <ol className="timeline">
        {experience.map((e) => (
          <li key={e.id} className="timeline__item reveal">
            <div className="timeline__when">
              <span>{e.dates}</span>
              <span className="timeline__where">{e.location}</span>
            </div>
            <article className="timeline__card" aria-labelledby={`exp-${e.id}`}>
              <h3 id={`exp-${e.id}`} className="timeline__role">
                {e.role}
                {e.current && <span className="badge badge--live">Now</span>}
              </h3>
              <p className="timeline__org">
                {e.link ? (
                  <a href={e.link} target="_blank" rel="noreferrer" className="text-link">
                    {e.org}
                    <ArrowIcon />
                  </a>
                ) : (
                  e.org
                )}
                {e.orgNote && <span className="timeline__note"> · {e.orgNote}</span>}
              </p>
              <ul className="timeline__points">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <ul className="tag-list" aria-label="Technologies">
                {e.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      title="Things I’ve made."
      intro="My strongest work is up top. Open a featured project to see the problem, the decisions, and the outcome."
    >
      <div className="reveal">
        <ProjectExplorer projects={projects} taxonomy={skillTaxonomy} />
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" index="04" eyebrow="Skills" title="What I work with.">
      <div className="skills">
        {skills.map((g) => (
          <div key={g.group} className="skills__group reveal">
            <h3 className="skills__title">{g.group}</h3>
            <ul className="tag-list">
              {g.items.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Resume() {
  return (
    <Section id="resume" index="05" eyebrow="Resume" title="The one-page version.">
      <div className="resume reveal">
        <div className="resume__actions">
          <p>Everything above, condensed for a quick read.</p>
          <a href={profile.resume} download className="btn btn--primary">
            <DownloadIcon /> Download PDF
          </a>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn--ghost">
            Open in new tab <ArrowIcon />
          </a>
        </div>
        <div className="resume__frame">
          <object data={`${profile.resume}#view=FitH`} type="application/pdf" aria-label="Resume preview">
            <p className="resume__fallback">
              Your browser can’t preview PDFs here. <a href={profile.resume}>Open the resume</a> instead.
            </p>
          </object>
        </div>
      </div>
    </Section>
  );
}

export function Beyond() {
  return (
    <Section id="beyond" index="06" eyebrow="Beyond the resume" title="The person behind the commits.">
      <ul className="beyond">
        {beyond.map((b) => (
          <li key={b.id} className={`beyond__card beyond__card--${b.id} reveal`}>
            <span className="beyond__glyph" aria-hidden="true" />
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Section id="contact" index="07" eyebrow="Contact" title="Let’s build something.">
      <div className="contact reveal">
        <p className="contact__lede">
          I’m looking for software engineering and ML internships, and I’m always happy to talk about reliable AI,
          learning tools, or a project you’re excited about.
        </p>
        <div className="contact__row">
          <a href={`mailto:${profile.email}`} className="btn btn--primary btn--lg">
            <MailIcon /> {profile.email}
          </a>
          <button type="button" className="btn btn--ghost" onClick={copy}>
            {copied ? 'Copied!' : 'Copy email'}
          </button>
          <span className="sr-only" role="status">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>
        <div className="contact__socials">
          <a href={profile.github} target="_blank" rel="noreferrer" className="text-link">
            <GitHubIcon /> GitHub
          </a>
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-link">
              <LinkedInIcon /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
