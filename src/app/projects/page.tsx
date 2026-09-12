import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { projects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Build</p>
      <h1 className="mt-2 font-display text-4xl">Projects</h1>
      <p className="mt-3 text-muted">
        Briefs with requirements and starter files. V1 tracks started/completed — it does not auto-grade full apps.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Link key={p.id} href={`/projects/${p.slug}`}>
            <Card className="h-full hover:border-primary/40">
              <div className="flex gap-2">
                <Badge>{p.language}</Badge>
                <Badge tone="accent">{p.difficulty}</Badge>
              </div>
              <h2 className="mt-3 font-display text-2xl">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.summary}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted">~{p.estimatedHours} hours</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
