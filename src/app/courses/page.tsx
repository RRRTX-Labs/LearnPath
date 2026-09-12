import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/resource-library";
import { Container } from "@/components/ui";
import { resources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Courses & playlists",
  description:
    "Long-form free courses and playlists curated by LearnPath — verified, officially embedded, never rehosted.",
};

function label(id: string) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CoursesPage() {
  const courses = resources.filter(
    (r) => r.type === "youtube-course" || r.type === "playlist" || r.type === "interactive",
  );
  const counts = new Map<string, number>();
  for (const r of courses) for (const t of r.topics) counts.set(t, (counts.get(t) ?? 0) + 1);
  const topics = [...counts.entries()]
    .map(([id, count]) => ({ id, label: label(id), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  return (
    <Container className="py-12">
      <p className="eyebrow">Long form</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Courses & playlists</h1>
      <p className="mt-4 max-w-2xl text-muted">
        The deep end of the library: full courses and structured playlists. LearnPath embeds YouTube
        officially; we do not host, download or restyle it.
      </p>
      <div className="mt-8">
        <ResourceLibrary resources={courses} topics={topics} />
      </div>
    </Container>
  );
}
