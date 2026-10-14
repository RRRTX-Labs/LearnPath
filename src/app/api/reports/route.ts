import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { reports } from "@/db/schema";
import { getSession } from "@/lib/session";
import { checkRateLimit, createRateLimitExceededResponse, getClientIp } from "@/lib/rate-limit";
import { isValidEntity } from "@/lib/content";

export async function POST(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Sign in to report" }, { status: 401 });

  // Rate limit reports to prevent spam flooding the admin queue
  const ip = getClientIp(req);
  const rl = checkRateLimit(`report-post:${session.user.id}:${ip}`, { windowMs: 15 * 60 * 1000, max: 10 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = z
    .object({
      targetType: z.enum(["resource", "challenge", "project", "other"]),
      targetId: z.string().min(1).max(80),
      reason: z.enum(["broken", "inaccurate", "spam", "policy", "other"]),
      details: z.string().max(2000).default(""),
    })
    .safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });

  // If targetType corresponds to a catalog item, verify it
  if (parsed.data.targetType !== "other") {
    if (!isValidEntity(parsed.data.targetType, parsed.data.targetId)) {
      return NextResponse.json({ error: "Report target not found in catalog" }, { status: 400 });
    }
  }

  const db = getDb();
  await db.insert(reports).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    targetType: parsed.data.targetType,
    targetId: parsed.data.targetId,
    reason: parsed.data.reason,
    details: parsed.data.details,
    status: "open",
    createdAt: new Date(),
  });
  return NextResponse.json({ ok: true });
}
