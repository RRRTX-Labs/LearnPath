"use client";

import { Compass } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/components/progress-provider";
import { RoadmapTick } from "@/components/roadmap-progress";
import { Badge, ButtonLink, EmptyState, ProgressBar } from "@/components/ui";
import { useSession } from "@/lib/auth-client";
import { challenges, getRoadmapProgress, projects, roadmaps, skillById, skills } from "@/lib/content";
import { completedIds } from "@/lib/progress-shared";

export function MeClient() {
  const { progress, ready } = useProgress();
  const { data: session } = useSession();
  const doneSkills = completedIds(progress, "skill");
  const doneChallenges = completedIds(progress, "challenge");
  const doneProjects = completedIds(progress, "project");

  const withProgress = roadmaps
    .map((r) => ({ r, ...getRoadmapProgress(r, doneSkills) }))
    .filter((x) => x.percent > 0)
    .sort((a, b) => b.percent - a.percent);

  const started = roadmaps
    .flatMap((r) => r.nodes.map((n) => ({ r, n })))
    .filter(({ n }) => progress.some((p) => p.entityType === "skill" && p.entityId === n.skillId))
    .slice(0, 6);

  return (
    <div className="mt-8 space-y-10">
      <p className="text-sm text-muted">
        {session?.user ? `Signed in as ${session.user.email}.` : "Browsing without an account — progress lives in this browser."}{" "}
        <Link className="text-primary hover:underline" href={session?.user ? "/profile" : "/sign-in"}>
          {session?.user ? "Profile" : "Sign in to keep it across devices"}
        </Link>
      </p>

      {!ready ? null : doneSkills.size === 0 && doneChallenges.size === 0 ? (
        <EmptyState
          icon={<Compass className="h-6 w-6" />}
          title="No progress yet"
          body="Pick a roadmap and finish your first skill. Everything you complete here stays honest — we never invent streaks or XP."
          action={<ButtonLink href="/roadmaps">Browse roadmaps</ButtonLink>}
        />
      ) : null}

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

      {started.length ? (
        <section aria-labelledby="recent">
          <h2 id="recent" className="font-display text-2xl">
            Recently touched skills
          </h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {started.map(({ r, n }) => {
              const skill = skillById.get(n.skillId);
              if (!skill) return null;
              return (
                <li key={`${r.id}-${n.id}`}>
                  <Link
                    href={`/learn/${r.slug}/${skill.slug}`}
                    className="surface card-hover flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
                  >
                    <RoadmapTick skillId={n.skillId} />
                    <span className="truncate">{skill.title}</span>
                    <span className="meta ml-auto truncate">{r.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="completed">
        <h2 id="completed" className="font-display text-2xl">
          Completed
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="surface rounded-lg p-5">
            <p className="eyebrow">Skills · {doneSkills.size}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {skills.filter((s) => doneSkills.has(s.id)).slice(0, 8).map((s) => (
                <li key={s.id}>
                  <Link className="hover:text-primary" href={`/skills/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
              {!doneSkills.size ? <li className="text-muted">None yet.</li> : null}
            </ul>
          </div>
          <div className="surface rounded-lg p-5">
            <p className="eyebrow">Challenges · {doneChallenges.size}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {challenges.filter((c) => doneChallenges.has(c.id)).slice(0, 8).map((c) => (
                <li key={c.id}>
                  <Link className="hover:text-primary" href={`/challenges/${c.slug}`}>{c.title}</Link>
                </li>
              ))}
              {!doneChallenges.size ? <li className="text-muted">None yet.</li> : null}
            </ul>
          </div>
          <div className="surface rounded-lg p-5">
            <p className="eyebrow">Projects · {doneProjects.size}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {projects.filter((p) => doneProjects.has(p.id)).slice(0, 8).map((p) => (
                <li key={p.id}>
                  <Link className="hover:text-primary" href={`/projects/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
              {!doneProjects.size ? <li className="text-muted">None yet.</li> : null}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
