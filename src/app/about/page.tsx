import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/logo";
import { ButtonLink, Container, SectionHeader } from "@/components/ui";
import { envOr } from "@/lib/env";

export const metadata: Metadata = {
  title: "About LearnPath & RRRTX Labs",
  description:
    "LearnPath is a free, open-source learning product by RRRTX Labs: structured roadmaps, verified free resources, in-browser practice, and honest proof of skill.",
  alternates: { canonical: "/about" },
};

const GITHUB_URL = envOr("https://github.com/RRRTX-Labs/LearnPath", process.env.NEXT_PUBLIC_GITHUB_URL);

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-12">
      <SectionHeader
        eyebrow="About"
        title="LearnPath is a product, not a link dump"
        sub="A free, open-source learning system: choose a path, learn from verified resources, practice in the browser, pass challenges, ship projects, and keep honest evidence of what you can do."
      />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed text-fg/90" aria-label="Why we built LearnPath">
        <h2 className="font-display text-2xl">Why we built it</h2>
        <p>
          The web already contains most of what a developer needs to learn — official docs,
          university-grade courses, excellent free video lectures, legal labs. The problem was never
          supply. It was sequencing, verification, and follow-through: which resource, in what
          order, with what practice, toward what proof.
        </p>
        <p>
          LearnPath answers that with a loop instead of a library:{" "}
          <strong className="font-semibold text-fg">
            choose a path → learn → practice → prove → build → grow
          </strong>
          . Every skill on every roadmap owns its objectives, one primary resource, a browser
          playground, a graded challenge, and a project application. Nothing is a dead end, and
          nothing pretends to be a certificate mill.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed text-fg/90" aria-label="Open-source philosophy">
        <h2 className="font-display text-2xl">Open-source philosophy</h2>
        <p>
          The curriculum is a Git repository: typed content, Zod schemas, a validation gate, and an
          import pipeline with tests. Anyone can read how a resource earned its place, propose a
          better one, or fix a mistake — with CI enforcing that the catalog stays consistent.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-muted">
          <li>No paywall, no certificates for sale, no trackers, no invented metrics.</li>
          <li>No copied curricula — roadmaps are independently authored.</li>
          <li>YouTube is embedded through official iframes behind a click-to-load facade; we never download, proxy, or restyle players.</li>
          <li>Practice runs in your browser sandbox — untrusted code never executes on our servers.</li>
        </ul>
        <p className="meta">
          Contribute:{" "}
          <a className="text-primary hover:underline" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            {GITHUB_URL.replace("https://", "")}
          </a>
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed text-fg/90" aria-label="Learning philosophy">
        <h2 className="font-display text-2xl">Learning philosophy</h2>
        <p>
          We design against the illusion of competence. Reading feels like learning; typing,
          running, breaking, and debugging code <em>is</em> learning. So practice sits one click
          from every lesson, challenges have pass/fail tests, and completion means something you
          can point at: learned, practiced, challenge passed, used in a project.
        </p>
        <p>
          No XP, no streaks, no leaderboards. Capability is the only currency here, and the
          progress model refuses to inflate it.
        </p>
      </section>

      <section className="mt-12 border-t border-line pt-10" aria-label="RRRTX Labs">
        <div className="flex items-start gap-4">
          <Mark className="mt-1 h-9 w-9 shrink-0" />
          <div className="space-y-4 text-[15px] leading-relaxed text-fg/90">
            <h2 className="font-display text-2xl">RRRTX Labs</h2>
            <p>
              LearnPath is built and maintained by <strong className="font-semibold text-fg">RRRTX Labs</strong>,
              an independent software studio. The studio&apos;s practice is simple: build products we
              would keep bookmarked ourselves — restrained design, honest claims, real engineering,
              and documentation a stranger can follow.
            </p>
            <p>
              LearnPath is the studio&apos;s open-source flagship: the place where our research on
              curriculum design, learning science, and developer tooling ships in public, where
              mistakes get fixed in pull requests instead of press releases, and where the{" "}
              <Link className="text-primary hover:underline" href="/blog">journal</Link> publishes
              what we learn along the way.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <ButtonLink href="/roadmaps">Start a roadmap</ButtonLink>
              <ButtonLink href="/blog" variant="subtle">Read the journal</ButtonLink>
              <ButtonLink href={GITHUB_URL} variant="ghost" external>GitHub</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
