import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 prose-lp">
      <h1 className="font-display text-4xl">Terms</h1>
      <p className="mt-4 text-muted">
        LearnPath is free software provided as-is. Curriculum opinions (including editorial scores) are ours, not
        warranties. Third-party resources remain under their own licenses and terms.
      </p>
      <p className="mt-4 text-muted">
        You may not use the practice tools to attack systems you do not own or lack written permission to test. The
        cybersecurity path is educational and defensive.
      </p>
      <p className="mt-4 text-muted">Do not scrape, rehost, or circumvent YouTube. We will not help you do that.</p>
    </div>
  );
}
