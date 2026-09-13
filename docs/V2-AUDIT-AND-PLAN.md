# LearnPath V2 — Audit & Implementation Plan (Wave 1)

_Prepared by the RRRTX Labs product team. Date: 2026-09-13. Branch: `v2-wave1`. Live site: https://learn-path-theta.vercel.app (verified: all v1 routes 200; `/blog`, `/about` 404 — Wave 1 targets)._

## 1. Current product assessment

**A. Already excellent (do not touch):**
- Git-canonical TS content pipeline with Zod validation (`content:validate` gate, 218 resources / 58 skills / 6 staged roadmaps / 18 exercises / 15 challenges / 6 projects).
- In-browser practice engine (Pyodide, sql.js, TS transpile, sandboxed iframe HTML) — untrusted code never runs server-side. Rare among free learning sites.
- Click-to-load YouTube facades (youtube-nocookie, Referrer-Policy, Player API error handling) — legally clean, fast first paint.
- Better Auth (Google/GitHub/Discord/email + anonymous), Turso/libSQL + Drizzle, progress + notes with server sync and localStorage fallback with sign-in migration.
- Progress data model is already proof-ready: `entityType ∈ {roadmap, skill, resource, challenge, project}`, sticky completion (`applyProgress`), unique per-user index.
- Design identity: dark editorial, Instrument Serif display, teal/amber restraint, custom brand mark. SEO: JSON-LD (WebSite, VideoObject), sitemap, canonical.
- CI gates + import gate (`tests/import.test.ts`) + env-hardened builds (`src/lib/env.ts` rule: never `??` on `process.env`).

**B. Weak:** No blog/journal; no company presence (RRRTX Labs invisible); dashboard answers "what next" weakly; skill page has objectives but the LEARN→PRACTICE→CHALLENGE loop isn't visually enforced; `editorScore` (0–100) pretends to precision it doesn't have; homepage resource row is static; challenge pass and project completion are tracked but never *shown as evidence*.

**C. Broken:** Nothing functional found in live smoke (13 routes 200, correct 404s). Known gaps: `/blog`, `/about` don't exist.

**D. Friction:** After finishing a skill the "proof" is invisible; a learner can't answer "what can I actually do now?" Resources lack "why we picked this" surface (data exists in `editorNote`, underexposed in UI).

**E. Generic:** Footer ends without a brand moment; no studio identity; no editorial voice (blog).

**F. Do not change:** stack, auth, DB, practice runtimes, content pipeline architecture, embed policy, brand palette/typography, gate suite.

**G. Tech debt:** `editorScore` numeric opacity; `me/ui.tsx` lists without hierarchy; roadmap graph lacks "why this comes next"; no blog content type in search index/sitemap.

**H. Scales poorly:** none critical; SSG keeps 219+ pages cheap. Blog must follow the same TS-canonical pattern (no headless CMS).

**I. Strongest differentiator:** the *closed loop* — curated free resources + browser practice + passing challenges + projects, all in one Git-versioned curriculum, with real progress evidence. Nobody free does all five well.

**J. Should become:** the bookmarked-weekly home of self-directed developer learning: CHOOSE A PATH → LEARN → PRACTICE → PROVE → BUILD → GROW, voiced by a real studio (RRRTX Labs) with an editorial journal.

## 2. Roadmap assessment

Per-roadmap audit (python-developer, full-stack, ai-engineer, genai, agentic, security): staging is logical, prereq edges valid, hours believable (110–200h), resources verified-embeds-first. Gaps: learning objectives exist per skill but outcomes→evidence mapping isn't surfaced; some stages lack a capstone-style project association; "why this comes next" (reverse prereq lookup) not shown. Wave 1 adds the evidence surface; Wave 2 rebalances content per stage.

## 3. Resource research findings

