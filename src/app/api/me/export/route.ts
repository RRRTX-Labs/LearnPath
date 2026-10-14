import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { notes, progress, reports, user } from "@/db/schema";
import { getSession } from "@/lib/session";
import { checkRateLimit, createRateLimitExceededResponse } from "@/lib/rate-limit";

export async function GET() {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`export:${session.user.id}`, { windowMs: 60 * 1000, max: 5 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  const db = getDb();
  const userRow = await db.select().from(user).where(eq(user.id, session.user.id));
  const progressRows = await db.select().from(progress).where(eq(progress.userId, session.user.id));
  const noteRows = await db.select().from(notes).where(eq(notes.userId, session.user.id));
  const reportRows = await db.select().from(reports).where(eq(reports.userId, session.user.id));

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    user: userRow[0]
      ? {
          id: userRow[0].id,
          name: userRow[0].name,
          email: userRow[0].email,
          createdAt: userRow[0].createdAt,
        }
      : null,
    progress: progressRows.map((p) => ({
      entityType: p.entityType,
      entityId: p.entityId,
      status: p.status,
      updatedAt: p.updatedAt,
    })),
    notes: noteRows.map((n) => ({
      skillId: n.skillId,
      body: n.body,
      updatedAt: n.updatedAt,
    })),
    reports: reportRows.map((r) => ({
      targetType: r.targetType,
      targetId: r.targetId,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt,
    })),
  };

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="learnpath-data-export-${Date.now()}.json"`,
    },
  });
}
