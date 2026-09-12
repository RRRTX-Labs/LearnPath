import { ArrowRight, Hammer, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/resource-card";
import { Badge, ButtonLink, Container, SectionHeader } from "@/components/ui";
import {
  challengeById,
  projectById,
  resourcesForSkill,
  roadmaps,
  skillById,
  skillBySlug,
} from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { skills } = await import("@/lib/content");
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = skillBySlug.get((await params).slug);
  return skill
    ? { title: skill.title, description: skill.summary, alternates: { canonical: `/skills/${skill.slug}` } }
    : {};
}

export default async function SkillPage({ params }: Props) {
  const skill = skillBySlug.get((await params).slug);
  if (!skill) notFound();
  const slotted = resourcesForSkill(skill);
  const parents = roadmaps.filter((r) => r.nodes.some((n) => n.skillId === skill.id));

  return (
    <Container className="max-w-5xl py-12">
      <p className="eyebrow">Skill</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{skill.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{skill.summary}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {parents.map((p) => (
          <ButtonLink key={p.id} href={`/learn/${p.slug}/${skill.slug}`}>
            Open learning workspace <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        ))}
        {parents.map((p) => (
          <Link key={p.id} href={`/roadmaps/${p.slug}`} className="text-sm text-primary hover:underline">
            in {p.title}
          </Link>
        ))}
      </div>

      {skill.prerequisites.length ? (
        <section className="mt-10" aria-labelledby="prereq">
          <h2 id="prereq" className="eyebrow">
            Do these first
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skill.prerequisites.map((id) => {
              const pre = skillById.get(id);
              return pre ? (
                <Link key={id} href={`/skills/${pre.slug}`}>
                  <Badge tone="warning" className="hover:border-warning/60">
                    {pre.title}
                  </Badge>
                </Link>
              ) : null;
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-10" aria-labelledby="objectives">
        <h2 id="objectives" className="font-display text-2xl">
          What you will be able to do
        </h2>
        <ul className="mt-3 space-y-2">
          {skill.objectives.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="resources">
        <SectionHeader eyebrow="Curated resources" title="Start with the pick, then branch out" />
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Scores are LearnPath editorial opinions (clarity, cost, freshness, project density) — not an
          objective ranking. Every YouTube item is embedded officially after a click-to-load facade.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {slotted.map(({ slot, resource }) => (
            <ResourceCard key={`${slot}-${resource.id}`} resource={resource} slot={slot} />
          ))}
        </div>
      </section>

      {skill.challengeIds.length || skill.projectIds.length ? (
        <section className="mt-12 grid gap-4 md:grid-cols-2" aria-labelledby="apply">
          <h2 id="apply" className="sr-only">
            Apply it
          </h2>
          {skill.challengeIds.length ? (
            <div className="surface rounded-lg p-5">
              <p className="eyebrow flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5" aria-hidden /> Challenges
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {skill.challengeIds.map((id) => {
                  const c = challengeById.get(id);
                  if (!c) return null;
                  return (
                    <li key={id}>
                      <Link className="text-primary hover:underline" href={`/challenges/${c.slug}`}>
                        {c.title}
                      </Link>
                      <span className="meta block">
                        {c.language} · ~{c.estimatedMinutes} min
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {skill.projectIds.length ? (
            <div className="surface rounded-lg p-5">
              <p className="eyebrow flex items-center gap-2">
                <Hammer className="h-3.5 w-3.5" aria-hidden /> Projects
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {skill.projectIds.map((id) => {
                  const p = projectById.get(id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <Link className="text-primary hover:underline" href={`/projects/${p.slug}`}>
                        {p.title}
                      </Link>
                      <span className="meta block">~{p.estimatedHours}h build</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </Container>
  );
}
