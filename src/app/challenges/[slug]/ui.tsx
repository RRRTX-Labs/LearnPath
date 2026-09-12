"use client";

import { MarkComplete } from "@/components/mark-complete";
import { ChallengeWorkspace } from "@/components/practice/workspace";
import { ReportForm } from "@/components/report-form";
import { useProgress } from "@/components/progress-provider";
import type { Challenge } from "@/lib/content";

export function ChallengeView({ challenge }: { challenge: Challenge }) {
  const { mark } = useProgress();
  return (
    <div className="mt-6 space-y-4">
      <ChallengeWorkspace challenge={challenge} onPass={() => mark("challenge", challenge.id, "completed")} />
      <MarkComplete entityType="challenge" entityId={challenge.id} label="I solved this" />
      <ReportForm targetType="challenge" targetId={challenge.id} />
    </div>
  );
}
