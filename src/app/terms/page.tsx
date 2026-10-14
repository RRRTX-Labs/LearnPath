import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "LearnPath terms of service: acceptable use, open-source licensing, defensive security guidelines, FreeVerse assessment integration, and educational disclaimers.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-12 prose-lp">
      <p className="eyebrow">Legal & Compliance</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Terms of Service</h1>
      <p className="meta mt-2">Last updated: October 2026 · MIT Open Source Curriculum</p>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">1. Acceptance & Nature of Service</h2>
        <p>
          By accessing or using <strong>RRRTX LearnPath</strong> (&ldquo;the platform&rdquo;), you agree to these Terms of Service.
          LearnPath is a free, open-source educational project developed and maintained by <strong>RRRTX Labs</strong>.
        </p>
        <p>
          The application source code is provided under the terms of the <strong>MIT License</strong>. The curriculum structure,
          exercise prompts, and editorial notes are published for free public educational use.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">2. Educational Status Disclaimer</h2>
        <p>
          <strong>Independent Educational Resource:</strong> LearnPath is a self-directed developer learning platform. LearnPath is not
          an accredited college, university, or vocational training school. Completion of roadmaps or skills on LearnPath does not constitute
          an accredited academic degree, professional license, or guarantee of employment.
        </p>
        <p>
          Curriculum rankings, editor scores, and difficulty estimates represent the subjective editorial opinions of LearnPath contributors,
          not standardized commercial warranties.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">3. RRRTX FreeVerse Assessments & Credentials</h2>
        <p>
          LearnPath integrates with <strong>RRRTX FreeVerse</strong>, an independent credentialing and skill assessment platform:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted">
          <li>
            LearnPath itself does not generate or issue cryptographic credentials. All proctored assessments, verification badges,
            and digital credential tokens are issued exclusively by FreeVerse under FreeVerse&apos;s governing terms.
          </li>
          <li>
            Passing challenges or marking projects as complete on LearnPath records honest progress for self-study; formal credential
            issuance requires completing corresponding requirements on FreeVerse.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">4. Acceptable Use of Sandboxes & Defensive Security</h2>
        <p>
          LearnPath provides interactive playgrounds (Python, JavaScript, TypeScript, SQL, HTML) and cybersecurity curriculum paths.
          You agree to strictly adhere to the following acceptable use rules:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted">
          <li>
            <strong>Defensive & Educational Only:</strong> All security labs, tools, and vulnerability demonstrations are strictly intended
            for defensive software engineering and authorized security education.
          </li>
          <li>
            <strong>No Unauthorized Attacking:</strong> You may not use knowledge or tools gained from LearnPath to attempt unauthorized
            access, penetration testing, port scanning, or denial-of-service against any system, network, or server that you do not own
            or have explicit, documented written authorization to test.
          </li>
          <li>
            <strong>No Service Disruption:</strong> You may not abuse API routes, perform denial-of-service attacks, flood issue reporting
            systems, or attempt to bypass sandbox isolation boundaries.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">5. Third-Party Content & YouTube Embedding</h2>
        <p>
          LearnPath curates and organizes third-party learning materials across the public web:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted">
          <li>
            Videos, articles, and documentation linked or embedded on LearnPath remain the intellectual property and copyright of their
            respective creators, publishers, and channels.
          </li>
          <li>
            Video embeds use official YouTube player interfaces via <code className="font-mono text-xs">youtube-nocookie.com</code> in compliance
            with YouTube Terms of Service. LearnPath never rehosts, proxies, downloads, or alters video streams.
          </li>
          <li>
            Paid resources, if ever referenced for documentation, are clearly marked. LearnPath will never introduce affiliate paywalls
            or deceptive billing.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">6. User-Submitted Content</h2>
        <p>
          When you write study notes or submit issue reports, you are responsible for the content you submit. You agree not to post:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
          <li>Malicious code, exploit payloads, or links to malware.</li>
          <li>Commercial spam, affiliate marketing links, or unauthorized advertisements.</li>
          <li>Defamatory, abusive, or infringing content.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">7. Disclaimer of Warranties & Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LEARNPATH IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;,
          WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.
        </p>
        <p>
          IN NO EVENT SHALL RRRTX LABS, ITS CONTRIBUTORS, OR MAINTAINERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER
          IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM OR IN CONNECTION WITH THE SOFTWARE, THE CURRICULUM, OR THE USE
          OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-2xl">8. Contact & Community Governance</h2>
        <p>
          LearnPath is governed in public. If you believe content violates copyright or community safety, please submit an issue or
          report via the{" "}
          <a
            href="https://github.com/RRRTX-Labs/LearnPath"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub repository
          </a>{" "}
          or reach out to maintainers at <code className="font-mono text-xs">terms@rrrtx.com</code>.
        </p>
      </section>
    </Container>
  );
}
