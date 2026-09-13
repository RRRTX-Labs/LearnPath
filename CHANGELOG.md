## [Unreleased] — V2 Wave 1

### Added
- **The LearnPath Journal** (`/blog`, `/blog/[slug]`): TS-canonical blog system with Zod
  schema, SSG pages, Article JSON-LD, prev/next, related skills/roadmaps, sitemap +
  search integration, and four researched pilot essays (AI coding agents, security for
  AI apps, TypeScript vs Python 2026, learning with AI) with original brand cover art
  (`scripts/render-blog-covers.py`). Authoring guide: `docs/BLOG-AUTHORING.md`.
- **Proof of skill foundation** (`src/lib/proof.ts`): honest evidence model
  (learned / practiced / challenge passed / applied → SKILL DEMONSTRATED, states
  NOT STARTED → LEARNING → PROVEN → APPLIED). New `practice` progress entity recorded
  on successful sandbox runs. Surfaces on the learning page (loop strip + evidence
  panel) and the dashboard (Evidence section).
- **Dashboard upgrade** (`/me`): dominant Continue card (roadmap · stage · skill · %),
  Today plan (next lessons + practice + challenge), roadmap progress, evidence summary,
  recent notes, recent activity.
- **Learning loop on skill pages**: stage context line, prerequisites warning,
  LEARN → PRACTICE → CHALLENGE → PROVE strip with live states, challenge links with
  pass status, project application links, "completing this unlocks…".
- **RRRTX Labs presence**: `/about` page (product, open-source and learning philosophy,
  studio), footer brand moment (LEARNPATH wordmark, "Built by RRRTX Labs"), journal +
  about links in header/footer, homepage journal teaser.
- **Resource quality system**: transparent editorial `review` dimensions
  (clarity/hands-on/freshness/projects/beginner, 1–5) with star badges on resource
  pages; numeric `editorScore` retained for sorting only, removed from display.
- **Homepage picks rail**: accessible horizontal scroll-snap carousel with real
  prev/next buttons; hero now states the loop (choose → learn → practice → prove → build).
- Docs: `docs/AUTH-SETUP.md`, `docs/DISCORD-SETUP.md` (server guide + OAuth vs server
  vs bot), `docs/V2-AUDIT-AND-PLAN.md`.

### Changed
- Search now indexes journal posts (`blog` result type); sitemap includes `/blog/*`.
- SectionHeader accepts an optional `sub` description line.

### Fixed
- (none this wave; v1 fixes remain in 1.0.0 entries)

# Changelog

## 1.0.0 — 2026-09-13

V1 product upgrade: audited, repaired, integrated, redesigned.

### Repaired (verified defects)

- **CI order:** `typecheck` ran before the build that generates Next's route types, failing every
  clean clone. Workflow now typechecks after build; `layout.tsx` no longer depends on generated
  globals either.
- **Progress sync:** re-marking an existing entity uploaded the wrong record (array tail instead of
  the changed record). `mark()` now sends exactly the record that changed.
- **YouTube fallback:** DOM `onerror` on a cross-origin iframe never fires; the documented
  "unavailable" state was unreachable. Now detected via the official IFrame Player API `onError`,
  with alternatives + report so the path continues.
- **Notes corruption:** server-side `replace(/<script/gi, …)` rewrote learners' text for zero
  security benefit. Removed; sanitization returns only if Markdown rendering lands.
- **Editor honesty:** `@monaco-editor/react` was installed but unused behind a textarea named
  `MonacoField`. Monaco now ships as a lazy client chunk with a functional textarea fallback.
- **Placeholder CTAs:** GitHub/Discord links defaulted to `github.com` / `discord.com` home pages.
  Defaults now point at the real repository; the Discord CTA renders only when an invite exists.
- **Raw ids in UI:** skill prerequisites rendered as slugs; they are now linked skill titles.
- **Error page** no longer leaks `error.message` to visitors.

### Content

- Integrated the embed-verified research dataset: **+167 resources** (218 total), 0 schema errors,
  every YouTube item `embed_status: verified`; 5 exact-duplicate videos skipped with reasons.
- Added 10 skills the dataset proves out (programming fundamentals, DSA, Python web APIs,
  containers & orchestration, CI/CD & cloud, system design, Next.js, MCP, agent frameworks,
  security fundamentals) and wired 36 existing skills with alternative/quick/project/docs slots.
- Roadmaps are now **staged journeys** (4–5 stages each) with real branch edges; schema gained
  `stages[]`, resources gained `publishedAt`, `warnings[]`, `learningOutcomes[]`,
  `playlistVideoCount`.
- Practice top-ups: JavaScript, TypeScript, HTML and SQL exercises plus four new challenges, so the
  Full Stack path has a real proof-of-work loop.
- Import pipeline: `scripts/import-resources.mjs` + `tests/import.test.ts` gate (verified embeds,
  no rejected videos, one `best-overall` per skill).

### Design & UI

- Design system v2: token contract, three-step elevation, restrained glass, motion scale with a
  reduced-motion contract, 2px hover lift, cursor spotlight, focus and touch-target standards.
- New brand: vector mark (path + destination), generated favicon/apple-touch/OG rasters (~150KB
  total, was 4.5MB of duplicates), boilerplate starter assets deleted.
- Homepage rebuilt to the product rhythm: hero + live loop constellation, continue-learning strip,
  roadmap cards with real progress, how-it-works, editor's picks with real thumbnails, field
  categories with real counts, practice preview, projects, open source, community.
- Roadmap graph: stage bands, curved dependency edges, done/active/locked/open states with icons,
  keyboard-usable nodes, legend; detail pages group skills by stage.
- Resource cards: thumbnail, provider, duration, level, score, badge, CTA, hover.
- Resource pages: why-recommended, outcomes, warnings, facts, alternatives, JSON-LD.
- Learning workspace: ARIA tabs, mobile path rail, sticky roadmap list, coherent three-pane desktop.
- Library: filterable by topic/type/level with live counts; search is instant and grouped.

### Platform

- SEO: canonicals, JSON-LD, stable sitemap dates, `/search` noindex.
- Docs truth pass: content location, editor, lazy loading, postMessage reality, community framing.

## 0.1.0 — 2026-09-12

Initial V1: six independently authored roadmaps; skill pages, YouTube facade embeds, notes,
progress; practice (Python, JavaScript, TypeScript, HTML/CSS, SQL); challenges and projects;
Better Auth (email + OAuth when configured); admin report queue; search, SEO, dark/light theme.
