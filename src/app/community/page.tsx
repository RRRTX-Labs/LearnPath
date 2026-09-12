import { MessagesSquare, Users } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Community",
  description:
    "LearnPath's community lives on Discord: ask questions, share projects, find study partners and discuss roadmaps.",
};

const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE;

export default function CommunityPage() {
  return (
    <Container className="max-w-4xl py-12">
      <p className="eyebrow">Campus</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Learn together. Build together.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        LearnPath is the curriculum. Discord is the community. We are not building a second, worse
        forum inside the app — and we do not invent member counts to sound bigger than we are.
      </p>

      <div className="surface edge-accent mt-10 rounded-lg p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-primary">
            <MessagesSquare className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="font-display text-2xl">LearnPath Discord</h2>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Ask questions when you are stuck",
            "Share projects and get code review",
            "Find study partners for a roadmap",
            "Contribute resources you have verified",
            "Discuss and propose roadmap changes",
            "Show what you built this month",
          ].map((x) => (
            <li key={x} className="flex items-start gap-2 text-sm text-muted">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {x}
            </li>
          ))}
        </ul>
        {invite ? (
          <ButtonLink href={invite} external size="lg" className="mt-8">
            Join LearnPath Discord
          </ButtonLink>
        ) : (
          <p className="mt-6 rounded-md border border-line bg-bg-sunken p-4 text-sm text-muted">
            The public invite link is configured by the maintainers via{" "}
            <code className="font-mono">NEXT_PUBLIC_DISCORD_INVITE</code>. Until then, meet us in the
            GitHub repository — discussions, issues and pull requests are open to everyone.
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="surface rounded-lg p-6">
          <h2 className="font-display text-xl">A server shaped like the curriculum</h2>
          <p className="mt-2 text-sm text-muted">
            We recommend the server runs one channel family per roadmap area — python, web, ai-ml,
            security — plus projects, code-review and showcase. That layout is a suggestion for the
            operators, not a promise about what exists today.
          </p>
        </div>
        <div className="surface rounded-lg p-6">
          <h2 className="font-display text-xl">Contribute instead</h2>
          <p className="mt-2 text-sm text-muted">
            Found a broken resource? Report it on the resource page. Want a new skill on a path? Open
            an issue or a pull request against the content catalog.
          </p>
          <ButtonLink href="/open-source" variant="ghost" className="mt-4">
            Contribution guide
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
