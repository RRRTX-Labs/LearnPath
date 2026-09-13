import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge, Container, SectionHeader } from "@/components/ui";
import { blogCategoryCopy, blogPosts, type BlogCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "The LearnPath Journal",
  description:
    "Essays and field notes from RRRTX Labs on AI tooling, security, the developer ecosystem, and how to actually learn to build software.",
  alternates: { canonical: "/blog" },
};

const CATEGORY_ORDER: BlogCategory[] = ["ai-tooling", "security", "ecosystem", "learning"];

function dateLabel(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const [lead, ...rest] = sorted;

  return (
    <Container className="max-w-6xl py-12">
      <SectionHeader
        eyebrow="The LearnPath Journal"
        title="Notes from the studio behind the paths"
        sub="Research-backed essays on AI tooling, security, the ecosystem, and learning that sticks. No filler, no fabricated trends — every claim checked, every source linked."
      />

      {/* lead article */}
      <article className="mt-10">
        <Link
          href={`/blog/${lead.slug}`}
          className="surface card-hover grid gap-0 overflow-hidden rounded-xl md:grid-cols-[1.15fr_1fr]"
        >
          <div className="relative aspect-[1200/630] w-full md:aspect-auto md:h-full">
            <Image
              src={lead.cover}
              alt={`Cover art for ${lead.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{blogCategoryCopy[lead.category]}</Badge>
              <span className="meta">
                {dateLabel(lead.publishedAt)} · {lead.readingMinutes} min read
              </span>
            </div>
            <h2 className="font-display text-3xl leading-tight">{lead.title}</h2>
            <p className="text-muted">{lead.excerpt}</p>
            <span className="meta mt-1">{lead.author}</span>
          </div>
        </Link>
      </article>

      {/* rest */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <article key={post.id}>
            <Link href={`/blog/${post.slug}`} className="surface card-hover flex h-full flex-col overflow-hidden rounded-xl">
              <div className="relative aspect-[1200/630] w-full">
                <Image
                  src={post.cover}
                  alt={`Cover art for ${post.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{blogCategoryCopy[post.category]}</Badge>
                  <span className="meta">{post.readingMinutes} min</span>
                </div>
                <h3 className="font-display text-xl leading-snug">{post.title}</h3>
                <p className="flex-1 text-sm text-muted">{post.excerpt}</p>
                <span className="meta">{dateLabel(post.publishedAt)}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* category legend */}
      <section className="mt-12 border-t border-line pt-8" aria-label="Journal categories">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {CATEGORY_ORDER.map((c) => (
            <p key={c} className="text-sm text-muted">
              <span className="font-mono text-primary">■</span> {blogCategoryCopy[c]}
            </p>
          ))}
        </div>
        <p className="meta mt-4">
          Writing policy: every factual claim is verified against a current public source before
          publication. Third-party estimates are attributed and hedged. We never invent numbers,
          products, or releases.
        </p>
      </section>
    </Container>
  );
}
