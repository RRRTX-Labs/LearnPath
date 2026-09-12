# LearnPath Research Notes

Research date: 2026-09-12.

Sources are ranked: official documentation first, then official repositories, then established technical docs, then high-quality engineering writing. Community discussion is used only for sentiment and practical failure modes.

## 1. Product / UX research

LearnPath is a **roadmap-first learning structure** around free resources (especially YouTube), not a video host, LMS, or certificate marketplace.

### Competitive matrix

| Product | Core loop | What works | What fails / gaps | LearnPath takeaway |
|---|---|---|---|---|
| [roadmap.sh](https://roadmap.sh) | Visual graph → topic → resource dump | Outstanding information architecture; community scale; progress checkboxes | Resource lists are noisy; little practice/projects in-product; content **cannot be redistributed** | Independent graph UX, never copy content |
| [freeCodeCamp](https://www.freecodecamp.org) | Curriculum → challenge → project → cert | Completely free; project-oriented; huge YouTube catalog | Pacing uneven; weaker career-path visualization | Use their **public YouTube** as curated resources; keep our own structure |
| [The Odin Project](https://www.theodinproject.com) | Reading → build real projects | Best-in-class project pedagogy; no paywall | No in-browser editor; video-light; intimidating for beginners | Project briefs + in-browser practice as a complement |
| [Full Stack Open](https://fullstackopen.com) | University-grade exercises | Depth and academic rigor | Narrow (React/Node); high bar | Quality bar for Full Stack path |
| [Exercism](https://exercism.org) | Exercise → tests → mentor | Mentored practice; excellent test UX | Not a curriculum | Challenge UX: tests, pass/fail, iteration |
| [Scrimba](https://scrimba.com) | Interactive screencasts | Code *inside* the lesson | Paid beyond free tier | Learning workspace: lesson beside editor |
| [Frontend Mentor](https://www.frontendmentor.io) | Design brief → ship UI | Real briefs, portfolio pieces | Frontend-only | Project cards with requirements + hints |
| [Codecademy](https://www.codecademy.com) | In-browser exercises | Low-friction onboarding | Shallow on free tier; paywalled paths | Never gate watching or practicing behind account |
| Coursera / Udemy | Course catalog | Production video, instructors | Paid, certificate-first, weak roadmaps | Not the model |
| YouTube | Watch | Best free instructors on earth | Zero curriculum, no progress, no practice | Embed officially; add the missing structure |

### UX principles extracted

1. **Never force signup to browse.** Codecademy-style walls destroy trust.
2. **Always answer “what next?”** Roadmap.sh does this visually; Odin does it linearly. LearnPath must do both.
3. **Practice must be one click from the lesson.** Scrimba’s adjacency is the gold standard.
4. **Projects are the proof.** Certificates are not.
5. **Progress should be visible but not gamified into junk.** Checkmarks and a path percentage beat streaks and fake XP.
6. **Broken resources must fail gracefully.** YouTube videos go private. Always offer an alternative.
7. **Mobile is a different layout, not a shrunk IDE.** Collapse the workspace into tabs.

## 2. YouTube research (official)

Primary sources:

- [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
- [Required Minimum Functionality](https://developers.google.com/youtube/terms/required-minimum-functionality)
- [IFrame Player API / player parameters](https://developers.google.com/youtube/player_parameters)
- [YouTube Branding Guidelines](https://developers.google.com/youtube/terms/branding-guidelines)

### Allowed

- Official `<iframe>` embeds and the IFrame Player API.
- `https://www.youtube.com/embed/VIDEO_ID` and privacy-enhanced `https://www.youtube-nocookie.com/embed/VIDEO_ID`.
- Playlist embeds via `listType=playlist&list=PLAYLIST_ID`.
- LearnPath branding *around* the player, not over it.

### Required

- Send an HTTP `Referer`. Missing referrer → **Error 153**. Use `Referrer-Policy: strict-origin-when-cross-origin` and `referrerpolicy="strict-origin-when-cross-origin"` on the iframe. Do **not** use `noreferrer`.
- Do not overlay or frame any part of the player, including controls.
- Do not modify player chrome beyond documented parameters.
- `modestbranding` is **deprecated and has no effect** (since 2023-08-15). Do not try to strip YouTube branding.
- Autoplay only when more than half the player is visible; never more than one autoplaying player. V1: **no autoplay**.
- Do not charge users to watch, or gate playback behind actions other than clicking play.
- Do not run a hidden/background player.
- Made For Kids videos require COPPA-compliant handling (no tracking). V1 uses a click-to-load facade so the player is not created until user intent.
- Substantial independent value (roadmaps, curation, practice, projects, progress) — LearnPath’s entire product.

### Forbidden

- Downloading, rehosting, proxying, separating audio/video.
- Fake players, scraping captions/streams, circumventing age/region restrictions.
- Incentives for watching.

### V1 implementation

- Facade (thumbnail + play) → official iframe on click.
- Host: `youtube-nocookie.com`.
- Referrer policy as above.
- On error / unavailable: human message + alternative resource.
- No YouTube Data API in V1 (avoids quota, API keys, and extra policy surface). Metadata is editorial and stored in Git content.

## 3. Roadmap.sh licensing

Official FAQ ([roadmap.sh/about](https://roadmap.sh/about)): **“Can I redistribute the content? No.”**

The `kamranahmedse/developer-roadmap` license forbids publishing text/images from the project except personal use and linking. Code is separately licensed; content is not reusable.

**Decision:** LearnPath authors original roadmaps, skill graphs, and copy. We may *link* to roadmap.sh as a related project. We do not import their JSON, SVGs, or node text.

## 4. Framework research

- **Next.js 16.3** (App Router, React 19, TypeScript) is current as of this research. Node 20.9+ required. This environment is Node 20.20.2.
- App Router: Server Components by default, nested layouts, `loading.tsx` / `error.tsx`, Route Handlers.
- Next.js 16 uses `proxy.ts` instead of `middleware.ts` for request interception. Cookie-only session checks are for optimistic redirects only — real authz happens in server code.
- Tailwind CSS v4 (`@import "tailwindcss"`, `@theme inline`) is the create-next-app default.
- shadcn/ui is a copy-paste component pattern, not a dependency. LearnPath uses the same primitives (`cva`, `cn`) but a **custom visual language** so it does not look like a dashboard template.

## 5. Authentication research

Better Auth is the 2026 default for self-hosted Next.js auth: TypeScript-first, Drizzle adapter, OAuth, anonymous plugin, `nextCookies()`.

Official integration: [better-auth.com/docs/integrations/next](https://better-auth.com/docs/integrations/next).

Pattern:

```
betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  socialProviders: { google, github, discord },
  plugins: [anonymous(), nextCookies()], // nextCookies last
})
```

Route: `app/api/auth/[...all]/route.ts` via `toNextJsHandler(auth)`.

Client: `createAuthClient` from `better-auth/react`.

Security notes:

- HTTP-only cookies; `BETTER_AUTH_SECRET` ≥ 32 chars.
- OAuth redirect URIs must match exactly (`/api/auth/callback/{provider}`).
- Do not trust `getSessionCookie()` for authorization.
- Account linking: same email across providers is a takeover risk unless verified. Enable only with verified emails.
- CSRF: Better Auth handles OAuth state. Still validate redirects against an allowlist.

**Alternatives rejected:** Clerk (not self-hosted, paid), Supabase Auth (conflicts with Turso-owned data), Auth.js v5 (viable, but Better Auth has first-class Drizzle + anonymous + TypeScript inference).

V1 also enables **email/password** so the product is usable without OAuth app credentials in local/dev.

Anonymous browsing is a product requirement. Better Auth `anonymous` plus local progress merge covers it.

## 6. Database research

Preferred: **Turso (libSQL) + Drizzle**.

- `@libsql/client` remains the production-ready remote driver with Drizzle support. Newer `@tursodatabase/*` packages exist; Drizzle support for them is still settling. V1 uses `@libsql/client`.
- Local: `file:./data/learnpath.db`. Production: `libsql://…` + auth token. Same schema.
- SQLite/libSQL: excellent for this workload (user progress, notes, reports). Canonical curriculum stays in Git.
- Transactions exist; interactive transactions lock writes (~5s timeout on Turso) — keep writes short.
- Edge: HTTP driver only; no `file:` on Vercel. All DB access in Node.js server runtime, not Edge.
- Native `libsql` can break Next.js bundling. Mark `@libsql/client` / `libsql` as `serverExternalPackages`.

**Rejected:** Postgres/Neon (extra moving part), Prisma (bundle size on serverless), PGlite (not for multi-user production).

## 7. Content architecture research

Canonical education content should be Git-native so PRs work.

| Format | Pros | Cons |
|---|---|---|
| MDX | Prose + components | Harder to validate; easy to drift |
| YAML | Human-friendly | Indent bugs; weaker tooling |
| JSON | Trivial to validate with Zod | Verbose |

**Decision:** JSON files under `/content` validated by Zod at build and in CI. Optional Markdown `body` fields later. User state stays in the database.

Flow: GitHub → content files → `pnpm/npm run content:validate` → PR review → merge → deploy.

## 8. Interactive code environment research

### Monaco Editor

MIT. De-facto browser IDE. Load lazily via `@monaco-editor/react` (CDN sources by default) so homepage does not pay the cost.

### Python — Pyodide

CPython compiled to WebAssembly. Current documented line: 0.27.x. Run in a **Web Worker** so the UI thread stays responsive. No interpreter sharing across workers. Packages: pure-Python wheels + Pyodide-built scientific stack via micropip. Memory: tens to hundreds of MB. **Never load Pyodide on pages that do not need it.**

Limitations: no real subprocess, limited native extensions, first-load download is large (show a honest loading state).

### JavaScript / TypeScript

**WebContainers rejected for V1:**

1. Production for-profit use requires a StackBlitz license.
2. SharedArrayBuffer needs COOP/COEP cross-origin isolation, which **breaks YouTube embeds** (and most third-party iframes).
3. Overkill for exercises that are functions + tests.

**V1 JS/TS:** sandboxed `iframe` (`sandbox="allow-scripts"`, no `allow-same-origin`) + `postMessage`. TypeScript transpiled in-browser with **Sucrase** (fast, small). No Node.js, no filesystem, no network.

### SQL — sql.js

SQLite compiled to WASM. Entirely client-side, MIT. Perfect for SELECT/JOIN pedagogy. Load from CDN in a worker. No persistence required for V1 exercises (each run gets a fresh in-memory DB + seed).

### HTML/CSS/JS preview

`iframe` with `sandbox="allow-scripts allow-modals"` and `srcdoc`. Default CSP-like restrictions. Do not inject into the parent DOM.

### Other languages / Piston

Piston public API is **no longer freely available** (as of 2026-02-15). Self-hosting requires privileged Docker + Isolate and is operationally heavy. **Out of V1.** Do not execute untrusted code on the Next.js server or Vercel functions.

## 9. Security research (threat model summary)

See `docs/SECURITY.md`. Highlights:

| Threat | Mitigation |
|---|---|
| OAuth callback / redirect attacks | Provider-verified state; allowlisted redirects |
| Session theft | HTTP-only, Secure, SameSite cookies; rotation |
| XSS via Markdown/notes | Strict sanitization; no raw HTML in user notes |
| Stored XSS in reports | Escape on render; admin-only |
| Untrusted code | Browser sandbox only; timeouts; no server eval |
| CSRF | SameSite cookies; Better Auth origin checks |
| Admin IDOR | Server-side role check, never hidden routes |
| Spam / abuse | Auth for mutations; report rate limits |
| YouTube policy breach | Official embed only; referrer; no overlays |

## 10. Design research

Avoid: generic AI SaaS, glassmorphism soup, dashboard templates, childish EdTech, roadmap.sh clones.

Direction: **editorial developer tool**. Instrument Serif for display, Geist for UI, Geist Mono for code. Dark charcoal + teal path + amber progress. Light mode is warm paper, not washed gray. 3D is reserved for the learning-path story (SVG/CSS), not cards.

**Three.js / R3F rejected for V1 homepage:** the extra ~100KB+ and GPU cost fight Core Web Vitals. A hand-authored SVG constellation with CSS perspective delivers the same metaphor.

## 11. Decision log

| Decision | Choice | Alternatives | Reason | Tradeoff |
|---|---|---|---|---|
| Framework | Next.js 16 App Router | Remix, Astro, SvelteKit | First-class Vercel, RSC, current default | Coupled to Vercel mental model |
| UI | Custom + Tailwind v4 | shadcn defaults, Chakra | Unique visual identity | More CSS ownership |
| Auth | Better Auth | Auth.js, Clerk, Supabase | OSS, Drizzle, OAuth, anonymous | We operate it |
| DB | libSQL/Turso + Drizzle | Postgres, Prisma | SQLite simplicity, serverless HTTP | SQLite limits (no rich PG types) |
| Content | Git JSON + Zod | MDX CMS, DB-only | PR workflow, validation | Less WYSIWYG |
| Python | Pyodide worker | Server sandbox, Piston | Safe, offline-capable, no ops | Cold start + memory |
| JS/TS | iframe sandbox + Sucrase | WebContainers | License + COOP/COEP vs YouTube | No real Node |
| SQL | sql.js | Server SQLite | Same safety story | SQLite dialect only |
| 3D | SVG/CSS | Three.js | Performance | Less “wow” on GPU scenes |
| Editor | Monospace textarea in V1 | Monaco | Compile RAM in constrained CI; Monaco remains the documented upgrade | Less IntelliSense |
| YouTube | Facade + nocookie iframe | Data API, custom player | Policy-compliant, fast LCP | Click required to play |
| Roadmaps | Independently authored | Import roadmap.sh | License forbids redistribution | More editorial work |
| AI tutor | None in V1 | Chat widgets | Distracts from the core loop | Competitors may look “smarter” |

## 12. Sources

- https://developers.google.com/youtube/terms/developer-policies
- https://developers.google.com/youtube/terms/required-minimum-functionality
- https://developers.google.com/youtube/player_parameters
- https://roadmap.sh/about
- https://github.com/kamranahmedse/developer-roadmap/blob/master/license
- https://better-auth.com/docs/integrations/next
- https://better-auth.com/docs/adapters/drizzle
- https://orm.drizzle.team
- https://docs.turso.tech/sdk/ts/reference
- https://nextjs.org/blog/next-16
- https://pyodide.org/en/0.27.0/
- https://github.com/engineer-man/piston
- https://developer.stackblitz.com/guides/user-guide/general-faqs
