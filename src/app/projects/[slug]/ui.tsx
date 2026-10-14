"use client";

import { Award, ExternalLink } from "lucide-react";
import { useState } from "react";
import { MarkComplete } from "@/components/mark-complete";
import { PracticeWorkspace } from "@/components/practice/workspace";
import { ReportForm } from "@/components/report-form";
import type { Project } from "@/lib/content";
import { getAssessmentForSkill, getFreeVerseAssessmentUrl, getFreeVerseCredentialUrl } from "@/lib/freeverse";
import { Badge } from "@/components/ui";

export function ProjectView({ project }: { project: Project }) {
  const files = Object.entries(project.starter);
  const [activeFile, setActiveFile] = useState(files[0]?.[0] ?? "main");
  const activeCode = project.starter[activeFile] ?? files[0]?.[1] ?? "";

  const primarySkillId = project.skillIds[0];
  const assessment = primarySkillId ? getAssessmentForSkill(primarySkillId) : null;
  const assessmentUrl = primarySkillId ? getFreeVerseAssessmentUrl(primarySkillId, { projectSlug: project.slug }) : null;
  const credentialUrl = primarySkillId ? getFreeVerseCredentialUrl(primarySkillId) : null;

  return (
    <div className="mt-8 space-y-4">
      <p className="eyebrow">Starter files</p>
      {files.length > 1 ? (
        <div role="tablist" aria-label="Starter files" className="flex flex-wrap gap-2">
          {files.map(([name]) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={name === activeFile}
              onClick={() => setActiveFile(name)}
              className={`rounded-md border px-3 py-1 font-mono text-xs transition-colors ${
                name === activeFile
                  ? "border-primary/50 bg-primary-soft text-fg font-medium"
                  : "border-line text-muted hover:text-fg hover:border-line-strong"
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
          <summary className="cursor-pointer font-medium text-sm">Hints & architecture tips</summary>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted space-y-1">
            {project.hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <MarkComplete entityType="project" entityId={project.id} label="Mark project complete" />
      </div>

      {assessment && assessmentUrl ? (
        <div className="surface edge-accent rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow flex items-center gap-1.5 text-accent">
              <Award className="h-4 w-4" aria-hidden /> Verifiable Credential Submission
            </p>
            <Badge tone="accent">FreeVerse Integration</Badge>
          </div>
          <h3 className="mt-2 font-display text-xl">{assessment.credentialTitle}</h3>
          <p className="mt-1 text-sm text-muted">
            Finished building this project? Submit your repository or complete the companion assessment
            on RRRTX FreeVerse to earn verifiable proof of capability.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={assessmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-xs font-medium text-bg-sunken hover:opacity-90"
            >
              Submit on FreeVerse <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
            {credentialUrl ? (
              <a
                href={credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-fg underline-offset-2 hover:underline"
              >
                Credential details
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="pt-2">
        <ReportForm targetType="project" targetId={project.id} />
      </div>
    </div>
  );
}
