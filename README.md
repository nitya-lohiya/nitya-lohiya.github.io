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

## Accessibility & performance notes

- Semantic landmarks, a skip link, one `h1`, labelled sections, and visible focus rings.
- Light and dark palettes each designed separately. The saved or OS theme is applied before first paint, so there is no flash of the wrong theme.
- `prefers-reduced-motion` turns off scroll reveals, the hero graph animation, and smooth scrolling.
- Fonts are self-hosted (`@fontsource-variable`), with no third-party requests, analytics, or cookies.

## AI use and limitations

I built this site with substantial help from **Claude Code (Anthropic)**. It scaffolded the project, wrote much of the component, CSS, test, and workflow code, and drafted copy from my resume and notes. I chose the content, reviewed and edited the output, and checked the site in the browser.

Limitations to be aware of:

- Copy is drafted from my resume and notes. Every number on the site comes from them, but the AI-drafted wording was edited by me and could still contain mistakes.
- Case-study "decisions" summarize choices described in my project notes. They are not full design documents.
- Tests run in jsdom, so they check behavior and accessibility semantics, not pixel-level visuals. Layout was checked by hand on desktop and mobile widths.
- The resume preview uses the browser's built-in PDF viewer. Some mobile browsers show a fallback link instead.
