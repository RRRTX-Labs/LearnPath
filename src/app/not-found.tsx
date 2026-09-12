import { ButtonLink, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <EmptyState
        title="That page is not on the path"
        body="The URL does not match a roadmap, skill, or resource."
        action={<ButtonLink href="/">Back home</ButtonLink>}
      />
    </div>
  );
}
