# V1 Upgrade Audit

**Date:** 2026-09-13
**Commit audited:** `098503d` ("Initial LearnPath V1", only commit)
**Method:** full read of every source file, doc, test, script and asset in the repository;
execution of `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run content:validate`,
`npm run build`; simulation of the CI step order on a clean tree; static validation of the supplied
research datasets (`learnpath-youtube-resources.json`, `learnpath-resources.import.json`) against the
repository's own Zod schema.

Everything below is observed, not assumed. Line numbers refer to commit `098503d`.

---

## 0. Executive summary

The repository is architecturally honest: the docs describe a real, coherent product and most of it
exists in code. The content model (`src/lib/content/schema.ts`), the progress model
(localStorage → server merge), the browser-only practice engines and the auth wiring are genuinely
good foundations that this upgrade **keeps**.

The gap between "documented" and "shipped" is the real story of this audit:

| Area | Documented | Actually shipped |
|---|---|---|
| CI | green pipeline | **red on every push** — `typecheck` runs before the build that generates the types it needs (§3.1) |
| Editor | README lists "Monaco"; docs say textarea | **textarea named `MonacoField`**; `@monaco-editor/react` installed but never imported (§3.4) |
| YouTube failure UX | "message + alternative resource" | **dead code** — `onError` on a cross-origin iframe never fires (§3.2) |
| Progress sync | "server wins on conflict" | **wrong record uploaded** when re-marking an existing entity (§3.3) |
| Content location | `docs/CONTENT-SYSTEM.md`: JSON in `/content` | TypeScript modules in `src/lib/content/`; `/content` holds only a README (§4.1) |
| SEO | JSON-LD + canonical (§MASTER-PROJECT §28) | **neither exists** (§6.3) |
| Lazy loading | "heavy runtimes are `next/dynamic`" | `next/dynamic` appears **zero** times (§6.4) |
| Branding | "premium editorial" | 964 KB unused `logo.png`, 1.34 MB OG image committed twice, create-next-app boilerplate SVGs still shipping (§5) |
| Homepage | the product's flagship | two near-duplicate roadmap lists; no resources, practice, projects, GitHub or Discord visual moments (§2.3) |

The supplied research dataset is the opposite of the codebase's weak spots: **172 resources, 0 schema
errors, every shipped item `embed_status: verified`** (§7). It is the raw material that turns
LearnPath's 17 YouTube embeds into a real library.

**Verdict:** do not rebuild. Fix the six genuine defects, close the doc/code gaps, then spend the
remaining effort on the visual layer and the content integration the product is missing.

---

## 1. Existing strengths

1. **Coherent product thesis, consistently enforced.** `README.md`, `docs/MASTER-PROJECT.md` and the
   code agree on what LearnPath is *not* (video host, LMS, certificate mill). The loop
   `roadmap → skill → resource → watch → practice → challenge → build` is implemented end-to-end and
   is testable without an account.
2. **Content integrity tooling.** `src/lib/content/schema.ts` (Zod) + `validateCatalog()`
   (`src/lib/content/index.ts:69-121`) catch duplicate ids, dangling skill/resource references, bad
   edges, out-of-range scores. `npm run content:validate` is wired into CI. This is the single most
   valuable piece of infrastructure in the repo and the upgrade leans on it heavily.
3. **Honest editorial model.** `editorScore` is documented as an opinion with a stated basis
   (`docs/CONTENT-SYSTEM.md`), labels avoid objective "best" claims (`labelCopy` in `schema.ts:148-156`).
   No fake learner counts, streaks or testimonials anywhere. Rare and worth protecting.
4. **Correct security posture for untrusted code.** Practice runs only in the browser:
   Pyodide/sql.js in workers (`public/workers/*.js`), JS/TS in `sandbox="allow-scripts"` iframes with a
   per-run nonce id (`src/components/practice/runtimes.ts:37-41,74-95`). No server eval, no third-party
   runner. `next.config.ts:20-35` sets `Referrer-Policy`, `nosniff`, `X-Frame-Options`,
   `Permissions-Policy`. Authz is server-side on every mutating route
   (`api/progress`, `api/notes`, `api/reports`, `api/admin/reports`).
