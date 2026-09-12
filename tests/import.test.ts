import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resources, roadmaps, skills, validateCatalog } from "@/lib/content";
import { importedResources } from "@/lib/content/resources.imported";

const research = JSON.parse(
  readFileSync(path.join(process.cwd(), "content/research/learnpath-youtube-resources.json"), "utf8"),
) as {
  categories: { resources: { id: string; embed_status: string; youtube_video_id?: string }[] }[];
  rejected_resources: { youtube_video_id: string }[];
};

const shipped = new Map(research.categories.flatMap((c) => c.resources.map((r) => [r.id, r])));
const rejected = new Set(research.rejected_resources.map((r) => r.youtube_video_id));

describe("imported dataset", () => {
  it("keeps the whole catalog reference-clean", () => {
    expect(validateCatalog()).toEqual([]);
  });

  it("ships every imported resource with a verified embed", () => {
    expect(importedResources.length).toBeGreaterThan(150);
    for (const r of importedResources) {
      const twin = shipped.get(r.id);
      expect(twin, `${r.id} missing from research file`).toBeTruthy();
      expect(twin!.embed_status, `${r.id} not embed-verified`).toBe("verified");
      if (r.youtubeId) expect(rejected.has(r.youtubeId), `${r.id} was rejected by research`).toBe(false);
    }
  });

  it("never ships a youtube-typed resource without an id", () => {
    for (const r of resources) {
      if (r.type === "youtube-course" || r.type === "youtube-video") {
        expect(r.youtubeId, r.id).toBeTruthy();
        expect(r.url).toContain(r.youtubeId!);
      }
    }
  });

  it("groups every roadmap into stages that cover every node exactly once", () => {
    for (const roadmap of roadmaps) {
      expect(roadmap.stages.length, roadmap.slug).toBeGreaterThan(0);
      const seen = roadmap.stages.flatMap((s) => s.nodeIds);
      expect(new Set(seen).size).toBe(seen.length);
      expect(seen.slice().sort()).toEqual(roadmap.nodes.map((n) => n.id).sort());
    }
  });

  it("grew the curriculum without breaking the six original roadmaps", () => {
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
    expect(skills.length).toBeGreaterThanOrEqual(58);
    expect(resources.length).toBeGreaterThanOrEqual(218);
  });
});
