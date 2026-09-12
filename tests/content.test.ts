import { describe, expect, it } from "vitest";
import { getRoadmapProgress, roadmaps, validateCatalog } from "@/lib/content";

describe("catalog", () => {
  it("validates without dangling references", () => {
    expect(validateCatalog()).toEqual([]);
  });

  it("ships six roadmaps", () => {
    expect(roadmaps.map((r) => r.slug).sort()).toEqual(
      [
        "agentic-ai-engineer",
        "ai-engineer",
        "full-stack-developer",
        "generative-ai-engineer",
        "junior-cybersecurity",
        "python-developer",
      ].sort(),
    );
  });

  it("computes required-skill progress", () => {
    const roadmap = roadmaps.find((r) => r.slug === "python-developer")!;
    const none = getRoadmapProgress(roadmap, new Set());
    expect(none.percent).toBe(0);
    const all = getRoadmapProgress(roadmap, new Set(roadmap.nodes.map((n) => n.skillId)));
    expect(all.percent).toBe(100);
  });
});
