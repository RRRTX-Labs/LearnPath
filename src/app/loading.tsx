import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-16">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
