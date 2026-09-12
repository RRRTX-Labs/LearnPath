import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeClient } from "./ui";
import { practiceExercises } from "@/lib/content";

const LANGS = ["python", "javascript", "typescript", "html", "sql"] as const;
type Lang = (typeof LANGS)[number];

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: `Practice ${lang}` };
}

export default async function PracticeLangPage({ params }: Props) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  const exercises = practiceExercises.filter((p) => p.language === lang);
  const first = exercises[0];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="eyebrow">Practice</p>
      <h1 className="mt-2 font-display text-4xl capitalize">{lang === "html" ? "HTML / CSS / JS" : lang}</h1>
      <PracticeClient language={lang as Lang} exercises={exercises} initial={first?.starter ?? ""} prompt={first?.prompt} />
    </div>
  );
}
