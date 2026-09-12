import { afterEach, describe, expect, it, vi } from "vitest";
import { envOr, firstNonEmptyEnv } from "@/lib/env";
import { resolveDbUrl } from "@/db";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("envOr", () => {
  it("skips empty and whitespace values", () => {
    expect(envOr("fallback", "", "   ", undefined)).toBe("fallback");
  });

  it("returns the first usable value, trimmed", () => {
    expect(envOr("fallback", "", " https://a.dev ")).toBe("https://a.dev");
  });
});

describe("firstNonEmptyEnv", () => {
  it("returns undefined when nothing is usable", () => {
    expect(firstNonEmptyEnv("", "  ", undefined)).toBeUndefined();
  });
});

describe("resolveDbUrl (Vercel crash regression: empty TURSO_DATABASE_URL)", () => {
  it("falls back to the local file db when the env var is empty", () => {
    vi.stubEnv("TURSO_DATABASE_URL", "");
    vi.stubEnv("VERCEL", "");
    expect(resolveDbUrl()).toBe("file:./data/learnpath.db");
  });

  it("falls back to /tmp on Vercel (read-only runtime FS)", () => {
    vi.stubEnv("TURSO_DATABASE_URL", "   ");
    vi.stubEnv("VERCEL", "1");
    expect(resolveDbUrl()).toBe("file:/tmp/learnpath.db");
  });

  it("uses the configured remote URL, trimmed", () => {
    vi.stubEnv("TURSO_DATABASE_URL", " libsql://learnpath-org.turso.io ");
    vi.stubEnv("VERCEL", "1");
    expect(resolveDbUrl()).toBe("libsql://learnpath-org.turso.io");
  });
});
