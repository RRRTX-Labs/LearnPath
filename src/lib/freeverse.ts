import { envOr } from "./env";

/**
 * RRRTX FreeVerse Integration
 *
 * LearnPath provides the free, open-source learning journey: roadmaps, curated resources,
 * browser practice, challenges, and project briefs.
 *
 * RRRTX FreeVerse provides the assessment engine: issuing proctored/verified skill assessments
 * and cryptographically verifiable digital credentials.
 *
 * This module manages the integration layer between LearnPath and FreeVerse via deep links,
 * allowing learners who demonstrate skills or ship projects on LearnPath to jump directly to
 * the corresponding FreeVerse skill assessment or view verifiable credential requirements.
 */

export const FREEVERSE_URL = envOr(
  "https://freeverse.rrrtx.com",
  process.env.NEXT_PUBLIC_FREEVERSE_URL,
);

export type FreeVerseAssessment = {
  id: string;
  slug: string;
  title: string;
  credentialTitle: string;
  durationMinutes: number;
  questionCount: number;
  passingScore: number;
  description: string;
  category: "python" | "web" | "ai" | "security" | "systems";
  skillsCovered: string[];
};

export const FREEVERSE_ASSESSMENTS: FreeVerseAssessment[] = [
  {
    id: "fv-py-core",
    slug: "python-core-developer",
    title: "Python Core Developer Assessment",
    credentialTitle: "Verifiable Credential: Python Core Developer",
    durationMinutes: 45,
    questionCount: 20,
    passingScore: 75,
    description: "Evaluates syntax, data structures, OOP, file handling, and idiomatic Python development.",
    category: "python",
    skillsCovered: [
      "python-setup",
      "python-syntax",
      "python-functions",
      "python-data-structures",
      "python-oop",
      "python-errors",
      "python-testing",
      "python-files",
      "programming-fundamentals",
      "dsa-fundamentals",
      "python-web-apis",
      "git-basics",
      "sql-fundamentals",
    ],
  },
  {
    id: "fv-fullstack-web",
    slug: "full-stack-web-engineering",
    title: "Full-Stack Web Engineering Assessment",
    credentialTitle: "Verifiable Credential: Full-Stack Web Developer",
    durationMinutes: 60,
    questionCount: 25,
    passingScore: 80,
    description: "Evaluates modern TypeScript, React component lifecycle, Next.js routing, REST/GraphQL APIs, and SQL.",
    category: "web",
    skillsCovered: [
      "html-css",
      "javascript-fundamentals",
      "typescript-fundamentals",
      "accessibility",
      "react-fundamentals",
      "node-express",
      "databases-orm",
      "web-auth",
      "web-testing",
      "deploy-basics",
      "nextjs-fundamentals",
      "containers-orchestration",
      "cloud-cicd",
      "system-design",
    ],
  },
  {
    id: "fv-ai-engineer",
    slug: "applied-ai-engineer",
    title: "Applied AI & LLM Systems Assessment",
    credentialTitle: "Verifiable Credential: Applied AI Engineer",
    durationMinutes: 50,
    questionCount: 22,
    passingScore: 75,
    description: "Assesses prompt engineering, embeddings, vector databases, RAG architecture, and fine-tuning fundamentals.",
    category: "ai",
    skillsCovered: [
      "linear-algebra-intuition",
      "probability-stats",
      "data-wrangling",
      "ml-fundamentals",
      "neural-networks",
      "pytorch-intro",
      "model-evaluation",
      "mlops-basics",
      "ai-ethics",
      "transformers-llms",
      "prompt-engineering",
      "embeddings-rag",
      "fine-tuning-basics",
      "genai-eval-safety",
    ],
  },
  {
    id: "fv-agentic-systems",
    slug: "agentic-ai-architect",
    title: "Agentic AI Systems Assessment",
    credentialTitle: "Verifiable Credential: Agentic AI Architect",
    durationMinutes: 50,
    questionCount: 20,
    passingScore: 80,
    description: "Assesses autonomous agent loops, tool calling, multi-agent orchestration, MCP integration, and agent safety.",
    category: "ai",
    skillsCovered: [
      "tool-use-apis",
      "agent-architecture",
      "memory-planning",
      "multi-agent",
      "agent-safety",
      "mcp-servers",
      "agent-frameworks",
    ],
  },
  {
    id: "fv-security-fundamentals",
    slug: "cybersecurity-practitioner",
    title: "Cybersecurity Practitioner Assessment",
    credentialTitle: "Verifiable Credential: Defensive Cybersecurity Practitioner",
    durationMinutes: 45,
    questionCount: 24,
    passingScore: 80,
    description: "Tests defensive security, OWASP Top 10 web vulnerabilities, network analysis, Linux hardening, and secure coding.",
    category: "security",
    skillsCovered: [
      "linux-cli",
      "networking-basics",
      "owasp-web",
      "cryptography-basics",
      "recon-osint",
      "vuln-assessment",
      "linux-hardening",
      "incident-response",
      "ethics-law",
      "security-fundamentals",
    ],
  },
];

