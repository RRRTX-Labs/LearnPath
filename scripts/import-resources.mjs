#!/usr/bin/env node
/**
 * LearnPath resource importer.
 *
 * Reads the research inputs in content/research/ and regenerates three
 * canonical, Zod-validated catalog modules:
 *
 *   src/lib/content/resources.imported.ts  — the 172 verified resources
 *   src/lib/content/skills.imported.ts     — skills the dataset adds to the curriculum
 *   src/lib/content/skill-wiring.ts        — dataset → existing-skill slot wiring
 *
 * Hand-authored files (skills.ts, roadmaps.ts, resources.ts) are never touched:
 * human editorial picks stay authoritative; the dataset extends around them.
 *
 * Hard gates (also re-checked by tests/import.test.ts in CI):
 *   1. every emitted record matches src/lib/content/schema.ts field semantics;
 *   2. every emitted record is embed_status === "verified" in the research file;
 *   3. no record rejected by the research pass may be emitted;
 *   4. one best-overall label per repo skill (highest editorScore wins).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const research = JSON.parse(readFileSync(join(ROOT, "content/research/learnpath-youtube-resources.json"), "utf8"));
const importList = JSON.parse(readFileSync(join(ROOT, "content/research/learnpath-resources.import.json"), "utf8"));

const shipped = new Map();
for (const cat of research.categories) for (const r of cat.resources) shipped.set(r.id, r);
const rejectedIds = new Set(research.rejected_resources.map((r) => r.youtube_video_id));

const TYPES = new Set(["youtube-course", "youtube-video", "playlist", "documentation", "article", "interactive", "project", "cheatsheet"]);
const LABELS = new Set(["best-overall", "best-beginner", "fastest", "project-based", "advanced", "official-docs", "hidden-gem"]);
const WARNINGS = new Set(["outdated", "missing_project", "fast_paced", "advanced", "incomplete", "requires_prerequisites", "framework_version_sensitive"]);

/* ------------------------------------------------------------------ *
 * Dataset skill_id → repo skill id.
 * "NEW:x" creates a skill in skills.imported.ts. Unlisted dataset skills
 * are intentionally left library-only (searchable, filterable, unslotted).
 * ------------------------------------------------------------------ */
