import {
  blogPostSchema,
  challengeSchema,
  practiceExerciseSchema,
  projectSchema,
  resourceSchema,
  roadmapSchema,
  skillSchema,
  type BlogBlock,
  type BlogCategory,
  type BlogPost,
  type Challenge,
  type PracticeExercise,
  type Project,
  type Resource,
  type Roadmap,
  type Skill,
} from "./schema";
import { blogPosts as rawBlogPosts } from "./blog";
import { challenges as rawChallenges } from "./challenges";
import { practiceExercises as rawPractice } from "./practice";
import { projects as rawProjects } from "./projects";
import { resources as rawResources } from "./resources";
import { importedResources } from "./resources.imported";
import { roadmaps as rawRoadmaps } from "./roadmaps";
import { skills as rawSkills } from "./skills";
import { importedSkills } from "./skills.imported";
import { importedWiring } from "./skill-wiring";

/**
 * Dataset wiring is merged into hand-authored skills *before* Zod parsing, so a
 * dangling reference in generated output fails the build instead of shipping.
 * Human editorial slots always win; generated slots only fill empty ones.
 */
function applyWiring(skill: unknown): unknown {
  const s = skill as {
    id: string;
    resources: { quick?: string; project?: string; docs?: string };
    extraResourceIds?: string[];
  };
  const w = importedWiring[s.id];
  if (!w) return skill;
  return {
    ...s,
    resources: {
      ...s.resources,
      quick: s.resources.quick ?? w.quick,
      project: s.resources.project ?? w.project,
      docs: s.resources.docs ?? w.docs,
    },
    extraResourceIds: [...(s.extraResourceIds ?? []), ...w.extra],
  };
}

function parseAll<T>(name: string, schema: { parse: (v: unknown) => T }, items: unknown[]): T[] {
  return items.map((item, i) => {
    try {
      return schema.parse(item);
    } catch (error) {
      throw new Error(`${name}[${i}] (${(item as { id?: string }).id ?? "?"}) failed validation: ${error}`);
    }
  });
}

export const resources = parseAll("resources", resourceSchema, [...rawResources, ...importedResources]);
export const skills = parseAll("skills", skillSchema, [...rawSkills, ...importedSkills].map(applyWiring));
export const roadmaps = parseAll("roadmaps", roadmapSchema, rawRoadmaps);
export const challenges = parseAll("challenges", challengeSchema, rawChallenges);
export const projects = parseAll("projects", projectSchema, rawProjects);
export const practiceExercises = parseAll("practice", practiceExerciseSchema, rawPractice);
export const blogPosts = parseAll("blog", blogPostSchema, rawBlogPosts);

export const resourceById = new Map(resources.map((r) => [r.id, r]));
export const skillById = new Map(skills.map((s) => [s.id, s]));
export const skillBySlug = new Map(skills.map((s) => [s.slug, s]));
export const roadmapBySlug = new Map(roadmaps.map((r) => [r.slug, r]));
export const challengeById = new Map(challenges.map((c) => [c.id, c]));
export const challengeBySlug = new Map(challenges.map((c) => [c.slug, c]));
export const projectById = new Map(projects.map((p) => [p.id, p]));
export const projectBySlug = new Map(projects.map((p) => [p.slug, p]));
export { blogCategoryCopy } from "./schema";

export const practiceById = new Map(practiceExercises.map((p) => [p.id, p]));
export const blogPostById = new Map(blogPosts.map((p) => [p.id, p]));
export const blogPostBySlug = new Map(blogPosts.map((p) => [p.slug, p]));

