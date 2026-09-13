import MiniSearch from "minisearch";
import { blogPosts, challenges, projects, resources, roadmaps, skills } from "./content";

export type SearchHit = {
  id: string;
  kind: "roadmap" | "skill" | "resource" | "project" | "challenge" | "blog";
  title: string;
  href: string;
  excerpt: string;
};

type Doc = SearchHit & { body: string };

let index: MiniSearch<Doc> | null = null;

function getIndex() {
  if (index) return index;
  index = new MiniSearch<Doc>({
    fields: ["title", "body"],
    storeFields: ["kind", "title", "href", "excerpt"],
    searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.2 },
  });
  const docs: Doc[] = [
    ...roadmaps.map((r) => ({
      id: `roadmap:${r.id}`,
      kind: "roadmap" as const,
      title: r.title,
      href: `/roadmaps/${r.slug}`,
      excerpt: r.tagline,
      body: `${r.title} ${r.tagline} ${r.description} ${r.category}`,
    })),
    ...skills.map((s) => ({
      id: `skill:${s.id}`,
      kind: "skill" as const,
      title: s.title,
      href: `/skills/${s.slug}`,
      excerpt: s.summary,
      body: `${s.title} ${s.summary} ${s.objectives.join(" ")}`,
    })),
    ...resources.map((r) => ({
      id: `resource:${r.id}`,
      kind: "resource" as const,
      title: r.title,
      href: `/resources/${r.id}`,
      excerpt: r.editorNote,
      body: `${r.title} ${r.provider} ${r.topics.join(" ")} ${r.editorNote}`,
    })),
    ...projects.map((p) => ({
      id: `project:${p.id}`,
      kind: "project" as const,
      title: p.title,
      href: `/projects/${p.slug}`,
      excerpt: p.summary,
      body: `${p.title} ${p.summary} ${p.description}`,
    })),
    ...blogPosts.map((b) => ({
      id: `blog:${b.id}`,
      kind: "blog" as const,
      title: b.title,
      href: `/blog/${b.slug}`,
      excerpt: b.excerpt.slice(0, 160),
      body: `${b.title} ${b.excerpt} ${b.category}`,
    })),
    ...challenges.map((c) => ({
      id: `challenge:${c.id}`,
      kind: "challenge" as const,
      title: c.title,
      href: `/challenges/${c.slug}`,
      excerpt: c.prompt.slice(0, 160),
      body: `${c.title} ${c.prompt}`,
    })),
  ];
  index.addAll(docs);
  return index;
}

export function searchCatalog(q: string, limit = 24): SearchHit[] {
  const query = q.trim();
  if (!query) return [];
  return getIndex()
    .search(query)
    .slice(0, limit)
    .map((hit) => ({
      id: String(hit.id),
      kind: hit.kind as SearchHit["kind"],
      title: hit.title as string,
      href: hit.href as string,
      excerpt: hit.excerpt as string,
    }));
}
