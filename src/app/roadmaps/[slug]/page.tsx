import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoadmapGraph } from "@/components/roadmap-graph";
import { RoadmapProgress, RoadmapTick } from "@/components/roadmap-progress";
import { Badge, ButtonLink, Container } from "@/components/ui";
import { resourceById, roadmapBySlug, skillById } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { roadmaps } = await import("@/lib/content");
  return roadmaps.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = roadmapBySlug.get(slug);
  if (!roadmap) return {};
  return {
    title: `${roadmap.title} roadmap`,
    description: roadmap.description,
    alternates: { canonical: `/roadmaps/${roadmap.slug}` },
  };
}

export default async function RoadmapDetailPage({ params }: Props) {
  const { slug } = await params;
  const roadmap = roadmapBySlug.get(slug);
  if (!roadmap) notFound();
  const skills = Object.fromEntries(roadmap.nodes.map((n) => [n.skillId, skillById.get(n.skillId)!]));
  const first = roadmap.nodes[0];
  const firstSkill = skillById.get(first.skillId)!;

  return (
    <Container className="py-12">
      <p className="eyebrow">{roadmap.category} roadmap</p>
      <h1 className="mt-2 font-display text-4xl md:text-6xl">{roadmap.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{roadmap.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge tone="accent">{roadmap.difficulty}</Badge>
        <Badge>~{roadmap.estimatedHours} hours</Badge>
        <Badge>{roadmap.stages.length} stages</Badge>
        <Badge>{roadmap.nodes.length} skills</Badge>
        {roadmap.prerequisites.length ? (
          <Badge tone="warning">after: {roadmap.prerequisites.join(", ")}</Badge>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <ButtonLink href={`/learn/${roadmap.slug}/${firstSkill.slug}`} size="lg">
          Start with {firstSkill.title}
        </ButtonLink>
        <RoadmapProgress roadmap={roadmap} />
      </div>

      <h2 className="mt-14 font-display text-3xl">The path</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Stages run top to bottom; skills inside a stage can be taken in any order unless a line says
        otherwise. Locked nodes need their required predecessor first.
      </p>
      <div className="mt-6">
        <RoadmapGraph roadmap={roadmap} skills={skills} />
      </div>

      <div className="mt-14 space-y-12">
        {roadmap.stages.map((stage, i) => (
          <section key={stage.id} aria-labelledby={`stage-${stage.id}`}>
            <div className="flex items-baseline gap-3">
              <span className="meta text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 id={`stage-${stage.id}`} className="font-display text-2xl">
                {stage.title.replace(/^\d+\s·\s/, "")}
              </h3>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted">{stage.summary}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {stage.nodeIds.map((nid) => {
                const node = roadmap.nodes.find((n) => n.id === nid);
                const skill = node ? skillById.get(node.skillId) : undefined;
                if (!node || !skill) return null;
                const best = resourceById.get(skill.resources.best);
                return (
                  <li key={nid}>
                    <Link
                      href={`/learn/${roadmap.slug}/${skill.slug}`}
                      className="group surface card-hover flex items-start gap-3 rounded-lg p-4"
                    >
                      <RoadmapTick skillId={skill.id} />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-medium transition-colors group-hover:text-primary">
                            {skill.title}
                          </span>
                          {node.requirement !== "required" ? <Badge>{node.requirement}</Badge> : null}
                        </span>
                        <span className="mt-1 block truncate text-sm text-muted">{skill.summary}</span>
                        <span className="meta mt-1 block">
                          {best ? `starts with: ${best.provider}` : "docs-led"} · {node.tier}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}

