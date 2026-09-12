"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MarkComplete } from "@/components/mark-complete";
import { NotesPanel } from "@/components/notes-panel";
import { PracticeWorkspace } from "@/components/practice/workspace";
import { RoadmapTick } from "@/components/roadmap-progress";
import { ButtonLink, Tabs } from "@/components/ui";
import { YoutubeEmbed } from "@/components/youtube-embed";
import type { PracticeExercise, Resource, Skill } from "@/lib/content";
import { cn } from "@/lib/utils";

type NodeLite = { id: string; title: string; slug: string; skillId: string };
type TabId = "path" | "lesson" | "practice" | "notes";

export function LearnClient({
  roadmapSlug,
  roadmapTitle,
  skill,
  nodes,
  prev,
  next,
  best,
  altHref,
  practice,
}: {
  roadmapSlug: string;
  roadmapTitle: string;
  skill: Skill;
  nodes: NodeLite[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  best: Resource | null;
  altHref?: string;
  practice: PracticeExercise | null;
}) {
  const [tab, setTab] = useState<TabId>("lesson");
  const hasPractice = Boolean(practice);

  const tabs: { id: TabId; label: string }[] = [
    { id: "path", label: "Path" },
    { id: "lesson", label: "Lesson" },
    ...(hasPractice ? [{ id: "practice" as TabId, label: "Practice" }] : []),
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="mt-6">
      <div className="lg:hidden">
        <Tabs tabs={tabs} active={tab} onChange={setTab} label="Learning workspace sections" />
      </div>

      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[248px_minmax(0,1fr)_minmax(0,0.9fr)]">
        {/* path rail — visible on desktop, a tab on mobile */}
        <aside
          className={cn(
            "surface max-h-[calc(100vh-7rem)] overflow-auto rounded-lg p-3 lg:sticky lg:top-20 lg:block",
            tab === "path" ? "block" : "hidden",
          )}
          aria-label="Roadmap path"
        >
          <p className="eyebrow mb-2 px-1">{roadmapTitle}</p>
          <ol className="space-y-0.5">
            {nodes.map((n, i) => (
              <li key={n.id}>
                <Link
                  href={`/learn/${roadmapSlug}/${n.slug}`}
                  aria-current={n.skillId === skill.id ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                    n.skillId === skill.id
                      ? "bg-primary-soft font-medium text-primary"
                      : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  <RoadmapTick skillId={n.skillId} />
                  <span className="meta w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{n.title}</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link href={`/roadmaps/${roadmapSlug}`} className="meta mt-3 block px-2 hover:text-fg">
            View the full graph →
          </Link>
        </aside>

        {/* lesson */}
        <section
          className={cn("surface rounded-lg p-5 md:p-6", tab === "lesson" ? "block" : "hidden", "lg:block")}
          aria-labelledby="lesson-title"
        >
          <p className="eyebrow">Lesson</p>
          <h1 id="lesson-title" className="mt-1 font-display text-3xl">
            {skill.title}
          </h1>
          <p className="mt-2 text-muted">{skill.summary}</p>
          <ul className="mt-4 space-y-1.5">
            {skill.objectives.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {best?.youtubeId || best?.playlistId ? (
              <YoutubeEmbed
                videoId={best.youtubeId}
                playlistId={best.playlistId}
                title={best.title}
                fallbackHref={altHref}
              />
            ) : best ? (
              <ButtonLink href={best.url} external>
                Open {best.title}
              </ButtonLink>
            ) : (
              <p className="text-muted">No video for this skill — use the docs resource on the skill page.</p>
            )}
          </div>
          {best ? (
            <p className="meta mt-3">
              {best.provider} · score {best.editorScore} ·{" "}
              <Link className="text-primary hover:underline" href={`/resources/${best.id}`}>
                why we picked it
              </Link>
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
            <MarkComplete entityType="skill" entityId={skill.id} />
            <span className="flex-1" />
            {prev ? (
              <ButtonLink href={`/learn/${roadmapSlug}/${prev.slug}`} variant="ghost" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous
              </ButtonLink>
            ) : null}
            {next ? (
              <ButtonLink href={`/learn/${roadmapSlug}/${next.slug}`} variant="ghost" size="sm">
                Next: {next.title} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </ButtonLink>
            ) : null}
          </div>
        </section>

        {/* practice + notes */}
        <div className="space-y-4">
          <section
            className={cn("surface rounded-lg p-5", tab === "practice" ? "block" : "hidden", hasPractice ? "lg:block" : "lg:hidden")}
            aria-labelledby="practice-title"
          >
            <h2 id="practice-title" className="eyebrow">
              Practice
            </h2>
            {practice ? (
              <div className="mt-3">
                <PracticeWorkspace language={practice.language} initialCode={practice.starter} prompt={practice.prompt} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">
                No playground attached to this skill. The{" "}
                <Link className="text-primary hover:underline" href="/practice">
                  practice lab
                </Link>{" "}
                has every runtime.
              </p>
            )}
          </section>
          <section
            className={cn("surface rounded-lg p-5", tab === "notes" ? "block" : "hidden", "lg:block")}
            aria-labelledby="notes-title"
          >
            <h2 id="notes-title" className="sr-only">
              Notes
            </h2>
            <NotesPanel skillId={skill.id} />
          </section>
        </div>
      </div>
    </div>
  );
}
