import { describe, expect, it } from "vitest";
import { mergeProgress, upsertProgress, type ProgressRecord } from "@/lib/progress-shared";

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
