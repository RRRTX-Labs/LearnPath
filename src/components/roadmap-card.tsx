"use client";

import { ArrowRight, BrainCircuit, Braces, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getRoadmapProgress } from "@/lib/content";
import type { Roadmap } from "@/lib/content";
import { completedIds } from "@/lib/progress-shared";
import { useProgress } from "./progress-provider";
import { Badge, ProgressBar } from "./ui";

const CATEGORY_ICON = {
  ai: BrainCircuit,
  language: Braces,
  web: Globe,
  security: ShieldCheck,
} as const;

const CATEGORY_LABEL = {
  ai: "AI & data",
  language: "Languages",
  web: "Web",
  security: "Security",
} as const;

export function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const { progress, ready } = useProgress();
  const done = completedIds(progress, "skill");
  const { percent } = getRoadmapProgress(roadmap, done);
  const Icon = CATEGORY_ICON[roadmap.category];

  return (
    <Link
      href={`/roadmaps/${roadmap.slug}`}
      className="group surface card-hover spotlight edge-accent flex h-full flex-col gap-3 rounded-lg p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md border border-line bg-surface-2 text-primary transition-transform duration-150 group-hover:-translate-y-0.5">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <Badge>{CATEGORY_LABEL[roadmap.category]}</Badge>
      </div>
      <h3 className="font-display text-2xl leading-tight transition-colors group-hover:text-primary">
        {roadmap.title}
      </h3>
      <p className="text-sm text-muted">{roadmap.tagline}</p>
      <p className="meta">
        {roadmap.stages.length} stages · {roadmap.nodes.length} skills · ~{roadmap.estimatedHours}h
      </p>
      <div className="mt-auto space-y-3 pt-1">
        {ready && percent > 0 ? <ProgressBar value={percent} label="Your progress" /> : null}
        <span className="flex items-center gap-1 text-sm font-medium text-primary">
          Explore roadmap
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
