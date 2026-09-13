# Auth Setup — Google, GitHub, Discord, Email

LearnPath uses **Better Auth** with server-side OAuth 2.0 authorization-code flows.
There are **no fake provider buttons**: a provider button only renders when its
credentials are configured (`src/lib/auth-providers.ts`), in dev and production alike.

> **Never paste secrets into chat, issues, or commits.** Everything below lives in
> environment variables only. `.env.local` is git-ignored; Vercel stores production values.

## Environment variables

| Variable | Required for | Example |
|---|---|---|
| `BETTER_AUTH_SECRET` | session signing (all modes) | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | base URL for callbacks | `http://localhost:3000` / `https://your.domain` |
| `NEXT_PUBLIC_APP_URL` | canonical site URL (SEO, trusted origins) | same as above |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login | from Google Cloud Console |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub login | from GitHub OAuth app |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Discord login | from Discord Developer Portal |

Email/password login needs no provider config — it is enabled by default and stores
credentials hashed via Better Auth (Turso/libSQL through Drizzle).

## Callback URLs (exact)

Better Auth mounts its routes under `/api/auth`. Register **exactly** these redirects:

| Provider | Local | Production |
|---|---|---|
| Google | `http://localhost:3000/api/auth/callback/google` | `https://<domain>/api/auth/callback/google` |
| GitHub | `http://localhost:3000/api/auth/callback/github` | `https://<domain>/api/auth/callback/github` |
| Discord | `http://localhost:3000/api/auth/callback/discord` | `https://<domain>/api/auth/callback/discord` |

Vercel previews get their own hostname; add each preview domain you intend to test,
or test auth on the production domain.

## Google

1. Google Cloud Console → create/select a project → **APIs & Services → OAuth consent screen**
   (External, fill app name + support email; publish or add test users).
2. **Credentials → Create Credentials → OAuth client ID → Web application**.
3. Authorized JavaScript origins: your site origin. Authorized redirect URIs: the
   Google callback above.
4. Copy Client ID/Secret into env vars.

Notes (verified against current Google docs):
- The old **Google Sign-In JavaScript platform library is deprecated**; new client IDs
  cannot use it, and FedCM becomes mandatory for browser-side flows. LearnPath does **not**
  use that library — Better Auth performs the standard **server-side OAuth code flow**,
  which is the currently recommended pattern for web apps. No GIS/FedCM work is required.
- If Google shows "Access blocked: redirect_uri_mismatch", the registered redirect URI
  does not exactly match the callback above (scheme, host, port, path all matter).

## GitHub

1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**.
2. Homepage URL: your site. Authorization callback URL: the GitHub callback above.
3. Generate a client secret; set both env vars.
4. Scopes: Better Auth requests `user:email` (public profile + email) — no repo scopes.

## Discord

1. Discord Developer Portal → **Applications → New Application**.
2. OAuth2 → General → add redirect: the Discord callback above.
3. Copy Client ID / Client Secret into env vars.
4. Scope used at login: `identify` (+ email if configured) — this is **login only**.
   It does not join users to any server and creates no bot. See `docs/DISCORD-SETUP.md`
   for the difference between OAuth login, a Discord server, and a bot.

## Local quickstart

```bash
cp .env.example .env.local
# fill BETTER_AUTH_SECRET (openssl rand -base64 32) and any providers you want
npm run dev
```

Sign-in page shows only the providers you configured, plus email/password.

## Common failures

| Symptom | Cause / fix |
|---|---|
| Provider button missing | Env vars for it are empty — intentional, by design. |
| `redirect_uri_mismatch` / `invalid redirect_uri` | Callback URL typo or missing preview domain (see table). |
| `state mismatch` / CSRF error | Cookies blocked (Safari ITP on localhost), or `BETTER_AUTH_URL` differs from the serving origin. |
| Sessions lost on reload | `BETTER_AUTH_SECRET` changed between runs, or cookies cleared; also ensure the DB schema exists (`npm run db:push`). |
| OAuth works locally but not on Vercel | Production callback not registered at the provider, or `BETTER_AUTH_URL` still `localhost`. |
| Empty env var crashes | Fixed permanently — `src/lib/env.ts` treats empty strings as unset (`firstNonEmptyEnv`/`envOr`). |
