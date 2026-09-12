import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-xl">LearnPath</p>
          <p className="mt-2 text-sm text-muted">Learn anything. Build everything.</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Learn</p>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/roadmaps">Roadmaps</Link>
            </li>
            <li>
              <Link href="/practice">Practice</Link>
            </li>
            <li>
              <Link href="/challenges">Challenges</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Community</p>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/community">Discord</Link>
            </li>
            <li>
              <Link href="/open-source">Open source</Link>
            </li>
            <li>
              <Link href="/resources">Resources</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Legal</p>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-4 text-center font-mono text-[11px] uppercase tracking-wider text-muted">
        Free and open source. No certificates. No paywall.
      </p>
    </footer>
  );
}
