import { AlertTriangle, CalendarDays, CheckCircle2, Clock, ExternalLink, Languages } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportForm } from "@/components/report-form";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { Badge, ButtonLink, Container } from "@/components/ui";
import { resourceById, resources as allResources, skills } from "@/lib/content";
import { labelCopy } from "@/lib/content/schema";
import { formatDuration } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { resources } = await import("@/lib/content");
  return resources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resourceById.get((await params).id);
  if (!r) return {};
  return {
    title: r.title,
    description: r.editorNote,
    alternates: { canonical: `/resources/${r.id}` },
  };
}

export default async function ResourcePage({ params }: Props) {
  const resource = resourceById.get((await params).id);
  if (!resource) notFound();

  const usedBy = skills.filter(
    (s) => Object.values(s.resources).includes(resource.id) || s.extraResourceIds.includes(resource.id),
  );
  const alternatives = skills
    .filter((s) => Object.values(s.resources).includes(resource.id))
    .flatMap((s) => [s.resources.alternative, s.resources.quick, s.resources.project, ...s.extraResourceIds])
    .filter((id): id is string => Boolean(id) && id !== resource.id);
  const topicAlternatives = topicAlternativesFor(resource.topics, resource.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": resource.youtubeId ? "VideoObject" : "LearningResource",
    name: resource.title,
    description: resource.editorNote,
    url: resource.url,
    ...(resource.youtubeId ? { embedUrl: `https://www.youtube-nocookie.com/embed/${resource.youtubeId}` } : {}),
    publisher: { "@type": "Organization", name: resource.provider },
    learningResourceType: resource.type,
    educationalLevel: resource.level,
    isAccessibleForFree: true,
  };

  return (
    <Container className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="flex flex-wrap gap-2">
            {resource.labels.map((l) => (
              <Badge key={l} tone={l === "best-overall" ? "accent" : "primary"}>
                {labelCopy[l]}
              </Badge>
            ))}
            <Badge>{resource.type.replace("-", " ")}</Badge>
            <Badge>{resource.level}</Badge>
          </div>
          <h1 className="mt-4 font-display text-3xl leading-tight md:text-5xl">{resource.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
            <span>{resource.provider}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {formatDuration(resource.durationMinutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5" aria-hidden /> {resource.language.toUpperCase()}
            </span>
            {resource.publishedAt ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden /> published {resource.publishedAt}
              </span>
            ) : null}
          </p>

          <section className="surface mt-8 rounded-lg p-5" aria-labelledby="why">
            <h2 id="why" className="eyebrow">
              Why LearnPath recommends it
            </h2>
            <p className="mt-3 leading-relaxed">{resource.editorNote}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-bg-sunken">
                <div className="h-full rounded-pill bg-primary" style={{ width: `${resource.editorScore}%` }} />
              </div>
              <p className="meta shrink-0">
                LearnPath score <span className="text-fg">{resource.editorScore}</span>/100 · verified{" "}
                {resource.lastVerified}
              </p>
            </div>
          </section>

          {resource.learningOutcomes.length ? (
            <section className="mt-8" aria-labelledby="outcomes">
              <h2 id="outcomes" className="font-display text-2xl">
                What you walk away with
              </h2>
              <ul className="mt-3 space-y-2">
                {resource.learningOutcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {resource.warnings.length ? (
            <section className="surface mt-8 rounded-lg border-warning/30 p-4" aria-labelledby="warnings">
              <h2 id="warnings" className="flex items-center gap-2 text-sm font-medium text-warning">
                <AlertTriangle className="h-4 w-4" aria-hidden /> Worth knowing before you start
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {resource.warnings.map((w) => (
                  <li key={w}>{w.replace(/_/g, " ")}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-8">
            {resource.youtubeId || resource.playlistId ? (
              <>
                <YoutubeEmbed
                  videoId={resource.youtubeId}
                  playlistId={resource.playlistId}
                  title={resource.title}
                  fallbackHref={topicAlternatives[0] ? `/resources/${topicAlternatives[0].id}` : undefined}
                  reportHref="#report"
                />
                <p className="meta mt-3">
                  Player by YouTube.{" "}
                  <a className="text-primary hover:underline" href={resource.url} rel="noopener noreferrer" target="_blank">
                    Watch on YouTube
                  </a>
                </p>
              </>
            ) : (
              <ButtonLink href={resource.url} external size="lg">
                Open resource <ExternalLink className="h-4 w-4" aria-hidden />
              </ButtonLink>
            )}
          </div>

          <div className="mt-10" id="report">
            <ReportForm targetType="resource" targetId={resource.id} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="surface rounded-lg p-5">
            <p className="eyebrow">Facts</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Type" v={resource.type.replace("-", " ")} />
              <Row k="Level" v={resource.level} />
              <Row k="Duration" v={formatDuration(resource.durationMinutes)} />
              {resource.playlistVideoCount ? <Row k="Videos" v={String(resource.playlistVideoCount)} /> : null}
              <Row k="Status" v={resource.status} />
              <Row k="Last verified" v={resource.lastVerified} />
            </dl>
          </div>
          {usedBy.length ? (
            <div className="surface rounded-lg p-5">
              <p className="eyebrow">Used in</p>
              <ul className="mt-3 space-y-2 text-sm">
                {usedBy.map((s) => (
                  <li key={s.id}>
                    <Link className="text-primary hover:underline" href={`/skills/${s.slug}`}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(alternatives.length || topicAlternatives.length) ? (
            <div className="surface rounded-lg p-5">
              <p className="eyebrow">Alternatives</p>
              <ul className="mt-3 space-y-3 text-sm">
                {[...new Set([...alternatives, ...topicAlternatives.map((t) => t.id)])]
                  .slice(0, 4)
                  .map((id) => {
                    const r = resourceById.get(id);
                    if (!r) return null;
                    return (
                      <li key={id}>
                        <Link className="group block" href={`/resources/${r.id}`}>
                          <span className="block font-medium transition-colors group-hover:text-primary">
                            {r.title}
                          </span>
                          <span className="meta">{r.provider} · score {r.editorScore}</span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </Container>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right capitalize">{v}</dd>
    </div>
  );
}

function topicAlternativesFor(topics: string[], exclude: string) {
  return allResources
    .filter((r) => r.id !== exclude && r.topics.some((t) => topics.includes(t)))
    .sort((a, b) => b.editorScore - a.editorScore)
    .slice(0, 3);
}
