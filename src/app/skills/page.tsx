import { ArrowRight, Award } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Container, SectionHeader } from "@/components/ui";
import { roadmaps, skills } from "@/lib/content";
import { getAssessmentForSkill, getFreeVerseAssessmentUrl } from "@/lib/freeverse";

export const metadata: Metadata = {
  title: "Skills catalog",
  description:
    "Every verified skill in the LearnPath curriculum — with curated learning resources, in-browser practice, challenges, and matching RRRTX FreeVerse skill assessments.",
  alternates: { canonical: "/skills" },
};

const CATEGORIES = [
  { id: "all", label: "All skills" },
  { id: "python", label: "Python & backend" },
  { id: "web", label: "Web & full stack" },
  { id: "ai", label: "AI & machine learning" },
  { id: "agents", label: "Agentic systems" },
  { id: "security", label: "Defensive security" },
];

function getCategoryForSkill(skillId: string): string {
  const norm = skillId.toLowerCase();
  if (norm.startsWith("python") || norm === "programming-fundamentals" || norm === "dsa-fundamentals" || norm === "sql-fundamentals" || norm === "git-basics") {
    return "python";
  }
  if (
    norm.startsWith("html") ||
    norm.startsWith("css") ||
    norm.startsWith("javascript") ||
    norm.startsWith("typescript") ||
    norm.startsWith("react") ||
    norm.startsWith("next") ||
    norm.startsWith("node") ||
    norm.startsWith("web") ||
    norm.includes("databases") ||
    norm.includes("deploy") ||
    norm.includes("cloud") ||
    norm.includes("system-design") ||
    norm.includes("containers") ||
    norm.includes("accessibility")
  ) {
    return "web";
  }
  if (
    norm.startsWith("tool-use") ||
    norm.startsWith("agent") ||
    norm.startsWith("memory") ||
    norm.startsWith("multi-agent") ||
    norm.includes("mcp")
  ) {
    return "agents";
  }
  if (
    norm.includes("linear-algebra") ||
    norm.includes("probability") ||
    norm.includes("data-wrangling") ||
    norm.includes("ml-") ||
    norm.includes("neural") ||
    norm.includes("pytorch") ||
    norm.includes("model-") ||
    norm.includes("mlops") ||
    norm.includes("transformers") ||
    norm.includes("prompt") ||
    norm.includes("embeddings") ||
    norm.includes("fine-tuning") ||
    norm.includes("genai") ||
    norm.includes("ai-ethics")
  ) {
    return "ai";
  }
  return "security";
}

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "all" } = await searchParams;
  const activeCategory = CATEGORIES.some((c) => c.id === category) ? category : "all";

  const filteredSkills = skills.filter((s) => {
    if (activeCategory === "all") return true;
    return getCategoryForSkill(s.id) === activeCategory;
  });

  return (
    <Container className="py-12">
      <SectionHeader
        eyebrow="Curriculum"
        title="Skills catalog"
        sub="Every node across all LearnPath roadmaps. Each skill defines tangible objectives, verified free learning resources, browser practice, pass/fail challenges, and direct access to corresponding RRRTX FreeVerse verifiable assessments."
      />

      {/* category filter bar */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-4" role="tablist" aria-label="Filter skills by domain">
        {CATEGORIES.map((c) => {
          const selected = c.id === activeCategory;
          return (
            <Link
              key={c.id}
              href={c.id === "all" ? "/skills" : `/skills?category=${c.id}`}
              role="tab"
              aria-selected={selected}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                selected
                  ? "bg-primary text-primary-fg font-medium"
                  : "bg-surface-2 text-muted hover:text-fg"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill) => {
          const assessment = getAssessmentForSkill(skill.id);
          const assessmentUrl = getFreeVerseAssessmentUrl(skill.slug);
          const parents = roadmaps.filter((r) => r.nodes.some((n) => n.skillId === skill.id));

          return (
            <div key={skill.id} className="surface card-hover flex flex-col rounded-lg p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="meta">{skill.id}</span>
                {assessment ? (
                  <Badge tone="accent" className="flex items-center gap-1">
                    <Award className="h-3 w-3" aria-hidden /> FreeVerse Assessment
                  </Badge>
                ) : null}
              </div>

              <h2 className="mt-3 font-display text-xl leading-snug">
                <Link href={`/skills/${skill.slug}`} className="hover:text-primary transition-colors">
                  {skill.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">{skill.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-line/60">
                {parents.slice(0, 1).map((p) => (
                  <Link
                    key={p.id}
                    href={`/learn/${p.slug}/${skill.slug}`}
                    className="meta text-primary hover:underline flex items-center gap-1"
                  >
                    Learn in {p.title} <ArrowRight className="h-3 w-3" aria-hidden />
                  </Link>
                ))}
                {assessment ? (
                  <a
                    href={assessmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta ml-auto text-accent hover:underline flex items-center gap-1"
                  >
                    Assess →
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
