"use client";

import { useId, useState } from "react";
import { Button, Textarea } from "./ui";

export function ReportForm({
  targetType,
  targetId,
}: {
  targetType: "resource" | "challenge" | "project";
  targetId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("broken");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [statusTone, setStatusTone] = useState<"muted" | "danger" | "success">("muted");

  const selectId = useId();
  const textareaId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, details }),
      });
      if (res.ok) {
        setMsg("Report sent. Maintainers review reports regularly.");
        setStatusTone("success");
        setDetails("");
        setTimeout(() => setOpen(false), 2500);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMsg(data.error ?? "Sign in to send a report.");
        setStatusTone("danger");
      }
    } catch {
      setMsg("Network error. Please try again later.");
      setStatusTone("danger");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="text-xs text-muted underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        onClick={() => setOpen(true)}
      >
        Report an issue with this {targetType}
      </button>
    );
  }

  return (
    <form className="surface space-y-3 p-4 rounded-lg" onSubmit={submit}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Report this {targetType}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-muted hover:text-fg"
        >
          Cancel
        </button>
      </div>

      <div>
        <label htmlFor={selectId} className="block text-xs font-medium text-muted mb-1">
          Reason for report
        </label>
        <select
          id={selectId}
          className="h-10 w-full rounded-md border border-line bg-bg-sunken px-3 text-sm text-fg focus:border-line-strong focus:outline-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="broken">Broken / unavailable</option>
          <option value="inaccurate">Inaccurate content</option>
          <option value="spam">Spam / affiliate / paywall</option>
          <option value="policy">Policy / copyright concern</option>
          <option value="other">Other issue</option>
        </select>
      </div>

      <div>
        <label htmlFor={textareaId} className="block text-xs font-medium text-muted mb-1">
          Details (optional)
        </label>
        <Textarea
          id={textareaId}
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="What broke or changed?"
          maxLength={2000}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send report"}
        </Button>
        {msg ? (
          <p className={`text-xs ${statusTone === "danger" ? "text-danger" : statusTone === "success" ? "text-success" : "text-muted"}`}>
            {msg}
          </p>
        ) : null}
      </div>
    </form>
  );
}
