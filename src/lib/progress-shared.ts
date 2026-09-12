export type EntityType = "roadmap" | "skill" | "resource" | "challenge" | "project";
export type ProgressStatus = "started" | "completed";

export type ProgressRecord = {
  entityType: EntityType;
  entityId: string;
  status: ProgressStatus;
  updatedAt: number;
};

export const LOCAL_PROGRESS_KEY = "learnpath.progress.v1";
export const LOCAL_NOTES_KEY = "learnpath.notes.v1";

export function upsertProgress(list: ProgressRecord[], next: ProgressRecord): ProgressRecord[] {
  const i = list.findIndex((p) => p.entityType === next.entityType && p.entityId === next.entityId);
  if (i === -1) return [...list, next];
  const current = list[i];
  if (current.status === "completed" && next.status === "started") return list;
  const copy = list.slice();
  copy[i] = next;
  return copy;
}

export function completedIds(list: ProgressRecord[], type: EntityType): Set<string> {
  return new Set(list.filter((p) => p.entityType === type && p.status === "completed").map((p) => p.entityId));
}

/**
 * Apply `record` to `list` and report whether anything actually changed.
 * Completion is sticky: a later "started" never downgrades a "completed",
 * and in that case nothing must be synced to the server.
 */
export function applyProgress(
  list: ProgressRecord[],
  record: ProgressRecord,
): { next: ProgressRecord[]; changed: boolean } {
  const i = list.findIndex((p) => p.entityType === record.entityType && p.entityId === record.entityId);
  if (i === -1) return { next: [...list, record], changed: true };
  const current = list[i];
  if (current.status === "completed" && record.status === "started") {
    return { next: list, changed: false };
  }
  const next = list.slice();
  next[i] = record;
  return { next, changed: true };
}

export function mergeProgress(local: ProgressRecord[], remote: ProgressRecord[]): ProgressRecord[] {
  const map = new Map<string, ProgressRecord>();
  for (const item of [...remote, ...local]) {
    const key = `${item.entityType}:${item.entityId}`;
    const prev = map.get(key);
    if (!prev || item.updatedAt >= prev.updatedAt) {
      if (prev?.status === "completed" && item.status === "started") {
        map.set(key, prev);
      } else {
        map.set(key, item);
      }
    }
  }
  return [...map.values()];
}
