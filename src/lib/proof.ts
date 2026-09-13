import type { Skill } from "./content";
import { completedIds, type ProgressRecord } from "./progress-shared";

/**
 * Proof of skill — the honest evidence model.
 *
 * No XP, no coins, no streaks. A skill's state is derived ONLY from real
 * completion records the learner earned:
 *
 *   learned         — skill marked complete
 *   practiced       — any linked resource marked complete
 *   challengePassed — any linked challenge passed (tests green in the browser)
 *   applied         — any linked project marked complete
 *
 *   SKILL DEMONSTRATED = learned AND (challengePassed OR applied)
 *
 * States: NOT STARTED → LEARNING → PROVEN → APPLIED.
 */
export type SkillProof = {
  learned: boolean;
  practiced: boolean;
  challengePassed: boolean;
  applied: boolean;
  demonstrated: boolean;
  state: "not-started" | "learning" | "proven" | "applied";
};

export function linkedResourceIds(skill: Skill): string[] {
  const slots = Object.values(skill.resources).filter((v): v is string => Boolean(v));
  return [...new Set([...slots, ...skill.extraResourceIds])];
}

export function skillProof(progress: ProgressRecord[], skill: Skill): SkillProof {
  const done = {
    skill: completedIds(progress, "skill"),
    resource: completedIds(progress, "resource"),
    challenge: completedIds(progress, "challenge"),
    project: completedIds(progress, "project"),
    practice: completedIds(progress, "practice"),
  };
  const learned = done.skill.has(skill.id);
  const practiced =
    (skill.practiceId ? done.practice.has(skill.practiceId) : false) ||
    linkedResourceIds(skill).some((id) => done.resource.has(id));
  const challengePassed = skill.challengeIds.some((id) => done.challenge.has(id));
  const applied = skill.projectIds.some((id) => done.project.has(id));
  const demonstrated = learned && (challengePassed || applied);

  const state: SkillProof["state"] = demonstrated
    ? applied
      ? "applied"
      : "proven"
    : learned || practiced || progress.some((p) => p.entityId === skill.id)
      ? "learning"
      : "not-started";

  return { learned, practiced, challengePassed, applied, demonstrated, state };
}

export const PROOF_STATE_LABEL: Record<SkillProof["state"], string> = {
  "not-started": "Not started",
  learning: "Learning",
  proven: "Skill demonstrated",
  applied: "Applied in a project",
};

/** Catalog-wide proof summary for the dashboard. */
export function proofSummary(progress: ProgressRecord[], allSkills: Skill[]) {
  const doneSkills = completedIds(progress, "skill");
  const doneChallenges = completedIds(progress, "challenge");
  const doneProjects = completedIds(progress, "project");
  const demonstrated = allSkills.filter((s) => skillProof(progress, s).demonstrated);
  return {
    demonstratedCount: demonstrated.length,
    demonstratedSkills: demonstrated,
    skillsCompleted: doneSkills.size,
    challengesPassed: doneChallenges.size,
    projectsShipped: doneProjects.size,
  };
}