5. **Auth done properly.** Better Auth + Drizzle sqlite adapter, `anonymous()` + `nextCookies()`,
   providers gated on env presence (`src/lib/auth.ts`, `src/lib/auth-providers.ts`), email/password
   always available. Admin gate is a real server check (`src/lib/session.ts:19-26`).
6. **Progress model is well designed.** Anonymous localStorage with a deterministic merge
   (`src/lib/progress-shared.ts:30-44`), completion never downgraded to started, unique
   `(userId, entityType, entityId)` index. The *design* is right; one sync bug (§3.3).
7. **Server/client split is disciplined.** Content pages are RSC with `generateStaticParams`
   (roadmaps, skills, resources, challenges, projects all SSG per the build output); islands are small
   and few. No client-side data fetching for content.
8. **Test seeds exist** for the three pure cores: catalog integrity, progress math, search
   (`tests/*.test.ts`, 7 tests, all green).
9. **Design tokens are semantic.** `src/app/globals.css` defines light/dark token sets mapped through
   Tailwind v4 `@theme inline`; components never hardcode hex (verified by grep). The "path through a
   constellation" direction (`docs/DESIGN-SYSTEM.md`) is distinctive and the OG image already uses it.
10. **Accessibility foundations present:** skip link, `:focus-visible` ring, `prefers-reduced-motion`
    guard for the draw animation, semantic landmarks, labelled search form, `aria-label` on the
    facade player.

---

## 2. UX problems

### 2.1 The homepage does not sell the product (highest visual priority)

`src/app/page.tsx` (122 lines) renders: hero + search + static SVG, "the loop" list, a *Featured
roadmaps* grid, an *Editor picks* grid **of the same roadmap objects**, two text panels
(Discord / open source). Consequences:

- The page shows **zero actual learning resources**. A visitor never sees a single video the platform
  curates — the core value — until they click three levels deep.
- "Featured" and "Editor picks" are the same entity type with near-identical cards, so 50% of the
  page is redundant.
- No categories, no practice preview, no projects, no progress story, no GitHub CTA with a real URL,
  no Discord visual moment. The brief's required rhythm
  (hero → discovery → how → picks → paths → practice → projects → OSS → community) is ~30% present.
- `PathCanvas` (`src/components/path-canvas.tsx`) is a static 5-node SVG labelled
  Foundation…Mastery. It reads as a diagram, not as "an interactive learning graph", and its
  `fontFamily="var(--font-mono)"` SVG attribute resolves against the *stylesheet* variable, which is
  fine, but the five hard-coded node positions duplicate information the roadmap data already has.

### 2.2 The learning loop's middle is thin

- **Skill page** (`src/app/skills/[slug]/page.tsx:54-57`) renders prerequisites as raw ids:
  `<Badge>{id}</Badge>` → the learner sees `python-data-structures`, not "Python data structures".
  Prerequisites are also unlinked.
- **Learning workspace** (`src/app/learn/[roadmap]/[skill]/ui.tsx`): the roadmap rail is
  `hidden lg:block` (line 46) so **on mobile the learner has no path context at all** — no lesson list,
  no prev/next visibility until they scroll to the buttons. The mobile tab row (lines 59-68) is three
  unstyled `<button>`s with no `role="tablist"`/`aria-selected`, and the show/hide logic
  (`tab !== "lesson" && "max-lg:hidden"` vs nested `max-lg:hidden lg:block`) is a three-state puzzle
  that is easy to break and hard to read.
- **Resource cards have no thumbnail, no CTA, no hover.** `src/components/resource-card.tsx` is a text
  card: badges, title, one meta line, the full `editorNote`, a mono score line. The brief's video-card
  anatomy (thumbnail, provider, duration, level, score, badge, CTA) is absent. YouTube identity — the
  thing that makes a curated video trustworthy — is invisible until click-through.
- **`/resources` is an unfiltered wall** of 51 cards (`src/app/resources/page.tsx`); `/courses`
  (`src/app/courses/page.tsx`) is the same wall filtered by type. With the supplied dataset the wall
  becomes 223 cards. There is no category filter, level filter, type filter, sort, or pagination
  anywhere.
- **Search** (`src/app/search/page.tsx`) is a server round-trip per keystroke-commit with plain list
  rows; MiniSearch already supports instant results and the `/api/search` route already exists but is
  unused by the UI. No keyboard shortcut, no grouping by kind, no empty-state art.

