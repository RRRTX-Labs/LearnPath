import { describe, expect, it } from "vitest";
import { isValidEntity } from "@/lib/content";
import { checkRateLimit } from "@/lib/rate-limit";

describe("entity validation security gate", () => {
  it("approves valid roadmap IDs and slugs", () => {
    expect(isValidEntity("roadmap", "python-developer")).toBe(true);
    expect(isValidEntity("roadmap", "ai-engineer")).toBe(true);
  });

  it("approves valid skill IDs and slugs", () => {
    expect(isValidEntity("skill", "python-syntax")).toBe(true);
    expect(isValidEntity("skill", "react-fundamentals")).toBe(true);
  });

  it("approves valid resources, challenges, and projects", () => {
    expect(isValidEntity("resource", "python-docs")).toBe(true);
    expect(isValidEntity("challenge", "py-hello")).toBe(true);
    expect(isValidEntity("project", "py-cli-todo")).toBe(true);
  });

  it("rejects non-existent entity IDs to prevent forged progress injection", () => {
    expect(isValidEntity("skill", "malicious-injected-skill-id")).toBe(false);
    expect(isValidEntity("roadmap", "fake-roadmap")).toBe(false);
    expect(isValidEntity("resource", "bad-resource-12345")).toBe(false);
    expect(isValidEntity("challenge", "fake-challenge")).toBe(false);
    expect(isValidEntity("project", "fake-project")).toBe(false);
    expect(isValidEntity("practice", "fake-practice")).toBe(false);
  });

  it("rejects unknown entity types", () => {
    expect(isValidEntity("admin", "admin-account")).toBe(false);
    expect(isValidEntity("user", "user-id")).toBe(false);
    expect(isValidEntity("../path-traversal", "test")).toBe(false);
  });
});

describe("rate limiter sliding window behavior", () => {
  it("enforces request threshold within the window", () => {
    const key = `sec-test-${Date.now()}`;
    const opts = { windowMs: 2000, max: 2 };

    const first = checkRateLimit(key, opts);
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(1);

    const second = checkRateLimit(key, opts);
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(0);

    const third = checkRateLimit(key, opts);
    expect(third.success).toBe(false);
    expect(third.remaining).toBe(0);
    expect(third.resetMs).toBeGreaterThan(0);
  });
});
