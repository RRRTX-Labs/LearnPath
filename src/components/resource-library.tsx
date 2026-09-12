"use client";

import { useMemo, useState } from "react";
import type { Resource } from "@/lib/content";
import { ResourceCard } from "./resource-card";
import { EmptyState, Input, Select, ShowMore } from "./ui";

const TYPES = ["all", "youtube-course", "youtube-video", "playlist", "documentation", "article", "interactive"] as const;
const LEVELS = ["all", "beginner", "intermediate", "advanced"] as const;

export function ResourceLibrary({
  resources,
  topics,
  initialTopic,
}: {
  resources: Resource[];
  topics: { id: string; label: string; count: number }[];
  initialTopic?: string;
}) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("all");
  const [topic, setTopic] = useState(initialTopic && topics.some((t) => t.id === initialTopic) ? initialTopic : "all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return resources
      .filter((r) => (type === "all" ? true : r.type === type))
      .filter((r) => (level === "all" ? true : r.level === level))
      .filter((r) => (topic === "all" ? true : r.topics.includes(topic)))
      .filter((r) =>
        query
          ? `${r.title} ${r.provider} ${r.topics.join(" ")} ${r.editorNote}`.toLowerCase().includes(query)
          : true,
      )
      .sort((a, b) => b.editorScore - a.editorScore);
  }, [resources, q, type, level, topic]);

  return (
    <div>
      <div className="sunken flex flex-wrap items-center gap-3 rounded-lg p-3">
        <div className="min-w-52 flex-1">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by title, channel, topic…"
            aria-label="Filter resources"
          />
        </div>
        <Select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Filter by topic">
          <option value="all">All topics ({resources.length})</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} ({t.count})
            </option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value as (typeof TYPES)[number])} aria-label="Filter by type">
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All types" : t.replace("-", " ")}
            </option>
          ))}
        </Select>
        <Select value={level} onChange={(e) => setLevel(e.target.value as (typeof LEVELS)[number])} aria-label="Filter by level">
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l === "all" ? "All levels" : l}
            </option>
          ))}
        </Select>
      </div>
      <p className="meta mt-3" aria-live="polite">
        {filtered.length} of {resources.length} resources
      </p>
      {filtered.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ShowMore count={12}>
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </ShowMore>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="Nothing matches those filters"
            body="Try a broader topic or level. Every resource here is free and was verified for availability and embed permission."
          />
        </div>
      )}
    </div>
  );
}
