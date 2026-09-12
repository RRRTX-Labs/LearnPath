import { describe, expect, it } from "vitest";
import { searchCatalog } from "@/lib/search";

describe("search", () => {
  it("finds the Python roadmap", () => {
    const hits = searchCatalog("python developer");
    expect(hits.some((h) => h.href.includes("python-developer"))).toBe(true);
  });

  it("returns empty for blank queries", () => {
    expect(searchCatalog("   ")).toEqual([]);
  });
});
