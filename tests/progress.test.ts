import { describe, expect, it } from "vitest";
import { applyProgress, mergeProgress, upsertProgress, type ProgressRecord } from "@/lib/progress-shared";

const rec = (id: string, status: ProgressRecord["status"], t: number): ProgressRecord => ({
  entityType: "skill",
  entityId: id,
  status,
  updatedAt: t,
});

describe("progress", () => {
  it("does not downgrade completed to started", () => {
    const list = [rec("a", "completed", 1)];
    expect(upsertProgress(list, rec("a", "started", 2))[0].status).toBe("completed");
  });

  it("merges local and remote by recency without losing completion", () => {
    const local = [rec("a", "completed", 2)];
    const remote = [rec("a", "started", 1), rec("b", "completed", 3)];
    const merged = mergeProgress(local, remote);
    expect(merged.find((p) => p.entityId === "a")?.status).toBe("completed");
    expect(merged.find((p) => p.entityId === "b")?.status).toBe("completed");
  });
});

describe("applyProgress sync decision", () => {
  const mk = (status: "started" | "completed", at = 1) => ({
    entityType: "skill" as const,
    entityId: "python-syntax",
    status,
    updatedAt: at,
  });

  it("reports a change for new records", () => {
    const { next, changed } = applyProgress([], mk("completed"));
    expect(changed).toBe(true);
    expect(next).toHaveLength(1);
  });

  it("never downgrades completed to started, and syncs nothing", () => {
    const { next, changed } = applyProgress([mk("completed", 5)], mk("started", 9));
    expect(changed).toBe(false);
    expect(next[0].status).toBe("completed");
  });

  it("replaces in place so the synced record is the changed one", () => {
    const other = { entityType: "skill" as const, entityId: "git-basics", status: "completed" as const, updatedAt: 2 };
    const { next, changed } = applyProgress([other, mk("started", 1)], mk("completed", 7));
    expect(changed).toBe(true);
    expect(next).toHaveLength(2);
    expect(next[1]).toEqual(mk("completed", 7));
    expect(next[next.length - 1].entityId).toBe("python-syntax");
  });
});
