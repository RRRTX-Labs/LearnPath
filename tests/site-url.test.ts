import { afterEach, describe, expect, it, vi } from "vitest";
import { firstNonEmptyEnv, getSiteUrl } from "@/lib/site-url";

const KEYS = ["NEXT_PUBLIC_APP_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"] as const;

function clearEnv() {
  for (const key of KEYS) vi.stubEnv(key, "");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteUrl (build-safety regression — empty env crashed Vercel builds)", () => {
  it("never throws and falls back to localhost when everything is empty", () => {
    clearEnv();
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("ignores empty and whitespace-only NEXT_PUBLIC_APP_URL (the Vercel bug)", () => {
    clearEnv();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "   ");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("ignores invalid URLs instead of throwing", () => {
    clearEnv();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "not-a-url");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "learnpath.vercel.app");
    expect(getSiteUrl()).toBe("https://learnpath.vercel.app");
  });

  it("prefers an explicit NEXT_PUBLIC_APP_URL and strips paths to an origin", () => {
    clearEnv();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://learnpath.dev/base/");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "learnpath.vercel.app");
    expect(getSiteUrl()).toBe("https://learnpath.dev");
  });

  it("uses the Vercel production domain when no explicit URL is set", () => {
    clearEnv();
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "learnpath-abc.vercel.app");
    expect(getSiteUrl()).toBe("https://learnpath-abc.vercel.app");
  });

  it("falls back to the preview domain, then localhost", () => {
    clearEnv();
    vi.stubEnv("VERCEL_URL", "learnpath-git-fix.vercel.app");
    expect(getSiteUrl()).toBe("https://learnpath-git-fix.vercel.app");
  });

  it("rejects non-http protocols (e.g. file:)", () => {
    clearEnv();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "file:./data/learnpath.db");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});

describe("firstNonEmptyEnv", () => {
  it("returns the first non-empty trimmed value", () => {
    expect(firstNonEmptyEnv("", "  ", "https://a.dev ", undefined)).toBe("https://a.dev");
  });

  it("returns undefined when nothing is usable", () => {
    expect(firstNonEmptyEnv("", undefined, "   ")).toBeUndefined();
  });
});
