"use client";

import { BookOpen, Hammer, Map as MapIcon, Search, Terminal, Waves , Newspaper } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { SearchHit } from "@/lib/search";
import { SearchBox } from "./search-box";
import { Badge, EmptyState, Skeleton } from "./ui";

const KIND_META = {
  roadmap: { icon: MapIcon, label: "Roadmaps" },
  skill: { icon: Waves, label: "Skills" },
  resource: { icon: BookOpen, label: "Resources" },
  challenge: { icon: Terminal, label: "Challenges" },
  project: { icon: Hammer, label: "Projects" },
  blog: { icon: Newspaper, label: "Journal" },
} as const;

/**
 * Instant results against /api/search (MiniSearch on the server). All state
 * changes happen in the input event handler — debounced by a timer — so no
 * effect ever setState-synchronously and every render is event-driven.
 */
export function SearchResults({ initialQ, initialHits }: { initialQ: string; initialHits: SearchHit[] }) {
  const [q, setQ] = useState(initialQ);
  const [hits, setHits] = useState<SearchHit[]>(initialHits);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  function onValue(value: string) {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    const query = value.trim();
    if (!query) {
      setHits([]);
      setPending(false);
      replaceUrl("/search");
      return;
    }
    setPending(true);
    timer.current = setTimeout(async () => {
      const id = ++seq.current;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok && id === seq.current) setHits((await res.json()) as SearchHit[]);
      } catch {
        if (id === seq.current) setHits([]);
      } finally {
        if (id === seq.current) setPending(false);
      }
      replaceUrl(`/search?q=${encodeURIComponent(query)}`);
    }, 180);
  }

  function replaceUrl(url: string) {
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== url) {
      window.history.replaceState(null, "", url);
    }
  }

  const groups = (Object.keys(KIND_META) as (keyof typeof KIND_META)[]).map((kind) => ({
    kind,
    items: hits.filter((h) => h.kind === kind),
  }));

  return (
    <div>
      <SearchBox large initial={initialQ} onValue={onValue} />
      {pending ? (
        <div className="mt-8 space-y-3" aria-busy="true">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : q.trim() && !hits.length ? (
        <div className="mt-8">
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Nothing matches"
            body="Try a skill name, a language, a provider such as freeCodeCamp, or a topic like RAG."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map(({ kind, items }) =>
            items.length ? (
              <section key={kind} aria-labelledby={`group-${kind}`}>
                <h2 id={`group-${kind}`} className="eyebrow flex items-center gap-2">
                  {(() => {
                    const Icon = KIND_META[kind].icon;
                    return <Icon className="h-3.5 w-3.5" aria-hidden />;
                  })()}
                  {KIND_META[kind].label} · {items.length}
                </h2>
                <ul className="mt-3 grid gap-3 md:grid-cols-2">
                  {items.slice(0, 8).map((h) => (
                    <li key={h.id}>
                      <Link
                        href={h.href}
                        className="group surface card-hover flex h-full flex-col gap-1.5 rounded-lg p-4"
                      >
                        <span className="font-medium transition-colors group-hover:text-primary">{h.title}</span>
                        <span className="line-clamp-2 text-sm text-muted">{h.excerpt}</span>
                        <Badge className="mt-1 self-start">{h.kind}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
