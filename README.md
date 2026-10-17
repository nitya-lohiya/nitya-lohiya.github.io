# Nitya Lohiya — Personal Portfolio

**Live site:** https://nitya-lohiya.github.io
**Stack:** React 19 · TypeScript · Vite · plain CSS (design tokens) · Vitest + Testing Library · GitHub Actions · GitHub Pages

A single-page portfolio covering my experience, projects, skills, and resume. It supports light and dark themes, works on phones and with a keyboard, and respects reduced-motion settings.

## The interactive feature: the skill lens

The whole site treats my work like a small knowledge graph (a nod to the curriculum graph I built at ITQAN). Skills are nodes, and every role and project connects to the skills it used.

- **Hero graph:** each node around my name is a skill and can be clicked. Clicking one switches on a site-wide lens, and the caption reports how many roles and projects use it.
- **Skill lens panel** (top of Experience): every skill as a chip, with a live count of how many pieces of work would stay lit if you added it. Picking several requires *all* of them (AND).
- **Experience timeline:** matching roles light up and the rest fade back, so the timeline stays in order.
- **Projects:** the gallery filters to matching projects. **Empty state:** if no side project uses the selection, it says so, links to the roles where I *did* use it, and offers closest matches with one-click fixes.
- **Floating pill:** while a lens is active, a pill at the bottom shows it from anywhere on the page, with a one-click clear.
- One shared selection drives all of it (`LensContext`). Chips and graph nodes are real `<button>`s with `aria-pressed`, and result counts are announced in a polite live region.

The filtering logic is pure TypeScript in [`src/features/skill-lens/explorer.ts`](src/features/skill-lens/explorer.ts). The components live next to it.

## Setup

