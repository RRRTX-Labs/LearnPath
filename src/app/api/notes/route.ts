import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { notes } from "@/db/schema";
import { getSession } from "@/lib/session";
import { skillById, skillBySlug } from "@/lib/content";
import { checkRateLimit, createRateLimitExceededResponse } from "@/lib/rate-limit";

export async function GET() {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`notes-get:${session.user.id}`, { windowMs: 60 * 1000, max: 120 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  const db = getDb();
  const rows = await db.select().from(notes).where(eq(notes.userId, session.user.id));
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.skillId, r.body])));
}

export async function POST(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`notes-post:${session.user.id}`, { windowMs: 60 * 1000, max: 60 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = z
    .object({ skillId: z.string().min(1).max(80), body: z.string().max(20000) })
    .safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // Validate skillId exists in the catalog
  const skillExists = skillById.has(parsed.data.skillId) || skillBySlug.has(parsed.data.skillId);
  if (!skillExists) {
    return NextResponse.json({ error: "Skill not found in catalog" }, { status: 404 });
  }

  const db = getDb();
  const now = new Date();
  const existing = await db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, session.user.id), eq(notes.skillId, parsed.data.skillId)));

  const body = parsed.data.body;
  if (existing[0]) {
    await db.update(notes).set({ body, updatedAt: now }).where(eq(notes.id, existing[0].id));
  } else {
    await db.insert(notes).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      skillId: parsed.data.skillId,
      body,
      updatedAt: now,
    });
  }
  return NextResponse.json({ ok: true });
}
