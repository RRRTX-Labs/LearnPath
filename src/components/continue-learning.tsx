"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getRoadmapProgress, roadmaps, skillById } from "@/lib/content";
import { completedIds } from "@/lib/progress-shared";
import { useProgress } from "./progress-provider";
import { Badge, ProgressBar } from "./ui";

/**
 * "Continue learning" uses only real, local progress. With no progress it
 * renders nothing — never a fake streak or a manufactured number.
 */
export function ContinueLearning() {
  const { progress, ready } = useProgress();
  if (!ready) return null;
  const done = completedIds(progress, "skill");
  if (!done.size) return null;

  const active = roadmaps
    .map((r) => ({ r, ...getRoadmapProgress(r, done) }))
    .filter((x) => x.percent > 0 && x.percent < 100)
    .sort((a, b) => b.percent - a.percent)[0];
  if (!active) return null;

  const nextNode = active.r.nodes.find((n) => !done.has(n.skillId));
  const nextSkill = nextNode ? skillById.get(nextNode.skillId) : undefined;

  return (
    <div className="glass edge-accent flex flex-wrap items-center gap-4 rounded-lg px-5 py-4">
      <Badge tone="accent">Continue</Badge>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{active.r.title}</p>
        <p className="meta truncate">
          {active.done}/{active.total} required skills
          {nextSkill ? ` · next: ${nextSkill.title}` : ""}
        </p>
      </div>
      <div className="w-full sm:w-40">
        <ProgressBar value={active.percent} />
      </div>
      {nextSkill ? (
        <Link
          href={`/learn/${active.r.slug}/${nextSkill.slug}`}
          className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
        >
          Resume <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
