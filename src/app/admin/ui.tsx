"use client";

import { useState } from "react";
import { Badge, Button } from "@/components/ui";

type Row = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  details: string;
  status: string;
};

export function AdminClient({ reports }: { reports: Row[] }) {
  const [rows, setRows] = useState(reports);
  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }
  return (
    <div className="mt-8 space-y-3">
      {!rows.length ? <p className="text-muted">No reports.</p> : null}
      {rows.map((r) => (
        <div key={r.id} className="surface p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{r.targetType}</Badge>
            <Badge tone="accent">{r.reason}</Badge>
            <Badge tone={r.status === "open" ? "danger" : "muted"}>{r.status}</Badge>
          </div>
          <p className="mt-2 font-mono text-xs text-muted">{r.targetId}</p>
          <p className="mt-2 text-sm">{r.details || "No details"}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "reviewed")}>
              Reviewed
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "dismissed")}>
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
