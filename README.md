# Nitya Lohiya — Personal Portfolio

**Live site:** https://nitya-lohiya.github.io
**Stack:** React 19 · TypeScript · Vite · plain CSS (design tokens) · Vitest + Testing Library · GitHub Actions · GitHub Pages

A single-page portfolio covering my experience, projects, skills, resume, and a bit of who I am outside of code. It supports light and dark themes, works on phones and with a keyboard, and respects reduced-motion settings.

## The interactive feature: project explorer

The Projects section treats my work like a small knowledge graph (a nod to the curriculum graph I built at ITQAN). Skills are nodes and projects connect to them.

- **Select skills** to keep only the projects connected to *all* of them (AND, not OR).
- **Every skill chip shows a live count** of how many projects you would see if you added it. Chips that would empty the results are dashed.
- **Empty state:** if a combination matches nothing, the explorer says so, lists the closest projects with the skills they share, and offers one-click buttons to switch to a combination that works.
- **Reset / Clear filters** returns to the full gallery.
- Chips are real `<button>`s with `aria-pressed`, and the result count is announced through a polite live region.

The filtering logic is pure TypeScript in [`src/features/project-explorer/explorer.ts`](src/features/project-explorer/explorer.ts), separate from the UI in [`ProjectExplorer.tsx`](src/features/project-explorer/ProjectExplorer.tsx).

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
| `ProjectExplorer.test.tsx` | The real UI with user events: filtering, combined filters and updated counts, **empty state** with closest matches, jumping from a closest match to a working filter, reset/clear, toggling off, keyboard use, rendering the real site data |
| `content.test.ts` | Data integrity: unique ids, every project skill exists in the taxonomy, every taxonomy skill has a project, https links, no `[ADD: …]` placeholder visible on the site, featured work first |
| `App.test.tsx` | One `h1`, a section for every nav link, the theme toggle (and that it is remembered), the mobile menu (`aria-expanded`, Escape closes it), the resume download |

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

All copy lives in **[`src/data/content.ts`](src/data/content.ts)**: profile, bio, experience, projects, skills, and the "beyond the resume" cards. Components only render it.

- **Add a project:** append an object to `projects`. Use skill ids from `skillTaxonomy` in its `skills` array (the tests will fail otherwise). Add `featured: true` and a `caseStudy` to give it a full-width card with a "How I built it" panel.
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
