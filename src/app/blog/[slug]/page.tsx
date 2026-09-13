import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogBody } from "@/components/blog-body";
import { Badge, ButtonLink, Container } from "@/components/ui";
import { blogCategoryCopy, blogPosts, blogPostBySlug, roadmapBySlug, skillById } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPostBySlug.get((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.cover],
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: [blogCategoryCopy[post.category]],
    },
  };
}

function dateLabel(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = blogPostBySlug.get((await params).slug);
  if (!post) notFound();

  const idx = blogPosts.findIndex((p) => p.id === post.id);
  const sorted = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const at = sorted.findIndex((p) => p.id === post.id);
  const newer = at > 0 ? sorted[at - 1] : null;
  const older = at < sorted.length - 1 ? sorted[at + 1] : null;

  const relatedSkills = post.relatedSkillIds.map((id) => skillById.get(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedRoadmaps = post.relatedRoadmapIds.map((id) => roadmapBySlug.get(id) ?? [...roadmapBySlug.values()].find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => Boolean(r));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: [post.cover],
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "RRRTX Labs" },
    articleSection: blogCategoryCopy[post.category],
    mainEntityOfPage: `/blog/${post.slug}`,
  };

  return (
    <Container className="max-w-4xl py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="meta">
        <Link href="/blog" className="hover:text-fg">Journal</Link>
        <span aria-hidden> / </span>
        <span>{blogCategoryCopy[post.category]}</span>
      </nav>

      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-5xl">{post.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge tone="accent">{post.author}</Badge>
        <span className="meta">
          {dateLabel(post.publishedAt)} · {post.readingMinutes} min read
        </span>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-muted">{post.excerpt}</p>

      <div className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-xl border border-line">
        <Image src={post.cover} alt={`Cover art for ${post.title}`} fill priority className="object-cover" sizes="(max-width: 896px) 100vw, 896px" />
      </div>

      <div className="mt-10">
        <BlogBody post={post} />
      </div>

      {(relatedSkills.length || relatedRoadmaps.length) ? (
        <section className="mt-10 border-t border-line pt-6" aria-label="Related learning">
          <p className="eyebrow">Keep going</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedRoadmaps.map((r) => (
              <ButtonLink key={r.id} href={`/roadmaps/${r.slug}`} variant="subtle" size="sm">
                {r.title} roadmap
              </ButtonLink>
            ))}
            {relatedSkills.map((s) => (
              <ButtonLink key={s.id} href={`/skills/${s.slug}`} variant="ghost" size="sm">
                {s.title}
              </ButtonLink>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2" aria-label="More articles">
        {older ? (
          <Link href={`/blog/${older.slug}`} className="surface card-hover rounded-lg p-4">
            <p className="meta">Older</p>
            <p className="mt-1 font-medium">{older.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/blog/${newer.slug}`} className="surface card-hover rounded-lg p-4 text-right">
            <p className="meta">Newer</p>
            <p className="mt-1 font-medium">{newer.title}</p>
          </Link>
        ) : null}
      </nav>
      <p className="meta mt-6">
        Index {idx + 1} of {blogPosts.length} · Corrections welcome via{" "}
        <a className="text-primary hover:underline" href="https://github.com/RRRTX-Labs/LearnPath" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </Container>
  );
}
