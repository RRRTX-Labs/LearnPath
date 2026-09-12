"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Play } from "lucide-react";
import { Skeleton } from "./ui";

/**
 * Official YouTube embeds only.
 *
 * - Nothing is loaded until the learner clicks the facade (no iframe, no API script on page load).
 * - After the click we load YouTube's own IFrame Player API and mount the official player on the
 *   privacy-enhanced host (youtube-nocookie.com). We never restyle, overlay, or replace its chrome.
 * - Failure detection uses the player API's `onError` event (codes 2/5/100/101/150). A DOM `onerror`
 *   on the iframe can never fire for cross-origin document failures, which is why the previous
 *   implementation's "unavailable" state was unreachable.
 * - On failure we keep the learning path moving: alternatives + report, never a dead end.
 */

type YTApi = {
    Player: new (
      el: string | HTMLElement,
      options: {
        host?: string;
        videoId?: string;
        playerVars?: Record<string, string | number>;
        events?: {
          onReady?: () => void;
          onError?: (event: { data: number }) => void;
        };
      },
  ) => { destroy?: () => void };
  ready?: (fn: () => void) => void;
};

type PlayerApi = { YT?: YTApi };

const ERROR_COPY: Record<number, string> = {
  2: "YouTube rejected the request for this video id.",
  5: "The YouTube player reported an HTML5 playback error.",
  100: "This video is private or has been removed.",
  101: "The owner has disabled embedding for this video.",
  150: "The owner has disabled embedding for this video.",
};

let apiPromise: Promise<YTApi> | null = null;

function loadPlayerApi(): Promise<YTApi> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const w = window as unknown as PlayerApi & { onYouTubeIframeAPIReady?: () => void };
    if (w.YT?.Player) {
      resolve(w.YT);
      return;
    }
    const finish = () => {
      if (w.YT) resolve(w.YT);
      else reject(new Error("YouTube player API loaded without exposing YT."));
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Could not load the YouTube player API."));
    w.onYouTubeIframeAPIReady = finish;
    document.head.appendChild(script);
  });
  return apiPromise;
}

export function YoutubeEmbed({
  videoId,
  title,
  playlistId,
  fallbackHref,
  reportHref,
}: {
  videoId?: string;
  title: string;
  playlistId?: string;
  fallbackHref?: string;
  reportHref?: string;
}) {
  const [phase, setPhase] = useState<"facade" | "loading" | "playing" | "failed">("facade");
  const [failure, setFailure] = useState("");
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<{ destroy?: () => void } | null>(null);

  useEffect(() => () => playerRef.current?.destroy?.(), []);

  async function start() {
    setPhase("loading");
    try {
      const YT = await loadPlayerApi();
      const mount = () => {
        if (!hostRef.current) return;
        hostRef.current.innerHTML = "";
        const el = document.createElement("div");
        hostRef.current.appendChild(el);
        playerRef.current = new YT.Player(el, {
          host: "https://www.youtube-nocookie.com",
          ...(videoId ? { videoId } : {}),
          playerVars: {
            rel: 0,
            playsinline: 1,
            ...(playlistId ? { listType: "playlist", list: playlistId } : {}),
          },
          events: {
            onReady: () => setPhase("playing"),
            onError: (event) => {
              setFailure(ERROR_COPY[event.data] ?? `YouTube reported error ${event.data}.`);
              setPhase("failed");
            },
          },
        });
      };
      if (typeof YT.ready === "function") YT.ready(mount);
      else mount();
    } catch {
      setFailure("The YouTube player API could not be loaded from this network.");
      setPhase("failed");
    }
  }

  if (phase === "failed") {
    return (
      <div className="surface flex flex-col gap-3 p-6" role="alert">
        <p className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-warning" aria-hidden />
          This resource is currently unavailable.
        </p>
        <p className="text-sm text-muted">
          {failure} YouTube availability and embed permission can change at any time; LearnPath
          verifies embeds editorially but cannot guarantee a third-party video.
        </p>
        <div className="flex flex-wrap gap-2">
          {fallbackHref ? <ButtonLinkish href={fallbackHref}>Explore alternatives</ButtonLinkish> : null}
          {reportHref ? (
            <Link href={reportHref} className="text-sm text-muted underline-offset-2 hover:underline">
              Report this resource
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  if (phase === "facade") {
    const thumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
    return (
      <button
        type="button"
        onClick={start}
        className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-line bg-bg-sunken text-left focus-visible:outline-2"
        aria-label={`Play ${title} on YouTube`}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-muted">
            Playlist
          </span>
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-fg transition group-hover:gap-3">
            <Play className="h-4 w-4 fill-current" aria-hidden />
            Play on YouTube
          </span>
        </span>
        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/85">
          YouTube
        </span>
      </button>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-black">
      {phase === "loading" ? (
        <div className="absolute inset-0 grid place-items-center gap-2 bg-bg-sunken">
          <Skeleton className="h-full w-full opacity-40" />
          <p className="absolute font-mono text-[11px] uppercase tracking-widest text-muted">
            Loading YouTube player…
          </p>
        </div>
      ) : null}
      <div ref={hostRef} className="h-full w-full" />
    </div>
  );
}

function ButtonLinkish({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-fg hover:opacity-90">
      {children}
    </Link>
  );
}
