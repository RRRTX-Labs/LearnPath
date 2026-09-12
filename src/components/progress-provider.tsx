"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  LOCAL_NOTES_KEY,
  LOCAL_PROGRESS_KEY,
  mergeProgress,
  type ProgressRecord,
  type EntityType,
  type ProgressStatus,
  upsertProgress,
} from "@/lib/progress-shared";

type Ctx = {
  progress: ProgressRecord[];
  notes: Record<string, string>;
  mark: (entityType: EntityType, entityId: string, status?: ProgressStatus) => void;
  isDone: (entityType: EntityType, entityId: string) => boolean;
  setNote: (skillId: string, body: string) => void;
  noteFor: (skillId: string) => string;
  ready: boolean;
};

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const local: ProgressRecord[] = JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY) || "[]");
      const localNotes: Record<string, string> = JSON.parse(localStorage.getItem(LOCAL_NOTES_KEY) || "{}");
      if (!session?.user) {
        if (!cancelled) {
          setProgress(local);
          setNotes(localNotes);
          setReady(true);
        }
        return;
      }
      try {
        const res = await fetch("/api/progress");
        const remote = res.ok ? ((await res.json()) as ProgressRecord[]) : [];
        const merged = mergeProgress(local, remote);
        if (merged.length && local.length) {
          await fetch("/api/progress", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: merged }),
          });
          localStorage.removeItem(LOCAL_PROGRESS_KEY);
        }
        const notesRes = await fetch("/api/notes");
        const remoteNotes = notesRes.ok ? ((await notesRes.json()) as Record<string, string>) : {};
        const mergedNotes = { ...localNotes, ...remoteNotes };
        if (!cancelled) {
          setProgress(merged);
          setNotes(mergedNotes);
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setProgress(local);
          setNotes(localNotes);
          setReady(true);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // Re-load when the authenticated user changes.
  }, [session?.user?.id]);

  const persist = useCallback(
    (next: ProgressRecord[]) => {
      setProgress(next);
      if (!session?.user) {
        localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
        return;
      }
      const last = next[next.length - 1];
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(last),
      }).catch(() => {});
    },
    [session?.user],
  );

  const mark = useCallback(
    (entityType: EntityType, entityId: string, status: ProgressStatus = "completed") => {
      persist(upsertProgress(progress, { entityType, entityId, status, updatedAt: Date.now() }));
    },
    [persist, progress],
  );

  const isDone = useCallback(
    (entityType: EntityType, entityId: string) =>
      progress.some((p) => p.entityType === entityType && p.entityId === entityId && p.status === "completed"),
    [progress],
  );

  const setNote = useCallback(
    (skillId: string, body: string) => {
      setNotes((prev) => {
        const next = { ...prev, [skillId]: body };
        if (!session?.user) localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(next));
        else {
          fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skillId, body }),
          }).catch(() => {});
        }
        return next;
      });
    },
    [session?.user],
  );

  const noteFor = useCallback((skillId: string) => notes[skillId] ?? "", [notes]);

  const value = useMemo(
    () => ({ progress, notes, mark, isDone, setNote, noteFor, ready }),
    [progress, notes, mark, isDone, setNote, noteFor, ready],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress outside provider");
  return ctx;
}
