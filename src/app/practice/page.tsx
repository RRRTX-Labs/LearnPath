import type { Metadata } from "next";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Practice" };

const LANGS = [
  { href: "/practice/python", title: "Python", body: "CPython in WebAssembly via Pyodide. First load downloads the runtime." },
  { href: "/practice/javascript", title: "JavaScript", body: "Runs in a sandboxed iframe. No Node, no network." },
  { href: "/practice/typescript", title: "TypeScript", body: "Transpiled with Sucrase, then the same sandbox." },
  { href: "/practice/html", title: "HTML / CSS / JS", body: "Live preview in an isolated iframe." },
  { href: "/practice/sql", title: "SQL", body: "SQLite compiled to WebAssembly. Fresh seed database each run." },
];

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">Lab</p>
      <h1 className="mt-2 font-display text-4xl">Practice</h1>
      <p className="mt-3 text-muted">
        All execution happens in your browser. LearnPath servers never see your code. Runtimes load only when you open
        them.
      </p>
      <div className="mt-8 grid gap-4">
        {LANGS.map((l) => (
          <Card key={l.href} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl">{l.title}</h2>
              <p className="text-sm text-muted">{l.body}</p>
            </div>
            <ButtonLink href={l.href}>Open</ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
