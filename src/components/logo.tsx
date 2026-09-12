import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The LearnPath mark: an ascending path with a destination node.
 * Vector source of truth: branding/mark.svg (rasters rendered by
 * scripts/render-brand-assets.py from the same geometry).
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-8", className)} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" className="fill-surface-2" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="13.5" fill="none" className="stroke-line" />
      <path
        d="M15 45 L28 32 L36 40 L49 22"
        fill="none"
        className="stroke-primary"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="45" r="3.5" className="fill-primary" />
      <circle cx="49" cy="22" r="9" fill="none" className="stroke-accent" strokeOpacity="0.35" strokeWidth="2" />
      <circle cx="49" cy="22" r="5.5" className="fill-accent" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 rounded-md text-fg", className)}
      aria-label="LearnPath home"
    >
      <Mark />
      <span className="font-display text-xl leading-none tracking-tight">LearnPath</span>
    </Link>
  );
}
