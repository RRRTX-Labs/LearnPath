# Architecture

LearnPath is a single Next.js 16 application. There is no microservice mesh, no queue, no vector
DB, no AI agent in the request path.

## Runtime split

| Concern | Where | Why |
|---|---|---|
| Curriculum | Git TypeScript modules, Zod-parsed on the server | PR workflow, typed, no CMS lock-in |
| Research dataset | `content/research/`, build-time only | Inputs to the importer; never bundled |
| User state | libSQL via Drizzle (Node runtime) | Durable, owned |
| Auth | Better Auth route handler | OSS, cookie sessions, anonymous plugin |
| Python / SQL / JS execution | Browser workers / sandboxed iframes | Untrusted code never touches the server |
| YouTube | Facade → official IFrame Player API on click | Policy + performance + real error events |
| Search | MiniSearch index built per server instance, `/api/search` | Corpus-size appropriate, no SaaS |
| Editor | Monaco, loaded as its own client chunk | Heavy; textarea fallback if the CDN fails |
| Community | Discord | Do not build a worse forum |

## Request path

1. Public pages are React Server Components reading `src/lib/content` and, where useful, the
   session via `auth.api.getSession({ headers })`.
2. Client islands handle graphs, editor, player, notes, filters and optimistic progress.
3. Mutations go to Route Handlers under `src/app/api/*` with Zod validation and session checks.
4. Generated content pages use `generateStaticParams` (roadmaps, skills, resources, challenges,
   projects). `/search`, `/me`, `/admin` and APIs are dynamic.

## Lazy loading contract

- Monaco: `import("./monaco-field")` inside an effect in `EditorField`; skeleton while loading;
  functional textarea fallback on failure. Never in SSR, never on marketing pages.
- Pyodide / sql.js: workers instantiated only from practice/challenge runs.
- Sucrase: dynamic `import()` on first TypeScript run.
- YouTube: no iframe and no player API script until the learner clicks the facade.
- Hero/graph visuals are SVG + CSS; there is no WebGL anywhere.

## YouTube failure handling (v1.1)

DOM `onerror` on a cross-origin iframe cannot fire for document-level failures, which made the old
fallback dead code. The facade now mounts the **official IFrame Player API**
(`https://www.youtube.com/iframe_api`, host `youtube-nocookie.com`) after the click and subscribes
to `onError` (codes 2/5/100/101/150). On failure the learner sees "This resource is currently
unavailable", an alternatives link and a report link — the path continues.

## Progress sync (v1.1 fix)

`mark()` computes the changed record and POSTs exactly that record. The previous implementation
posted the array tail, which — because `upsertProgress` replaces in place — silently uploaded an
unrelated record when re-marking an existing entity. Anonymous → authenticated merge still uses a
single `PUT /api/progress` with the merged array.

## Data ownership

```
Git  ── curriculum (roadmaps, skills, resources, challenges, projects, practice)
DB   ── users, sessions, accounts, progress, notes, reports, resource_meta
```

Never duplicate canonical skill text into the database. `resource_meta` exists for operational
overrides only.

## Database

libSQL (Turso in production, `file:./data/learnpath.db` locally) + Drizzle. `src/db/ensure.ts`
creates tables idempotently on first API use for local/dev convenience; the Drizzle schema in
`src/db/schema.ts` remains the source of truth and `drizzle-kit push`/migrations are the production
path. Keep the two in sync — CI typecheck covers shape, review covers drift.

## Failure modes

| Failure | UX |
|---|---|
| DB down | Public curriculum still works; auth/progress degrade gracefully |
| OAuth misconfigured | Email/password + anonymous still work; provider buttons hide |
| YouTube unavailable | Player API error → message + alternatives + report |
| Monaco CDN fail | Textarea fallback editor, fully functional |
| Pyodide CDN fail | Explicit error and retry suggestion in the output pane |
| Search API fail | Empty result state with guidance, no crash |

## Security

See `docs/SECURITY.md` and `SECURITY.md`. Invariants: no server-side execution of learner code;
sandboxed iframes without `allow-same-origin`; nonce-id `postMessage` protocol (origin checks are
impossible for opaque-origin sandboxes — the docs say so now); server-side authz on every mutating
route; no `dangerouslySetInnerHTML` except first-party JSON-LD blobs.

## SEO

Per-page metadata with canonicals, JSON-LD (`WebSite` + `SearchAction` globally, `VideoObject` /
`LearningResource` per resource), sitemap with stable `lastModified` (catalog verification date,
not request time), `/search` marked noindex, robots excluding app surfaces.
