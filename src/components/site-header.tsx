"use client";

import { Menu, MessagesSquare, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "./github-icon";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { ButtonLink } from "./ui";
import { envOr } from "@/lib/env";

const NAV = [
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/resources", label: "Resources" },
  { href: "/practice", label: "Practice" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
];

const GITHUB_URL = envOr("https://github.com/RRRTX-Labs/LearnPath", process.env.NEXT_PUBLIC_GITHUB_URL);

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // "/" focuses search from anywhere, like a developer tool.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (e.key !== "/" || !target) return;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      e.preventDefault();
      const input = document.getElementById("lp-search-input") as HTMLInputElement | null;
      if (input) {
        input.focus();
        return;
      }
      router.push("/search");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                pathname.startsWith(item.href) ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/search"
            className="flex h-9 items-center gap-2 rounded-md border border-line bg-bg-sunken px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <Search className="h-3.5 w-3.5" aria-hidden />
            Search
            <kbd className="ml-2 rounded border border-line px-1 font-mono text-[10px]">/</kbd>
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LearnPath on GitHub"
            className="rounded-md p-2 text-muted transition-colors hover:text-fg"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
          <ThemeToggle />
          {session?.user ? (
            <ButtonLink href="/me" size="sm">
              My learning
            </ButtonLink>
          ) : (
            <ButtonLink href="/sign-in" size="sm" variant="ghost">
              Sign in
            </ButtonLink>
          )}
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-fg md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Primary mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-base",
                  pathname.startsWith(item.href) ? "bg-surface-2 text-fg" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-3 text-base text-muted">
              <Search className="h-4 w-4" aria-hidden /> Search
            </Link>
            <Link href={GITHUB_URL} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-3 text-base text-muted">
              <GitHubIcon className="h-4 w-4" /> GitHub
            </Link>
            <Link href="/community" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-3 text-base text-muted">
              <MessagesSquare className="h-4 w-4" aria-hidden /> Discord
            </Link>
            <div className="flex items-center gap-2 px-3 py-3">
              <ThemeToggle />
              {session?.user ? (
                <ButtonLink href="/me" size="sm">
                  My learning
                </ButtonLink>
              ) : (
                <ButtonLink href="/sign-in" size="sm" variant="ghost">
                  Sign in
                </ButtonLink>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
