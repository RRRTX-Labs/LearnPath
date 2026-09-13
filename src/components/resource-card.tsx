import { ArrowUpRight, BookOpen, Clock, FileText, FlaskConical, ListVideo, Play, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Resource } from "@/lib/content";
import { labelCopy } from "@/lib/content/schema";
import { cn, formatDuration } from "@/lib/utils";
import { Badge } from "./ui";

const TYPE_ICON = {
  "youtube-course": Play,
  "youtube-video": Play,
  playlist: ListVideo,
  documentation: BookOpen,
  article: FileText,
  interactive: FlaskConical,
  project: Terminal,
  cheatsheet: FileText,
} as const;

function Score({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2" title={`LearnPath editorial score ${value}/100`}>
      <div className="h-1 w-16 overflow-hidden rounded-pill bg-bg-sunken" aria-hidden>
        <div className="h-full rounded-pill bg-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
        Score <span className="text-fg">{value}</span>
      </span>
    </div>
  );
}

export function ResourceCard({
  resource,
  slot,
  className,
}: {
  resource: Resource;
  slot?: string;
  className?: string;
}) {
  const Icon = TYPE_ICON[resource.type];
  const isVideo = Boolean(resource.youtubeId);
  const primaryLabel = resource.labels[0];

  return (
    <Link
      href={`/resources/${resource.id}`}
      className={cn(
        "group surface card-hover spotlight flex h-full flex-col overflow-hidden rounded-lg",
        className,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-line bg-bg-sunken">
        {isVideo ? (
          <>
            <Image
              src={`https://i.ytimg.com/vi/${resource.youtubeId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
              loading="lazy"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-fg">
                <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
              </span>
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white/90">
              {formatDuration(resource.durationMinutes)}
            </span>
          </>
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface-2 to-bg-sunken">
            <Icon className="h-8 w-8 text-muted transition duration-300 group-hover:scale-110 group-hover:text-primary" aria-hidden />
            {resource.type === "playlist" && resource.playlistVideoCount ? (
              <span className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/90">
                {resource.playlistVideoCount} videos
              </span>
            ) : null}
          </span>
        )}
        {primaryLabel ? (
          <span className="absolute left-2 top-2">
            <Badge tone={primaryLabel === "best-overall" ? "accent" : "primary"} className="bg-bg/80 backdrop-blur-sm">
              {labelCopy[primaryLabel]}
            </Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {slot ? <Badge tone="primary">{slot}</Badge> : null}
          <Badge>{resource.type.replace("-", " ")}</Badge>
          <Badge>{resource.level}</Badge>
        </div>
        <h3 className="font-display text-lg leading-snug transition-colors group-hover:text-primary">
          {resource.title}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <span className="truncate">{resource.provider}</span>
          <span aria-hidden>·</span>
          <Clock className="h-3 w-3" aria-hidden />
          <span className="shrink-0">{formatDuration(resource.durationMinutes)}</span>
        </p>
        <p className="line-clamp-2 text-sm text-muted">{resource.editorNote}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <Score value={resource.editorScore} />
          <span className="flex items-center gap-1 text-sm font-medium text-primary">
            {isVideo ? "Watch" : "Open"}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Transparent editorial review — five honest dimensions instead of a fake score. */
export function ReviewStars({
  review,
  className = "",
}: {
  review: { clarity: number; handsOn: number; freshness: number; projects: number; beginner: number };
  className?: string;
}) {
  const rows: [string, number][] = [
    ["Clarity", review.clarity],
    ["Hands-on", review.handsOn],
    ["Freshness", review.freshness],
    ["Projects", review.projects],
    ["Beginner-friendly", review.beginner],
  ];
  return (
    <dl className={`grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2 ${className}`}>
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-3 text-sm">
          <dt className="text-muted">{label}</dt>
          <dd aria-label={`${label}: ${value} out of 5`}>
            <span aria-hidden className="tracking-[0.15em] text-primary">
              {"★".repeat(value)}
              <span className="text-muted/50">{"★".repeat(5 - value)}</span>
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
