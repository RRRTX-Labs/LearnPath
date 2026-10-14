import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { progress } from "@/db/schema";
import { getSession } from "@/lib/session";
import { isValidEntity } from "@/lib/content";
import { checkRateLimit, createRateLimitExceededResponse, getClientIp } from "@/lib/rate-limit";

const itemSchema = z.object({
  entityType: z.enum(["roadmap", "skill", "resource", "challenge", "project", "practice"]),
  entityId: z.string().min(1).max(80),
  status: z.enum(["started", "completed"]),
  updatedAt: z.number().optional(),
});

export async function GET(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`progress-get:${session.user.id}:${ip}`, { windowMs: 60 * 1000, max: 120 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  const db = getDb();
  const rows = await db.select().from(progress).where(eq(progress.userId, session.user.id));
  return NextResponse.json(
    rows.map((r) => ({
      entityType: r.entityType,
      entityId: r.entityId,
      status: r.status,
      updatedAt: r.updatedAt.getTime(),
    })),
  );
}

export async function POST(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`progress-post:${session.user.id}`, { windowMs: 60 * 1000, max: 60 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = itemSchema.safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request schema" }, { status: 400 });

  // Validate that the entity actually exists in our content catalog
  if (!isValidEntity(parsed.data.entityType, parsed.data.entityId)) {
    return NextResponse.json(
      { error: `Unknown ${parsed.data.entityType} ID: ${parsed.data.entityId}` },
      { status: 400 },
    );
  }

  const db = getDb();
  const now = new Date(parsed.data.updatedAt ?? Date.now());
  const id = crypto.randomUUID();
  const existing = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.userId, session.user.id),
        eq(progress.entityType, parsed.data.entityType),
        eq(progress.entityId, parsed.data.entityId),
      ),
    );

  if (existing[0]) {
    // Sticky completion: never downgrade from completed to started
    if (existing[0].status === "completed" && parsed.data.status === "started") {
      return NextResponse.json({ ok: true });
    }
    await db
      .update(progress)
      .set({ status: parsed.data.status, updatedAt: now })
      .where(eq(progress.id, existing[0].id));
  } else {
    await db.insert(progress).values({
      id,
      userId: session.user.id,
      entityType: parsed.data.entityType,
      entityId: parsed.data.entityId,
      status: parsed.data.status,
      updatedAt: now,
    });
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`progress-put:${session.user.id}`, { windowMs: 60 * 1000, max: 30 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = z.object({ items: z.array(itemSchema).min(1).max(250) }).safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ error: "Invalid batch payload" }, { status: 400 });

  // Filter out any forged or unknown entity records
  const validItems = parsed.data.items.filter((item) =>
    isValidEntity(item.entityType, item.entityId),
  );

  const db = getDb();
  for (const item of validItems) {
    const now = new Date(item.updatedAt ?? Date.now());
    const existing = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, session.user.id),
          eq(progress.entityType, item.entityType),
          eq(progress.entityId, item.entityId),
        ),
      );
    if (existing[0]) {
      if (existing[0].status === "completed" && item.status === "started") continue;
      await db.update(progress).set({ status: item.status, updatedAt: now }).where(eq(progress.id, existing[0].id));
    } else {
      await db.insert(progress).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        entityType: item.entityType,
        entityId: item.entityId,
        status: item.status,
        updatedAt: now,
      });
    }
  }
  return NextResponse.json({ ok: true, processed: validItems.length });
}
