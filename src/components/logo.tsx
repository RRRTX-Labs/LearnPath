import Link from "next/link";
import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="64" height="64" rx="14" fill="currentColor" className="text-surface-2" />
      <path
        d="M16 44H40V16"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 44 l4 -4 l4 4 l-4 4 z" fill="var(--primary)" />
      <path d="M40 44 l4 -4 l4 4 l-4 4 z" fill="var(--primary)" />
      <path d="M40 16 l4 -4 l4 4 l-4 4 z" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 text-fg", className)}>
      <Mark />
      <span className="font-display text-xl leading-none tracking-tight">LearnPath</span>
    </Link>
  );
}
