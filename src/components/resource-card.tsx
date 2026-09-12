import Link from "next/link";
import type { Resource } from "@/lib/content";
import { labelCopy } from "@/lib/content/schema";
import { formatDuration } from "@/lib/utils";
import { Badge, Card } from "./ui";

export function ResourceCard({
  resource,
  slot,
}: {
  resource: Resource;
  slot?: string;
}) {
  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {slot ? <Badge tone="primary">{slot}</Badge> : null}
        <Badge>{resource.type.replace("-", " ")}</Badge>
        {resource.labels.slice(0, 2).map((l) => (
          <Badge key={l} tone="accent">
            {labelCopy[l]}
          </Badge>
        ))}
      </div>
      <h3 className="font-display text-xl leading-tight">
        <Link href={`/resources/${resource.id}`} className="hover:text-primary">
          {resource.title}
        </Link>
      </h3>
      <p className="text-sm text-muted">
        {resource.provider} · {formatDuration(resource.durationMinutes)} · {resource.level}
      </p>
      <p className="text-sm">{resource.editorNote}</p>
      <p className="mt-auto font-mono text-[11px] uppercase tracking-wider text-muted">
        Editorial score {resource.editorScore}/100 · verified {resource.lastVerified}
      </p>
    </Card>
  );
}