const SKILL_MAP = {
  "programming-fundamentals": "NEW:programming-fundamentals",
  "data-structures-algorithms": "NEW:dsa-fundamentals",
  "python-syntax": "python-syntax",
  "python-functions": "python-functions",
  "python-oop": "python-oop",
  "python-projects": "python-syntax",
  "python-for-ai": "python-syntax",
  "python-automation": "python-functions",
  "python-web-apis": "NEW:python-web-apis",
  "git-basics": "git-basics",
  "git-collaboration": "git-basics",
  "linux-cli": "linux-cli",
  "linux-server-admin": "linux-cli",
  "sql-fundamentals": "sql-fundamentals",
  "sql-analytics": "sql-fundamentals",
  "database-design": "databases-orm",
  mongodb: "databases-orm",
  postgresql: "databases-orm",
  redis: "databases-orm",
  "html-css": "html-css",
  html: "html-css",
  css: "html-css",
  tailwind: "html-css",
  accessibility: "accessibility",
  "javascript-fundamentals": "javascript-fundamentals",
  "typescript-fundamentals": "typescript-fundamentals",
  "react-fundamentals": "react-fundamentals",
  nextjs: "NEW:nextjs-fundamentals",
  "fullstack-project": "NEW:nextjs-fundamentals",
  "node-express": "node-express",
  "backend-auth": "web-auth",
  "web-auth": "web-auth",
  "web-testing": "web-testing",
  docker: "NEW:containers-orchestration",
  kubernetes: "NEW:containers-orchestration",
  cicd: "NEW:cloud-cicd",
  "aws-cloud": "NEW:cloud-cicd",
  "gcp-cloud": "NEW:cloud-cicd",
  terraform: "NEW:cloud-cicd",
  "system-design": "NEW:system-design",
  "system-design-interview": "NEW:system-design",
  "data-wrangling": "data-wrangling",
  "data-science-fundamentals": "data-wrangling",
  "probability-stats": "probability-stats",
  "ml-fundamentals": "ml-fundamentals",
  "ml-algorithms": "ml-fundamentals",
  "ai-fundamentals": "ml-fundamentals",
  "neural-networks": "neural-networks",
  pytorch: "pytorch-intro",
  "mlops-basics": "mlops-basics",
  "ai-engineering": "mlops-basics",
  "transformers-llms": "transformers-llms",
  "llm-fundamentals": "transformers-llms",
  "local-llms": "transformers-llms",
  multimodal: "transformers-llms",
  prompting: "prompt-engineering",
  "llm-practice": "prompt-engineering",
  rag: "embeddings-rag",
  embeddings: "embeddings-rag",
  "vector-databases": "embeddings-rag",
  "ai-application-development": "embeddings-rag",
  "fine-tuning-basics": "fine-tuning-basics",
  "fine-tuning": "fine-tuning-basics",
  "genai-eval": "genai-eval-safety",
  "tool-use-apis": "tool-use-apis",
  mcp: "NEW:mcp-servers",
  "agent-architecture": "agent-architecture",
  "agent-frameworks": "NEW:agent-frameworks",
  "memory-planning": "memory-planning",
  "agent-safety": "agent-safety",
  "security-fundamentals": "NEW:security-fundamentals",
  "ethical-hacking": "vuln-assessment",
  owasp: "owasp-web",
  "networking-basics": "networking-basics",
  cryptography: "cryptography-basics",
  soc: "incident-response",
  "incident-response": "incident-response",
  "linux-hardening": "linux-hardening",
  "cloud-security": "linux-hardening",
};

/* ------------------------------------------------------------------ *
 * Skills the dataset adds. Copy is original LearnPath editorial voice.
 * `best` is resolved at generation time to the highest-scoring mapped
 * resource, so the slot is never a guess.
 * ------------------------------------------------------------------ */
