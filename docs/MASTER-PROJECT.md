# LearnPath — Master Project Document

**Status:** V1 blueprint (canonical)  
**Date:** 2026-09-12  
**Product:** LearnPath — *Learn anything. Build everything.*

This document is the source of truth. Specialized docs (`ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, …) expand sections without contradicting this file.

---

## 1. Executive Summary

LearnPath is a free, open-source, **roadmap-first learning platform**. It does not host video. It structures learning around independently authored roadmaps, editorially curated free resources (primarily YouTube embeds plus official docs), in-browser practice, challenges, and projects — with progress that persists.

The product exists because the internet already has excellent free teachers and terrible structure. Learners bounce between playlists, abandon courses, and never build. LearnPath is the missing spine:

```
ROADMAP → SKILL → BEST FREE RESOURCES → WATCH → PRACTICE → CHALLENGE → BUILD → NEXT SKILL
```

## 2. Product Philosophy

**Is:** structure, curation, practice, projects, progress, community, open contribution.

**Is not:** YouTube, Coursera, Udemy, a paid LMS, a certificate mill, an AI course generator, a video host, or a cloud IDE.

Every feature must materially improve learning. Impressive-sounding features that do not serve the loop are rejected (including an AI tutor in V1).

## 3. Target Users

| Persona | Need |
|---|---|
| Career-switcher | A coherent path, not 40 tabs |
| Student | Free, high-signal resources + practice |
| Working developer | Targeted skill graphs (e.g. Agentic AI) |
| Contributor | Git-based content PRs |
| Admin / maintainer | Moderation, resource verification |

## 4–5. Competitive research & differentiation

See `docs/RESEARCH.md`. Differentiation:

1. Roadmap **and** practice **and** projects in one loop.
2. Original curriculum (not a roadmap.sh clone; their license forbids redistribution).
3. Official YouTube embeds with substantial independent value.
4. Browser sandboxes — no untrusted server execution.
5. Anonymous-first; accounts are for persistence and community, not a wall.
6. Editorial scores with defined criteria — never “the best” as an objective claim.

## 6. User Journeys

**New visitor:** Land → understand the loop (Foundation→Mastery) → search or pick a featured roadmap → browse without signup.

**Anonymous learner:** Open a skill → watch facade embed → take local notes → practice in-browser → complete a challenge (local progress).

**Authenticated learner:** Same, plus server progress, notes sync, My Learning.

**Returning learner:** Sign in → resume current skill → see path percentage.

**Contributor:** GitHub CONTRIBUTING → content schema → PR → CI validate → merge.

**Admin:** Sign in with allowlisted email → reports, resource status, moderation.

## 7. Information Architecture (sitemap)

```
/                       Home
/roadmaps               Catalog
/roadmaps/[slug]        Graph + overview
/skills/[slug]          Skill page
/learn/[roadmap]/[skill] Learning workspace
/courses                Curated courses
/resources              Resource library
/resources/[id]         Resource detail
/practice               Language picker
/practice/[lang]        Playground
/challenges             Challenge library
/challenges/[id]        Challenge workspace
/projects               Project library
/projects/[id]          Project brief + workspace
/me                     My Learning (auth or local)
/search                 Unified search
/community              Discord + contribution
/open-source            Repo, license, contributing
/sign-in                Auth
/profile                Profile + linked accounts
/admin                  Internal CMS / reports
/privacy                Privacy
/terms                  Terms
```

## 8. Feature Specification (V1)

- Home: hero, search, featured roadmaps, editor picks, loop explanation, community + OSS CTAs.
- Roadmaps: listing, detail, interactive graph, categories, difficulty, progress, prerequisites.
- Skills: overview, objectives, prerequisites, resource slots (best / alternative / quick / project / docs), practice, challenges, projects, progress.
- Courses/resources: metadata, editorial score, verified date, status, YouTube facade embeds.
- Learning workspace: three-pane desktop, tabbed mobile.
- Practice: Python, JavaScript, TypeScript, HTML/CSS/JS, SQL.
- Challenges: prompt, editor, run, tests, pass/fail, progress.
- Projects: requirements, starter, hints, skills, difficulty, progress.
- My Learning, search, auth (Google, GitHub, Discord + email), notes, reports.
- Community page (Discord is the community layer).
- Admin: reports, resource verification, role-gated.
- SEO, a11y, dark/light, empty/loading/error states.

## 9. UX Flows

Canonical happy path (acceptance test):

Discover → AI Engineer → understand graph → open Python skill → recommended course → watch embed → notes → practice Python → challenge → project → track progress → create account → progress kept → join Discord.

If any step is confusing, the UX is not done.

## 10. Design System

See `docs/DESIGN-SYSTEM.md`. Summary:

- Display: Instrument Serif. UI: Geist. Code: Geist Mono.
- Dark charcoal + teal path + amber progress. Light: warm paper.
- Semantic tokens only. Motion: fast 150ms / normal 250ms / slow 400ms; honor `prefers-reduced-motion`.
- 3D: SVG constellation + CSS perspective on home and roadmap graphs. **Not** on cards, lists, or forms.

## 11. 3D Strategy

**Used:** homepage learning-path visualization; subtle depth on roadmap graphs; small motion on empty/loading.

**Not used:** resource cards, buttons, modals, editor chrome, marketing particle storms, Three.js on first paint.

## 12. Technical Architecture

```
Browser
  ├─ Next.js App Router (RSC + client islands)
  ├─ Monaco (lazy)
  ├─ Pyodide worker (lazy, practice/python only)
  ├─ sql.js worker (lazy, SQL only)
  ├─ JS/TS/HTML sandboxed iframes
  └─ YouTube iframe (after click)
        │
Next.js (Vercel, Node runtime)
  ├─ Better Auth
  ├─ Drizzle → libSQL (Turso prod / file local)
  ├─ Content loader (Git JSON, Zod)
  └─ Route handlers (progress, notes, search, reports, admin)
        │
External
  ├─ Google / GitHub / Discord OAuth
  ├─ YouTube (embed only)
  └─ Discord (community, not a bot)
```

No microservices, Redis, queues, vector DBs, or AI agents.

## 13. Technology Decisions

Recorded in `docs/RESEARCH.md` §11.

## 14. Authentication Architecture

Better Auth + Drizzle (sqlite) + `nextCookies()` last.

Providers: Google, GitHub, Discord (enabled when env present). Email/password always available for local/dev.

Anonymous plugin + localStorage progress merge on first authenticated session.

Sessions: database-backed, HTTP-only cookies.

Admin: `ADMIN_EMAILS` env → `user.role = admin`. Authorization on the server.

## 15–16. Database & Content

See `docs/DATABASE.md` and `docs/CONTENT-SYSTEM.md`.

Rule: **curriculum in Git, user state in DB.**

## 17. YouTube Architecture

Facade → `youtube-nocookie.com/embed/{id}` with `referrerpolicy="strict-origin-when-cross-origin"`. Global `Referrer-Policy` header same. No overlays, no autoplay, no custom player, no Data API in V1. Unavailable videos: message + alternative.

## 18. Practice Architecture

See `docs/PRACTICE-ENGINE.md`. All execution in the browser. Never on Vercel functions.

## 19. Challenge Architecture

Content-defined tests. Runner reuses practice sandboxes. Results stay client-side until pass, then progress API records completion. Failures never execute extra network.

## 20. Project Architecture

Git-defined briefs (requirements, starter files, hints). Learner builds in the matching playground or locally. V1 tracks `started` / `completed`, not automated grading of full apps.

## 21. Progress Architecture

Entities: `roadmap | skill | resource | challenge | project`. Status: `started | completed`. Percent = completed required skills / required skills. Anonymous: `learnpath.progress.v1` in localStorage. Auth: `progress` table. Merge: union of completed, server wins on conflict of timestamps.

## 22. Discord Community Architecture

Discord is the community layer, not an in-app forum and not (V1) a bot.

Suggested server channels (documented for operators, not created by this repo):

- Announcements, General, Introductions
- Python, Web Development, AI / ML, Cybersecurity
- Projects, Code Review, Showcase
- Open Source, Contributors, Roadmap Proposals, Feedback

App: `/community` with invite CTA (`NEXT_PUBLIC_DISCORD_INVITE`).

## 23. Search Architecture

Build-time in-memory MiniSearch over roadmaps, skills, resources, projects, challenges. Server route `/api/search?q=` plus client page. Good enough for V1 corpus size. No extra search SaaS.

## 24. Admin Architecture

`/admin` behind server role check. Resource status, reports queue, verification dates. Canonical content still edited via Git.

## 25. Security Threat Model

See `docs/SECURITY.md`.

## 26. Accessibility Strategy

WCAG 2.2 AA-conscious: semantic HTML, keyboard graph navigation, visible focus, labels, dialogs, contrast, 44px touch targets, `prefers-reduced-motion`, skip link, editor keyboard help.

## 27. Performance Strategy

- RSC for content pages; client islands for editor/graph/player.
- Dynamic `import()` for Monaco, Pyodide, sql.js, Sucrase.
- YouTube facade (no iframe on load).
- `serverExternalPackages` for libsql.
- Fonts via `next/font`.
- No Three.js on home.

## 28. SEO Strategy

Per-page metadata, canonical, OG (`/og.png`), sitemap, robots, JSON-LD `Course`/`LearningResource` where it fits. Crawlable HTML for roadmaps/skills (not canvas-only).

## 29. Analytics / Privacy

**None in V1.** No trackers. Privacy page explains YouTube’s own collection after click-to-play.

## 30. Testing Strategy

- Unit: Zod content, progress math, search index, score labels.
- Integration: progress API authz.
- E2E (Playwright, optional in CI): homepage → roadmap → skill.
- A11y: eslint-jsx-a11y + manual keyboard pass.
- Security: unauthenticated admin, XSS in notes.

## 31. Deployment Architecture

GitHub → GitHub Actions (typecheck, lint, unit, content validate, build) → Vercel. Turso remote DB. OAuth callback URLs on the production origin.

See `docs/DEPLOYMENT.md`.

## 32. Environment Variables

See `.env.example`. Never commit secrets.

## 33. Folder Structure

```
content/                 Git-canonical curriculum
docs/                    Architecture
public/                  Brand, OG, favicon
src/app/                 App Router
src/components/          UI
src/db/                  Drizzle schema + client
src/lib/                 Auth, content, search, utils
scripts/                 content:validate, db:push
tests/                   Vitest
```

## 34–36. Schema, API, Content schemas

See specialized docs. APIs: `/api/auth/*`, `/api/progress`, `/api/notes`, `/api/search`, `/api/reports`, `/api/admin/*`. All mutations validated with Zod on the server.

## 37. V1 Scope

The six roadmaps:

1. AI Engineer
2. Generative AI Engineer
3. Agentic AI Engineer
4. Python Developer
5. Full Stack Developer
6. Junior Cybersecurity Professional (ethical hacking fundamentals)

Quality over quantity. Real free resources only.

## 38. Out of Scope (V1)

AI tutor, certificates, payments, video hosting, WebContainers, Piston, Discord bot, social feed, mobile native apps, i18n beyond `lang=en`, Made-for-Kids specialized COPPA flows beyond click-to-load, multi-tenant orgs.

## 39. Phase-by-phase plan

See `docs/IMPLEMENTATION-PLAN.md`.

## 40. Verification Checklist

A real learner can complete the §9 loop on desktop and mobile, with persistence after signup, without console errors, without placeholder copy, without secrets in git, with CI green.

---

*End of master document.*
