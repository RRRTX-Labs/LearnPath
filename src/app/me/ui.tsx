"use client";

import { ArrowRight, Compass, NotebookPen, Trophy } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/components/progress-provider";
import { Badge, ButtonLink, EmptyState, ProgressBar } from "@/components/ui";
import { useSession } from "@/lib/auth-client";
import {
  challengeById,
  challenges,
  getRoadmapProgress,
  practiceById,
  projects,
  roadmaps,
  skillById,
  skills,
} from "@/lib/content";
import { proofSummary } from "@/lib/proof";
import { completedIds } from "@/lib/progress-shared";

function timeAgo(ts: number) {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

export function MeClient() {
  const { progress, notes, ready } = useProgress();
  const { data: session } = useSession();
  const doneSkills = completedIds(progress, "skill");
  const doneChallenges = completedIds(progress, "challenge");

  const withProgress = roadmaps
    .map((r) => ({ r, ...getRoadmapProgress(r, doneSkills) }))
    .filter((x) => x.percent > 0)
    .sort((a, b) => b.percent - a.percent);

  const active = withProgress.find((x) => x.percent < 100) ?? null;
  const activeNode = active ? active.r.nodes.find((n) => !doneSkills.has(n.skillId)) : undefined;
  const activeSkill = activeNode ? skillById.get(activeNode.skillId) : undefined;
  const activeStage =
    active && activeNode
      ? active.r.stages.find((st) => st.nodeIds.includes(activeNode.id)) ?? null
      : null;
  const activeStageIdx = active && activeStage ? active.r.stages.indexOf(activeStage) : -1;

  // Today's plan: next two lessons + one practice + one challenge from the active roadmap.
  const upcomingNodes = active
    ? active.r.nodes.filter((n) => !doneSkills.has(n.skillId)).slice(0, 2)
    : [];
  const todayPractice = activeSkill?.practiceId ? practiceById.get(activeSkill.practiceId) : undefined;
  const todayChallenge = activeSkill
    ? activeSkill.challengeIds.map((id) => challengeById.get(id)).find((c) => c && !doneChallenges.has(c.id))
    : undefined;

  const proof = proofSummary(progress, skills);

  const activity = [...progress]
    .filter((p) => p.status === "completed")
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6)
    .map((p) => {
      const title =
        p.entityType === "skill"
          ? skillById.get(p.entityId)?.title
          : p.entityType === "challenge"
            ? challengeById.get(p.entityId)?.title
            : p.entityType === "project"
              ? projects.find((x) => x.id === p.entityId)?.title
              : p.entityType === "practice"
                ? practiceById.get(p.entityId)?.title
                : undefined;
      return { ...p, title: title ?? p.entityId };
    });

  const noteEntries = Object.entries(notes)
    .filter(([, text]) => text.trim().length > 0)
    .slice(0, 4);

  return (
    <div className="mt-8 space-y-10">
      <p className="text-sm text-muted">
        {session?.user ? `Signed in as ${session.user.email}.` : "Browsing without an account — progress lives in this browser."}{" "}
        <Link className="text-primary hover:underline" href={session?.user ? "/profile" : "/sign-in"}>
          {session?.user ? "Profile" : "Sign in to keep it across devices"}
        </Link>
      </p>

      {!ready ? null : doneSkills.size === 0 && doneChallenges.size === 0 && !noteEntries.length ? (
        <EmptyState
          icon={<Compass className="h-6 w-6" />}
          title="No progress yet"
          body="Pick a roadmap and finish your first skill. Everything you complete here stays honest — we never invent streaks or XP."
          action={<ButtonLink href="/roadmaps">Browse roadmaps</ButtonLink>}
        />
      ) : null}

      {/* -------------------------------------------- continue (dominant) */}
      {active && activeSkill && activeNode ? (
        <section aria-label="Continue learning">
          <Link
            href={`/learn/${active.r.slug}/${activeSkill.slug}`}
            className="glass edge-accent card-hover block rounded-xl p-6 md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="eyebrow">Continue learning</p>
                <h2 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{activeSkill.title}</h2>
                <p className="meta mt-2">
                  {active.r.title}
                  {activeStage && activeStageIdx >= 0
                    ? ` · Stage ${String(activeStageIdx + 1).padStart(2, "0")} ${activeStage.title}`
                    : ""}{" "}
                  · {active.percent}% of required skills
                </p>
              </div>
              <div className="flex w-full max-w-xs flex-col gap-3">
                <ProgressBar value={active.percent} label="roadmap progress" />
                <span className="flex items-center justify-end gap-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg">
                  Continue <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      {/* ---------------------------------------------------- today's plan */}
      {upcomingNodes.length || todayPractice || todayChallenge ? (
        <section aria-labelledby="today">
          <h2 id="today" className="font-display text-2xl">
            Today
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {upcomingNodes.map((n, i) => {
              const s = skillById.get(n.skillId);
              if (!s) return null;
              return (
                <Link key={n.id} href={`/learn/${active?.r.slug}/${s.slug}`} className="surface card-hover rounded-lg p-4">
                  <p className="meta">{i === 0 ? "Next lesson" : "Then"}</p>
                  <p className="mt-1 font-medium">{s.title}</p>
                  <p className="meta mt-1">{s.objectives[0]}</p>
                </Link>
              );
            })}
            {todayPractice ? (
              <div className="surface rounded-lg p-4">
                <p className="meta">Practice</p>
                <p className="mt-1 font-medium">{todayPractice.title}</p>
                <p className="meta mt-1">In-browser · {todayPractice.language}</p>
              </div>
            ) : null}
            {todayChallenge ? (
              <Link href={`/challenges/${todayChallenge.slug}`} className="surface card-hover rounded-lg p-4">
                <p className="meta">Challenge</p>
                <p className="mt-1 font-medium">{todayChallenge.title}</p>
                <p className="meta mt-1">Pass the tests to prove the skill</p>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------- roadmap progress */}
      {withProgress.length ? (
        <section aria-labelledby="roadmap-progress">
          <h2 id="roadmap-progress" className="font-display text-2xl">
            Roadmaps in motion
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {withProgress.map(({ r, percent, done, total }) => (
              <Link key={r.id} href={`/roadmaps/${r.slug}`} className="surface card-hover rounded-lg p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl">{r.title}</h3>
                  <Badge tone="accent">
                    {done}/{total}
                  </Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={percent} label="required skills" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------- evidence */}
      <section aria-labelledby="evidence">
        <h2 id="evidence" className="font-display text-2xl">
          Evidence
        </h2>
        <p className="mt-1 text-sm text-muted">
          Not points — proof. A skill counts as demonstrated when you have learned it and passed
          its challenge or applied it in a project.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="surface rounded-lg p-5">
            <p className="eyebrow flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-accent" aria-hidden /> Skills demonstrated
            </p>
            <p className="mt-2 font-display text-3xl">{proof.demonstratedCount}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {proof.demonstratedSkills.slice(0, 4).map((s) => (
                <li key={s.id} className="truncate">
                  <Link className="hover:text-primary" href={`/skills/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
              {!proof.demonstratedCount ? <li>None yet — pass a challenge on a completed skill.</li> : null}
            </ul>
          </div>
          <div className="surface rounded-lg p-5">
            <p className="eyebrow">Challenges passed</p>
            <p className="mt-2 font-display text-3xl">{proof.challengesPassed}</p>
            <p className="meta mt-2">of {challenges.length} in the catalog</p>
          </div>
          <div className="surface rounded-lg p-5">
            <p className="eyebrow">Projects shipped</p>
            <p className="mt-2 font-display text-3xl">{proof.projectsShipped}</p>
            <p className="meta mt-2">of {projects.length} project briefs</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- notes + recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="recent-notes">
          <h2 id="recent-notes" className="flex items-center gap-2 font-display text-2xl">
            <NotebookPen className="h-4 w-4 text-muted" aria-hidden /> Recent notes
          </h2>
          <ul className="mt-4 space-y-2">
            {noteEntries.map(([skillId, text]) => {
              const s = skillById.get(skillId);
              return (
                <li key={skillId}>
                  <Link href={s ? `/skills/${s.slug}` : "#"} className="surface card-hover block rounded-lg p-4">
                    <p className="text-sm font-medium">{s?.title ?? skillId}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{text}</p>
                  </Link>
                </li>
              );
            })}
            {!noteEntries.length ? <li className="text-sm text-muted">No notes yet — they save automatically per skill.</li> : null}
          </ul>
        </section>
        <section aria-labelledby="activity">
          <h2 id="activity" className="font-display text-2xl">
            Recent activity
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {activity.map((a) => (
              <li key={`${a.entityType}:${a.entityId}`} className="surface flex items-center gap-3 rounded-lg px-4 py-2.5">
                <span className="meta w-20 shrink-0 uppercase">{a.entityType}</span>
                <span className="truncate">{a.title}</span>
                <span className="meta ml-auto shrink-0">{timeAgo(a.updatedAt)}</span>
              </li>
            ))}
            {!activity.length ? <li className="text-sm text-muted">Nothing completed yet.</li> : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
