import type { Metadata } from "next";
import { ResourceCard } from "@/components/resource-card";
import { resources } from "@/lib/content";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  const courses = resources.filter((r) => r.type === "youtube-course" || r.type === "playlist" || r.type === "interactive");
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Long form</p>
      <h1 className="mt-2 font-display text-4xl">Courses</h1>
      <p className="mt-3 text-muted">Curated free courses and playlists. We embed YouTube; we do not host it.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {courses.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  );
}
