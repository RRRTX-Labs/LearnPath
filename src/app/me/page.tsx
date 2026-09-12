import type { Metadata } from "next";
import { MeClient } from "./ui";

export const metadata: Metadata = { title: "My learning" };

export default function MePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">Progress</p>
      <h1 className="mt-2 font-display text-4xl">My learning</h1>
      <p className="mt-3 text-muted">
        Anonymous progress lives in this browser. Sign in to keep it across devices.
      </p>
      <MeClient />
    </div>
  );
}
