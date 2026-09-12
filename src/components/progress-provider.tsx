"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  applyProgress,
  LOCAL_NOTES_KEY,
  LOCAL_PROGRESS_KEY,
  mergeProgress,
  type ProgressRecord,
  type EntityType,
  type ProgressStatus,
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
  const userId = session?.user?.id;
  const isAuthed = Boolean(session?.user);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const local: ProgressRecord[] = JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY) || "[]");
      const localNotes: Record<string, string> = JSON.parse(localStorage.getItem(LOCAL_NOTES_KEY) || "{}");
      if (!isAuthed) {
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
    // Re-load when the authenticated user changes; primitives keep the
    // dependency list referentially stable.
  }, [userId, isAuthed]);

  // Sends exactly the records that changed. Never the array tail: upsertProgress
  // replaces existing entities in place, so the tail is usually an unrelated record.
  const syncRecord = useCallback(
    (record: ProgressRecord) => {
      if (!session?.user) return;
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch(() => {});
    },
    [session?.user],
  );

  const mark = useCallback(
    (entityType: EntityType, entityId: string, status: ProgressStatus = "completed") => {
      const record: ProgressRecord = { entityType, entityId, status, updatedAt: Date.now() };
      const { next, changed } = applyProgress(progress, record);
      setProgress(next);
      if (!session?.user) {
        localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
        return;
      }
      // Sync exactly the record that changed — never the array tail.
      if (changed) syncRecord(record);
    },
    [progress, session?.user, syncRecord],
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
