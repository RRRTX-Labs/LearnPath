import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/resource-card";
import { Badge, ButtonLink } from "@/components/ui";
import { challengeById, projectById, resourcesForSkill, roadmaps, skillBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { skills } = await import("@/lib/content");
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = skillBySlug.get((await params).slug);
  return skill ? { title: skill.title, description: skill.summary } : {};
}

export default async function SkillPage({ params }: Props) {
  const skill = skillBySlug.get((await params).slug);
  if (!skill) notFound();
  const resources = resourcesForSkill(skill);
  const parent = roadmaps.find((r) => r.nodes.some((n) => n.skillId === skill.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">Skill</p>
      <h1 className="mt-2 font-display text-5xl">{skill.title}</h1>
      <p className="mt-4 text-lg text-muted">{skill.summary}</p>
      {parent ? (
        <p className="mt-3 text-sm text-muted">
          Part of{" "}
          <Link className="text-primary" href={`/roadmaps/${parent.slug}`}>
            {parent.title}
          </Link>
        </p>
      ) : null}
      <div className="mt-6">
        {parent ? (
          <ButtonLink href={`/learn/${parent.slug}/${skill.slug}`}>Open learning workspace</ButtonLink>
        ) : null}
      </div>
      <h2 className="mt-12 font-display text-3xl">Objectives</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        {skill.objectives.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      {skill.prerequisites.length ? (
        <div className="mt-8">
          <h2 className="font-display text-3xl">Prerequisites</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skill.prerequisites.map((id) => (
              <Badge key={id}>{id}</Badge>
            ))}
          </div>
        </div>
      ) : null}
      <h2 className="mt-12 font-display text-3xl">Resources</h2>
      <p className="mt-2 text-sm text-muted">
        Scores are LearnPath editorial opinions (clarity, cost, freshness, project density) — not an objective ranking.
      </p>
      <div className="mt-6 grid gap-4">
        {resources.map(({ slot, resource }) => (
          <ResourceCard key={resource.id} resource={resource} slot={slot} />
        ))}
      </div>
      {skill.challengeIds.length ? (
        <div className="mt-10">
          <h2 className="font-display text-3xl">Challenges</h2>
          <ul className="mt-3 space-y-2">
            {skill.challengeIds.map((id) => {
              const c = challengeById.get(id);
              if (!c) return null;
              return (
                <li key={id}>
                  <Link className="text-primary" href={`/challenges/${c.slug}`}>
                    {c.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {skill.projectIds.length ? (
        <div className="mt-10">
          <h2 className="font-display text-3xl">Projects</h2>
          <ul className="mt-3 space-y-2">
            {skill.projectIds.map((id) => {
              const p = projectById.get(id);
              if (!p) return null;
              return (
                <li key={id}>
                  <Link className="text-primary" href={`/projects/${p.slug}`}>
                    {p.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