### 2.3 Roadmaps read as lists, not paths

- Coordinates are generated by `line()` (`src/lib/content/roadmaps.ts:5-18`): a vertical chain with a
  40px zigzag on odd rows. Every one of the six roadmaps is therefore the same shape — a column.
- There is **no stage/grouping concept** in `roadmapSchema` (`schema.ts:87-107`): only `tier`. The
  brief's "Goal → Prerequisites → Stages → Skills → …" journey has no data to render from.
- `RoadmapGraph` (`src/components/roadmap-graph.tsx`) draws straight `<line>` edges between 150×56
  `foreignObject` boxes; no hover, no locked/prerequisite state, no completion ring on the node
  itself (only a border tint), no curve, no tier banding. The page then repeats the same information
  as an `<ol>` below (roadmaps/[slug]/page.tsx:60-76), so the graph adds little.
- `edges` exist but four of six roadmaps are pure chains (`chain()` helper), so dependency *structure*
  — the interesting part — only exists in `ai-engineer`.

### 2.4 Empty / loading / error states are minimal but honest

`EmptyState`, `Skeleton`, `error.tsx`, `not-found.tsx` exist. Gaps: `/me` shows the first three
roadmaps at 0% when nothing is done (`me/ui.tsx:26-28`) which reads as progress that isn't there;
`error.tsx` prints raw `error.message` to the user; no skeleton for the facade thumbnail while it loads.

---

## 3. Broken features (verified defects)

### 3.1 CI is red on every push — build-blocking

`.github/workflows/ci.yml:17-22` runs `typecheck` (step 3) **before** `build` (step 6).
`src/app/layout.tsx:33` uses the generated global type `LayoutProps<"/">`, which only exists after
`next build`/`next dev` writes `.next/types/routes.d.ts`; `next-env.d.ts` is gitignored
(`.gitignore:50`). Reproduced on a clean clone:

```
$ rm -rf .next next-env.d.ts && npx tsc --noEmit
src/app/layout.tsx(33,50): error TS2304: Cannot find name 'LayoutProps'.
```

After `npm run build`, `tsc --noEmit` is clean. So every PR fails CI before it can build. Either the
workflow must typecheck after a build (or run `next build` once first), or `layout.tsx` must stop
depending on generated route types. This is the first thing to fix because it masks every future
regression.

### 3.2 The documented "unavailable video" fallback can never trigger

`src/components/youtube-embed.tsx:66` attaches `onError` to the YouTube `<iframe>`. Browsers do not
fire `error` on an iframe whose *document* fails (private video, region block, embed disabled); the
player itself shows its own error UI inside the frame. `setFailed` is therefore unreachable, and the
carefully written fallback UI (lines 20-38) plus `docs/ARCHITECTURE.md`'s "YouTube unavailable →
alternative resource + status message" row are fiction. Detection has to come from the YouTube
iframe/player API messaging (`postMessage` `{"event":"error"}` …) or an oEmbed/HTTP check at build or
render time — not from DOM `onerror`.

### 3.3 Progress sync uploads the wrong record

