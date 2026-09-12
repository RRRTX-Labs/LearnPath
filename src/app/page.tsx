import {
  ArrowRight,
  Code2,
  GitPullRequest,
  Hammer,
  Map as MapIcon,
  MessagesSquare,
  Play,
  Terminal,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContinueLearning } from "@/components/continue-learning";
import { PathCanvas } from "@/components/path-canvas";
import { ResourceCard } from "@/components/resource-card";
import { RoadmapCard } from "@/components/roadmap-card";
import { SearchBox } from "@/components/search-box";
import { Badge, ButtonLink, Container, SectionHeader } from "@/components/ui";
import { projects, resources, roadmaps, skills } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learn anything. Build everything.",
  description:
    "LearnPath turns the best free learning resources on the web into structured, staged learning paths — with in-browser practice, challenges, projects and progress that follows you.",
};

const CATEGORY_OF_TOPIC: Record<string, string[]> = {
  ai: ["ai", "generative-ai", "agentic-ai", "machine-learning", "deep-learning", "data-science"],
  language: ["python", "programming-fundamentals", "git-github", "linux"],
  web: ["web-development", "javascript-typescript", "frontend-development", "backend-development", "databases"],
  security: ["cybersecurity"],
};

export default function HomePage() {
  const featured = roadmaps.filter((r) => r.featured);
  const picks = resources
    .filter((r) => r.labels.includes("best-overall") && r.youtubeId && r.status === "active")
    .sort((a, b) => b.editorScore - a.editorScore)
    .slice(0, 4);

  const categoryStats = (Object.keys(CATEGORY_OF_TOPIC) as (keyof typeof CATEGORY_OF_TOPIC)[]).map((cat) => {
    const cats = CATEGORY_OF_TOPIC[cat];
    const roadmapCount = roadmaps.filter((r) => r.category === cat).length;
    const skillIds = new Set(
      roadmaps
        .filter((r) => r.category === cat)
        .flatMap((r) => r.nodes.map((n) => n.skillId)),
    );
    const resourceCount = resources.filter((r) => r.topics.some((t) => cats.includes(t))).length;
    return { cat, roadmapCount, skillCount: skillIds.size, resourceCount };
  });

  return (
    <div>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 30rem at 15% -10%, var(--glow), transparent 60%), radial-gradient(50rem 26rem at 90% 0%, var(--accent-soft), transparent 65%)",
          }}
        />
        <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow">Open source · Roadmap-first · Free forever</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
              Learn anything.
              <br />
              <span className="text-primary">Build everything.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              LearnPath turns the best free resources on the web into structured learning paths.
              Follow a roadmap, watch a curated lesson, practice in your browser, ship a project —
              and keep your progress.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBox large />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/roadmaps" size="lg">
                Explore roadmaps <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/learn/python-developer/python-setup" size="lg" variant="ghost">
                <Play className="h-4 w-4" aria-hidden /> Start learning
              </ButtonLink>
            </div>
            <p className="meta mt-6">
              {roadmaps.length} roadmaps · {skills.length} skills · {resources.length} verified free
              resources · {projects.length} project briefs
            </p>
          </div>
          <div className="animate-fade-up lg:pt-6" style={{ animationDelay: "120ms" }}>
            <PathCanvas />
          </div>
        </Container>
      </section>

      <Container className="py-6">
        <ContinueLearning />
      </Container>

      {/* ------------------------------------------------------- roadmaps */}
      <section className="py-14">
        <Container>
          <SectionHeader
            eyebrow="Popular roadmaps"
            title="Pick a path, not forty tabs"
            action={
              <Link href="/roadmaps" className="flex items-center gap-1 text-sm text-primary hover:underline">
                All roadmaps <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <RoadmapCard key={r.id} roadmap={r} />
            ))}
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------- how it works */}
      <section className="border-y border-line bg-surface/40 py-14">
        <Container>
          <SectionHeader eyebrow="How LearnPath works" title="One loop, repeated until it sticks" />
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { icon: MapIcon, t: "Roadmap", d: "Staged graphs with prerequisites, so you always know what comes next and why." },
              { icon: Play, t: "Learn", d: "Editorially verified free resources — official YouTube embeds, never rehosted." },
              { icon: Terminal, t: "Practice", d: "Python, JS, TS, SQL and HTML run in your browser. Your code never touches our servers." },
              { icon: Hammer, t: "Build", d: "Challenges with real tests, then project briefs you can put in a portfolio." },
            ].map((s, i) => (
              <li key={s.t} className="relative">
                <div className="surface card-hover h-full rounded-lg p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="meta">0{i + 1}</span>
                  </div>
                  <p className="mt-4 font-medium">{s.t}</p>
                  <p className="mt-1 text-sm text-muted">{s.d}</p>
                </div>
                {i < 3 ? (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-muted md:block"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------------------------------------------- editor's picks */}
      <section className="py-14">
        <Container>
          <SectionHeader
            eyebrow="Editor's picks"
            title="The best free resources, verified"
            action={
              <Link href="/resources" className="flex items-center gap-1 text-sm text-primary hover:underline">
                Browse the library <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          />
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Scores are LearnPath editorial opinions — clarity, cost, freshness and project density —
            documented per resource. Every embed is checked for availability and embedding permission.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {picks.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- categories */}
      <section className="border-y border-line bg-surface/40 py-14">
        <Container>
          <SectionHeader eyebrow="Explore by field" title="Where do you want to go?" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryStats.map((c) => (
              <Link
                key={c.cat}
                href={`/roadmaps?category=${c.cat}`}
                className="group surface card-hover spotlight rounded-lg p-5"
              >
                <p className="meta capitalize">{c.cat === "ai" ? "AI & data" : c.cat === "web" ? "Web & full stack" : c.cat === "language" ? "Languages & tools" : "Security"}</p>
                <p className="mt-2 font-display text-2xl">{c.roadmapCount} roadmaps</p>
                <p className="mt-1 text-sm text-muted">
                  {c.skillCount} skills · {c.resourceCount} curated resources
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------- practice */}
      <section className="py-14">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Practice" title="Code in the browser, from the first minute" />
            <p className="mt-4 max-w-lg text-muted">
              Five runtimes, all sandboxed client-side: CPython via WebAssembly, SQLite compiled to
              WASM, and JS/TS/HTML in isolated iframes. No accounts, no installs, no server ever sees
              your code.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS"].map((l) => (
                <Badge key={l} tone="primary">
                  {l}
                </Badge>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <ButtonLink href="/practice">
                Open the practice lab <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/challenges" variant="ghost">
                Try a challenge
              </ButtonLink>
            </div>
          </div>
          <div className="sunken overflow-hidden rounded-lg">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <p className="meta flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5" aria-hidden /> practice · python
              </p>
              <Badge tone="success">sandboxed</Badge>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-fg">
{`def learnpath(skill):
    """The whole product in five lines."""
    watch   = curated(skill)      # verified, free
    practice = run_in_browser(skill)
    build   = ship_a_project(skill)
    return progress(watch, practice, build)

print(learnpath("python-syntax"))
# → {'skills': 1, 'confidence': 'earned'}`}
            </pre>
            <div className="border-t border-line px-4 py-2">
              <p className="meta">Output — runs entirely in your browser</p>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------- projects */}
      <section className="border-y border-line bg-surface/40 py-14">
        <Container>
          <SectionHeader
            eyebrow="Projects"
            title="Learning counts when something ships"
            action={
              <Link href="/projects" className="flex items-center gap-1 text-sm text-primary hover:underline">
                All projects <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="group surface card-hover rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <Badge>{p.language}</Badge>
                  <span className="meta">~{p.estimatedHours}h</span>
                </div>
                <h3 className="mt-3 font-display text-xl transition-colors group-hover:text-primary">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{p.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------- oss + community */}
      <section className="py-14">
        <Container className="grid gap-4 lg:grid-cols-2">
          <div className="surface edge-accent rounded-lg p-8">
            <p className="eyebrow">Open source</p>
            <h2 className="mt-2 font-display text-3xl">The curriculum is a Git repo</h2>
            <p className="mt-3 max-w-md text-muted">
              Roadmaps, skills and resources are validated files. Improve a path, suggest a resource,
              report a broken link — a pull request is the contribution flow.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {["Improve roadmaps", "Suggest free resources", "Report broken links", "Build challenges", "Contribute code"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <GitPullRequest className="h-3.5 w-3.5 text-primary" aria-hidden /> {x}
                </li>
              ))}
            </ul>
            <ButtonLink href="/open-source" className="mt-6">
              Contribute on GitHub
            </ButtonLink>
          </div>
          <div className="surface edge-accent rounded-lg p-8">
            <p className="eyebrow">Community</p>
            <h2 className="mt-2 font-display text-3xl">Learn together. Build together.</h2>
            <p className="mt-3 max-w-md text-muted">
              Discord is the campus: ask questions, share projects, find study partners, argue about
              roadmaps. LearnPath deliberately does not build a worse forum inside the app.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {["Ask questions", "Share projects", "Find study partners", "Contribute resources", "Discuss roadmaps"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <MessagesSquare className="h-3.5 w-3.5 text-primary" aria-hidden /> {x}
                </li>
              ))}
            </ul>
            <ButtonLink href="/community" variant="ghost" className="mt-6">
              About the community
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
