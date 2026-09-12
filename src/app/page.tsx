import Link from "next/link";
import { PathCanvas } from "@/components/path-canvas";
import { SearchBox } from "@/components/search-box";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { roadmaps } from "@/lib/content";

export default function HomePage() {
  const featured = roadmaps.filter((r) => r.featured);
  const picks = roadmaps.filter((r) => r.editorPick);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="eyebrow">Open source · Roadmap-first</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Learn anything.
            <br />
            Build everything.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            LearnPath is a free learning structure around the best public teachers. Follow a roadmap, watch a curated
            lesson, practice in the browser, then ship a project.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchBox large />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/roadmaps">Explore roadmaps</ButtonLink>
            <ButtonLink href="/roadmaps/python-developer" variant="ghost">
              Start with Python
            </ButtonLink>
          </div>
        </div>
        <PathCanvas />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="eyebrow">The loop</p>
        <h2 className="mt-2 font-display text-3xl">Roadmap → skill → watch → practice → build</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {[
            ["01", "Roadmap", "A coherent order. Not forty tabs."],
            ["02", "Skill", "One idea, with prerequisites."],
            ["03", "Watch", "Official YouTube embeds. We never rehost video."],
            ["04", "Practice", "Python, JS, TS, HTML, SQL — in your browser."],
            ["05", "Build", "A challenge, then a project you can show."],
          ].map(([n, t, d]) => (
            <li key={n} className="surface p-4">
              <p className="font-mono text-xs text-accent">{n}</p>
              <p className="mt-2 font-medium">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="mt-2 font-display text-3xl">Roadmaps</h2>
          </div>
          <Link href="/roadmaps" className="text-sm text-primary">
            All roadmaps
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <Link key={r.id} href={`/roadmaps/${r.slug}`}>
              <Card className="h-full hover:border-primary/40">
                <Badge>{r.category}</Badge>
                <h3 className="mt-3 font-display text-2xl">{r.title}</h3>
                <p className="mt-2 text-sm text-muted">{r.tagline}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                  {r.difficulty} · ~{r.estimatedHours}h · {r.nodes.length} skills
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="eyebrow">Editor picks</p>
        <h2 className="mt-2 font-display text-3xl">Start here if you are unsure</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {picks.map((r) => (
            <Link key={r.id} href={`/roadmaps/${r.slug}`} className="surface flex flex-col gap-2 p-5 hover:border-primary/40">
              <h3 className="font-display text-2xl">{r.title}</h3>
              <p className="text-sm text-muted">{r.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-2">
        <div className="surface p-8">
          <p className="eyebrow">Community</p>
          <h2 className="mt-2 font-display text-3xl">Discord is the campus</h2>
          <p className="mt-3 text-muted">
            Questions, code review, and roadmap proposals live on Discord — not in a half-built in-app forum.
          </p>
          <ButtonLink href="/community" className="mt-6">
            Join the community
          </ButtonLink>
        </div>
        <div className="surface p-8">
          <p className="eyebrow">Open source</p>
          <h2 className="mt-2 font-display text-3xl">Curriculum is a Git repo</h2>
          <p className="mt-3 text-muted">
            Roadmaps and resources are files. Propose a change with a pull request. No certificate marketplace. No
            paywall.
          </p>
          <ButtonLink href="/open-source" variant="ghost" className="mt-6">
            Contribute
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
