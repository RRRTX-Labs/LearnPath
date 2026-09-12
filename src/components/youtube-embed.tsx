"use client";

import { useState } from "react";
import { Button } from "./ui";

export function YoutubeEmbed({
  videoId,
  title,
  fallbackHref,
}: {
  videoId: string;
  title: string;
  fallbackHref?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (failed) {
    return (
      <div className="surface flex flex-col gap-3 p-6">
        <p className="font-medium">This resource is currently unavailable.</p>
        <p className="text-sm text-muted">
          YouTube could not load the video. It may be private, deleted, or restricted in your region.
        </p>
        {fallbackHref ? (
          <Button onClick={() => (window.location.href = fallbackHref)}>Open an alternative</Button>
        ) : (
          <a className="link-plain text-sm" href={`https://www.youtube.com/watch?v=${videoId}`} rel="noopener">
            Open on YouTube
          </a>
        )}
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-[16px] border border-border bg-bg-sunken text-left"
        aria-label={`Play ${title} on YouTube`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt="" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-bg">Play on YouTube</span>
        </span>
        <span className="absolute bottom-3 left-3 font-mono text-[11px] uppercase tracking-wider text-white/80">
          YouTube
        </span>
      </button>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-[16px] border border-border bg-black">
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
