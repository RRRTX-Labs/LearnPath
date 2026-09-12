import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Community" };

const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.com";

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="eyebrow">Campus</p>
      <h1 className="mt-2 font-display text-4xl">Community</h1>
      <p className="mt-4 text-lg text-muted">
        LearnPath is the curriculum. Discord is the community. We are not building a second, worse forum inside the
        app.
      </p>
      <div className="mt-8 surface p-6">
        <h2 className="font-display text-2xl">Suggested channels</h2>
        <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          {[
            "Announcements",
            "General",
            "Introductions",
            "Python",
            "Web Development",
            "AI / ML",
            "Cybersecurity",
            "Projects",
            "Code Review",
            "Showcase",
            "Open Source",
            "Contributors",
            "Roadmap Proposals",
            "Feedback",
          ].map((c) => (
            <li key={c} className="font-mono text-muted">
              #{c.toLowerCase().replace(/\s+/g, "-")}
            </li>
          ))}
        </ul>
        <ButtonLink href={invite} className="mt-6">
          Open Discord
        </ButtonLink>
      </div>
      <div className="mt-8 prose-lp">
        <h2 className="font-display text-2xl">How to contribute</h2>
        <p className="mt-3 text-muted">
          Found a broken resource? Report it on the resource page. Want a new skill on a path? Open a GitHub issue or
          pull request against the content files. See the open source guide.
        </p>
        <ButtonLink href="/open-source" variant="ghost" className="mt-4">
          Contribution guide
        </ButtonLink>
      </div>
    </div>
  );
}
