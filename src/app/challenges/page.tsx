import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { challenges } from "@/lib/content";

export const metadata: Metadata = { title: "Challenges" };

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Prove it</p>
      <h1 className="mt-2 font-display text-4xl">Challenges</h1>
      <p className="mt-3 text-muted">Small tests. Run them in the browser. Passing marks the challenge complete.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {challenges.map((c) => (
          <Link key={c.id} href={`/challenges/${c.slug}`}>
            <Card className="h-full hover:border-primary/40">
              <div className="flex gap-2">
                <Badge>{c.language}</Badge>
                <Badge tone="accent">{c.difficulty}</Badge>
              </div>
              <h2 className="mt-3 font-display text-2xl">{c.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{c.prompt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
