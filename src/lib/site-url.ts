/**
 * Canonical site URL resolution — build-safe.
 *
 * `new URL("")` throws, and an env var set to an empty string (a common
 * Vercel mistake) used to crash the production build. This helper picks the
 * first *valid* candidate and always returns a parseable http(s) origin, so
 * metadata/robots/sitemap/auth can never take the build down.
 *
 * Precedence:
 * 1. NEXT_PUBLIC_APP_URL        — explicit override (custom domain)
 * 2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's production domain, no config needed
 * 3. VERCEL_URL                 — preview deployment domain
 * 4. http://localhost:3000      — local dev
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "http://localhost:3000",
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") return url.origin;
    } catch {
      continue; // invalid candidate — fall through to the next one
    }
  }
  return "http://localhost:3000";
}

/** First non-empty env value, trimmed; undefined if none is usable. */
export function firstNonEmptyEnv(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}
