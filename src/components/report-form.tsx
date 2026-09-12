"use client";

import { useState } from "react";
import { Button, Textarea } from "./ui";

export function ReportForm({ targetType, targetId }: { targetType: "resource" | "challenge" | "project"; targetId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("broken");
  const [details, setDetails] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, reason, details }),
    });
    setMsg(res.ok ? "Report sent. Thank you." : "Sign in to send a report.");
  }

  if (!open) {
    return (
      <button type="button" className="text-xs text-muted underline-offset-2 hover:underline" onClick={() => setOpen(true)}>
        Report an issue
      </button>
    );
  }

  return (
    <div className="surface space-y-2 p-4">
      <p className="text-sm font-medium">Report this {targetType}</p>
      <select
        className="h-10 w-full rounded-[10px] border border-border bg-bg-sunken px-2 text-sm"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="broken">Broken / unavailable</option>
        <option value="inaccurate">Inaccurate</option>
        <option value="spam">Spam / affiliate junk</option>
        <option value="policy">Policy concern</option>
        <option value="other">Other</option>
      </select>
      <Textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="What happened?" />
      <Button size="sm" onClick={submit}>
        Send
      </Button>
      {msg ? <p className="text-xs text-muted">{msg}</p> : null}
    </div>
  );
}
