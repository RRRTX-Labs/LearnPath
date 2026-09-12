"use client";

import Link from "next/link";
import { useState } from "react";
import { MarkComplete } from "@/components/mark-complete";
import { NotesPanel } from "@/components/notes-panel";
import { PracticeWorkspace } from "@/components/practice/workspace";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { ButtonLink } from "@/components/ui";
import type { PracticeExercise, Resource, Skill } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useProgress } from "@/components/progress-provider";

type NodeLite = { id: string; title: string; slug: string; skillId: string };

export function LearnClient({
  roadmapSlug,
  skill,
  nodes,
  prev,
  next,
  best,
  altHref,
  practice,
}: {
  roadmapSlug: string;
  skill: Skill;
  nodes: NodeLite[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  best: Resource | null;
  altHref?: string;
  practice: PracticeExercise | null;
}) {
  const [tab, setTab] = useState<"lesson" | "practice" | "notes">("lesson");
  const { isDone } = useProgress();

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="surface hidden max-h-[calc(100vh-8rem)] overflow-auto p-3 lg:block">
        <p className="eyebrow mb-2">Roadmap</p>
        <ol className="space-y-1">
          {nodes.map((n) => (
            <li key={n.id}>
              <Link
                href={`/learn/${roadmapSlug}/${n.slug}`}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm hover:bg-surface-2",
                  n.skillId === skill.id && "bg-surface-2 text-primary",
                )}
              >
                {isDone("skill", n.skillId) ? "● " : "○ "}
                {n.title}
              </Link>
            </li>
          ))}
        </ol>
      </aside>

      <div className="flex gap-2 lg:hidden">
        {(["lesson", "practice", "notes"] as const).map((t) => (
          <button
            key={t}
            className={cn("rounded-full border px-3 py-1 text-sm", tab === t ? "border-primary text-primary" : "border-border text-muted")}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <section className={cn("surface p-5", tab !== "lesson" && "max-lg:hidden")}>
        <h1 className="font-display text-3xl">{skill.title}</h1>
        <p className="mt-2 text-muted">{skill.summary}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {skill.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
        <div className="mt-6">
          {best?.youtubeId ? (
            <YoutubeEmbed videoId={best.youtubeId} title={best.title} fallbackHref={altHref} />
          ) : best ? (
            <a className="link-plain" href={best.url} rel="noopener noreferrer" target="_blank">
              Open {best.title}
            </a>
          ) : (
            <p className="text-muted">No video for this skill — use the docs resource.</p>
          )}
        </div>
        {best ? (
          <p className="mt-3 text-sm text-muted">
            {best.provider}.{" "}
            <Link className="text-primary" href={`/resources/${best.id}`}>
              Resource details
            </Link>
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <MarkComplete entityType="skill" entityId={skill.id} />
          {prev ? (
            <ButtonLink href={`/learn/${roadmapSlug}/${prev.slug}`} variant="ghost" size="sm">
              Previous
            </ButtonLink>
          ) : null}
          {next ? (
            <ButtonLink href={`/learn/${roadmapSlug}/${next.slug}`} variant="ghost" size="sm">
              Next: {next.title}
            </ButtonLink>
          ) : null}
        </div>
      </section>

      <section className={cn("space-y-4", tab === "lesson" && "max-lg:hidden")}>
        <div className={cn("surface p-5", tab !== "practice" && "max-lg:hidden lg:block")}>
          <p className="eyebrow">Practice</p>
          {practice ? (
            <PracticeWorkspace language={practice.language} initialCode={practice.starter} prompt={practice.prompt} />
          ) : (
            <p className="mt-2 text-sm text-muted">
              No playground attached. Try the{" "}
              <Link className="text-primary" href="/practice">
                practice lab
              </Link>
              .
            </p>
          )}
        </div>
        <div className={cn("surface p-5", tab !== "notes" && "max-lg:hidden lg:block")}>
          <NotesPanel skillId={skill.id} />
        </div>
      </section>
    </div>
  );
}
