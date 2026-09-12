import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { roadmaps } from "@/lib/content";

export const metadata: Metadata = { title: "Roadmaps" };

export default function RoadmapsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">Catalog</p>
      <h1 className="mt-2 font-display text-4xl">Roadmaps</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Independently authored paths. We do not copy roadmap.sh content. Each node is a skill with curated free
        resources, practice, and something to build.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {roadmaps.map((r) => (
          <Link key={r.id} href={`/roadmaps/${r.slug}`}>
            <Card className="h-full hover:border-primary/40">
              <div className="flex gap-2">
                <Badge>{r.category}</Badge>
                <Badge tone="accent">{r.difficulty}</Badge>
              </div>
              <h2 className="mt-3 font-display text-3xl">{r.title}</h2>
              <p className="mt-2 text-muted">{r.tagline}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                ~{r.estimatedHours} hours · {r.nodes.length} skills
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
