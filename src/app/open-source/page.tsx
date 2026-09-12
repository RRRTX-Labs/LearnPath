import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Open source" };

const github = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com";

export default function OpenSourcePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose-lp">
      <p className="eyebrow">Git</p>
      <h1 className="mt-2 font-display text-4xl">Open source</h1>
      <p className="mt-4 text-muted">
        LearnPath is MIT-licensed software with independently authored curriculum in Git. Canonical lessons are files,
        not a proprietary CMS.
      </p>
      <h2 className="mt-10 font-display text-2xl">Contribute content</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">
        <li>Fork the repository.</li>
        <li>Edit JSON/TS under the content catalog (skills, resources, roadmaps).</li>
        <li>
          Run <code>npm run content:validate</code>.
        </li>
        <li>Open a pull request. Humans review resource quality and licenses.</li>
      </ol>
      <h2 className="mt-10 font-display text-2xl">What we will not merge</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li>Copied roadmap.sh graphs or text (their license forbids redistribution).</li>
        <li>Paid-only resources presented as free.</li>
        <li>Affiliate stuffing.</li>
        <li>Anything that downloads or rehosts YouTube.</li>
      </ul>
      <div className="mt-8 flex gap-3">
        <ButtonLink href={github}>GitHub</ButtonLink>
        <ButtonLink href="/community" variant="ghost">
          Discord
        </ButtonLink>
      </div>
    </div>
  );
}
