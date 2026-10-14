import { describe, expect, it } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

describe("rate limiter", () => {
  it("allows requests under the limit", () => {
    const key = `test-ip-${Date.now()}`;
    const result1 = checkRateLimit(key, { windowMs: 1000, max: 3 });
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = checkRateLimit(key, { windowMs: 1000, max: 3 });
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = checkRateLimit(key, { windowMs: 1000, max: 3 });
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("blocks requests over the limit", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, { windowMs: 1000, max: 5 });
    }
    const blocked = checkRateLimit(key, { windowMs: 1000, max: 5 });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });

  it("extracts client IP from x-forwarded-for header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("falls back to x-real-ip if forwarded is absent", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "198.51.100.22" },
    });
    expect(getClientIp(req)).toBe("198.51.100.22");
  });
});
