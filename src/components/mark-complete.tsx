"use client";

import type { EntityType } from "@/lib/progress-shared";
import { useProgress } from "./progress-provider";
import { Button } from "./ui";

export function MarkComplete({
  entityType,
  entityId,
  label = "Mark complete",
}: {
  entityType: EntityType;
  entityId: string;
  label?: string;
}) {
  const { isDone, mark } = useProgress();
  const done = isDone(entityType, entityId);
  return (
    <Button
      variant={done ? "ghost" : "accent"}
      onClick={() => mark(entityType, entityId, done ? "started" : "completed")}
    >
      {done ? "Completed" : label}
    </Button>
  );
}
