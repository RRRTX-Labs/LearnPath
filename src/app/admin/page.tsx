import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminClient } from "./ui";
import { getSession, isAdmin } from "@/lib/session";
import { ensureSchema } from "@/db/ensure";
import { getDb } from "@/db";
import { reports } from "@/db/schema";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await ensureSchema();
  const session = await getSession();
  if (!isAdmin(session)) redirect("/sign-in");
  const db = getDb();
  const rows = await db.select().from(reports);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">Internal</p>
      <h1 className="mt-2 font-display text-4xl">Admin</h1>
      <p className="mt-3 text-muted">
        Canonical curriculum still lives in Git. This queue is for reports and operational overrides.
      </p>
      <AdminClient
        reports={rows.map((r) => ({
          id: r.id,
          targetType: r.targetType,
          targetId: r.targetId,
          reason: r.reason,
          details: r.details,
          status: r.status,
        }))}
      />
    </div>
  );
}
