import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { notes } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function GET() {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const rows = await db.select().from(notes).where(eq(notes.userId, session.user.id));
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.skillId, r.body])));
}

export async function POST(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = z
    .object({ skillId: z.string().min(1).max(80), body: z.string().max(20000) })
    .safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const db = getDb();
  const now = new Date();
  const existing = await db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, session.user.id), eq(notes.skillId, parsed.data.skillId)));
  // Notes are rendered as plain text in a controlled <textarea> (React-escaped).
  // Do not "sanitize" here: rewriting user text corrupts notes about HTML/JS.
  // If Markdown rendering ever lands, add a real allowlist sanitizer (docs/SECURITY.md).
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
