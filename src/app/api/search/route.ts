import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/search";
import { checkRateLimit, createRateLimitExceededResponse, getClientIp } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`search:${ip}`, { windowMs: 60 * 1000, max: 120 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 100);
  return NextResponse.json(searchCatalog(q));
}
