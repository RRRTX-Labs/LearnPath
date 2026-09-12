import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/resource-library";
import { Container } from "@/components/ui";
import { resources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resource library",
  description:
    "Every free resource LearnPath curates — verified for availability and embed permission, scored editorially, filterable by topic, type and level.",
};

function label(id: string) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const counts = new Map<string, number>();
  for (const r of resources) for (const t of r.topics) counts.set(t, (counts.get(t) ?? 0) + 1);
  const topics = [...counts.entries()]
    .map(([id, count]) => ({ id, label: label(id), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 40);

  return (
    <Container className="py-12">
      <p className="eyebrow">Library</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Every curated resource</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Free resources only. Scores are LearnPath editorial opinions — clarity, cost, freshness,
        project density — never “the best on the internet”. YouTube items are embedded officially and
        checked for embed permission; nothing is rehosted.
      </p>
      <div className="mt-8">
        <ResourceLibrary resources={resources} topics={topics} initialTopic={topic} />
      </div>
    </Container>
  );
}
