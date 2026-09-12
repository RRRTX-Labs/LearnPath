import type { Roadmap } from "./schema";

type NodeDef = {
  id: string;
  skillId: string;
  tier: Roadmap["nodes"][number]["tier"];
  requirement?: Roadmap["nodes"][number]["requirement"];
};
type StageDef = { id: string; title: string; summary: string; nodes: NodeDef[] };

const COL = 200;
const ROW = 150;

/**
 * Staged layout: each stage is a horizontal band, nodes inside a stage read
 * left→right, stages stack top→bottom. The graph component draws bands from
 * `stages`, so the data — not the renderer — decides the journey's shape.
 */
function layout(stages: StageDef[]) {
  const nodes: Roadmap["nodes"] = [];
  const outStages: Roadmap["stages"] = [];
  stages.forEach((stage, row) => {
    const nodeIds: string[] = [];
    stage.nodes.forEach((n, col) => {
      nodes.push({
        id: n.id,
        skillId: n.skillId,
        tier: n.tier,
        requirement: n.requirement ?? "required",
        x: 60 + col * COL + (row % 2 === 1 ? 40 : 0),
        y: 70 + row * ROW,
      });
      nodeIds.push(n.id);
    });
    outStages.push({ id: stage.id, title: stage.title, summary: stage.summary, nodeIds });
  });
  return { nodes, stages: outStages };
}

function chain(ids: string[]): Roadmap["edges"] {
  return ids.slice(1).map((to, i) => ({ from: ids[i], to, kind: "required" as const }));
}
function link(from: string, to: string, kind: Roadmap["edges"][number]["kind"] = "required") {
  return { from, to, kind };
}

