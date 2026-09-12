import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "./github-icon";
import { Mark } from "./logo";
import { envOr, firstNonEmptyEnv } from "@/lib/env";

const GITHUB_URL = envOr("https://github.com/RRRTX-Labs/LearnPath", process.env.NEXT_PUBLIC_GITHUB_URL);
const DISCORD_INVITE = firstNonEmptyEnv(process.env.NEXT_PUBLIC_DISCORD_INVITE);

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark className="h-7 w-7" />
            <span className="font-display text-xl">LearnPath</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Learn anything. Build everything. Free, structured learning paths built from the best
            resources on the web.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line p-2 text-muted transition-colors hover:text-fg"
              aria-label="LearnPath on GitHub"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
            {DISCORD_INVITE ? (
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line p-2 text-muted transition-colors hover:text-fg"
                aria-label="Join the LearnPath Discord"
              >
                <MessagesSquare className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
        <nav aria-label="Learn">
          <p className="eyebrow mb-3">Learn</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-fg" href="/roadmaps">Roadmaps</Link></li>
            <li><Link className="hover:text-fg" href="/skills/python-syntax">Skills</Link></li>
            <li><Link className="hover:text-fg" href="/resources">Resources</Link></li>
            <li><Link className="hover:text-fg" href="/practice">Practice</Link></li>
          </ul>
        </nav>
        <nav aria-label="Build">
          <p className="eyebrow mb-3">Build</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-fg" href="/challenges">Challenges</Link></li>
            <li><Link className="hover:text-fg" href="/projects">Projects</Link></li>
            <li><Link className="hover:text-fg" href="/me">My learning</Link></li>
            <li><Link className="hover:text-fg" href="/search">Search</Link></li>
          </ul>
        </nav>
        <nav aria-label="Project">
          <p className="eyebrow mb-3">Project</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-fg" href="/community">Community</Link></li>
            <li><Link className="hover:text-fg" href="/open-source">Open source</Link></li>
            <li><Link className="hover:text-fg" href="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-fg" href="/terms">Terms</Link></li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-line py-4 text-center font-mono text-[11px] uppercase tracking-wider text-muted">
        Free and open source. No certificates. No paywall. No trackers.
      </p>
    </footer>
  );
}
