"use client";

import { PracticeWorkspace } from "@/components/practice/workspace";
import type { PracticeExercise } from "@/lib/content";
import { useState } from "react";

export function PracticeClient({
  language,
  exercises,
  initial,
  prompt,
}: {
  language: PracticeExercise["language"];
  exercises: PracticeExercise[];
  initial: string;
  prompt?: string;
}) {
  const [active, setActive] = useState(exercises[0]?.id);
  const current = exercises.find((e) => e.id === active);
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        {exercises.map((e) => (
          <button
            key={e.id}
            className={`block w-full rounded-md px-3 py-2 text-left text-sm ${e.id === active ? "bg-surface" : "text-muted"}`}
            onClick={() => setActive(e.id)}
          >
            {e.title}
          </button>
        ))}
      </aside>
      <PracticeWorkspace
        key={current?.id ?? "empty"}
        language={language}
        initialCode={current?.starter ?? initial}
        prompt={current?.prompt ?? prompt}
      />
    </div>
  );
}
