"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button, ButtonLink } from "./ui";

const NAV = [
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/practice", label: "Practice" },
  { href: "/challenges", label: "Challenges" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm text-muted hover:text-fg",
                pathname.startsWith(item.href) && "text-fg",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/search" variant="ghost" size="sm">
            Search
          </ButtonLink>
          <ThemeToggle />
          {session?.user ? (
            <ButtonLink href="/me" size="sm">
              My learning
            </ButtonLink>
          ) : (
            <ButtonLink href="/sign-in" size="sm">
              Sign in
            </ButtonLink>
          )}
        </div>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          Menu
        </Button>
      </div>
      {open ? (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setOpen(false)}>
              Search
            </Link>
            <Link href={session?.user ? "/me" : "/sign-in"} onClick={() => setOpen(false)}>
              {session?.user ? "My learning" : "Sign in"}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
