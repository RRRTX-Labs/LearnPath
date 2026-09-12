import type { Metadata } from "next";
import { ResourceCard } from "@/components/resource-card";
import { resources } from "@/lib/content";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Library</p>
      <h1 className="mt-2 font-display text-4xl">Resources</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Free resources only. Editorial scores are LearnPath’s opinion, documented in the content system — never “the
        best on the internet.”
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  );
}
