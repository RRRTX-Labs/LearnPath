import { describe, expect, it } from "vitest";
import { linkedResourceIds, proofSummary, skillProof } from "@/lib/proof";
import { skills } from "@/lib/content";
import type { ProgressRecord } from "@/lib/progress-shared";

const skill = skills.find((s) => s.challengeIds.length && s.resources.best)!;

const rec = (entityType: ProgressRecord["entityType"], entityId: string): ProgressRecord => ({
  entityType,
  entityId,
  status: "completed",
  updatedAt: 1,
});

describe("skillProof", () => {
  it("is not-started with no records", () => {
    const p = skillProof([], skill);
    expect(p.state).toBe("not-started");
    expect(p.demonstrated).toBe(false);
  });

  it("is learning when only the skill is completed", () => {
    const p = skillProof([rec("skill", skill.id)], skill);
    expect(p.learned).toBe(true);
    expect(p.state).toBe("learning");
    expect(p.demonstrated).toBe(false);
  });

  it("becomes proven when learned AND a linked challenge passed", () => {
    const p = skillProof([rec("skill", skill.id), rec("challenge", skill.challengeIds[0])], skill);
    expect(p.challengePassed).toBe(true);
    expect(p.demonstrated).toBe(true);
    expect(p.state).toBe("proven");
  });

  it("becomes applied when a linked project is also complete", () => {
    if (!skill.projectIds.length) return; // skip when skill has no project link
    const records = [
      rec("skill", skill.id),
      rec("challenge", skill.challengeIds[0]),
      rec("project", skill.projectIds[0]),
    ];
    expect(skillProof(records, skill).state).toBe("applied");
  });

  it("counts a completed linked resource as practiced", () => {
    const p = skillProof([rec("resource", skill.resources.best)], skill);
    expect(p.practiced).toBe(true);
    expect(p.state).toBe("learning");
  });

  it("never claims demonstrated from a challenge alone (must be learned too)", () => {
    const p = skillProof([rec("challenge", skill.challengeIds[0])], skill);
    expect(p.demonstrated).toBe(false);
  });
});

describe("linkedResourceIds", () => {
  it("includes slots and extras without duplicates", () => {
    const ids = linkedResourceIds(skill);
    expect(ids).toContain(skill.resources.best);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("proofSummary", () => {
  it("aggregates honest counts", () => {
    const s = proofSummary([rec("challenge", skill.challengeIds[0])], skills);
    expect(s.challengesPassed).toBe(1);
    expect(s.demonstratedCount).toBe(0); // not learned → not demonstrated
  });
});
