"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResourceCard } from "./resource-card";
import type { Resource } from "@/lib/content";

const STEP_MS = 3400; // one card per tick — calm, readable pacing
const CARD_STEP = 336; // card width + gap

/**
 * Accessible horizontal rail: native scroll-snap + real buttons, plus a calm
 * auto-advance (one card at a time, loops). Auto-advance pauses on hover,
 * focus, touch, wheel, manual clicks, tab-hidden, off-screen, and is disabled
 * entirely under prefers-reduced-motion.
 */
export function ResourceRail({ picks }: { picks: Resource[] }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const pauseUntil = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const bump = useCallback((ms: number) => {
    // Soft pause: interval keeps running but skips ticks until deadline.
    pauseUntil.current = Date.now() + ms;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const id = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail || document.hidden) return;
      if (Date.now() < pauseUntil.current) return;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 12;
      if (atEnd) rail.scrollTo({ left: 0, behavior: "smooth" });
      else rail.scrollBy({ left: CARD_STEP, behavior: "smooth" });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  // pause while off-screen (no motion where nobody watches)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setPaused(!entries.some((e) => e.isIntersecting)),
      { threshold: 0.15 },
    );
    io.observe(rail);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-end gap-2">
        <p className="meta mr-auto" aria-hidden>
          {paused ? "paused" : "auto-scrolling — hover to pause"}
        </p>
        <RailButton
          dir={-1}
          onClick={() => {
            bump(STEP_MS * 2);
            railRef.current?.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
          }}
        />
        <RailButton
          dir={1}
          onClick={() => {
            bump(STEP_MS * 2);
            railRef.current?.scrollBy({ left: CARD_STEP, behavior: "smooth" });
          }}
        />
      </div>
      <div
        ref={railRef}
        role="region"
        aria-label="Editor's picks — auto-scrolling resource rail, pauses on hover or focus"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={() => bump(9000)}
        onTouchMove={() => bump(9000)}
        onWheel={() => bump(6000)}
        className="mt-3 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 focus-visible:outline-2 focus-visible:outline-primary sm:mx-0 sm:px-0"
      >
        {picks.map((r) => (
          <div key={r.id} className="w-[290px] shrink-0 snap-start sm:w-[320px]">
            <ResourceCard resource={r} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RailButton({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === -1 ? "Scroll picks left" : "Scroll picks right"}
      onClick={onClick}
      className="rounded-md border border-line p-2 text-muted transition-colors hover:text-fg"
    >
      {dir === -1 ? <ChevronLeft className="h-4 w-4" aria-hidden /> : <ChevronRight className="h-4 w-4" aria-hidden />}
    </button>
  );
}