export function validateCatalog(): string[] {
  const errors: string[] = [];
  const ids = (xs: { id: string }[]) => {
    const seen = new Set<string>();
    for (const x of xs) {
      if (seen.has(x.id)) errors.push(`Duplicate id ${x.id}`);
      seen.add(x.id);
    }
  };
  ids(resources);
  ids(skills);
  ids(roadmaps);
  ids(challenges);
  ids(projects);
  ids(blogPosts);
  {
    const seenSlugs = new Set<string>();
    for (const post of blogPosts) {
      if (seenSlugs.has(post.slug)) errors.push(`Duplicate blog slug ${post.slug}`);
      seenSlugs.add(post.slug);
      for (const id of post.relatedSkillIds) {
        if (!skillById.has(id)) errors.push(`Blog ${post.id} missing related skill ${id}`);
      }
      for (const id of post.relatedRoadmapIds) {
        if (!roadmaps.some((r) => r.id === id)) errors.push(`Blog ${post.id} missing related roadmap ${id}`);
      }
    }
  }

  for (const skill of skills) {
    for (const key of ["best", "alternative", "quick", "project", "docs"] as const) {
      const ref = skill.resources[key];
      if (ref && !resourceById.has(ref)) errors.push(`Skill ${skill.id} missing resource ${ref}`);
    }
    for (const id of skill.prerequisites) {
      if (!skillById.has(id)) errors.push(`Skill ${skill.id} missing prerequisite ${id}`);
    }
    if (skill.practiceId && !practiceById.has(skill.practiceId)) {
      errors.push(`Skill ${skill.id} missing practice ${skill.practiceId}`);
    }
    for (const id of skill.challengeIds) {
      if (!challengeById.has(id)) errors.push(`Skill ${skill.id} missing challenge ${id}`);
    }
    for (const id of skill.projectIds) {
      if (!projectById.has(id)) errors.push(`Skill ${skill.id} missing project ${id}`);
    }
  }

  for (const roadmap of roadmaps) {
    const nodeIds = new Set(roadmap.nodes.map((n) => n.id));
    for (const node of roadmap.nodes) {
      if (!skillById.has(node.skillId)) errors.push(`Roadmap ${roadmap.id} missing skill ${node.skillId}`);
    }
    for (const edge of roadmap.edges) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
        errors.push(`Roadmap ${roadmap.id} bad edge ${edge.from} -> ${edge.to}`);
      }
    }
    const staged = new Set<string>();
    for (const stage of roadmap.stages) {
      for (const nid of stage.nodeIds) {
        if (!nodeIds.has(nid)) errors.push(`Roadmap ${roadmap.id} stage ${stage.id} unknown node ${nid}`);
        if (staged.has(nid)) errors.push(`Roadmap ${roadmap.id} node ${nid} in two stages`);
        staged.add(nid);
      }
    }
    for (const nid of nodeIds) {
      if (roadmap.stages.length && !staged.has(nid)) {
        errors.push(`Roadmap ${roadmap.id} node ${nid} missing from stages`);
      }
    }
  }

  // Imported resources must never ship unverified embeds.
  for (const resource of resources) {
    if ((resource.type === "youtube-course" || resource.type === "youtube-video") && !resource.youtubeId) {
      errors.push(`Resource ${resource.id} is a youtube type without youtubeId`);
    }
    if (resource.youtubeId && !resource.url.includes(resource.youtubeId)) {
      errors.push(`Resource ${resource.id} url does not contain its youtubeId`);
    }
  }

  for (const challenge of challenges) {
    if (!skillById.has(challenge.skillId)) errors.push(`Challenge ${challenge.id} missing skill`);
  }
  for (const project of projects) {
    for (const id of project.skillIds) {
      if (!skillById.has(id)) errors.push(`Project ${project.id} missing skill ${id}`);
    }
  }
  return errors;
}

export function getRoadmapProgress(roadmap: Roadmap, completedSkillIds: Set<string>) {
  const required = roadmap.nodes.filter((n) => n.requirement === "required");
  const done = required.filter((n) => completedSkillIds.has(n.skillId)).length;
  const percent = required.length === 0 ? 0 : Math.round((done / required.length) * 100);
  return { done, total: required.length, percent };
}

export function resourcesForSkill(skill: Skill): { slot: string; resource: Resource }[] {
  const slots: { slot: string; key: keyof Skill["resources"] }[] = [
    { slot: "LearnPath pick", key: "best" },
    { slot: "Alternative", key: "alternative" },
    { slot: "Quick path", key: "quick" },
    { slot: "Project-oriented", key: "project" },
    { slot: "Official docs", key: "docs" },
  ];
  const seen = new Set<string>();
  const out: { slot: string; resource: Resource }[] = [];
  for (const { slot, key } of slots) {
    const id = skill.resources[key];
    if (!id || seen.has(id)) continue;
    const resource = resourceById.get(id);
    if (!resource) continue;
    seen.add(id);
    out.push({ slot, resource });
  }
  for (const id of skill.extraResourceIds) {
    if (seen.has(id)) continue;
    const resource = resourceById.get(id);
    if (!resource) continue;
    seen.add(id);
    out.push({ slot: "More curated", resource });
  }
  return out;
}

export type { BlogBlock, BlogCategory, BlogPost, Challenge, PracticeExercise, Project, Resource, Roadmap, Skill };