`editorNote` + `lastVerified` + `labels` + `warnings` already exist. Upgrade: optional transparent `review` dimensions (clarity, handsOn, freshness, projects, beginner — 1..5 stars) rendered as badges + "Why we picked it" (editorNote) + Last reviewed. `editorScore` stays for sorting, never displayed as a "scientific" number. Wave 1 fills `review` for flagship/editor-picked resources; rollout continues in Wave 2. No invented data: dimensions reflect existing curation notes and verified status only.

## 4. Competitor research findings (patterns, not content)

- **roadmap.sh**: node graphs win on scanability, lose on "what do I do here" — we keep graph + add per-node outcome/proof.
- **Exercism / PortSwigger Academy**: proof = passed tests/labs. Our challenge-pass + project completion is the same idea; surface it as evidence.
- **The Odin Project / Full Stack Open**: linear reading + projects; retention comes from "build early". Our stage projects already do this — dashboard must show them.
- **freeCodeCamp**: certification = completion evidence. Our "SKILL DEMONSTRATED" panel is the honest, lighter version.
- **Microsoft Learn / GitHub Skills**: modules→badges; we avoid gamification, show capability states instead.
- **MDN / CS50**: authoritative single-source teaching; our resource curation mirrors that editorial stance ("why we picked it").

## 5. UX problems

(1) No answer to "what should I do today" in ≤5s on `/me`. (2) Skill completion ≠ visible capability. (3) Loop steps (learn/practice/challenge) presented as equal tabs instead of a sequence. (4) No editorial surface (journal) for return visits. (5) Homepage resources static row.

## 6. UI problems

Footer lacks brand moment; no studio attribution; resource cards underuse quality signals; dashboard hierarchy flat.

## 7. Engineering problems

None blocking. Keep gates green; blog must be SSG + typed + validated like all content. Env-empty-string class of bugs permanently fixed (`src/lib/env.ts`).

## 8. Content problems

No journal; RRRTX Labs absent; project progression copy thin. Wave 1 ships 4 researched pilot articles + about page; Wave 2 expands.

## 9. Proposed roadmap system (loop made explicit)

ROADMAP → STAGE → SKILL → OBJECTIVES → RESOURCE → PRACTICE → CHALLENGE → PROJECT → PROOF → NEXT. Data model already supports it; Wave 1 adds the PROOF derivation and UI, and "unlocks" (reverse prereqs) on skill pages.

## 10. Proposed learning loop / proof model

`skillProof(progress, skill)` → { learned: skill completed; practiced: any linked exercise/resource completed; challengePassed: any linked challenge completed; applied: any linked project completed } → **SKILL DEMONSTRATED** when learned && (challengePassed || applied). States: NOT STARTED → LEARNING → PROVEN → APPLIED (no XP/coins/streaks). Pure function + tests; renders on skill page + dashboard.

## 11. Proposed dashboard

Hierarchy: identity line → dominant **Continue** card (roadmap · stage · skill · % · button) → **Today** (next 2 lessons, 1 practice, 1 challenge) → roadmap progress bars → proof summary (skills demonstrated / challenges passed / projects shipped) → recent notes → recent activity. Primary action visually dominant; no analytics wall.

## 12. Proposed auth improvements

Implementation is correct (server-side OAuth code flow via Better Auth; providers hidden when unconfigured — no fake buttons). Deliverable: `docs/AUTH-SETUP.md` with exact env names, Google Cloud Console steps (OAuth client, Web application type, redirect `{BETTER_AUTH_URL}/api/auth/callback/google`; note: legacy Google Sign-In JS library deprecated — server-side flow is the current recommended pattern, FedCM applies to browser-side GIS only), GitHub OAuth App steps (`/api/auth/callback/github`), Discord steps (`/api/auth/callback/discord`, scope `identify`), local vs production callback URLs, common failures. No secrets in chat/docs.

## 13. Proposed blog architecture

