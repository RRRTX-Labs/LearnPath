import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportForm } from "@/components/report-form";
import { Badge, ButtonLink } from "@/components/ui";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { resourceById, skills } from "@/lib/content";
import { labelCopy } from "@/lib/content/schema";
import { formatDuration } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { resources } = await import("@/lib/content");
  return resources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resourceById.get((await params).id);
  return r ? { title: r.title, description: r.editorNote } : {};
}

export default async function ResourcePage({ params }: Props) {
  const resource = resourceById.get((await params).id);
  if (!resource) notFound();
  const usedBy = skills.filter((s) => Object.values(s.resources).includes(resource.id) || s.extraResourceIds.includes(resource.id));
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap gap-2">
        <Badge>{resource.type.replace("-", " ")}</Badge>
        <Badge>{resource.level}</Badge>
        {resource.labels.map((l) => (
          <Badge key={l} tone="accent">
            {labelCopy[l]}
          </Badge>
        ))}
      </div>
      <h1 className="mt-4 font-display text-4xl">{resource.title}</h1>
      <p className="mt-2 text-muted">
        {resource.provider} · {formatDuration(resource.durationMinutes)} · {resource.language.toUpperCase()}
      </p>
      <p className="mt-4">{resource.editorNote}</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        Editorial score {resource.editorScore}/100 · verified {resource.lastVerified} · {resource.status}
      </p>
      <div className="mt-8">
        {resource.youtubeId ? (
          <YoutubeEmbed videoId={resource.youtubeId} title={resource.title} />
        ) : (
          <ButtonLink href={resource.url}>Open resource</ButtonLink>
        )}
      </div>
      {resource.youtubeId ? (
        <p className="mt-3 text-sm text-muted">
          Player by YouTube.{" "}
          <a className="link-plain" href={resource.url} rel="noopener noreferrer" target="_blank">
            Watch on YouTube
          </a>
        </p>
      ) : null}
      {usedBy.length ? (
        <div className="mt-10">
          <h2 className="font-display text-2xl">Used in</h2>
          <ul className="mt-2 space-y-1">
            {usedBy.map((s) => (
              <li key={s.id}>
                <Link className="text-primary" href={`/skills/${s.slug}`}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-8">
        <ReportForm targetType="resource" targetId={resource.id} />
      </div>
    </div>
  );
}
