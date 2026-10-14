"use client";

import { Download, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button, ButtonLink, buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";

export function ProfileClient() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  if (isPending) return <p className="mt-6 text-muted">Loading…</p>;
  if (!session?.user) {
    return (
      <div className="mt-6 surface p-6 rounded-lg">
        <p className="text-muted">You are currently browsing anonymously.</p>
        <p className="mt-2 text-sm text-muted">
          Sign in to automatically sync and preserve your learning progress, notes, and challenges across devices.
        </p>
        <ButtonLink href="/sign-in" className="mt-4">
          Sign in or create account
        </ButtonLink>
      </div>
    );
  }

  async function handleDeleteAccount() {
    setBusy(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/me/delete", { method: "POST" });
      if (res.ok) {
        await authClient.signOut();
        router.push("/");
      } else {
        setStatusMsg("Failed to delete account. Please try again.");
      }
    } catch {
      setStatusMsg("A network error occurred.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="surface p-6 rounded-lg space-y-4">
        <div>
          <span className="eyebrow">Learner Profile</span>
          <p className="mt-1 font-display text-2xl">{session.user.name}</p>
          <p className="text-sm text-muted">{session.user.email}</p>
        </div>

        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </Button>
        </div>
      </div>

      {/* Privacy & data ownership section */}
      <div className="surface p-6 rounded-lg space-y-4">
        <h2 className="font-display text-xl">Data ownership & privacy</h2>
        <p className="text-sm text-muted">
          Under GDPR, CCPA, and India&apos;s DPDP Act, you have the full right to download or permanently delete
          all your personal data, notes, and learning records at any time.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/api/me/export"
            download
            className={cn(buttonStyles({ variant: "subtle", size: "sm" }))}
          >
            <Download className="h-4 w-4" aria-hidden /> Download my data (.json)
          </a>

          {!confirmDelete ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-danger hover:border-danger/40"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" aria-hidden /> Delete account
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={busy}
                onClick={handleDeleteAccount}
              >
                {busy ? "Deleting…" : "Confirm permanent deletion"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        {statusMsg ? <p className="text-sm text-danger">{statusMsg}</p> : null}
      </div>
    </div>
  );
}
