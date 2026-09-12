"use client";

import { useProgress } from "./progress-provider";
import { Textarea } from "./ui";

export function NotesPanel({ skillId }: { skillId: string }) {
  const { noteFor, setNote } = useProgress();
  return (
    <div>
      <p className="eyebrow mb-2">Notes</p>
      <Textarea
        rows={8}
        value={noteFor(skillId)}
        onChange={(e) => setNote(skillId, e.target.value)}
        placeholder="Write in your own words. Notes stay on this device until you sign in."
      />
    </div>
  );
}
