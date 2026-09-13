"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResourceCard } from "./resource-card";
import type { Resource } from "@/lib/content";

/** Accessible horizontal rail: native scroll-snap + real buttons, keyboard & touch friendly. */
export function ResourceRail({ picks }: { picks: Resource[] }) {
  return (
    <div className="mt-8">
      <div className="flex justify-end gap-2">
        <RailButton dir={-1} />
        <RailButton dir={1} />
      </div>
      <div
        id="picks-rail"
        role="region"
        aria-label="Editor's picks — scrollable resource rail"
        tabIndex={0}
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

function RailButton({ dir }: { dir: -1 | 1 }) {
  return (
    <button
      type="button"
      aria-label={dir === -1 ? "Scroll picks left" : "Scroll picks right"}
      onClick={() => {
        const rail = document.getElementById("picks-rail");
        rail?.scrollBy({ left: dir * 340, behavior: "smooth" });
      }}
      className="rounded-md border border-line p-2 text-muted transition-colors hover:text-fg"
    >
      {dir === -1 ? <ChevronLeft className="h-4 w-4" aria-hidden /> : <ChevronRight className="h-4 w-4" aria-hidden />}
    </button>
  );
}

