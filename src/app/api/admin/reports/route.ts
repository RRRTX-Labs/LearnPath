import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { reports } from "@/db/schema";
import { getSession, isAdmin } from "@/lib/session";
import { checkRateLimit, createRateLimitExceededResponse } from "@/lib/rate-limit";

export async function GET() {
  await ensureSchema();
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rl = checkRateLimit(`admin-reports-get:${session!.user.id}`, { windowMs: 60 * 1000, max: 60 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  const db = getDb();
  const rows = await db.select().from(reports);
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rl = checkRateLimit(`admin-reports-patch:${session!.user.id}`, { windowMs: 60 * 1000, max: 60 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = z
    .object({ id: z.string().min(1), status: z.enum(["open", "reviewed", "dismissed"]) })
    .safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });

  const db = getDb();
  const existing = await db.select().from(reports).where(eq(reports.id, parsed.data.id));
  if (!existing[0]) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  await db.update(reports).set({ status: parsed.data.status }).where(eq(reports.id, parsed.data.id));

  // Security audit log for administrative modification (no secrets or sensitive data logged)
  console.info(
    `[ADMIN_AUDIT] Admin ${session!.user.id} updated report ${parsed.data.id} status to ${parsed.data.status}`,
  );

  return NextResponse.json({ ok: true });
}
