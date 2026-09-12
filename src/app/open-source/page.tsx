import { GitPullRequest, Heart, Scale } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui";
import { GitHubIcon } from "@/components/github-icon";
import { envOr } from "@/lib/env";

export const metadata: Metadata = {
  title: "Open source",
  description:
    "LearnPath is MIT-licensed software with an independently authored, Git-canonical curriculum. Improve roadmaps, suggest resources, report broken links, contribute code.",
};

const github = envOr("https://github.com/RRRTX-Labs/LearnPath", process.env.NEXT_PUBLIC_GITHUB_URL);

export default function OpenSourcePage() {
  return (
    <Container className="max-w-4xl py-12">
      <p className="eyebrow">Git</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">LearnPath is open source</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        MIT-licensed software with an independently authored curriculum living in Git. Canonical
        lessons are validated TypeScript modules — not a proprietary CMS, not a database dump.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          { icon: GitPullRequest, t: "Improve roadmaps", d: "Reorder stages, add prerequisites, fix a node that belongs elsewhere. Graphs are data; a PR shows the diff." },
          { icon: Heart, t: "Suggest resources", d: "Free only, with a reason. Every suggestion is verified for availability and embed permission before it ships." },
          { icon: Scale, t: "Report broken links", d: "Use the report form on any resource or challenge. Reports land in a maintainer queue, not a black hole." },
          { icon: GitPullRequest, t: "Build challenges & practice", d: "Challenges are prompts plus browser-run tests. Add one for a skill that lacks proof-of-work." },
        ].map((c) => (
          <div key={c.t} className="surface card-hover rounded-lg p-6">
            <c.icon className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="mt-3 font-display text-xl">{c.t}</h2>
            <p className="mt-2 text-sm text-muted">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="surface mt-10 rounded-lg p-6">
        <h2 className="font-display text-2xl">The contribution loop</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Fork the repository and branch from main.</li>
          <li>
            Edit the catalog under <code className="font-mono text-fg">src/lib/content/</code> — resources, skills,
            roadmaps, challenges, projects, practice.
          </li>
          <li>
            Run <code className="font-mono text-fg">npm run content:validate</code> and{" "}
            <code className="font-mono text-fg">npm test</code>. CI enforces both, plus lint, typecheck and build.
          </li>
          <li>Open a pull request. Humans review resource quality, licenses and editorial scores.</li>
        </ol>
        <h2 className="mt-8 font-display text-2xl">What we will not merge</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Copied roadmap.sh graphs or text — their license forbids redistribution.</li>
          <li>Paid-only resources presented as free, or affiliate links.</li>
          <li>Anything that downloads, proxies or rehosts YouTube media.</li>
          <li>Server-side execution of learner code.</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={github} external size="lg">
            <GitHubIcon className="h-4 w-4" /> View repository
          </ButtonLink>
          <ButtonLink href="/community" variant="ghost" size="lg">
            Community
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