/**
 * Finds the matching FreeVerse assessment for a given skill ID or skill slug.
 */
export function getAssessmentForSkill(skillIdOrSlug: string): FreeVerseAssessment | null {
  const norm = skillIdOrSlug.toLowerCase();
  for (const assessment of FREEVERSE_ASSESSMENTS) {
    if (
      assessment.skillsCovered.some(
        (id) => id.toLowerCase() === norm || norm.includes(id.toLowerCase()),
      )
    ) {
      return assessment;
    }
  }

  // Fallback category matching based on skill prefix
  if (norm.startsWith("python") || norm.startsWith("py-")) {
    return FREEVERSE_ASSESSMENTS[0];
  }
  if (
    norm.startsWith("react") ||
    norm.startsWith("next") ||
    norm.startsWith("html") ||
    norm.startsWith("css") ||
    norm.startsWith("sql") ||
    norm.startsWith("ts-") ||
    norm.startsWith("js-")
  ) {
    return FREEVERSE_ASSESSMENTS[1];
  }
  if (norm.startsWith("agent") || norm.includes("tool-use") || norm.includes("orchestr")) {
    return FREEVERSE_ASSESSMENTS[3];
  }
  if (norm.startsWith("ai-") || norm.includes("llm") || norm.includes("rag") || norm.includes("embedding")) {
    return FREEVERSE_ASSESSMENTS[2];
  }
  if (norm.includes("sec") || norm.includes("cyber") || norm.includes("vuln") || norm.includes("owasp")) {
    return FREEVERSE_ASSESSMENTS[4];
  }

  return null;
}

/**
 * Generates a deep link to start a FreeVerse assessment.
 */
export function getFreeVerseAssessmentUrl(
  skillIdOrSlug: string,
  options?: {
    returnUrl?: string;
    projectSlug?: string;
    roadmapSlug?: string;
  },
): string {
  const assessment = getAssessmentForSkill(skillIdOrSlug);
  const path = assessment ? assessment.slug : skillIdOrSlug;
  const params = new URLSearchParams();
  params.set("skill", skillIdOrSlug);
  params.set("source", "learnpath");
  if (options?.returnUrl) params.set("return_url", options.returnUrl);
  if (options?.projectSlug) params.set("project", options.projectSlug);
  if (options?.roadmapSlug) params.set("roadmap", options.roadmapSlug);

  return `${FREEVERSE_URL}/assessments/${path}?${params.toString()}`;
}

/**
 * Generates a deep link to verify or view credential specifications on FreeVerse.
 */
export function getFreeVerseCredentialUrl(credentialOrSkillSlug: string): string {
  const assessment = getAssessmentForSkill(credentialOrSkillSlug);
  const target = assessment ? assessment.slug : credentialOrSkillSlug;
  return `${FREEVERSE_URL}/credentials/${target}?source=learnpath`;
}
