import { useEffect, useRef, useState } from 'react';
import { bio, education, notes, profile, quickFacts, skills } from '../data/content';
import { ExperienceTimeline } from '../features/skill-lens/ExperienceTimeline';
import { LensPanel } from '../features/skill-lens/LensPanel';
import { ProjectGallery } from '../features/skill-lens/ProjectGallery';
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';
import { HandNote } from './HandNote';
import { Section } from './Section';
import { Compass, Pack, Pines, Summit, TrailMap, TrailSign } from './Sketches';
import { PressedFlower } from './Wildflowers';

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title="Models, data, and the code that ships them."
      sketch={<TrailSign lines={['FIRST', 'SWITCHBACK']} />}
    >
      <div className="about">
        <div className="about__bio reveal">
          {bio.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <aside className="about__side reveal">
          <figure className="portrait">
            <div className="portrait__photo">
              {profile.photo ? (
                <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={320} height={320} loading="lazy" />
              ) : (
                <span className="portrait__mono" aria-hidden="true">
                  NL
                </span>
              )}
            </div>
            <figcaption className="portrait__caption">Champaign-Urbana, IL</figcaption>
            <PressedFlower className="portrait__flower" />
          </figure>
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
      intro="Internships, research, and team leadership, with the stack behind each one. Use the skill lens to see where each tool shows up."
      sketch={<Pines />}
      note={notes.lens}
    >
      <div className="reveal">
        <LensPanel />
      </div>
      <ExperienceTimeline />
    </Section>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      title="Things I’ve made on the side."
      intro="Hackathon builds, class projects, and team apps. Open any project to see the problem, the architecture decisions, and the outcome. The skill lens above filters these too."
      sketch={<Compass />}
      note={notes.projects}
    >
      <div className="reveal">
        <ProjectGallery />
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" index="04" eyebrow="Skills" title="What I work with." intro="The tools I reach for to get there." sketch={<Pack />}>
      <div className="skills" data-stagger>
        {skills.map((g) => (
          <div key={g.group} className="skills__group">
            <h3 className="skills__title">{g.group}</h3>
            <ul className="gear-list">
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * Loads the PDF preview only when the Resume section is about to scroll into view, so the
 * browser's PDF viewer doesn't slow down the first paint of the page.
 */
function useNearViewport<T extends Element>(margin = '600px') {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (near || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: margin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near, margin]);
  return [ref, near] as const;
}

export function Resume() {
  const [frameRef, showPreview] = useNearViewport<HTMLDivElement>();
  return (
    <Section id="resume" index="05" eyebrow="Resume" title="The one-page version." sketch={<TrailMap />}>
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
        <div className="resume__frame" ref={frameRef}>
          {showPreview && (
            <object data={`${profile.resume}#view=FitH`} type="application/pdf" aria-label="Resume preview">
              <p className="resume__fallback">
                Your browser can’t preview PDFs here. <a href={profile.resume}>Open the resume</a> instead.
              </p>
            </object>
          )}
        </div>
      </div>
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
    <Section id="contact" index="06" eyebrow="Contact" title="Let’s build something that helps." sketch={<Summit />}>
      <div className="contact reveal">
        <p className="contact__lede">
          I’m looking for software engineering and ML internships, and I’m always happy to talk about reliable AI,
          learning tools, or anything that makes someone’s day a little easier.
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
        <HandNote arrow="up" className="contact__note">
          {notes.contact}
        </HandNote>
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
