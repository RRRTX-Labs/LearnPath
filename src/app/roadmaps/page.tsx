import type { Metadata } from "next";
import Link from "next/link";
import { RoadmapCard } from "@/components/roadmap-card";
import { Container, EmptyState } from "@/components/ui";
import { Tabs } from "@/components/ui-client";
import { roadmaps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Roadmaps",
  description:
    "Independently authored, staged learning roadmaps. Every node is a skill with verified free resources, practice and something to build.",
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & data" },
  { id: "web", label: "Web" },
  { id: "language", label: "Languages" },
  { id: "security", label: "Security" },
];

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = CATEGORIES.some((c) => c.id === category) ? (category as string) : "all";
  const list = active === "all" ? roadmaps : roadmaps.filter((r) => r.category === active);

  return (
    <Container className="py-12">
      <p className="eyebrow">Catalog</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Roadmaps</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Independently authored paths — we do not copy roadmap.sh content. Each roadmap is a staged
        graph: every node is a skill with curated free resources, in-browser practice, and something
        concrete to build.
      </p>
      <Tabs tabs={CATEGORIES} active={active} hrefBase="/roadmaps" label="Filter roadmaps by field" className="mt-8" />
      {list.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <RoadmapCard key={r.id} roadmap={r} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No roadmaps in this field yet"
            body="The catalog is small on purpose and grows through reviewed pull requests. Try another field, or propose a roadmap on GitHub."
            action={
              <Link href="/open-source" className="text-sm text-primary hover:underline">
                Propose a roadmap
              </Link>
            }
          />
        </div>
      )}
    </Container>
  );
}
