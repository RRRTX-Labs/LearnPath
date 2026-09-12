"use client";

import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { Roadmap, Skill } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useProgress } from "./progress-provider";

const NODE_W = 184;
const NODE_H = 64;

type NodeState = "done" | "active" | "locked" | "open";

/**
 * Staged learning graph.
 *
 * - Stage bands, dependency curves and node states are drawn from roadmap data
 *   (stages + edges + progress), never hardcoded per roadmap.
 * - Nodes are real links in an overflow-scrolling canvas: keyboard and screen
 *   reader usable, touch scrollable, and legible at 375px.
 * - A node is "locked" when a required predecessor is incomplete — communicated
 *   by icon + label, not colour alone.
 */
export function RoadmapGraph({
  roadmap,
  skills,
  activeSkillId,
}: {
  roadmap: Roadmap;
  skills: Record<string, Skill>;
  activeSkillId?: string;
}) {
  const { isDone } = useProgress();

  const width = useMemo(() => Math.max(...roadmap.nodes.map((n) => n.x)) + NODE_W + 80, [roadmap.nodes]);
  const height = useMemo(() => Math.max(...roadmap.nodes.map((n) => n.y)) + NODE_H + 80, [roadmap.nodes]);
  const byId = useMemo(() => new Map(roadmap.nodes.map((n) => [n.id, n])), [roadmap.nodes]);

  const doneSkills = useMemo(
    () => new Set(roadmap.nodes.filter((n) => isDone("skill", n.skillId)).map((n) => n.skillId)),
    [roadmap.nodes, isDone],
  );

  const incoming = useMemo(() => {
    const map = new Map<string, { from: string; kind: string }[]>();
    for (const e of roadmap.edges) {
      if (!map.has(e.to)) map.set(e.to, []);
      map.get(e.to)!.push({ from: e.from, kind: e.kind });
    }
    return map;
  }, [roadmap.edges]);

  function stateOf(nodeId: string): NodeState {
    const node = byId.get(nodeId);
    if (!node) return "open";
    if (activeSkillId && node.skillId === activeSkillId) return "active";
    if (doneSkills.has(node.skillId)) return "done";
    const reqs = (incoming.get(nodeId) ?? []).filter((i) => i.kind === "required");
    const locked = reqs.some((i) => {
      const src = byId.get(i.from);
      return src ? !doneSkills.has(src.skillId) : false;
    });
    return locked ? "locked" : "open";
  }

  const bands = roadmap.stages.map((stage) => {
    const nodes = stage.nodeIds.map((id) => byId.get(id)).filter(Boolean) as Roadmap["nodes"];
    if (!nodes.length) return null;
    const minX = Math.min(...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x));
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxY = Math.max(...nodes.map((n) => n.y));
    return { stage, x: minX - 28, y: minY - 40, w: maxX - minX + NODE_W + 56, h: maxY - minY + NODE_H + 64 };
  });

  return (
    <div className="sunken overflow-x-auto rounded-lg p-4" role="group" aria-label={`${roadmap.title} learning graph`}>
      <div className="relative" style={{ width, height }}>
        <svg className="absolute inset-0" width={width} height={height} aria-hidden="true">
          <defs>
            <linearGradient id={`grad-${roadmap.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          {bands.map(
            (b) =>
              b && (
                <g key={b.stage.id}>
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx={16}
                    fill="var(--surface)"
                    fillOpacity={0.5}
                    stroke="var(--line)"
                  />
                  <text
                    x={b.x + 14}
                    y={b.y + 20}
                    fill="var(--muted)"
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.14em"
                  >
                    {b.stage.title.toUpperCase()}
                  </text>
                </g>
              ),
          )}
          {roadmap.edges.map((e) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;
            const sameRow = Math.abs(a.y - b.y) < 8;
            const aDone = doneSkills.has(a.skillId);
            const bDone = doneSkills.has(b.skillId);
            const lit = aDone && bDone;
            let d: string;
            if (sameRow) {
              const x1 = a.x + NODE_W;
              const y1 = a.y + NODE_H / 2;
              const x2 = b.x;
              const y2 = b.y + NODE_H / 2;
              const mx = (x1 + x2) / 2;
              d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
            } else {
              const x1 = a.x + NODE_W / 2;
              const y1 = a.y + NODE_H;
              const x2 = b.x + NODE_W / 2;
              const y2 = b.y;
              const my = (y1 + y2) / 2;
              d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
            }
            return (
              <path
                key={`${e.from}-${e.to}`}
                d={d}
                fill="none"
                stroke={lit ? `url(#grad-${roadmap.id})` : "var(--line-strong)"}
                strokeWidth={lit ? 2 : 1.4}
                strokeDasharray={e.kind === "optional" ? "3 5" : e.kind === "recommended" ? "7 4" : undefined}
                markerEnd="none"
              />
            );
          })}
        </svg>

        {roadmap.nodes.map((node) => {
          const skill = skills[node.skillId];
          if (!skill) return null;
          const state = stateOf(node.id);
          return (
            <Link
              key={node.id}
              href={`/learn/${roadmap.slug}/${skill.slug}`}
              aria-current={state === "active" ? "true" : undefined}
              className={cn(
                "card-hover absolute flex flex-col justify-center gap-0.5 rounded-md border px-3 py-2 backdrop-blur-sm",
                state === "done" && "border-accent/50 bg-surface",
                state === "active" && "border-primary bg-surface shadow-glow",
                state === "locked" && "border-line bg-surface/70 opacity-70",
                state === "open" && "border-line bg-surface",
              )}
              style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
            >
              <span className="flex items-center gap-1.5">
                {state === "done" ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                ) : state === "locked" ? (
                  <Lock className="h-3 w-3 shrink-0 text-muted" aria-hidden />
                ) : null}
                <span className="truncate text-[13px] font-medium leading-tight">{skill.title}</span>
              </span>
              <span className="meta truncate">
                {node.requirement} · {node.tier}
                {state === "done" ? " · done" : state === "locked" ? " · locked" : ""}
              </span>
            </Link>
          );
        })}
      </div>
      <p className="meta mt-3 flex flex-wrap gap-x-4 gap-y-1">
        <span>Solid line — required</span>
        <span>Dashed — recommended</span>
        <span>Dotted — optional</span>
        <span>Lock — finish the required step before it</span>
      </p>
    </div>
  );
}
