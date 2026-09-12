# LearnPath V1 — Deployment & Handoff Checklist

_Companion to `CHANGELOG.md` (1.0.0) and `docs/V1-UPGRADE-AUDIT.md`. Branch: `v1-upgrade`, commit `7958952`._

## Local state (verified green)

| Check | Status |
|---|---|
| `npm run lint` | 0 problems |
| `npm run typecheck` | clean |
| `npm run test` | 15/15 (content, import, progress, search) |
| `npm run content:validate` | 218 resources / 58 skills / 6 staged roadmaps |
| `npm run build` | production build OK, 219 SSG resource pages |
| Prod-server smoke test | 18 routes all 200; JSON-LD, facade, thumbnails, compiled CSS verified |

## To ship

1. **Push & PR** (requires GitHub credentials — not available in the build sandbox):
   ```bash
   cd LearnPath
   git checkout v1-upgrade
   git push -u origin v1-upgrade
   ```
   Then open a PR against the default branch. CI (`.github/workflows/ci.yml`) runs
   install → content:validate → test → lint → build → typecheck (typecheck intentionally
   after build).

2. **Environment variables** (Vercel → Project → Settings → Environment Variables).
   Full list and descriptions in `.env.example`:
   - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (or `file:` DB for local)
   - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (must be the production domain)
   - OAuth: `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`, `DISCORD_CLIENT_ID/SECRET`
   - Email auth: `RESEND_API_KEY` (or configured provider)
   - `NEXT_PUBLIC_DISCORD_INVITE`

3. **Database migrations** — run Drizzle migrations against Turso before first deploy
   traffic (`npm run db:push` or the project's migrate script; see `docs/ARCHITECTURE.md`).

## Post-deploy manual verification (learning loop, desktop + mobile)

- [ ] Sign in with Google / GitHub / Discord / email → session persists on reload
- [ ] Home → pick a roadmap → roadmap graph renders stages, dependency lines, legend
- [ ] Mark a skill started → node state changes; complete → sticky (never downgrades)
- [ ] Learn workspace: tabs (resources / practice / notes), stage bands, prereq rail
- [ ] Click a video → facade replaced by youtube-nocookie iframe; broken video → graceful fallback
- [ ] Practice: run Python (Pyodide), SQL, JS/TS; Monaco loads lazily; textarea fallback if chunk fails
- [ ] Challenge starters contain no solutions (spot-check `sql-loan-count`)
- [ ] Search: `/search` + header palette return grouped hits (roadmaps/skills/resources)
- [ ] `/me`: empty state when signed out; recent skills + completed grid when signed in
- [ ] Progress syncs to DB when signed in, localStorage when signed out; merge on sign-in
- [ ] Mobile: hamburger closes on navigation; roadmap graph scrolls; no horizontal overflow
- [ ] `prefers-reduced-motion` honored (disable animations in OS, re-check hover/motion)
- [ ] Lighthouse spot-check: home, a roadmap, a resource page (a11y ≥ 95 target)

## Known constraints / deferred

- Only `embed_status == "verified"` videos are primary recommendations (YouTube policy).
- No tsx runner in practice engine (by design).
- Dataset ids are immutable — importer skips duplicates (`SKIP_DUPLICATES`), never renames.
- Regenerate imported content after dataset changes: `node scripts/import-resources.mjs`
  then `npm run test` (import gate). Never hand-edit `*.imported.ts` / `skill-wiring.ts`.
