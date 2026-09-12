import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { Badge, EmptyState } from "@/components/ui";
import { searchCatalog } from "@/lib/search";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const hits = q ? searchCatalog(q) : [];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl">Search</h1>
      <div className="mt-6">
        <SearchBox large />
      </div>
      {q && !hits.length ? (
        <div className="mt-8">
          <EmptyState title="Nothing matches" body="Try a skill name, a language, or a provider such as freeCodeCamp." />
        </div>
      ) : null}
      <ul className="mt-8 space-y-3">
        {hits.map((h) => (
          <li key={h.id} className="surface p-4">
            <Badge>{h.kind}</Badge>
            <h2 className="mt-2 font-display text-2xl">
              <Link href={h.href}>{h.title}</Link>
            </h2>
            <p className="text-sm text-muted">{h.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
