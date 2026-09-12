import { z } from "zod";

export const resourceTypeSchema = z.enum([
  "youtube-course",
  "youtube-video",
  "playlist",
  "documentation",
  "article",
  "interactive",
  "project",
  "cheatsheet",
]);

export const resourceLabelSchema = z.enum([
  "best-overall",
  "best-beginner",
  "fastest",
  "project-based",
  "advanced",
  "official-docs",
  "hidden-gem",
]);

export const levelSchema = z.enum(["beginner", "intermediate", "advanced"]);

export const resourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  provider: z.string().min(1),
  url: z.string().url(),
  type: resourceTypeSchema,
  youtubeId: z.string().optional(),
  playlistId: z.string().optional(),
  level: levelSchema,
  durationMinutes: z.number().int().nonnegative(),
  language: z.string().default("en"),
  topics: z.array(z.string()),
  projectBased: z.boolean().default(false),
  editorScore: z.number().int().min(0).max(100),
  lastVerified: z.string(),
  status: z.enum(["active", "unavailable", "deprecated"]).default("active"),
  editorNote: z.string(),
  labels: z.array(resourceLabelSchema).default([]),
});

export const skillSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  objectives: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()).default([]),
  resources: z.object({
    best: z.string(),
    alternative: z.string().optional(),
    quick: z.string().optional(),
    project: z.string().optional(),
    docs: z.string().optional(),
  }),
  extraResourceIds: z.array(z.string()).default([]),
  practiceId: z.string().optional(),
  challengeIds: z.array(z.string()).default([]),
  projectIds: z.array(z.string()).default([]),
});

export const roadmapNodeSchema = z.object({
  id: z.string(),
  skillId: z.string(),
  x: z.number(),
  y: z.number(),
  tier: z.enum(["foundation", "core", "practice", "project", "mastery"]),
  requirement: z.enum(["required", "recommended", "optional"]).default("required"),
});

export const roadmapSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  category: z.enum(["ai", "language", "web", "security"]),
  difficulty: levelSchema,
  estimatedHours: z.number(),
  featured: z.boolean().default(false),
  editorPick: z.boolean().default(false),
  color: z.string(),
  prerequisites: z.array(z.string()).default([]),
  nodes: z.array(roadmapNodeSchema).min(1),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      kind: z.enum(["required", "recommended", "optional"]).default("required"),
    }),
  ),
});

export const challengeTestSchema = z.object({
  id: z.string(),
  description: z.string(),
  code: z.string(),
});

export const challengeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  skillId: z.string(),
  language: z.enum(["python", "javascript", "typescript", "sql", "html"]),
  difficulty: levelSchema,
  prompt: z.string(),
  starter: z.string(),
  tests: z.array(challengeTestSchema).min(1),
  hints: z.array(z.string()).default([]),
  estimatedMinutes: z.number().default(15),
});

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  skillIds: z.array(z.string()),
  difficulty: levelSchema,
  estimatedHours: z.number(),
  language: z.enum(["python", "javascript", "typescript", "sql", "html"]),
  requirements: z.array(z.string()),
  starter: z.record(z.string(), z.string()),
  hints: z.array(z.string()).default([]),
});

export const practiceExerciseSchema = z.object({
  id: z.string(),
  title: z.string(),
  prompt: z.string(),
  starter: z.string(),
  language: z.enum(["python", "javascript", "typescript", "sql", "html"]),
  seedSql: z.string().optional(),
});

export type Resource = z.infer<typeof resourceSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type Project = z.infer<typeof projectSchema>;
export type PracticeExercise = z.infer<typeof practiceExerciseSchema>;

export const labelCopy: Record<z.infer<typeof resourceLabelSchema>, string> = {
  "best-overall": "LearnPath pick",
  "best-beginner": "Best for beginners",
  "fastest": "Fastest path",
  "project-based": "Project-based",
  "advanced": "Advanced",
  "official-docs": "Official docs",
  "hidden-gem": "Hidden gem",
};
