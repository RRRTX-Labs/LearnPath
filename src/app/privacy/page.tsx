import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 prose-lp">
      <h1 className="font-display text-4xl">Privacy</h1>
      <p className="mt-4 text-muted">
        LearnPath V1 ships without analytics. We store account data you provide (name, email, OAuth identifiers),
        learning progress, notes, and reports on a database we operate (Turso/libSQL).
      </p>
      <p className="mt-4 text-muted">
        YouTube is loaded only after you click play. After that, Google/YouTube’s own privacy policy applies to the
        player. We use youtube-nocookie.com and send a Referer because YouTube requires it for embeds.
      </p>
      <p className="mt-4 text-muted">
        Practice code runs in your browser. We do not upload it. Anonymous progress is stored in localStorage.
      </p>
    </div>
  );
}
