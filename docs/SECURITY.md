# Security

## Threat model (V1)

| Asset | Adversary | Threat | Mitigation |
|---|---|---|---|
| Sessions | Network attacker | Cookie theft | HTTPS, Secure, HTTP-only, SameSite=Lax |
| OAuth | CSRF / open redirect | Account takeover | Provider `state`, allowlisted callback, exact redirect URI |
| Account linking | Email attacker | Takeover via unverified email | Link only verified identities; no silent link |
| Notes / reports | XSS | Stored XSS | Treat as untrusted text; no `dangerouslySetInnerHTML` |
| Markdown later | XSS / HTML smuggling | Script execution | Sanitizer allowlist if Markdown lands |
| Progress API | Forged requests | Write others’ progress | Session required; userId from session only |
| Admin | Hidden-route crawler | Privilege | Server role check on every admin loader/action |
| Practice code | Malicious learner | XSS, crypto miner, CSRF to parent | iframe sandbox without allow-same-origin; origin checks on postMessage; timeouts |
| Pyodide | Malicious Python | Escape to parent | Worker isolation; no shared memory with privileged code |
| Uploads | Malware | RCE | No user file uploads in V1 |
| YouTube | Policy / legal | TOS violation | Official embed only |
| Secrets | Repo leak | Credential dump | `.env*` gitignored; `.env.example` placeholders |
| Dependency XSS | Supply chain | Compromised package | lockfile, GitHub Dependabot later |

## Code execution rules

1. Never `eval` user code on the server.
2. Never send user code to a third-party runner in V1.
3. Timeouts: 3s JS, 8s Python, 3s SQL.
4. No network from sandboxes.
5. Output size capped.

## Headers

- `Referrer-Policy: strict-origin-when-cross-origin` (YouTube identity **and** privacy)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy` camera/mic disabled

CSP in V1 is report-optional: YouTube, jsDelivr (Pyodide/sql.js/Monaco CDN), Google fonts not needed (`next/font`). A strict nonce CSP is a V1.1 hardening task — do not ship a CSP that breaks embeds.

## Authz checklist

- `/admin` and `/api/admin/*`: `role === "admin"`
- `/api/progress`, `/api/notes`: session user
- Reports: session user
- Public content: no auth

## Disclosure

See `SECURITY.md` in the repo root.