const NEW_SKILLS = {
  "programming-fundamentals": {
    title: "Programming fundamentals",
    summary:
      "What a program actually is: variables, control flow, functions and data, and how a machine executes them — before any single language's syntax.",
    objectives: [
      "Explain what happens between source code and execution",
      "Reason about variables, control flow and functions language-agnostically",
      "Choose a first language with the right mental model",
    ],
    prerequisites: [],
  },
  "dsa-fundamentals": {
    title: "Data structures & algorithms",
    summary:
      "Arrays, lists, hash maps, trees and graphs with the classic algorithms and complexity analysis — typed out, not memorised, for interviews and for real code.",
    objectives: [
      "Implement and trace the core structures and algorithms",
      "State time and space complexity of a solution",
      "Apply recurring patterns (two pointers, sliding window, DP) under time pressure",
    ],
    prerequisites: ["python-syntax", "python-functions"],
  },
  "python-web-apis": {
    title: "Python web APIs",
    summary:
      "Ship an HTTP API in Python: routing, validation, JSON, errors and tests with a modern framework, ending in something you can deploy.",
    objectives: [
      "Design JSON endpoints with explicit validation",
      "Handle errors and status codes honestly",
      "Test an API end to end",
    ],
    prerequisites: ["python-functions", "python-oop"],
  },
  "containers-orchestration": {
    title: "Containers & orchestration",
    summary:
      "Docker images and containers you can explain line by line, then Kubernetes enough to deploy, scale and debug a workload without folklore.",
    objectives: [
      "Write a minimal, layered, production-sane Dockerfile",
      "Run, network and persist state for containers locally",
      "Read a Kubernetes deployment, service and pod failure",
    ],
    prerequisites: ["linux-cli"],
  },
  "cloud-cicd": {
    title: "CI/CD & cloud basics",
    summary:
      "Pipelines that test and deploy on every push, plus the small slice of cloud and infrastructure-as-code that a solo developer actually uses.",
    objectives: [
      "Build a CI pipeline with tests, lint and build gates",
      "Deploy automatically on merge with a rollback path",
      "Describe what your cloud provider is doing under the console",
    ],
    prerequisites: ["git-basics", "deploy-basics"],
  },
  "system-design": {
    title: "System design",
    summary:
      "How real systems stay up: caching, queues, replication, consistency trade-offs and capacity back-of-envelope — reasoned from constraints, not buzzwords.",
    objectives: [
      "Sketch a design from requirements and constraints",
      "Choose between cache, queue and replication with reasons",
      "Estimate load, storage and bandwidth on paper",
    ],
    prerequisites: ["databases-orm", "node-express"],
  },
  "nextjs-fundamentals": {
    title: "Next.js & full-stack React",
    summary:
      "The App Router mental model: server components, routing, data fetching and server actions, ending in a deployed full-stack project.",
    objectives: [
      "Decide what renders on the server and what on the client",
      "Route, load and cache data in the App Router",
      "Ship a full-stack feature end to end",
    ],
    prerequisites: ["react-fundamentals", "typescript-fundamentals"],
  },
  "mcp-servers": {
    title: "MCP & tool servers",
    summary:
      "The Model Context Protocol as software: tools, resources and prompts over a typed boundary you can inspect, version and least-privilege.",
    objectives: [
      "Explain MCP's client/server boundary and transport",
      "Build and test a tool server with explicit schemas",
      "Apply least privilege and auditability to agent tools",
    ],
    prerequisites: ["tool-use-apis"],
  },
  "agent-frameworks": {
    title: "Agent frameworks in practice",
    summary:
      "One framework deeply, several comparatively: loops, tool wiring, memory and tracing — and how to debug an agent run from its logs.",
    objectives: [
      "Build an agent loop with step limits and structured tools",
      "Trace and replay a failing agent run",
      "Compare frameworks on observability and control, not hype",
    ],
    prerequisites: ["agent-architecture"],
  },
  "security-fundamentals": {
    title: "Security fundamentals",
    summary:
      "The defensive baseline: the CIA triad, threat modelling, common control families and how to think about risk before touching any tool.",
    objectives: [
      "Model a simple system's threats and assets",
      "Map controls to threats with reasons",
      "Keep every exercise inside authorised, legal labs",
    ],
    prerequisites: ["ethics-law"],
  },
};

/* ------------------------------------------------------------------ *
 * Duplicates of resources the hand-curated catalog already ships.
 * The canonical (human-edited) entry wins; the dataset twin is skipped
 * rather than emitted as a second card for the same video.
 * ------------------------------------------------------------------ */
const SKIP_DUPLICATES = {
  "fcc-python-4h": "identical id and video to canonical resources.ts entry fcc-python-4h",
  "3b1b-nn-ch1": "same video (aircAruvnKk) as canonical 3b1b-nn",
  "karpathy-build-gpt": "same video (kCc8FmEb1nY) as canonical karpathy-gpt",
  "fcc-ml-for-everybody": "same video (i_LwzRVP7bg) as canonical fcc-ml",
  "fcc-git-crash-2020": "same video (RGOj5yH7evk) as canonical fcc-git",
};

/* ------------------------------------------------------------------ */

const errors = [];
const records = [];
const skipped = [];

