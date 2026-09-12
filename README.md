# LearnPath

**Learn anything. Build everything.**

A free, open-source, roadmap-first learning platform. YouTube is the classroom. LearnPath is the structure around it: roadmaps, curated free resources, in-browser practice, challenges, projects, and progress.

```
ROADMAP → SKILL → FREE RESOURCE → WATCH → PRACTICE → CHALLENGE → BUILD → NEXT SKILL
```

This is not YouTube, Coursera, Udemy, a certificate mill, or an AI course generator.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Better Auth (Google, GitHub, Discord, email)
- Turso / libSQL + Drizzle ORM
- Git-canonical curriculum (Zod-validated)
- Monaco + Pyodide + sql.js + sandboxed JS/HTML (browser only)

## Local setup

```bash
cp .env.example .env.local
npm install
npm run db:push   # optional; schema is also created on first API use
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

OAuth buttons appear only when the corresponding client IDs are set. Email/password always works. You can complete the full learning loop without an account.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run test` | Unit tests |
| `npm run content:validate` | Curriculum integrity |
| `npm run db:push` | Push Drizzle schema |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Content

Curriculum lives in `src/lib/content/` and is validated by Zod. See `docs/CONTENT-SYSTEM.md` and `CONTRIBUTING.md`.

**We do not copy roadmap.sh content.** Their license forbids redistribution. LearnPath roadmaps are independently authored.

## YouTube

Official iframe embeds only, after a click-to-load facade, with `Referrer-Policy: strict-origin-when-cross-origin`. We never download, proxy, or restyle the player.

## Security

Untrusted code never runs on the server. See `SECURITY.md` and `docs/SECURITY.md`.

## License

MIT. Third-party resources remain under their own terms.
