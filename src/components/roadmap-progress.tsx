"use client";

import { Check, Circle } from "lucide-react";
import { getRoadmapProgress, type Roadmap } from "@/lib/content";
import { completedIds } from "@/lib/progress-shared";
import { useProgress } from "./progress-provider";
import { ProgressBar } from "./ui";

export function RoadmapProgress({ roadmap }: { roadmap: Roadmap }) {
  const { progress, ready } = useProgress();
  if (!ready) return null;
  const { percent, done, total } = getRoadmapProgress(roadmap, completedIds(progress, "skill"));
  if (!done) return null;
  return (
    <div className="w-full max-w-56">
      <ProgressBar value={percent} label={`${done}/${total} required skills`} />
    </div>
  );
}

export function RoadmapTick({ skillId }: { skillId: string }) {
  const { isDone } = useProgress();
  const done = isDone("skill", skillId);
  return done ? (
    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-label="completed" />
  ) : (
    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-label="not completed yet" />
  );
}
