"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "./ui";

export function SearchBox({ large }: { large?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      className="flex w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
      role="search"
    >
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search roadmaps, skills, resources…"
        aria-label="Search LearnPath"
        className={large ? "h-14 text-base" : ""}
      />
      <Button type="submit" className={large ? "h-14 px-6" : ""}>
        Search
      </Button>
    </form>
  );
}
