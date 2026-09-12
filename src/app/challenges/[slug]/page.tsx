import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeView } from "./ui";
import { challengeBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { challenges } = await import("@/lib/content");
  return challenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = challengeBySlug.get((await params).slug);
  return c ? { title: c.title, description: c.prompt } : {};
}

export default async function ChallengePage({ params }: Props) {
  const challenge = challengeBySlug.get((await params).slug);
  if (!challenge) notFound();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="eyebrow">
        {challenge.language} · {challenge.difficulty} · ~{challenge.estimatedMinutes} min
      </p>
      <h1 className="mt-2 font-display text-4xl">{challenge.title}</h1>
      <ChallengeView challenge={challenge} />
    </div>
  );
}