TS-canonical like everything else: `src/lib/content/blog.ts` + Zod schema (id, slug, title, excerpt, category, author, publishedAt, readingMinutes, cover, relatedSkillIds, relatedRoadmapIds, body as structured sections). Routes `/blog` (index, category filter) + `/blog/[slug]` (SSG, Article JSON-LD, prev/next, related skills/roadmaps). Search index + sitemap include blog. Original PIL-rendered brand covers (dark editorial, subtle neon, topic-meaningful geometry — no robots/brains/stock). `docs/BLOG-AUTHORING.md` for contributors. Pilot articles (topics verified against current sources, Sep 2026):
1. *AI coding agents: what developers actually need to understand* — agent = model + harness; CLI/IDE/cloud form factors; context engineering (CLAUDE.md/AGENTS.md); async agents; orchestration shift.
2. *Security fundamentals for AI-powered applications* — OWASP LLM Top 10 2025 (prompt injection #1, excessive agency, output handling) + OWASP Agentic Top 10 (uncontrolled autonomy, delegated identity, cross-agent injection); defenses a junior can apply.
3. *TypeScript vs Python in 2026: reading the ecosystem honestly* — metrics disagree by design (Octoverse: TS #1 by GitHub activity 2025; SO Survey: JS 66%, TS 43.6%, Python top-TIOBE; RedMonk Jan 2026 tie) — how to choose.
4. *How to learn programming with AI without fooling yourself* — structured curriculum + typing/running/debugging yourself; AI as tutor not ghostwriter; ties directly into the LearnPath loop.

## 14. RRRTX Labs integration

`/about` page: LearnPath → why we built it → open-source philosophy → learning philosophy → RRRTX Labs (the studio). Footer: "Built by RRRTX Labs" + large restrained LEARNPATH wordmark moment (fine gradient, subtle glow, slight letter-spacing motion, reduced-motion safe) + legal line. No invented logos — existing brand mark + typographic treatment only.

## 15. Discord integration plan

`docs/DISCORD-SETUP.md`: (1) **OAuth login** (what LearnPath uses today — user identity via authorization code grant, scope `identify`), (2) **server** (community space — step-by-step creation guide: name, icon, categories START HERE / ROADMAPS / SHOWCASE / OPEN SOURCE / STAFF, channels, roles, onboarding, rules, moderation, security), (3) **bot** (automation — explicitly NOT built yet; architecture/permissions must be clear first). Exact redirect URIs for local + production. No secrets in chat.

## 16. Prioritized implementation roadmap

**Wave 1 (this branch — highest value, no breakage):**
1. Blog system + 4 researched articles + brand covers + search/sitemap integration
2. `/about` + RRRTX Labs footer identity + LEARNPATH wordmark brand moment
3. Proof-of-skill foundation (`skillProof` + skill page evidence panel + "unlocks")
4. Dashboard upgrade (Continue card dominant, Today plan, proof summary, activity)
5. Learn page loop upgrade (objectives/outcome first, LEARN→PRACTICE→CHALLENGE sequence states, sticky next)
6. Homepage: accessible resource carousel (scroll-snap, buttons, keyboard, reduced motion) + hero promise copy
7. Resource quality surface: `review` badges + "Why we picked it" + Last reviewed (flagship resources)
8. YouTube facade polish: reserved aspect ratio (zero layout jump), loading state, a11y labels
9. Docs: AUTH-SETUP.md, DISCORD-SETUP.md, BLOG-AUTHORING.md, CHANGELOG, header nav (Blog, About)
10. Gates: lint/typecheck/test/content:validate/build + local preview → **await approval before push**

**Wave 2 (after approval):** roadmap graph readability pass + mobile; full `review` rollout across catalog; skill-state model across catalogue pages; projects system upgrade (stretch goals, submission states); notes UX depth (saved-at indicator, offline states); performance pass (bundle, font, image audit); mobile + a11y dedicated audit; more journal articles.

**Never:** fake metrics, gamification currencies, content copying, embed-policy violations, stack swaps, pushing without approval.
