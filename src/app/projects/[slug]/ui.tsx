"use client";

import { useState } from "react";
import { MarkComplete } from "@/components/mark-complete";
import { PracticeWorkspace } from "@/components/practice/workspace";
import { ReportForm } from "@/components/report-form";
import type { Project } from "@/lib/content";

export function ProjectView({ project }: { project: Project }) {
  const files = Object.entries(project.starter);
  const [activeFile, setActiveFile] = useState(files[0]?.[0] ?? "main");
  const activeCode = project.starter[activeFile] ?? files[0]?.[1] ?? "";

  return (
    <div className="mt-8 space-y-4">
      <p className="eyebrow">Starter</p>
      {files.length > 1 ? (
        <div role="tablist" aria-label="Starter files" className="flex flex-wrap gap-2">
          {files.map(([name]) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={name === activeFile}
              onClick={() => setActiveFile(name)}
              className={`rounded-pill border px-3 py-1 font-mono text-xs transition-colors ${
                name === activeFile
                  ? "border-teal/50 bg-teal/10 text-fg"
                  : "border-border text-muted hover:text-fg"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      ) : (
        <p className="font-mono text-sm text-muted">{activeFile}</p>
      )}
      {/* Keyed so each file keeps its own editor + output state. */}
      <PracticeWorkspace key={activeFile} language={project.language} initialCode={activeCode} />
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
