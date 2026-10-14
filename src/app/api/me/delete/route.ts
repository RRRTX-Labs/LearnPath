import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { account, notes, progress, session as sessionTable, user } from "@/db/schema";
import { getSession } from "@/lib/session";
import { checkRateLimit, createRateLimitExceededResponse, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`delete-account:${session.user.id}:${ip}`, { windowMs: 60 * 1000, max: 3 });
  if (!rl.success) return createRateLimitExceededResponse(rl.limit, rl.resetMs);

  const db = getDb();
  const userId = session.user.id;

  // Cascade deletion of all user records
  await db.delete(notes).where(eq(notes.userId, userId));
  await db.delete(progress).where(eq(progress.userId, userId));
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
  await db.delete(account).where(eq(account.userId, userId));
  await db.delete(user).where(eq(user.id, userId));

  return NextResponse.json({ ok: true, message: "Account and data successfully deleted" });
}
