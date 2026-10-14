import { NextResponse } from "next/server";

type RateLimitOptions = {
  windowMs: number; // Duration of window in milliseconds
  max: number;      // Maximum number of requests allowed in window
};

type RateLimitEntry = {
  timestamps: number[];
};

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const threshold = now - windowMs;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > threshold);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * In-memory sliding-window rate limiter for serverless & edge routes.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, max: 60 },
): { success: boolean; limit: number; remaining: number; resetMs: number } {
  const now = Date.now();
  cleanupStaleEntries(options.windowMs);

  const windowStart = now - options.windowMs;
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside current sliding window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= options.max) {
    const oldestInWindow = entry.timestamps[0];
    const resetMs = Math.max(0, oldestInWindow + options.windowMs - now);
    return {
      success: false,
      limit: options.max,
      remaining: 0,
      resetMs,
    };
  }

  entry.timestamps.push(now);
  const remaining = options.max - entry.timestamps.length;
  const resetMs = options.windowMs;

  return {
    success: true,
    limit: options.max,
    remaining,
    resetMs,
  };
}

/**
 * Extracts best-effort client IP from standard proxy headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "anonymous-client";
}

/**
 * Standard 429 Too Many Requests response with RFC-compliant headers.
 */
export function createRateLimitExceededResponse(limit: number, resetMs: number): NextResponse {
  const retryAfterSec = Math.ceil(resetMs / 1000);
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil((Date.now() + resetMs) / 1000)),
      },
    },
  );
}
