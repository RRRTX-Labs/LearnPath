import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView } from "./ui";
import { projectBySlug, skillById } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = await import("@/lib/content");
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = projectBySlug.get((await params).slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const project = projectBySlug.get((await params).slug);
  if (!project) notFound();
  const starter = Object.entries(project.starter)[0];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="eyebrow">
        {project.language} · {project.difficulty} · ~{project.estimatedHours}h
      </p>
      <h1 className="mt-2 font-display text-4xl">{project.title}</h1>
      <p className="mt-3 max-w-2xl text-muted">{project.description}</p>
      <h2 className="mt-8 font-display text-2xl">Requirements</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {project.requirements.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">
        Skills: {project.skillIds.map((id) => skillById.get(id)?.title ?? id).join(" · ")}
      </p>
      <ProjectView project={project} starterFile={starter?.[0] ?? "main"} starterCode={starter?.[1] ?? ""} />
    </div>
  );
}
