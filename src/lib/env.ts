/**
 * Env-var helpers.
 *
 * Vercel lets you create an env var with an EMPTY value. `process.env.X ?? fallback`
 * does NOT catch that ("" is not nullish), which twice crashed production builds
 * (`new URL("")` in metadata, `createClient({ url: "" })` in db). Rule: never use
 * `??` directly on `process.env` — always go through these helpers.
 */

/** First non-empty (after trim) value; undefined if none is usable. */
export function firstNonEmptyEnv(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = typeof value === "string" ? value.trim() : undefined;
    if (trimmed) return trimmed;
  }
  return undefined;
}

/** First non-empty value, or `fallback` when none is usable. */
export function envOr(fallback: string, ...values: (string | undefined)[]): string {
  return firstNonEmptyEnv(...values) ?? fallback;
}