export const roadmaps = [
  {
    id: "python-developer",
    slug: "python-developer",
    title: "Python Developer",
    tagline: "From zero to fluent — syntax, structure, tests, and a real CLI or API.",
    description:
      "A tightly scoped path for people who want to write Python they can trust. You will set up a real environment, learn the language (not a framework zoo), test your code, and ship something that runs for other people.",
    category: "language",
    difficulty: "beginner",
    estimatedHours: 110,
    featured: true,
    editorPick: true,
    color: "#2DD4BF",
    prerequisites: [],
    ...layout([
      {
        id: "foundations",
        title: "01 · Foundations",
        summary: "What programs are, a working environment, and the language's grammar.",
        nodes: [
          { id: "n-progfund", skillId: "programming-fundamentals", tier: "foundation" },
          { id: "n-setup", skillId: "python-setup", tier: "foundation" },
          { id: "n-syntax", skillId: "python-syntax", tier: "foundation" },
        ],
      },
      {
        id: "core",
        title: "02 · Core language",
        summary: "Functions, structures, failure and objects — the part interviews probe.",
        nodes: [
          { id: "n-fn", skillId: "python-functions", tier: "core" },
          { id: "n-ds", skillId: "python-data-structures", tier: "core" },
          { id: "n-err", skillId: "python-errors", tier: "core" },
          { id: "n-oop", skillId: "python-oop", tier: "core" },
        ],
      },
      {
        id: "craft",
        title: "03 · Craft",
        summary: "Files, tests and version control: code that survives contact with reality.",
        nodes: [
          { id: "n-files", skillId: "python-files", tier: "practice" },
          { id: "n-test", skillId: "python-testing", tier: "practice" },
          { id: "n-git", skillId: "git-basics", tier: "practice" },
        ],
      },
      {
        id: "ship",
        title: "04 · Ship",
        summary: "Data, an HTTP API, and the algorithms depth to keep going.",
        nodes: [
          { id: "n-sql", skillId: "sql-fundamentals", tier: "project", requirement: "recommended" },
          { id: "n-webapi", skillId: "python-web-apis", tier: "project", requirement: "recommended" },
          { id: "n-dsa", skillId: "dsa-fundamentals", tier: "mastery", requirement: "optional" },
        ],
      },
    ]),
    edges: [
      ...chain(["n-progfund", "n-setup", "n-syntax"]),
      ...chain(["n-fn", "n-ds", "n-err", "n-oop"]),
      ...chain(["n-files", "n-test", "n-git"]),
      link("n-syntax", "n-fn"),
      link("n-oop", "n-files"),
      link("n-test", "n-webapi"),
      link("n-ds", "n-dsa", "recommended"),
      link("n-sql", "n-webapi", "recommended"),
    ],
  },
  {
    id: "full-stack-developer",
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    tagline: "HTML to a deployed app — frontend, API, data, auth, pipelines.",
    description:
      "A project-oriented web path. You learn HTML/CSS and JavaScript deeply, add TypeScript, React and Next.js, a Node API, SQL, authentication, tests, containers and a public deploy. Quality over framework fashion.",
    category: "web",
    difficulty: "beginner",
    estimatedHours: 200,
    featured: true,
    editorPick: true,
    color: "#7AA2FF",
    prerequisites: [],
    ...layout([
      {
        id: "foundations",
        title: "01 · Foundations",
        summary: "The platform: how programs, documents, scripts and versions work.",
        nodes: [
          { id: "n-progfund", skillId: "programming-fundamentals", tier: "foundation", requirement: "recommended" },
          { id: "n-html", skillId: "html-css", tier: "foundation" },
          { id: "n-js", skillId: "javascript-fundamentals", tier: "foundation" },
          { id: "n-git", skillId: "git-basics", tier: "foundation" },
        ],
      },
      {
        id: "core-web",
        title: "02 · Core web",
        summary: "Accessibility, types, components and the App Router mental model.",
        nodes: [
          { id: "n-a11y", skillId: "accessibility", tier: "core" },
          { id: "n-ts", skillId: "typescript-fundamentals", tier: "core" },
          { id: "n-react", skillId: "react-fundamentals", tier: "core" },
          { id: "n-next", skillId: "nextjs-fundamentals", tier: "core" },
        ],
      },
      {
        id: "backend",
        title: "03 · Backend",
        summary: "HTTP APIs, relational data, an ORM, and authentication done honestly.",
        nodes: [
          { id: "n-node", skillId: "node-express", tier: "core" },
          { id: "n-sql", skillId: "sql-fundamentals", tier: "practice" },
          { id: "n-orm", skillId: "databases-orm", tier: "practice" },
          { id: "n-auth", skillId: "web-auth", tier: "practice" },
        ],
      },
      {
        id: "ship",
        title: "04 · Ship",
        summary: "Tests, a public deploy, containers and a pipeline that guards it all.",
        nodes: [
          { id: "n-test", skillId: "web-testing", tier: "project" },
          { id: "n-deploy", skillId: "deploy-basics", tier: "mastery" },
          { id: "n-docker", skillId: "containers-orchestration", tier: "mastery", requirement: "recommended" },
          { id: "n-cicd", skillId: "cloud-cicd", tier: "mastery", requirement: "optional" },
        ],
      },
      {
        id: "depth",
        title: "05 · Depth",
        summary: "Optional: design for scale and the algorithms depth for interviews.",
        nodes: [
          { id: "n-sysd", skillId: "system-design", tier: "mastery", requirement: "optional" },
          { id: "n-dsa", skillId: "dsa-fundamentals", tier: "mastery", requirement: "optional" },
        ],
      },
    ]),
    edges: [
      ...chain(["n-progfund", "n-html", "n-js", "n-git"]),
      ...chain(["n-a11y", "n-ts", "n-react", "n-next"]),
      ...chain(["n-node", "n-sql", "n-orm", "n-auth"]),
      ...chain(["n-test", "n-deploy", "n-docker", "n-cicd"]),
      link("n-js", "n-ts"),
      link("n-react", "n-node", "recommended"),
      link("n-next", "n-test"),
      link("n-orm", "n-sysd", "optional"),
      link("n-js", "n-dsa", "optional"),
    ],
  },
  {
    id: "ai-engineer",
    slug: "ai-engineer",
    title: "AI Engineer",
    tagline: "Math intuition, data, classical ML, networks, and responsible shipping.",
    description:
      "For builders who want to understand models, not only call APIs. Python, data wrangling, classical ML, neural nets, evaluation, operations, and a sober look at ethics.",
    category: "ai",
    difficulty: "intermediate",
    estimatedHours: 200,
    featured: true,
    editorPick: true,
    color: "#F5B942",
    prerequisites: [],
    ...layout([
      {
        id: "foundations",
        title: "01 · Foundations",
        summary: "Python fluency plus the two maths intuitions everything else leans on.",
        nodes: [
          { id: "n-py", skillId: "python-syntax", tier: "foundation" },
          { id: "n-ds", skillId: "python-data-structures", tier: "foundation" },
          { id: "n-lin", skillId: "linear-algebra-intuition", tier: "foundation" },
          { id: "n-stat", skillId: "probability-stats", tier: "foundation" },
        ],
      },
      {
        id: "data-ml",
        title: "02 · Data & classical ML",
        summary: "Query, wrangle and model tabular data before touching a network.",
        nodes: [
          { id: "n-sql", skillId: "sql-fundamentals", tier: "core", requirement: "recommended" },
          { id: "n-wrangle", skillId: "data-wrangling", tier: "core" },
          { id: "n-ml", skillId: "ml-fundamentals", tier: "core" },
        ],
      },
      {
        id: "deep",
        title: "03 · Deep learning",
        summary: "Networks from first principles, then PyTorch you can debug.",
        nodes: [
          { id: "n-nn", skillId: "neural-networks", tier: "core" },
          { id: "n-torch", skillId: "pytorch-intro", tier: "practice" },
        ],
      },
      {
        id: "production",
        title: "04 · Production",
        summary: "Evaluation you trust, operations you can repeat, packaging you can ship.",
        nodes: [
          { id: "n-eval", skillId: "model-evaluation", tier: "practice" },
          { id: "n-ops", skillId: "mlops-basics", tier: "project" },
          { id: "n-docker", skillId: "containers-orchestration", tier: "project", requirement: "recommended" },
        ],
      },
      {
        id: "responsibility",
        title: "05 · Responsibility",
        summary: "Where models hurt people, and the checks that stop yours from doing so.",
        nodes: [{ id: "n-eth", skillId: "ai-ethics", tier: "mastery" }],
      },
    ]),
    edges: [
      ...chain(["n-py", "n-ds", "n-lin", "n-stat"]),
      ...chain(["n-sql", "n-wrangle", "n-ml"]),
      ...chain(["n-nn", "n-torch"]),
      ...chain(["n-eval", "n-ops", "n-docker"]),
      link("n-ds", "n-wrangle"),
      link("n-lin", "n-nn"),
      link("n-stat", "n-ml"),
      link("n-ml", "n-nn"),
      link("n-torch", "n-eval"),
      link("n-ops", "n-eth"),
    ],
  },
  {
    id: "generative-ai-engineer",
    slug: "generative-ai-engineer",
    title: "Generative AI Engineer",
    tagline: "Transformers, prompting, RAG, evals — build with language models on purpose.",
    description:
      "A path for people who will ship LLM features. You learn enough of the stack to debug token limits, retrieval failures, and unsafe outputs — not only to paste prompts.",
    category: "ai",
    difficulty: "intermediate",
    estimatedHours: 140,
    featured: true,
    color: "#C084FC",
    prerequisites: ["python-developer"],
    ...layout([
      {
        id: "foundations",
        title: "01 · Foundations",
        summary: "Python you can rely on and the network ideas transformers reuse.",
        nodes: [
          { id: "n-py", skillId: "python-syntax", tier: "foundation" },
          { id: "n-nn", skillId: "neural-networks", tier: "foundation" },
        ],
      },
      {
        id: "llm-core",
        title: "02 · LLM core",
        summary: "How transformers actually work, and how to specify behaviour precisely.",
        nodes: [
          { id: "n-tx", skillId: "transformers-llms", tier: "core" },
          { id: "n-prompt", skillId: "prompt-engineering", tier: "core" },
        ],
      },
      {
        id: "retrieval",
        title: "03 · Retrieval & tuning",
        summary: "Grounding models in your data, and when fine-tuning is the wrong answer.",
        nodes: [
          { id: "n-rag", skillId: "embeddings-rag", tier: "core" },
          { id: "n-ft", skillId: "fine-tuning-basics", tier: "practice", requirement: "optional" },
        ],
      },
      {
        id: "ship-safely",
        title: "04 · Ship safely",
        summary: "Evals, red-teaming and the safety cases that let you deploy.",
        nodes: [
          { id: "n-eval", skillId: "genai-eval-safety", tier: "project" },
          { id: "n-eth", skillId: "ai-ethics", tier: "mastery" },
        ],
      },
    ]),
    edges: [
      ...chain(["n-py", "n-nn"]),
      ...chain(["n-tx", "n-prompt"]),
      ...chain(["n-rag", "n-ft"]),
      ...chain(["n-eval", "n-eth"]),
      link("n-nn", "n-tx"),
      link("n-prompt", "n-rag"),
      link("n-rag", "n-eval"),
    ],
  },
  {
    id: "agentic-ai-engineer",
    slug: "agentic-ai-engineer",
    title: "Agentic AI Engineer",
    tagline: "Tools, loops, memory, and safety — agents you can actually debug.",
    description:
      "Agents are programs that call tools in a loop. This path treats them as software: schemas, logs, step limits, and least privilege. Multi-agent theatre is optional; reliability is not.",
    category: "ai",
    difficulty: "advanced",
    estimatedHours: 130,
    featured: true,
    color: "#FB7185",
    prerequisites: ["generative-ai-engineer"],
    ...layout([
      {
        id: "foundations",
        title: "01 · Foundations",
        summary: "Functions as tools, and prompts as specifications.",
        nodes: [
          { id: "n-py", skillId: "python-functions", tier: "foundation" },
          { id: "n-prompt", skillId: "prompt-engineering", tier: "foundation" },
        ],
      },
      {
        id: "tools",
        title: "02 · Tools & architecture",
        summary: "Function calling, MCP boundaries, and the loop that drives them.",
        nodes: [
          { id: "n-tools", skillId: "tool-use-apis", tier: "core" },
          { id: "n-mcp", skillId: "mcp-servers", tier: "core" },
          { id: "n-arch", skillId: "agent-architecture", tier: "core" },
        ],
      },
      {
        id: "reliability",
        title: "03 · Reliability",
        summary: "Memory, planning, frameworks compared, and tracing failed runs.",
        nodes: [
          { id: "n-mem", skillId: "memory-planning", tier: "practice" },
          { id: "n-fw", skillId: "agent-frameworks", tier: "practice", requirement: "recommended" },
          { id: "n-multi", skillId: "multi-agent", tier: "practice", requirement: "optional" },
        ],
      },
      {
        id: "safety",
        title: "04 · Safety",
        summary: "Least privilege, guardrails, and the ethics of delegated action.",
        nodes: [
          { id: "n-safe", skillId: "agent-safety", tier: "mastery" },
          { id: "n-owasp", skillId: "ai-ethics", tier: "mastery" },
        ],
      },
    ]),
    edges: [
      ...chain(["n-py", "n-prompt"]),
      ...chain(["n-tools", "n-mcp", "n-arch"]),
      ...chain(["n-mem", "n-fw", "n-multi"]),
      ...chain(["n-safe", "n-owasp"]),
      link("n-prompt", "n-tools"),
      link("n-arch", "n-mem"),
      link("n-fw", "n-safe"),
    ],
  },
  {
    id: "junior-cybersecurity",
    slug: "junior-cybersecurity",
    title: "Junior Cybersecurity Professional",
    tagline: "Ethical foundations, Linux, networks, web bugs, and incident basics.",
    description:
      "A junior defensive-leaning path. You will learn the command line, how networks work, how web apps fail (in legal labs only), cryptography hygiene, and how to behave under an incident. Unauthorized access is out of scope — forever.",
    category: "security",
    difficulty: "beginner",
    estimatedHours: 160,
    featured: true,
    editorPick: true,
    color: "#34D399",
    prerequisites: [],
    ...layout([
      {
        id: "foundations",
        title: "01 · Foundations",
        summary: "Scope and law first, then the defensive baseline, the shell and the wire.",
        nodes: [
          { id: "n-eth", skillId: "ethics-law", tier: "foundation" },
          { id: "n-secfund", skillId: "security-fundamentals", tier: "foundation" },
          { id: "n-linux", skillId: "linux-cli", tier: "foundation" },
          { id: "n-net", skillId: "networking-basics", tier: "foundation" },
        ],
      },
      {
        id: "core",
        title: "02 · Core",
        summary: "Scripting, version control and the web vulnerability classes.",
        nodes: [
          { id: "n-py", skillId: "python-syntax", tier: "core" },
          { id: "n-git", skillId: "git-basics", tier: "core" },
          { id: "n-owasp", skillId: "owasp-web", tier: "core" },
        ],
      },
      {
        id: "practice",
        title: "03 · Practice",
        summary: "Crypto hygiene and authorised reconnaissance in legal labs.",
        nodes: [
          { id: "n-crypto", skillId: "cryptography-basics", tier: "practice" },
          { id: "n-recon", skillId: "recon-osint", tier: "practice" },
        ],
      },
      {
        id: "project",
        title: "04 · Project",
        summary: "Assess and harden a lab system end to end.",
        nodes: [
          { id: "n-vuln", skillId: "vuln-assessment", tier: "project" },
          { id: "n-hard", skillId: "linux-hardening", tier: "project" },
        ],
      },
      {
        id: "mastery",
        title: "05 · Mastery",
        summary: "Behave well on the worst day: incident response basics.",
        nodes: [{ id: "n-ir", skillId: "incident-response", tier: "mastery" }],
      },
    ]),
    edges: [
      ...chain(["n-eth", "n-secfund", "n-linux", "n-net"]),
      ...chain(["n-py", "n-git", "n-owasp"]),
      ...chain(["n-crypto", "n-recon"]),
      ...chain(["n-vuln", "n-hard"]),
      link("n-net", "n-owasp"),
      link("n-linux", "n-py"),
      link("n-owasp", "n-vuln"),
      link("n-recon", "n-vuln", "recommended"),
      link("n-hard", "n-ir"),
    ],
  },
];
