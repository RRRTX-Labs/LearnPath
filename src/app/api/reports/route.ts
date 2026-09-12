import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { reports } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  await ensureSchema();
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Sign in to report" }, { status: 401 });
  const parsed = z
    .object({
      targetType: z.enum(["resource", "challenge", "project", "other"]),
      targetId: z.string().min(1).max(80),
      reason: z.enum(["broken", "inaccurate", "spam", "policy", "other"]),
      details: z.string().max(2000).default(""),
    })
    .safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
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
