"use client";

import { Button } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <h1 className="font-display text-4xl">Something broke</h1>
      <p className="mt-3 text-muted">{error.message || "An unexpected error occurred."}</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
