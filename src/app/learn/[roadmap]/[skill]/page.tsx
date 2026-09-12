import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LearnClient } from "./ui";
import { practiceById, resourceById, roadmapBySlug, skillById, skillBySlug } from "@/lib/content";

type Props = { params: Promise<{ roadmap: string; skill: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill: skillSlug, roadmap: roadmapSlug } = await params;
  const skill = skillBySlug.get(skillSlug);
  const roadmap = roadmapBySlug.get(roadmapSlug);
  return { title: skill && roadmap ? `${skill.title} · ${roadmap.title}` : "Learn" };
}

export default async function LearnPage({ params }: Props) {
  const { roadmap: roadmapSlug, skill: skillSlug } = await params;
  const roadmap = roadmapBySlug.get(roadmapSlug);
  const skill = skillBySlug.get(skillSlug);
  if (!roadmap || !skill) notFound();
  if (!roadmap.nodes.some((n) => n.skillId === skill.id)) notFound();

  const idx = roadmap.nodes.findIndex((n) => n.skillId === skill.id);
  const prev = idx > 0 ? skillById.get(roadmap.nodes[idx - 1].skillId) : null;
  const next = idx < roadmap.nodes.length - 1 ? skillById.get(roadmap.nodes[idx + 1].skillId) : null;
  const best = resourceById.get(skill.resources.best);
  const alt = skill.resources.alternative ? resourceById.get(skill.resources.alternative) : undefined;
  const practice = skill.practiceId ? practiceById.get(skill.practiceId) : undefined;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <p className="eyebrow">
        <Link href={`/roadmaps/${roadmap.slug}`}>{roadmap.title}</Link>
        {" / "}
        {skill.title}
      </p>
      <LearnClient
        roadmapSlug={roadmap.slug}
        roadmapTitle={roadmap.title}
        skill={skill}
        nodes={roadmap.nodes.map((n) => ({
          id: n.id,
          title: skillById.get(n.skillId)!.title,
          slug: skillById.get(n.skillId)!.slug,
          skillId: n.skillId,
        }))}
        prev={prev ? { slug: prev.slug, title: prev.title } : null}
        next={next ? { slug: next.slug, title: next.title } : null}
        best={best ?? null}
        altHref={alt ? `/resources/${alt.id}` : undefined}
        practice={practice ?? null}
      />
    </div>
  );
}