Requires Node 22+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run lint` | ESLint, including `jsx-a11y` accessibility rules |
| `npm run typecheck` | TypeScript in strict mode |
| `npm test` | Run the full Vitest suite once |
| `npm run test:watch` | Tests in watch mode |
| `npm run build` | Type-check and build to `dist/` |
| `npm run check` | Everything CI runs, in order |

## Tests

```bash
npm test
```

| File | Covers |
| --- | --- |
| `explorer.test.ts` | Filtering logic: no selection, single skill, AND across skills, an unknown skill, no matches, input not mutated, live counts, closest-match ranking and limits |
| `SkillLens.test.tsx` | The real components with user events: lighting up roles and filtering projects, combined skills and updated counts, the **empty state** pointing to work experience, a combination nothing uses, jumping to a closest match, every reset path, the hero graph and panel sharing one selection, keyboard use |
| `content.test.ts` | Data integrity: unique ids, skills exist in the taxonomy, every skill connects to some work, every role has an audience, detail, and a tech stack, no role repeated as a project, audience cards point at real anchors, https links, no `[ADD: …]` placeholders or old nickname visible |
| `App.test.tsx` | One `h1`, a section per nav link, the theme toggle (and that it is remembered), the mobile menu, the hero graph lighting up experience and the floating pill clearing it, the resume download |
| `trail.test.ts` | Trail geometry: one ridge point per stop plus saddles, higher elevation drawn higher, scroll position → stop and fraction, hiker position on the ridge, elevation readout, edge cases (no sections, past the summit, bad index) |
| `Trail.test.tsx` | The navigator: a working flag link for every section, starts at the 740 ft trailhead, marks the current and passed stops; the "try me" hint shows once and stays hidden after first use |
| `Intro.test.tsx` | The intro: climb progress → stop, plays on a first visit and previews every stop, skips with the button or Escape, finishes on its own, never replays in a session, never plays with reduced motion |
| `countUp.test.ts` | Count-up formatting: whole numbers, before→after changes, decimals, clamping |

## CI/CD

One workflow, [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

1. **On every pull request**, the `verify` job runs lint → typecheck → tests → build.
2. **Merge gate:** `main` is branch-protected. Pull requests are required, and the `verify` check must pass before merging.
3. **On every push to `main`** (that is, after a merge), `verify` runs again on the merged code.
4. **Deploy:** only if that passes, the `deploy` job publishes `dist/` to GitHub Pages. The live site always reflects the latest `main` commit that passed.

### Deploying your own copy

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Settings → Branches:** add a protection rule for `main` that requires the `verify` status check.
4. Merge to `main`, and the site deploys automatically.

If the repo is not named `<username>.github.io`, set `base: '/<repo-name>/'` in `vite.config.ts`.

## Editing content

All copy lives in **[`src/data/content.ts`](src/data/content.ts)**: profile, bio, experience, projects, skills, and the "What I build" cards. Components only render it.

- **Add a role or project:** append to `experience` or `projects`. Use skill ids from `skillTaxonomy` in `skills` (the tests will fail otherwise), and fill in `audience`, the "Built for" line. Every project needs a `caseStudy` (its "How I built it" panel); `featured: true` makes the card full width.
- **Resume:** replace `public/Nitya_Lohiya_Resume.pdf` (keep the name, or update `profile.resume`).
- **Photo:** put an image in `public/` and set `profile.photo` to its path, e.g. `'/nitya.jpg'`.
- **LinkedIn:** set `profile.linkedin`. Empty fields are hidden on the site.
- **Theme colors:** change the tokens at the top of [`src/styles/global.css`](src/styles/global.css), for both light and dark.

## Design: the trail

The site is a hike from trailhead to summit. Each section is a stop on the trail with its own (made-up, rising) elevation, starting at Champaign's real 740 ft. The look is a field journal: paper, forest green, charcoal ink, fine rules, and a few hand-drawn sketches.

| Piece | Where | How to tune or turn off |
| --- | --- | --- |
| **Trailhead intro:** a 2–3 s opener that types the coordinates, draws the ridge, climbs it flag by flag (a preview of every section) while the elevation counts up, then lifts away like a map. Once per session; skip with the button, Escape, or a click; never shown with reduced motion | `Intro.tsx`, `.intro-screen*` | timings in `INTRO_TIMING` in `Intro.tsx`; delete `<Intro />` in `App.tsx` to turn it off |
| **Trail navigator:** the nav is a mountain ridge with a flag per section. A hiker walks it as you scroll, the walked trail darkens, the elevation readout updates, and every flag is a link | `Ridge.tsx`, `Nav.tsx`, `useTrailProgress.ts`, `lib/trail.ts` (pure geometry, unit-tested) | stops and elevations live in `trail` in `content.ts` |
| **Skill lens as trail blazes:** pick a skill and matching work gets a painted blaze; the rest fades | `features/skill-lens/*`, `.blaze` in `global.css` | `.timeline__item.is-dim` opacity |
| "Try me" hint that disappears after first use (remembered per browser) | `HandNote`, `touched` in `LensContext.tsx` | edit `notes.hero` in `content.ts` |
| Handwritten margin notes | `HandNote.tsx`, `notes` in `content.ts` | edit or delete any note in `content.ts` |
| Hand-drawn sketches (pines, compass, pack, map, summit, trail sign) with a slight ink wobble | `Sketches.tsx` (`#rough` filter) | remove a `sketch` prop on a `<Section>` |
| Taped-in featured projects, polaroid portrait | `.tape`, `.portrait` | delete the `.tape` span in `ProjectCard.tsx` |
| Topographic contour lines behind the hero | `public/topo.svg` (generated once), `.hero__art::before` | `--topo-opacity` (0 = off) |
| Paper grain over the page | `body::after` | `--grain-opacity` (0 = off) |
| Kanjeevaram temple-border divider, drawn as a ridge of peaks | `TempleBorder.tsx` | the SVG path in the `.temple-border__band` mask |
| Gentle fades on scroll, cascading lists, count-up metrics | `useReveal.ts`, `[data-stagger]`, `CountUp.tsx` | `--motion-stagger`, `--motion-intro` |

**Colors** are tokens at the top of `src/styles/global.css` (paper `#F3F0E8`, sand `#EBE6DA`, charcoal `#1E2320`, lichen grey `#4F5650`, deep forest `#2E4A3B`, with a "night on the trail" dark set). **Fonts:** Newsreader (headings), IBM Plex Sans (body), IBM Plex Mono (labels), Reenie Beanie (handwritten notes). All are self-hosted.

All motion stops under `prefers-reduced-motion`. The PDF preview loads only when you scroll near the Resume section.

**Lighthouse** (production build, mobile simulation): Performance 93–94, Accessibility 100, Best Practices 100, SEO 100. Total blocking time ≤ 20 ms, layout shift 0.

## Accessibility & performance notes

- Semantic landmarks, a skip link, one `h1`, labelled sections, and visible focus rings.
- Light and dark palettes each designed separately. The saved or OS theme is applied before first paint, so there is no flash of the wrong theme.
- `prefers-reduced-motion` turns off scroll reveals, the hero graph animation, and smooth scrolling.
- Fonts are self-hosted (`@fontsource`), with no third-party requests, analytics, or cookies.


## AI use and limitations

I built this site with help from **Claude Code (Anthropic)**. It:

- scaffolded the project and wrote most of the component, CSS, test, and GitHub Actions code,
- drafted the copy from my resume, my notes, and the code in my public GitHub repos (for example the IDX query timings, the classifier's training settings, and the OSLI architecture),
- built the motion layer, and found and fixed bugs along the way (a CSS minifier dropping the nav blur, and the skill lens hiding roles after a reset),
- checked layouts with automated Chrome screenshots at desktop and phone widths, and ran Lighthouse.

I decided what the site should say and how it should feel, reviewed every change through a pull request, and asked for revisions when the wording or design wasn't right.

Limitations to be aware of:

- Copy was AI-drafted and then reviewed by me. Numbers come from my resume or my repos. Where the two disagree (the email classifier's README reports 99.7% test accuracy, my resume 96%), the site uses the resume figure.
- The AI Travel Planner and Food Recommendation write-ups have no public repo behind them yet, so their "decisions" are more general than the others.
- Unit tests run in jsdom, so they check behavior and accessibility semantics, not pixels. Visual checks were automated screenshots plus my own review in the browser, not a visual-regression suite.
- The View Transitions theme sweep and the unfolding "How I built it" panels need a recent Chromium-based browser. Other browsers get a plain cross-fade and an instant open.
- The resume preview uses the browser's built-in PDF viewer. Some mobile browsers show a fallback link instead.
