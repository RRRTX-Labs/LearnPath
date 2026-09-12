import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoadmapGraph } from "@/components/roadmap-graph";
import { Badge, ButtonLink } from "@/components/ui";
import { roadmapBySlug, skillById } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { roadmaps } = await import("@/lib/content");
  return roadmaps.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = roadmapBySlug.get(slug);
  if (!roadmap) return {};
  return { title: roadmap.title, description: roadmap.description };
}

export default async function RoadmapDetailPage({ params }: Props) {
  const { slug } = await params;
  const roadmap = roadmapBySlug.get(slug);
  if (!roadmap) notFound();
  const skills = Object.fromEntries(roadmap.nodes.map((n) => [n.skillId, skillById.get(n.skillId)!]));
  const first = roadmap.nodes[0];
  const firstSkill = skillById.get(first.skillId)!;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">{roadmap.category}</p>
      <h1 className="mt-2 font-display text-5xl">{roadmap.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{roadmap.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="accent">{roadmap.difficulty}</Badge>
        <Badge>~{roadmap.estimatedHours} hours</Badge>
        <Badge>{roadmap.nodes.length} skills</Badge>
      </div>
      <div className="mt-6">
        <ButtonLink href={`/learn/${roadmap.slug}/${firstSkill.slug}`}>Start with {firstSkill.title}</ButtonLink>
      </div>
      <h2 className="mt-12 font-display text-3xl">Path</h2>
      <p className="mt-2 text-sm text-muted">Required nodes are solid. Optional nodes are dashed. Click a skill to open the workspace.</p>
      <div className="mt-6">
        <RoadmapGraph roadmap={roadmap} skills={skills} />
      </div>
      <ol className="mt-10 space-y-3">
        {roadmap.nodes.map((n, i) => {
          const skill = skillById.get(n.skillId)!;
          return (
            <li key={n.id} className="surface flex items-start justify-between gap-4 p-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {String(i + 1).padStart(2, "0")} · {n.tier} · {n.requirement}
                </p>
                <Link href={`/learn/${roadmap.slug}/${skill.slug}`} className="font-display text-2xl hover:text-primary">
                  {skill.title}
                </Link>
                <p className="text-sm text-muted">{skill.summary}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
