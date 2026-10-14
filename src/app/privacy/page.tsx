import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "LearnPath's privacy policy: what data we store, how local practice works, our strict zero-tracker policy, and how to export or delete your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-12 prose-lp">
      <p className="eyebrow">Legal & Compliance</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Privacy Policy</h1>
      <p className="meta mt-2">Last updated: October 2026 · Operates with zero third-party tracking</p>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">1. Our Commitment & Architecture</h2>
        <p>
          <strong>RRRTX LearnPath</strong> is built on an architecture of extreme data minimization. You can browse all roadmaps,
          read all curated lesson guides, and run in-browser coding exercises without creating an account or providing any personal information.
        </p>
        <p>
          We do not run third-party advertising, commercial tracking SDKs, device fingerprinting, or session replay tools.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">2. What Data We Collect & Store</h2>
        <h3 className="font-display text-xl">A. Anonymous Learners</h3>
        <p>
          If you browse without signing in, your learning progress (completed skills, challenges, and projects) and skill notes
          live solely in your browser&apos;s <code className="font-mono text-xs">localStorage</code>. We never transmit or store your
          anonymous progress on our servers.
        </p>

        <h3 className="font-display text-xl">B. Authenticated Accounts</h3>
        <p>When you choose to sign in to sync your progress across devices, we collect:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li><strong>Identity:</strong> Email address, name or display handle, and password hash (if using email sign-in).</li>
          <li><strong>OAuth Identifiers:</strong> If you sign in via GitHub, Google, or Discord, we receive your provider user ID and verified email to authenticate you. We never request access to your private repositories, contacts, or drive files.</li>
          <li><strong>Learning Records:</strong> Progress states (started, completed) for roadmap nodes, challenges passed, and projects shipped.</li>
          <li><strong>Study Notes:</strong> Text notes you write in the learning workspace.</li>
          <li><strong>Issue Reports:</strong> Broken link reports and feedback you voluntarily submit.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">3. Cookie & Local Storage Policy</h2>
        <p>
          LearnPath uses <strong>strictly necessary cookies</strong> only:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li><strong>Session Cookies:</strong> Used by our authentication provider (Better Auth) to keep you signed in securely across requests (<code className="font-mono text-xs">better-auth.session_token</code>) and protect against Cross-Site Request Forgery (CSRF).</li>
          <li><strong>Theme Preference:</strong> Stored locally in your browser to remember dark or light mode.</li>
        </ul>
        <p>
          Because LearnPath uses no non-essential, marketing, or tracking cookies, you will not see an intrusive cookie banner.
          Under the ePrivacy Directive and GDPR, strictly necessary cookies required for user-requested functionality do not require prior consent.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">4. Code Execution & Third-Party Embeds</h2>
        <h3 className="font-display text-xl">A. Sandboxed In-Browser Practice</h3>
        <p>
          All code practice in Python, JavaScript, TypeScript, and SQL executes <strong>entirely in your browser sandbox</strong> via
          WebAssembly (Pyodide, sql.js) and isolated <code className="font-mono text-xs">&lt;iframe&gt;</code> sandboxes without network access.
          Your code never leaves your device and is never uploaded to our servers.
        </p>

        <h3 className="font-display text-xl">B. YouTube Embeds (Click-to-Load)</h3>
        <p>
          To protect your privacy, YouTube videos are never loaded automatically. LearnPath displays a static thumbnail facade.
          Only when you explicitly click &ldquo;Play on YouTube&rdquo; is the official YouTube IFrame Player loaded from
          <code className="font-mono text-xs">youtube-nocookie.com</code>. At that point, Google&apos;s privacy policy applies to video playback.
        </p>

        <h3 className="font-display text-xl">C. Self-Hosted Typography</h3>
        <p>
          All typography (Geist Sans, Geist Mono, and Instrument Serif) is self-hosted directly from LearnPath servers. No requests are
          made to Google Fonts or external CDN font endpoints, preserving user privacy and IP address confidentiality.
        </p>

        <h3 className="font-display text-xl">D. RRRTX FreeVerse Integration</h3>
        <p>
          LearnPath deep-links to <strong>RRRTX FreeVerse</strong> for optional proctored skill assessments and verifiable digital credentials.
          Navigating to FreeVerse is an explicit action by the learner; LearnPath does not silently transfer user databases or background tokens to FreeVerse.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">5. Data Retention, Export & Deletion Rights</h2>
        <p>
          We retain your account data and learning records only for as long as your account is active.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted">
          <li>
            <strong>Data Export (Portability):</strong> You can download a complete JSON export of your personal profile, progress history, notes, and submitted reports at any time by visiting your{" "}
            <Link href="/profile" className="text-primary hover:underline">Profile</Link>.
          </li>
          <li>
            <strong>Account Deletion (Right to Erasure):</strong> You can permanently delete your account and all associated progress and notes with one click on your{" "}
            <Link href="/profile" className="text-primary hover:underline">Profile</Link>. Deletion is immediate and irreversible on our database.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">6. International Regulations & Compliance</h2>
        <p>
          We respect user privacy rights across all jurisdictions:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li><strong>GDPR (European Union / UK):</strong> Lawful basis for processing is performance of a contract (delivering requested learning tools) and legitimate interest. Rights of access, rectification, erasure, and data portability are fully supported.</li>
          <li><strong>CCPA / CPRA (California):</strong> We do not sell or share personal information.</li>
          <li><strong>DPDP Act 2023 (India):</strong> Personal data is processed solely for the specified purpose of developer learning and progress persistence, adhering to data minimization principles.</li>
          <li><strong>Children&apos;s Privacy:</strong> LearnPath is designed for developer and student education and does not knowingly collect personal information from individuals under 13 years of age.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">7. Contact & Privacy Inquiries</h2>
        <p>
          For questions regarding data privacy or security inquiries, please open an issue on the official{" "}
          <a
            href="https://github.com/RRRTX-Labs/LearnPath"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub repository
          </a>{" "}
          or contact the maintainers at <code className="font-mono text-xs">privacy@rrrtx.com</code>.
        </p>
      </section>
    </Container>
  );
}
