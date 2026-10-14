import { describe, expect, it } from "vitest";
import {
  FREEVERSE_ASSESSMENTS,
  FREEVERSE_URL,
  getAssessmentForSkill,
  getFreeVerseAssessmentUrl,
  getFreeVerseCredentialUrl,
} from "@/lib/freeverse";
import { skills } from "@/lib/content";

describe("freeverse integration", () => {
  it("provides valid base URL", () => {
    expect(FREEVERSE_URL).toBeTruthy();
    expect(FREEVERSE_URL.startsWith("http")).toBe(true);
  });

  it("has defined assessments with required properties", () => {
    expect(FREEVERSE_ASSESSMENTS.length).toBeGreaterThan(0);
    for (const a of FREEVERSE_ASSESSMENTS) {
      expect(a.id).toBeTruthy();
      expect(a.slug).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.credentialTitle).toBeTruthy();
      expect(a.durationMinutes).toBeGreaterThan(0);
      expect(a.skillsCovered.length).toBeGreaterThan(0);
    }
  });

  it("finds matching assessment for core skills", () => {
    const py = getAssessmentForSkill("python-syntax");
    expect(py).not.toBeNull();
    expect(py?.category).toBe("python");

    const web = getAssessmentForSkill("react-basics");
    expect(web).not.toBeNull();
    expect(web?.category).toBe("web");

    const sec = getAssessmentForSkill("owasp-top-10");
    expect(sec).not.toBeNull();
    expect(sec?.category).toBe("security");
  });

  it("generates correct deep link with query parameters", () => {
    const url = getFreeVerseAssessmentUrl("python-syntax", {
      returnUrl: "https://learnpath.example/me",
      projectSlug: "py-cli-todo",
    });
    expect(url).toContain(FREEVERSE_URL);
    expect(url).toContain("skill=python-syntax");
    expect(url).toContain("source=learnpath");
    expect(url).toContain("project=py-cli-todo");
  });

  it("generates correct credential deep link", () => {
    const credUrl = getFreeVerseCredentialUrl("python-syntax");
    expect(credUrl).toContain(FREEVERSE_URL);
    expect(credUrl).toContain("/credentials/");
    expect(credUrl).toContain("source=learnpath");
  });

  it("matches majority of roadmap skills to a relevant assessment pathway", () => {
    let matchedCount = 0;
    for (const s of skills) {
      if (getAssessmentForSkill(s.id) || getAssessmentForSkill(s.slug)) {
        matchedCount++;
      }
    }
    // At least 90% of skills should resolve to a FreeVerse assessment pathway
    expect(matchedCount / skills.length).toBeGreaterThan(0.9);
  });
});
