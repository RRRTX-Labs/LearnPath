"use client";

import { ArrowLeft, ArrowRight, Check, Circle, Lock, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MarkComplete } from "@/components/mark-complete";
import { NotesPanel } from "@/components/notes-panel";
import { PracticeWorkspace } from "@/components/practice/workspace";
import { RoadmapTick } from "@/components/roadmap-progress";
import { ButtonLink, Tabs } from "@/components/ui";
import { YoutubeEmbed } from "@/components/youtube-embed";
import type { PracticeExercise, Resource, Skill } from "@/lib/content";
import { skillProof, PROOF_STATE_LABEL } from "@/lib/proof";
import { useProgress } from "@/components/progress-provider";
import { completedIds } from "@/lib/progress-shared";
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
  stageTitle,
  stageIndex,
  stagePos,
  stageSize,
  unlocks,
  skillChallenges,
  skillProjects,
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
  stageTitle: string | null;
  stageIndex: number | null;
  stagePos: number;
  stageSize: number;
  unlocks: { slug: string; title: string }[];
  skillChallenges: { id: string; slug: string; title: string }[];
  skillProjects: { slug: string; title: string }[];
}) {
  const [tab, setTab] = useState<TabId>("lesson");
  const hasPractice = Boolean(practice);
  const { progress, mark } = useProgress();
  const proof = skillProof(progress, skill);
  const doneResources = completedIds(progress, "resource");
  const doneChallenges = completedIds(progress, "challenge");
  const prereqsMet = skill.prerequisites.every((id) => completedIds(progress, "skill").has(id));

  const tabs: { id: TabId; label: string }[] = [
    { id: "path", label: "Path" },
    { id: "lesson", label: "Lesson" },
    ...(hasPractice ? [{ id: "practice" as TabId, label: "Practice" }] : []),
    { id: "notes", label: "Notes" },
  ];

  const loopSteps = [
    {
      label: "Learn",
      done: proof.learned || (best ? doneResources.has(best.id) : false),
      href: null as string | null,
    },
    { label: "Practice", done: skill.practiceId ? completedIds(progress, "practice").has(skill.practiceId) : false, href: hasPractice ? "#practice-panel" : null },
    { label: "Challenge", done: proof.challengePassed, href: skillChallenges[0] ? `/challenges/${skillChallenges[0].slug}` : null },
    { label: "Prove", done: proof.demonstrated, href: null },
  ];

  return (
    <div className="mt-6">
      {/* ------------------------------------------------- the loop strip */}
      <ol
        className="flex flex-wrap items-center gap-x-1 gap-y-2 rounded-lg border border-line bg-surface/60 px-4 py-3"
        aria-label="Learning loop for this skill"
      >
        {loopSteps.map((step, i) => (
          <li key={step.label} className="flex items-center gap-1">
            {i > 0 ? <span className="mx-1 font-mono text-xs text-muted" aria-hidden>→</span> : null}
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider",
                step.done
                  ? "bg-primary-soft text-primary"
                  : "border border-line text-muted",
              )}
            >
              {step.done ? <Check className="h-3 w-3" aria-hidden /> : <Circle className="h-3 w-3" aria-hidden />}
              {step.label}
            </span>
          </li>
        ))}
        <li className="ml-auto">
          <span
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider",
              proof.demonstrated ? "bg-accent-soft text-accent" : "text-muted",
            )}
          >
            {PROOF_STATE_LABEL[proof.state]}
          </span>
        </li>
      </ol>

      <div className="lg:hidden mt-4">
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
          <p className="eyebrow">
            {stageTitle && stageIndex !== null
              ? `Stage ${String(stageIndex + 1).padStart(2, "0")} · ${stageTitle} · skill ${stagePos} of ${stageSize}`
              : "Lesson"}
          </p>
          <h1 id="lesson-title" className="mt-1 font-display text-3xl">
            {skill.title}
          </h1>
          <p className="mt-2 text-muted">{skill.summary}</p>

          {!prereqsMet ? (
            <p className="mt-3 flex items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-2 text-sm text-muted">
              <Lock className="h-3.5 w-3.5 text-accent" aria-hidden />
              Recommended first:{" "}
              {skill.prerequisites
                .filter((id) => !completedIds(progress, "skill").has(id))
                .map((id) => nodes.find((n) => n.skillId === id)?.title ?? id)
                .join(", ")}
            </p>
          ) : null}

          <h2 className="eyebrow mt-5">After this you will be able to</h2>
          <ul className="mt-2 space-y-1.5">
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
              {best.provider} ·{" "}
              <Link className="text-primary hover:underline" href={`/resources/${best.id}`}>
                why we picked it
              </Link>
            </p>
          ) : null}

          {unlocks.length ? (
            <p className="meta mt-4">
              Completing this unlocks:{" "}
              {unlocks.map((u, i) => (
                <span key={u.slug}>
                  {i > 0 ? ", " : ""}
                  <Link className="text-primary hover:underline" href={`/learn/${roadmapSlug}/${u.slug}`}>
                    {u.title}
                  </Link>
                </span>
              ))}
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

        {/* practice + proof + notes */}
        <div className="space-y-4">
          <section
            id="practice-panel"
            className={cn("surface rounded-lg p-5", tab === "practice" ? "block" : "hidden", hasPractice ? "lg:block" : "lg:hidden")}
            aria-labelledby="practice-title"
          >
            <h2 id="practice-title" className="eyebrow">
              Practice
            </h2>
            {practice ? (
              <div className="mt-3">
                <PracticeWorkspace
                  language={practice.language}
                  initialCode={practice.starter}
                  prompt={practice.prompt}
                  onRan={(res) => {
                    if (!res.error) mark("practice", practice.id, "completed");
                  }}
                />
                <p className="meta mt-2">
                  A successful run records “practiced” on this skill. Nothing leaves your browser.
                </p>
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

          {skillChallenges.length ? (
            <section className="surface rounded-lg p-5" aria-labelledby="challenges-title">
              <h2 id="challenges-title" className="eyebrow">
                Challenge — prove it
              </h2>
              <ul className="mt-3 space-y-2">
                {skillChallenges.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/challenges/${c.slug}`}
                      className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {doneChallenges.has(c.id) ? (
                        <Trophy className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                      ) : (
                        <Circle className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                      )}
                      <span className="truncate">{c.title}</span>
                      <span className="meta ml-auto shrink-0">{doneChallenges.has(c.id) ? "passed" : "attempt"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {skillProjects.length ? (
            <section className="surface rounded-lg p-5" aria-labelledby="apply-title">
              <h2 id="apply-title" className="eyebrow">
                Apply it in a project
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {skillProjects.map((p) => (
                  <li key={p.slug}>
                    <Link className="text-primary hover:underline" href={`/projects/${p.slug}`}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* proof panel */}
          <section className="surface rounded-lg p-5" aria-labelledby="proof-title">
            <h2 id="proof-title" className="eyebrow">
              Evidence
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(
                [
                  ["Learned", proof.learned],
                  ["Practiced", proof.practiced],
                  ["Challenge passed", proof.challengePassed],
                  ["Used in a project", proof.applied],
                ] as [string, boolean][]
              ).map(([label, ok]) => (
                <li key={label} className="flex items-center gap-2">
                  {ok ? (
                    <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted/60" aria-hidden />
                  )}
                  <span className={ok ? "text-fg" : "text-muted"}>{label}</span>
                </li>
              ))}
            </ul>
            <p className={cn("mt-3 font-mono text-[11px] uppercase tracking-wider", proof.demonstrated ? "text-accent" : "text-muted")}>
              {proof.demonstrated ? "Skill demonstrated" : "Not demonstrated yet"}
            </p>
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
