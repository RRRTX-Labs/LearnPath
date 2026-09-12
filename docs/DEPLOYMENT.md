# Deployment

## Target

Vercel (Node.js server runtime) + Turso + OAuth providers.

## Checklist

1. Production build (`npm run build`) succeeds.
2. Env vars set in Vercel (see `.env.example`).
3. Turso database created; `drizzle-kit push` or migrations applied.
4. OAuth apps:
   - Google: JS origin + redirect `https://<domain>/api/auth/callback/google`
   - GitHub: callback `…/api/auth/callback/github`
   - Discord: `…/api/auth/callback/discord`
5. `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` equal the canonical HTTPS origin.
6. `BETTER_AUTH_SECRET` random, ≥ 32 characters.
7. `ADMIN_EMAILS` comma-separated.
8. Discord invite + GitHub URL public env.
9. Referrer-Policy header present (YouTube).
10. No secrets in client bundle (`NEXT_PUBLIC_*` only for public values).

## Local

```bash
cp .env.example .env.local
npm install
npm run db:push
npm run dev
```

File SQLite at `./data/learnpath.db` is created automatically.

## CI

GitHub Actions: install, content:validate, typecheck, lint, unit, build.

## What will not work on Vercel

Long-running code execution, persistent terminals, writing the serverless filesystem. Practice stays in the browser; DB is remote libSQL.
