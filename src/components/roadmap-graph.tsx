"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Roadmap, Skill } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useProgress } from "./progress-provider";

export function RoadmapGraph({
  roadmap,
  skills,
}: {
  roadmap: Roadmap;
  skills: Record<string, Skill>;
}) {
  const { isDone } = useProgress();
  const width = useMemo(() => Math.max(...roadmap.nodes.map((n) => n.x)) + 180, [roadmap.nodes]);
  const height = useMemo(() => Math.max(...roadmap.nodes.map((n) => n.y)) + 80, [roadmap.nodes]);
  const byId = useMemo(() => Object.fromEntries(roadmap.nodes.map((n) => [n.id, n])), [roadmap.nodes]);

  return (
    <div className="overflow-x-auto rounded-[16px] border border-border bg-bg-sunken p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={Math.max(height, 420)}
        role="group"
        aria-label={`${roadmap.title} graph`}
        className="min-w-full"
      >
        {roadmap.edges.map((e) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x + 70}
              y1={a.y + 18}
              x2={b.x + 70}
              y2={b.y + 18}
              stroke="var(--primary)"
              strokeOpacity={e.kind === "required" ? 0.55 : 0.25}
              strokeDasharray={e.kind === "optional" ? "4 4" : undefined}
            />
          );
        })}
        {roadmap.nodes.map((node) => {
          const skill = skills[node.skillId];
          const done = isDone("skill", node.skillId);
          return (
            <foreignObject key={node.id} x={node.x} y={node.y} width={150} height={56}>
              <Link
                href={`/learn/${roadmap.slug}/${skill.slug}`}
                className={cn(
                  "flex h-full items-center rounded-[10px] border px-3 text-left text-xs leading-tight",
                  done
                    ? "border-accent/40 bg-surface text-fg"
                    : "border-border bg-surface hover:border-primary/50",
                )}
              >
                <span>
                  <span className="block font-medium">{skill.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {node.requirement} · {node.tier}
                    {done ? " · done" : ""}
                  </span>
                </span>
              </Link>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}
