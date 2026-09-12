import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { reports } from "@/db/schema";
import { getSession, isAdmin } from "@/lib/session";

export async function GET() {
  await ensureSchema();
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = getDb();
  const rows = await db.select().from(reports);
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = z
    .object({ id: z.string(), status: z.enum(["open", "reviewed", "dismissed"]) })
    .safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const db = getDb();
  await db.update(reports).set({ status: parsed.data.status }).where(eq(reports.id, parsed.data.id));
  return NextResponse.json({ ok: true });
}
