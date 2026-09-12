"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "./ui";

export function SearchBox({
  large,
  initial,
  onValue,
}: {
  large?: boolean;
  initial?: string;
  onValue?: (v: string) => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initial ?? "");
  return (
    <form
      className="flex w-full gap-2"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <Input
          id="lp-search-input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onValue?.(e.target.value);
          }}
          placeholder="Search roadmaps, skills, resources, projects…"
          aria-label="Search LearnPath"
          className={large ? "h-13 pl-10 text-base" : "pl-10"}
        />
      </div>
      <Button type="submit" className={large ? "h-13 px-6" : ""}>
        Search
      </Button>
    </form>
  );
}
