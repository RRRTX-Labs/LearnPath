"use client";

import { Button } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  // Never surface raw error text: it can leak internals. Details stay in the
  // server/browser console.
  if (typeof window !== "undefined") console.error(error);
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <p className="eyebrow">Unexpected detour</p>
      <h1 className="mt-2 font-display text-4xl">Something broke on our side</h1>
      <p className="mt-3 text-muted">
        The page hit an unexpected error. Your progress is safe — it lives in your browser and, if you
        are signed in, on your account.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
