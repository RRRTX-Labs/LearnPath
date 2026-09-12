"use client";

import { MarkComplete } from "@/components/mark-complete";
import { PracticeWorkspace } from "@/components/practice/workspace";
import { ReportForm } from "@/components/report-form";
import type { Project } from "@/lib/content";
export function ProjectView({
  project,
  starterFile,
  starterCode,
}: {
  project: Project;
  starterFile: string;
  starterCode: string;
}) {
  return (
    <div className="mt-8 space-y-4">
      <p className="eyebrow">Starter — {starterFile}</p>
      <PracticeWorkspace language={project.language} initialCode={starterCode} />
      {project.hints.length ? (
        <details className="surface p-4">
          <summary className="cursor-pointer">Hints</summary>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {project.hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      ) : null}
      <MarkComplete entityType="project" entityId={project.id} label="Mark project complete" />
      <ReportForm targetType="project" targetId={project.id} />
    </div>
  );
}