for (const entry of importList) {
  if (SKIP_DUPLICATES[entry.id]) {
    skipped.push(`${entry.id}: ${SKIP_DUPLICATES[entry.id]}`);
    continue;
  }
  const twin = shipped.get(entry.id);
  if (!twin) {
    errors.push(`${entry.id}: not present in research dataset`);
    continue;
  }
  if (twin.embed_status !== "verified") {
    errors.push(`${entry.id}: embed_status=${twin.embed_status}`);
    continue;
  }
  if (entry.youtubeId && rejectedIds.has(entry.youtubeId)) {
    errors.push(`${entry.id}: in rejected list`);
    continue;
  }
  if (!TYPES.has(entry.type)) errors.push(`${entry.id}: bad type ${entry.type}`);
  for (const l of entry.labels) if (!LABELS.has(l)) errors.push(`${entry.id}: bad label ${l}`);
  for (const w of twin.warnings ?? []) if (!WARNINGS.has(w)) errors.push(`${entry.id}: bad warning ${w}`);

  const mapped = SKILL_MAP[twin.skill_id];
  const repoSkill = mapped && !mapped.startsWith("NEW:") ? mapped : mapped ? mapped.slice(4) : null;

  records.push({
    entry,
    twin,
    repoSkill,
    isNewSkill: Boolean(mapped && mapped.startsWith("NEW:")),
  });
}