`src/components/progress-provider.tsx:84-93` persists by sending `next[next.length - 1]`.
`upsertProgress` (`progress-shared.ts:15-21`) replaces an existing entity **in place**, so when a
learner toggles an already-tracked entity (e.g. un-completes skill #2 of 9), the array's last element
is an unrelated older record, and that unrelated record is what gets POSTed. The intended change is
silently dropped server-side. Local state still looks correct, which makes this invisible in manual
testing. Fix: `mark()` must send the record it changed, not the array tail.

### 3.4 The editor is a textarea, and the docs disagree about which

`@monaco-editor/react` is a production dependency (`package.json`) that **no file imports**
(grep: only `MonacoField` references). `src/components/practice/monaco-field.tsx:17` renders a
`<textarea>` with a two-space Tab handler. `README.md` lists "Monaco" in the stack; `docs/RESEARCH.md`
§11 and `docs/PRACTICE-ENGINE.md` say the opposite ("first-class monospace editor … rather than
bundling Monaco"). One of the three must change. A textarea also means: no syntax highlighting, no
line numbers, no bracket matching, and Tab inserts spaces **only when the handler wins focus** — the
brief's "learning workspace feels like a real product" bar is not met by a textarea.

### 3.5 Notes are silently corrupted by fake sanitization

`src/app/api/notes/route.ts:32`: `body.replace(/<script/gi, "&lt;script")`. There is no HTML rendering
of notes anywhere (they render in a controlled `<Textarea>`), so this buys zero security and destroys
data: a learner taking notes on DOM scripting or writing an HTML challenge gets `<script>` rewritten
to `&lt;script>` in their saved note, permanently. Either delete the line (correct today) or add a
real sanitizer *when and only when* Markdown rendering lands, as `docs/SECURITY.md` already plans.

### 3.6 Public CTAs point at placeholders

- `src/app/open-source/page.tsx:6` → `https://github.com` (the site root) when env is unset.
- `src/app/community/page.tsx:6` → `https://discord.com` (no invite).
- `.env.example` suggests `https://github.com/learnpath/learnpath`, an organization that does not own
  this repository (the real origin is `RRRTX-Labs/LearnPath`).
- `/community` also lists fourteen "suggested channels" as if they existed. `docs/MASTER-PROJECT.md`
  §22 says they are operator suggestions, not a description of a live server; to a visitor they read
  as a community that isn't there. Reframe explicitly as "channels we recommend the server has /
  will have".

These violate the brief's "no broken links / no fake community" bar in the default configuration.

---

## 4. Architecture problems

### 4.1 The documented content location does not exist

`docs/CONTENT-SYSTEM.md` opens with a `/content/*.json` tree; `/content` contains only `README.md`,
which itself admits the truth ("Canonical curriculum is TypeScript modules in `src/lib/content/`).
`docs/RESEARCH.md` §7 records the JSON decision; `docs/MASTER-PROJECT.md` §33 repeats the folder
layout. TypeScript modules are arguably *better* (typed, refactorable, no export step) — but then the
docs, the CONTRIBUTING flow ("edit JSON"), and `open-source/page.tsx` ("Edit JSON/TS") must say so in
one voice. The upgrade adopts TS modules as canonical and fixes every doc that says otherwise.

### 4.2 Curriculum shape is too flat for the product story

`roadmapSchema` has nodes+edges but no stages, no per-node summary, no explicit prerequisite-skill
rendering beyond `skill.prerequisites` (ids). `estimatedHours` exists per roadmap only. As a result
the "learning path" pages can only show order, not *why*. The supplied dataset carries `prerequisites`,
`learning_outcomes`, `warnings`, `notes` per resource and skill-level groupings per category — exactly
the missing semantic layer. Schema extension (stages, outcomes) is additive and backwards compatible.

### 4.3 Server schema is created by a 90-line SQL string

`src/db/ensure.ts` hand-writes `CREATE TABLE IF NOT EXISTS …` for all eight tables, in parallel with
`src/db/schema.ts` (Drizzle) and `drizzle.config.ts`. Three sources of truth for one schema; a column
added in Drizzle but not in the string silently 500s at runtime in production. `docs/DATABASE.md`
already prescribes `drizzle-kit push`/migrations. The runtime `ensureSchema()` is a nice local
convenience but must be derived from, or checked against, the Drizzle schema.

### 4.4 Two progress write paths, one of them lossy

Anonymous → authenticated merge is a single `PUT /api/progress` with the whole merged array
(`progress-provider.tsx:47-52`), while normal updates are one-`POST`-of-the-last-element (§3.3).
Unifying on "send exactly the records that changed" removes the lossy path.

### 4.5 `db/index.ts` exports a Proxy that is never used

`export const db = new Proxy(...)` (lines 29-37) exists to look like a singleton; every call site uses
`getDb()`. Dead surface that invites the wrong import.

### 4.6 Module-scope env reads

`src/lib/auth-providers.ts` and the two page-level `process.env.NEXT_PUBLIC_*` reads are evaluated at
module load. Harmless today, but `auth-providers.ts` is imported by `lib/auth.ts` only — good — while
nothing prevents a future client import from silently shipping `undefined` providers. Worth a
`server-only`-style guard or a typed accessor.

---

## 5. Content & asset problems

1. **Catalog is small relative to the product claim.** 51 resources, of which **17 have a YouTube id**
   (`youtube-course` 14, `youtube-video` 1, `playlist` 2). Six roadmaps × ~10 skills each means most
   skills have exactly one video option. The supplied dataset adds 172 verified items (88 courses,
   73 videos, 11 playlists) — a 4× increase in embeddable material.
2. **Dead and duplicated brand assets (~4.5 MB committed):**
   - `public/logo.png` — 964 KB, 1024×1024, **referenced by nothing** (the app draws an inline SVG
     `Mark` in `src/components/logo.tsx`).
   - `public/og.png` — 1.34 MB, referenced by metadata; acceptable content, unacceptable weight.
   - `branding/logo-dark.png` and `branding/og-image.png` are **byte-identical duplicates**
     (md5 `2ee6dd50…`, `fd83be16…`) of the two above.
   - `public/next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg` — create-next-app
     boilerplate, referenced by nothing.
   - `src/app/favicon.ico` (25 KB, Next starter icon) coexists with `public/favicon.svg`, which is
     what `metadata.icons` actually points at; browsers may pick the .ico.
3. **The mark does not survive 16 px.** `public/favicon.svg` / `Mark` in `logo.tsx` is an "L" stroke
   with three 8-unit diamonds and two-colour glow accents; at favicon size the diamonds merge into
   noise and the amber/teal split reads as an artifact. There is no light-mode variant, no compact
   mark distinct from the favicon, no vector source of truth (the only "brand" files are rasters).
4. **No per-page OG images, no JSON-LD, no canonical** (see §6.3), despite `MASTER-PROJECT.md` §28
   promising all three.
5. **Skill/practice coverage is lopsided.** `practice.ts`: python 7, sql 2, javascript 1,
   typescript 1, html 1. `challenges.ts`: python 6, javascript 2, sql 1, typescript 1, html 1. A
   learner on the Full Stack roadmap gets one JavaScript exercise. The dataset cannot fix this (it is
   video research), so practice content needs authoring attention after the import.
6. **Project starter files are half-shipped.** `projects/[slug]/page.tsx:21` takes
   `Object.entries(project.starter)[0]` — only the first file of a multi-file brief is ever shown.

---

## 6. Performance, accessibility, security, SEO

### 6.1 Performance

- **OG image 1.34 MB** on every social/preview fetch; favicon path ambiguous (§5.2).
- Facade is correct and must stay: no iframe until click (`youtube-embed.tsx:41-58`), thumbnail from
  `i.ytimg.com` via plain `<img>` (fine; `next/image` remotePatterns already allow the host but are
  unused).
- Pyodide/sql.js load only from practice pages via workers; Sucrase is a genuine dynamic
  `import()` (`runtimes.ts:63`). Homepage payload is clean — no runtime is initialised there.
- `next/dynamic` is used **nowhere**, contradicting `docs/ARCHITECTURE.md` ("Heavy runtimes are
  next/dynamic with ssr:false"). Today's laziness comes from route-splitting plus worker `new Worker()`
  calls; that is adequate but undocumented-as-such. Any new heavy component (3D, Monaco) must use
  explicit dynamic import with `ssr:false`.
- Fonts: three families via `next/font/google` (Geist, Geist Mono, Instrument Serif) — acceptable;
  Instrument Serif is single-weight and display-only.
- Build output shows all content pages SSG; `/search`, `/me`, `/admin`, API routes dynamic — correct.

### 6.2 Accessibility

Good: skip link, focus ring, reduced-motion guard, labelled controls, semantic headings, real
buttons for actions.
Gaps to fix in the upgrade:
- Mobile workspace tabs and practice exercise list are `<button>`s without tab/list semantics or
  `aria-current` (`learn/…/ui.tsx:59-68`, `practice/[lang]/ui.tsx:20-29`).
- Roadmap graph nodes are focusable links (good) but state is colour-only (`done` border tint,
  `roadmap-graph.tsx:57-62`); needs a non-colour completion indicator for colour-blind users.
- `report-form.tsx` status message and `sign-in/ui.tsx` error are not in an `aria-live` region.
- 11 px uppercase mono is used for most meta text; legible at 4.5:1 contrast but small — reserve for
  true meta, never for body.
- Touch targets: graph nodes are 150×56 (fine); tab pills and theme toggle are ~28-36 px tall (below
  the 44 px the docs themselves promise).

### 6.3 SEO

- Metadata titles/descriptions per page: present. `robots.ts`, `sitemap.ts`: present.
- `sitemap.ts` sets `lastModified: new Date()` for **every** URL on every build — useless churn for
  crawlers; content pages should carry their `lastVerified`/content hash date instead.
- Missing: canonical URLs (`alternates`), JSON-LD (`Course`/`LearningPath`/`VideoObject`), per-roadmap
  OG images, `og:type` per entity. All promised in `MASTER-PROJECT.md` §28.
- `/search` is indexable but meaningless; should be `noindex`.

### 6.4 Security

Posture is strong (§1.4). Precise notes:
- `runtimes.ts:80-87` posts to `'*'` and the parent listener filters only by nonce id. Because the
  sandbox has no `allow-same-origin`, an origin check is *impossible*; the nonce is the real control.
  `docs/SECURITY.md`'s "origin checks on postMessage" row overstates this — fix the doc, keep the nonce,
  and validate payload shape on receipt.
- `notes` route: see §3.5 (data corruption, not a vulnerability).
- `error.tsx` surfaces `error.message` verbatim — potential internal-detail leak; show a generic
  message and log the rest.
- Admin report rows are returned wholesale to admins only — acceptable.
- No rate limiting on `/api/reports` (auth-gated) or `/api/search` (public). Documented as a V1
  trade-off; keep, but note.
- No CSP. `docs/SECURITY.md` deliberately defers a nonce CSP to V1.1 to avoid breaking embeds —
  correct call, keep the deferral explicit.

---

## 7. Supplied dataset assessment

**Files:** `learnpath-youtube-resources.json` (research dataset, schema v5),
`learnpath-resources.import.json` (172 pre-shaped records).

**Validation performed** (`scripts/`-level static validation against
`src/lib/content/schema.ts` semantics + internal consistency):

| Check | Result |
|---|---|
| Records in import list | 172 (88 `youtube-course`, 73 `youtube-video`, 11 `playlist`) |
| Required-field completeness | 172/172 |
| `type` / `level` / `status` / `labels` enum conformance | 172/172 |
| `editorScore` within 0–100 | 172/172 (range 64–91, mean 80.2) |
| `youtubeId` format (11-char) + `url` ↔ id consistency | 161/161 video-bearing records |
| Playlist records carry `playlistId`, no fake `youtubeId` | 11/11 |
| Duplicate ids / duplicate youtube ids | none |
| Every shipped record `embed_status == "verified"` | 172/172 |
| Rejected list (8 embed-disabled videos) absent from import | confirmed |
| Category `resource_count` vs actual | matches |
| Category skill → resource id references resolve | all resolve |
| `lastVerified`, `durationMinutes`, `editorScore` agree with research twin | all agree |
| **Errors** | **0** |

One advisory note: `verification_summary` reports 220 checks for 190 verified + 8 failed videos +
21 playlists (219); the extra check is consistent with a re-check, not with missing data. Not blocking.

**Assessment.** The dataset is import-ready and *more* disciplined than the repo's current content:
every item carries a defensible `why_recommended`, an explicit score breakdown, a verification method,
and a licence note. Its `recommended_role`/`learnpath_labels` vocabulary maps 1:1 onto the repo's
labels enum (documented in the file's own `learnpath_mapping`). It must still be **normalized, not
pasted**:

1. Research `topics` are dataset skill ids (`data-structures-algorithms`), which do **not** match repo
   skill ids (`python-data-structures`). A mapping table is required; unmapped topics become new
   topics, not dangling skill references.
2. 63 records claim `best-overall` *within their dataset skill*; the repo's rule is one primary per
   **repo skill**, so role demotion (per the dataset's own `curation.role_rule`) must be applied again
   at repo-skill granularity.
3. The repo has no `publishedAt`, `warnings`, `learningOutcomes` fields. Either extend the schema
   (additive, recommended — the brief's resource page wants "why this is recommended") or drop the
   data. Extending is cheaper than re-researching later.
4. 11 playlist records have no single `youtubeId`; the facade must render playlist embeds via
   `?list=` and the resource page must not promise a thumbnail-per-video it cannot verify.

**Decision:** integrate all 172 as canonical resources behind the existing Zod schema plus a small
additive extension (§8 R-3), wire them into skills through an explicit topic→skill map, and keep the
research file out of the runtime bundle (build-time only).

---

## 8. Recommended changes (ordered)

**R-1 Fix CI first.** Make `typecheck` runnable on a clean clone (build-then-typecheck order in
`ci.yml`, or drop the generated-type dependency in `layout.tsx`). Nothing else can be trusted until
CI is green.

**R-2 Fix the six functional defects** (§3.1–3.6): progress record sync, YouTube failure detection,
editor decision (ship real Monaco via dynamic import, rename the component honestly), notes
corruption, placeholder CTAs (real repo URL, honest Discord framing), mobile path context.

**R-3 Extend the content schema additively**: `stages[]` on roadmaps (id, title, summary, node ids),
`publishedAt`, `warnings[]`, `learningOutcomes[]`, `playlistVideoCount` on resources; keep every
existing field and test green.

**R-4 Import the dataset** through a committed, re-runnable normalization script
(`scripts/import-resources.ts`) that emits canonical TS, applies repo-skill role demotion, and fails
CI on any `embed_status != verified`. Grow 51 → 223 resources.

**R-5 Author the missing curriculum depth**: stage groupings for all six roadmaps; new skills/nodes
for uncovered dataset categories that belong to existing roadmaps (DevOps, system design, data
science); practice/challenge top-ups for javascript/typescript/html/sql so the Full Stack path has a
real practice loop.

**R-6 Design system v2**: elevation/hover/glass tokens, motion scale, radii discipline, focus and
touch-target standards, reduced-motion contract — codified in `docs/DESIGN-SYSTEM.md` and in CSS, not
in ad-hoc classes.

**R-7 Brand**: hand-authored SVG mark + wordmark as the single source of truth; generated PNGs
(favicon 16/32/48, apple-touch 180, OG 1200×630) at sane weights; delete the 4.5 MB of dead/duplicate
assets and the starter boilerplate.

**R-8 UI primitives**: promote `ui.tsx` into a shadcn-style component set (button, card, badge, tabs,
dialog, tooltip, progress, skeleton, empty-state, tabs-with-a11y) plus two or three *restrained*
visual components (spotlight card, animated path canvas). No component-library sprawl.

**R-9 Homepage redesign** to the brief's rhythm, showing real resources with thumbnails.

**R-10 Roadmap experience**: stage-banded interactive graph with dependency curves, hover/active/
done/locked states, keyboard traversal, and a mobile stacked rendering; kill the duplicated `<ol>`.

**R-11 Resource & course experience**: thumbnail cards with CTA and hover; resource page with
"why recommended", outcomes, warnings, alternatives, docs slot; graceful unavailability handling
wired to the new detection (§3.2).

**R-12 Search**: instant client-side MiniSearch over the grown catalog with grouped, polished result
cards and a command-style shortcut; keep `/api/search` for parity.

**R-13 SEO**: canonicals, JSON-LD, per-roadmap OG images, stable `lastModified`, `/search` noindex.

**R-14 A11y & responsive pass**: tab semantics, aria-live, 44 px targets, colour-independent state,
375→1440 verification of the full loop.

**R-15 Docs truth pass**: one voice for content location, editor, lazy-loading, postMessage, and the
community framing; update `ARCHITECTURE`, `CONTENT-SYSTEM`, `DESIGN-SYSTEM`, `CHANGELOG`.

**R-16 Regression net**: tests for the progress sync fix, role demotion, import validation, YouTube
fallback contract, and the CI-order bug (typecheck-before-build on a clean tree).

---

## 9. What this upgrade must NOT touch

- Better Auth configuration, providers, anonymous plugin, session model (§1.5) — working, keep.
- Browser-only execution policy for user code; sandbox flags; timeouts (§1.4).
- The Git-canonical content principle and the Zod gate (§1.2).
- The editorial-score honesty model and the no-fake-metrics rule.
- libSQL/Drizzle/Turso choice; no new backend, state library, or SaaS dependency.
- The click-to-load YouTube facade *policy* (its failure detection is broken; the policy is right).

---

*Audit ends. Implementation proceeds in the phase order of the mission brief, tracked in
`docs/IMPLEMENTATION-PLAN.md` and `CHANGELOG.md`.*
