import type { Metadata } from "next";
import { SearchResults } from "@/components/search-results";
import { Container } from "@/components/ui";
import { searchCatalog } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const hits = q ? searchCatalog(q) : [];
  return (
    <Container className="max-w-4xl py-12">
      <p className="eyebrow">Discovery</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Search LearnPath</h1>
      <p className="mt-3 max-w-xl text-muted">
        Roadmaps, skills, {""}
        resources, challenges and projects — one index, instant results. Press{" "}
        <kbd className="rounded border border-line bg-bg-sunken px-1 font-mono text-[11px]">/</kbd> anywhere to jump here.
      </p>
      <div className="mt-8">
        <SearchResults initialQ={q} initialHits={hits} />
      </div>
    </Container>
  );
}
