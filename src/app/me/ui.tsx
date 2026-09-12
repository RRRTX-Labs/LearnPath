"use client";

import Link from "next/link";
import { useProgress } from "@/components/progress-provider";
import { Badge, ProgressBar } from "@/components/ui";
import { challenges, getRoadmapProgress, projects, roadmaps, skills } from "@/lib/content";
import { completedIds } from "@/lib/progress-shared";
import { useSession } from "@/lib/auth-client";

export function MeClient() {
  const { progress } = useProgress();
  const { data: session } = useSession();
  const doneSkills = completedIds(progress, "skill");
  const doneChallenges = completedIds(progress, "challenge");
  const doneProjects = completedIds(progress, "project");
  const active = roadmaps
    .map((r) => ({ r, ...getRoadmapProgress(r, doneSkills) }))
    .filter((x) => x.percent > 0)
    .sort((a, b) => b.percent - a.percent);

  return (
    <div className="mt-8 space-y-8">
      <p className="text-sm text-muted">
        {session?.user ? `Signed in as ${session.user.email}` : "Browsing without an account."}{" "}
        <Link className="text-primary" href={session?.user ? "/profile" : "/sign-in"}>
          {session?.user ? "Profile" : "Sign in"}
        </Link>
      </p>
      <section>
        <h2 className="font-display text-2xl">Roadmaps</h2>
        <div className="mt-4 grid gap-4">
          {(active.length ? active : roadmaps.map((r) => ({ r, ...getRoadmapProgress(r, doneSkills) })).slice(0, 3)).map(
            ({ r, percent, done, total }) => (
              <Link key={r.id} href={`/roadmaps/${r.slug}`} className="surface p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">{r.title}</h3>
                  <Badge>
                    {done}/{total}
                  </Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={percent} />
                </div>
              </Link>
            ),
          )}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl">Completed skills</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {skills.filter((s) => doneSkills.has(s.id)).map((s) => (
            <li key={s.id}>
              <Link href={`/skills/${s.slug}`}>{s.title}</Link>
            </li>
          ))}
          {!doneSkills.size ? <li className="text-muted">None yet — open a roadmap.</li> : null}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-2xl">Challenges</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {challenges.filter((c) => doneChallenges.has(c.id)).map((c) => (
            <li key={c.id}>
              <Link href={`/challenges/${c.slug}`}>{c.title}</Link>
            </li>
          ))}
          {!doneChallenges.size ? <li className="text-muted">No challenges passed yet.</li> : null}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-2xl">Projects</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {projects.filter((p) => doneProjects.has(p.id)).map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
          {!doneProjects.size ? <li className="text-muted">No projects started.</li> : null}
        </ul>
      </section>
    </div>
  );
}
