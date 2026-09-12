# Architecture

LearnPath is a single Next.js 16 application. There is no microservice mesh.

## Runtime split

| Concern | Where | Why |
|---|---|---|
| Curriculum | Git JSON, loaded on the server | PR workflow, no CMS lock-in |
| User state | libSQL via Drizzle (Node runtime) | Durable, owned |
| Auth | Better Auth route handler | OSS, cookie sessions |
| Python / SQL / JS execution | Browser workers / sandboxed iframes | Untrusted code must not touch the server |
| YouTube | Official iframe after click | Policy + performance |
| Community | Discord | Do not build a worse forum |

## Request path

1. Public pages are React Server Components. They read content from `src/lib/content` (filesystem JSON) and optional session via `auth.api.getSession({ headers })`.
2. Client islands (`"use client"`) handle graphs, editors, players, notes, and optimistic progress.
3. Mutations go to Route Handlers under `src/app/api/*` with Zod validation and session checks.

## Rendering

- Roadmaps, skills, resources, projects: statically generated from content where possible (`generateStaticParams`).
- My Learning, admin, progress APIs: dynamic, `force-dynamic` as needed.
- No Edge runtime for DB or auth.

## Bundling

`next.config.ts` sets:

- `serverExternalPackages: ["@libsql/client", "libsql"]`
- `Referrer-Policy: strict-origin-when-cross-origin` (YouTube Error 153)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (app itself; YouTube is a child iframe, not framing us)

Heavy runtimes are `next/dynamic` with `ssr: false`.

## Data ownership

```
Git  ── curriculum (roadmaps, skills, resources, challenges, projects)
DB   ── users, sessions, accounts, progress, notes, reports
```

Never duplicate canonical skill text into the database.

## Failure modes

| Failure | UX |
|---|---|
| DB down | Public curriculum still works; auth/progress degrade with a banner |
| OAuth misconfigured | Email/password + anonymous still work; provider buttons hide if env missing |
| YouTube unavailable | Alternative resource + status message |
| Pyodide CDN fail | Explicit error, retry, suggest local practice |
| Turso missing in prod | Deploy checklist fails; locally file SQLite is the default |