if (errors.length) {
  console.error("Import refused:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

/* best-overall demotion: one per repo skill, highest editorScore wins. */
const bySkill = new Map();
for (const r of records) {
  if (!r.repoSkill) continue;
  if (!bySkill.has(r.repoSkill)) bySkill.set(r.repoSkill, []);
  bySkill.get(r.repoSkill).push(r);
}
for (const [, list] of bySkill) {
  const holders = list.filter((r) => r.entry.labels.includes("best-overall"));
  if (holders.length > 1) {
    holders.sort((a, b) => b.entry.editorScore - a.entry.editorScore);
    for (const h of holders.slice(1)) {
      h.entry = { ...h.entry, labels: h.entry.labels.filter((l) => l !== "best-overall") };
      h.demoted = true;
    }
  }
}

/* ------------------------------------------------------------ emit ---- */

const q = (s) => JSON.stringify(s);
const esc = (s) => q(s);

function resourceLiteral(r) {
  const e = r.entry;
  const t = r.twin;
  const lines = [
    "  {",
    `    id: ${esc(e.id)},`,
    `    title: ${esc(e.title)},`,
    `    provider: ${esc(e.provider)},`,
    `    url: ${esc(e.url)},`,
    `    type: ${esc(e.type)},`,
    ...(e.youtubeId ? [`    youtubeId: ${esc(e.youtubeId)},`] : []),
    ...(e.playlistId ? [`    playlistId: ${esc(e.playlistId)},`] : []),
    `    level: ${esc(e.level)},`,
    `    durationMinutes: ${e.durationMinutes},`,
    `    language: ${esc(e.language)},`,
    `    topics: [${e.topics.map(esc).join(", ")}],`,
    `    projectBased: ${e.projectBased},`,
    `    editorScore: ${e.editorScore},`,
    `    lastVerified: ${esc(e.lastVerified)},`,
    `    status: ${esc(e.status)},`,
    `    editorNote: ${esc(e.editorNote)},`,
    `    labels: [${e.labels.map(esc).join(", ")}],`,
    ...(t.published_at ? [`    publishedAt: ${esc(t.published_at)},`] : []),
    `    warnings: [${(t.warnings ?? []).map(esc).join(", ")}],`,
    `    learningOutcomes: [${(t.learning_outcomes ?? []).map(esc).join(", ")}],`,
    ...(t.playlist?.video_count ? [`    playlistVideoCount: ${t.playlist.video_count},`] : []),
    "  },",
  ];
  return lines.join("\n");
}

const header = `/* GENERATED by scripts/import-resources.mjs — do not edit by hand.
 * Source: content/research/ (embed-verified 2026-09-12). Re-run the script to change. */
`;

const resourcesOut =
  header +
  `import type { Resource } from "./schema";\n\nexport const importedResources: Resource[] = [\n` +
  records.map(resourceLiteral).join("\n") +
  `\n];\n`;

/* wiring: per repo skill, fill empty quick/project/docs slots, rest → extra */
const wiring = new Map();
for (const [skill, list] of bySkill) {
  if (NEW_SKILLS[skill]) continue; // new skills carry their own slots
  const sorted = [...list].sort((a, b) => b.entry.editorScore - a.entry.editorScore);
  const w = { extra: [] };
  for (const r of sorted) {
    const labels = r.entry.labels;
    const role = labels.includes("fastest")
      ? "quick"
      : labels.includes("project-based")
        ? "project"
        : labels.includes("official-docs")
          ? "docs"
          : "extra";
    if (role !== "extra" && !w[role]) w[role] = r.entry.id;
    else w.extra.push(r.entry.id);
  }
  wiring.set(skill, w);
}

const wiringOut =
  header +
  `export type ImportedWiring = { quick?: string; project?: string; docs?: string; extra: string[] };\n\n` +
  `export const importedWiring: Record<string, ImportedWiring> = {\n` +
  [...wiring.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([skill, w]) => {
      const parts = [];
      if (w.quick) parts.push(`quick: ${esc(w.quick)}`);
      if (w.project) parts.push(`project: ${esc(w.project)}`);
      if (w.docs) parts.push(`docs: ${esc(w.docs)}`);
      parts.push(`extra: [${w.extra.map(esc).join(", ")}]`);
      return `  ${esc(skill)}: { ${parts.join(", ")} },`;
    })
    .join("\n") +
  `\n};\n`;

/* new skills: best = highest-scored mapped resource */
const skillsOut =
  header +
  `import type { Skill } from "./schema";\n\nexport const importedSkills: Skill[] = [\n` +
  Object.entries(NEW_SKILLS)
    .map(([id, def]) => {
      const list = (bySkill.get(id) ?? []).slice().sort((a, b) => b.entry.editorScore - a.entry.editorScore);
      if (!list.length) throw new Error(`new skill ${id} has no resources`);
      const [best, ...rest] = list;
      const quick = rest.find((r) => r.entry.labels.includes("fastest"));
      const project = rest.find((r) => r.entry.labels.includes("project-based"));
      const extras = rest.filter((r) => r !== quick && r !== project).map((r) => r.entry.id);
      return [
        "  {",
        `    id: ${esc(id)},`,
        `    slug: ${esc(id)},`,
        `    title: ${esc(def.title)},`,
        `    summary: ${esc(def.summary)},`,
        `    objectives: [${def.objectives.map(esc).join(", ")}],`,
        `    prerequisites: [${def.prerequisites.map(esc).join(", ")}],`,
        "    resources: {",
        `      best: ${esc(best.entry.id)},`,
        ...(quick ? [`      quick: ${esc(quick.entry.id)},`] : []),
        ...(project ? [`      project: ${esc(project.entry.id)},`] : []),
        "    },",
        `    extraResourceIds: [${extras.map(esc).join(", ")}],`,
        `    challengeIds: [],`,
        `    projectIds: [],`,
        "  },",
      ].join("\n");
    })
    .join("\n") +
  `\n];\n`;

writeFileSync(join(ROOT, "src/lib/content/resources.imported.ts"), resourcesOut);
writeFileSync(join(ROOT, "src/lib/content/skill-wiring.ts"), wiringOut);
writeFileSync(join(ROOT, "src/lib/content/skills.imported.ts"), skillsOut);

const newCount = records.length;
console.log(`emitted ${newCount} resources, ${wiring.size} wired skills, ${Object.keys(NEW_SKILLS).length} new skills`);
const unmapped = [...new Set(research.categories.flatMap((c) => c.resources.map((r) => r.skill_id)))].filter(
  (s) => !SKILL_MAP[s],
);
console.log("library-only dataset skills (intentional):", unmapped.join(", ") || "none");
console.log("skipped duplicates of canonical resources:");
for (const s of skipped) console.log(" -", s);
