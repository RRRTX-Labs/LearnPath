/**
 * The LearnPath Journal — canonical TS content, same rules as everything else:
 * validated by Zod, gated by content:validate, never generated filler.
 *
 * Editorial policy (see docs/BLOG-AUTHORING.md):
 * - Every factual claim is checked against a current source before publishing.
 * - Estimates from third-party reports are attributed and hedged, never stated
 *   as fact. No invented numbers, products, or releases.
 * - Each post must teach something a developer can use the same day.
 */
export const blogPosts = [
  {
    id: "ai-coding-agents-2026",
    slug: "ai-coding-agents-what-developers-need-to-understand",
    title: "AI coding agents: what developers actually need to understand",
    excerpt:
      "Agent equals model plus harness. Once you see the architecture behind Claude Code, Codex, Cursor and Copilot, the hype flattens into three form factors, one skill shift, and a short list of fundamentals that got more valuable, not less.",
    category: "ai-tooling",
    author: "RRRTX Labs",
    publishedAt: "2026-09-13",
    readingMinutes: 9,
    cover: "/blog/covers/ai-coding-agents-2026.png",
    relatedSkillIds: ["git-basics", "python-testing", "python-syntax"],
    relatedRoadmapIds: ["ai-engineer", "full-stack-developer"],
    body: [
      {
        type: "p",
        text: "Somewhere between 2024 and 2026, \"AI coding tool\" split into two different things. An assistant suggests the next line inside your editor. An agent understands a repository, makes multi-file changes, runs tests, reads the failures, and iterates — with a human approving at gates. Every serious product review in 2026 draws this line first, and it is the right place to start ([Faros AI's 2026 review](https://www.faros.ai/blog/best-ai-coding-agents-2026) is a good example).",
      },
      { type: "h2", text: "Agent = model + harness" },
      {
        type: "p",
        text: "The mental model that makes the whole market legible: an agent is a model (the raw intelligence — Claude, GPT, Gemini, Grok, Kimi) wrapped in a harness (the software that gives it a terminal, a file system, a test runner, git, memory, and approval gates). The model decides how smart the agent can be; the harness decides how reliable it is in your repo. When someone says \"Claude Code is better than X at refactoring,\" they are usually describing a harness difference as much as a model difference.",
      },
      {
        type: "p",
        text: "This is why rankings churn so fast. Model releases reshuffle the top every few months — 2026 ranking refreshes put Claude Code, Codex, Cursor, Copilot, and open harnesses like OpenCode and Cline in shifting order ([MightyBot's mid-2026 ranking](https://mightybot.ai/blog/coding-ai-agents-for-accelerating-engineering-workflows/)). But the architecture underneath has converged: repo-aware context, tool use, feedback loops from compilers and tests, and memory files.",
      },
      { type: "h2", text: "Three form factors" },
      {
        type: "list",
        items: [
          "**CLI agents** (Claude Code, Codex CLI, Gemini CLI, Aider, OpenCode) live in your terminal, are scriptable, and slot into CI/CD. The terminal won as the surface for deep autonomous work because it has structured feedback loops — exit codes, test output, logs — that an agent can actually read ([state-of-play analysis](https://niteagent.com/blog/2026-05-21-ai-coding-agents-state-of-play/)).",
          "**IDE-native agents** (Cursor, Windsurf, Copilot in VS Code) optimize for flow: inline completions, chat about the open file, multi-file edits with a diff review UI.",
          "**Cloud/async agents** (Codex cloud tasks, GitHub Copilot coding agent, Cursor background agents, Devin) take an assigned issue and return a pull request later. You context-switch while they run.",
        ],
      },
      {
        type: "p",
        text: "Teams increasingly run more than one: a strong CLI agent for refactors and debugging, an IDE agent for daily flow, an open-source harness for flexibility. There is no single winner, and waiting for one is a mistake.",
      },
      { type: "h2", text: "The skill shift: from prompting to context engineering" },
      {
        type: "p",
        text: "The durable 2026 habit is context engineering: curating what the agent sees. Repo memory files — CLAUDE.md, AGENTS.md, GEMINI.md — now define how well agents behave in a project: conventions, forbidden paths, test commands, architecture notes. Writing a good AGENTS.md is unglamorous and enormously leveraged. (This repository has one; it is not an accident.)",
      },
      {
        type: "p",
        text: "Adoption numbers vary by report, but the direction is not in dispute: large majorities of developers now use or plan to use AI coding tools, and industry reports in 2026 estimate that a substantial share — roughly half, by one widely cited estimate — of code committed to GitHub is AI-generated or AI-assisted ([State of AI Coding Agents 2026](https://sourceryintel.com/reports/the-state-of-ai-coding-agents-2026)). Treat the precise percentages as estimates, and the trend as real.",
      },
      { type: "h2", text: "What got more valuable, not less" },
      {
        type: "list",
        items: [
          "**Reading code fast.** You review more than you write. Comprehension is the bottleneck.",
          "**Specs and decomposition.** Agents execute well-defined slices; someone still has to define them.",
          "**Testing discipline.** An agent's output is only as trustworthy as the tests that gate it. If you cannot write the test, you cannot delegate the task.",
          "**Git.** Branches, diffs, reverts, bisect — the safety net under every autonomous run.",
          "**Security judgment.** Prompt injection, excessive agency, and insecure tool integration are now application-security problems, not theory. OWASP published a dedicated Top 10 for agentic AI in late 2025.",
          "**Debugging.** Models still fail in novel ways; the person who can read a stack trace steers the recovery.",
        ],
      },
      {
        type: "p",
        text: "Notice what is missing from that list: memorizing syntax. That is precisely the part the machines took. It is also why learning \"just enough to prompt\" fails — you cannot review what you cannot read, and you cannot test what you do not understand.",
      },
      { type: "h2", text: "How to actually learn this" },
      {
        type: "p",
        text: "Pick one CLI agent and use it on a codebase you understand moderately well — that is where you can tell when it is wrong. Read every diff. Run the tests yourself. Write the AGENTS.md by hand. Then take one task end-to-end with no agent at all, and notice what felt different. That contrast, repeated, is the education. Everything else is product marketing.",
      },
      {
        type: "p",
        text: "On LearnPath, the [Git skill](/skills/git-basics) and the testing skills in the [Python Developer roadmap](/roadmaps/python-developer) are the two places we would start — they are the load-bearing fundamentals of working with agents safely.",
      },
      {
        type: "sources",
        items: [
          { label: "Faros AI — Best AI Coding Agents for 2026 (agent = model + harness)", url: "https://www.faros.ai/blog/best-ai-coding-agents-2026" },
          { label: "MightyBot — Best AI Coding Agents in 2026, Ranked (July 2026 refresh)", url: "https://mightybot.ai/blog/coding-ai-agents-for-accelerating-engineering-workflows/" },
          { label: "AI Coding Agents 2026: State of Play (CLI/IDE/cloud, memory files)", url: "https://niteagent.com/blog/2026-05-21-ai-coding-agents-state-of-play/" },
          { label: "The State of AI Coding Agents — 2026 (adoption estimates)", url: "https://sourceryintel.com/reports/the-state-of-ai-coding-agents-2026" },
        ],
      },
    ],
  },
  {
    id: "security-for-ai-apps",
    slug: "security-fundamentals-for-ai-powered-applications",
    title: "Security fundamentals for AI-powered applications",
    excerpt:
      "Prompt injection is still #1 on the OWASP LLM Top 10, and the agentic era added ten new failure modes. Here is the junior-developer-sized version: what the real risks are, and the seven defenses you can apply this week.",
    category: "security",
    author: "RRRTX Labs",
    publishedAt: "2026-09-13",
    readingMinutes: 10,
    cover: "/blog/covers/security-for-ai-apps.png",
    relatedSkillIds: ["security-fundamentals"],
    relatedRoadmapIds: ["junior-cybersecurity"],
    body: [
      {
        type: "p",
        text: "If you build anything on top of an LLM — a chatbot, a copilot, an agent that reads tickets and calls tools — you are building a web application with a new class of input-handling bug at its core. The good news: the discipline is already written down. The [OWASP Top 10 for LLM Applications (2025)](https://owasp.org/www-project-top-10-for-large-language-model-applications/) is the canonical list, and OWASP followed it with a Top 10 for Agentic AI Applications in late 2025 ([overview](https://bsg.tech/blog/owasp-llm-top-10/)).",
      },
      { type: "h2", text: "The one bug to understand first: prompt injection (LLM01)" },
      {
        type: "p",
        text: "Prompt injection has held the #1 spot for two consecutive editions, for a structural reason: LLMs process instructions and data in the same channel. There is no privilege boundary between \"the system prompt\" and \"the document the user uploaded\" — the model sees tokens. An attacker crafts input the model interprets as a new instruction, and the model often complies because it genuinely cannot tell the difference ([Aembit's explainer](https://aembit.io/blog/owasp-top-10-llm-risks-explained/)).",
      },
      {
        type: "p",
        text: "The nastier variant is indirect injection: the malicious instruction arrives inside content your app ingests — a scraped web page, a PDF, a support ticket, a calendar invite — not from the chat box. Any feature that lets a model read third-party content and then act is an injection surface.",
      },
      { type: "h2", text: "The rest of the LLM Top 10, in plain terms" },
      {
        type: "list",
        items: [
          "**LLM02 Sensitive information disclosure** — the model leaks training data, other users' data, or your secrets via context. What the active identity can't authorize must not surface.",
          "**LLM03 Supply chain** — compromised models, datasets, plugins, dependencies. Your app is only as trustworthy as everything flowing through it.",
          "**LLM04 Data and model poisoning** — tampered fine-tuning data becomes tampered behavior.",
          "**LLM05 Improper output handling** — the classic web bugs, re-entering through the model: if LLM output flows into HTML, SQL, shell commands, or templates unsanitized, you have XSS/SQLi/command injection with extra steps. Treat model output exactly like user input.",
          "**LLM06 Excessive agency** — the agent has more tools, broader permissions, or fewer approval gates than the task requires. This is how a chat feature becomes a data-exfiltration feature.",
          "**LLM07 System prompt leakage** — system prompts are not secrets. Never put credentials or security-critical logic in one.",
          "**LLM08 Vector and embedding weaknesses** — RAG pipelines need the same access control as the data they index; poisoned or cross-tenant embeddings reach the context window.",
          "**LLM09 Misinformation** — confident wrongness; mitigate with grounding, citations, and human review where stakes are high.",
          "**LLM10 Unbounded consumption** — inference is expensive; unthrottled endpoints are a denial-of-service and wallet-drain surface.",
        ],
      },
      { type: "h2", text: "What agents add (OWASP Agentic Top 10)" },
      {
        type: "p",
        text: "When the model stops answering and starts doing, new failure modes appear: uncontrolled autonomy (AG01 — acting without approval gates), insecure tool integration (AG02), delegated identity abuse (AG03 — the agent impersonates users or escalates through tool chains), audit gaps (AG07), and cross-agent prompt injection (AG09 — malicious instructions propagating between agents). The theme is identical to decades of distributed-systems security: least privilege, explicit authorization, and logging ([framework summary](https://bsg.tech/blog/owasp-llm-top-10/)).",
      },
      { type: "h2", text: "Seven defenses you can apply this week" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Sanitize at the sink, not the model.** Escape or validate LLM output wherever it meets HTML, SQL, a shell, or a template. You cannot prompt your way out of LLM05; classic input-handling discipline is the fix.",
          "**Least-privilege tools.** Give the agent the minimum scopes it needs. Read-only by default; write access per-tool, per-task.",
          "**Human approval for irreversible actions.** Deletes, payments, sends, deploys — gate them. This single control blunts most of AG01 and LLM06.",
          "**Separate identities.** The agent's credentials are not the user's credentials. Delegated actions carry the user's authorization, checked server-side (AG03).",
          "**Rate-limit and cap.** Per-user token budgets, request throttles, timeouts (LLM10).",
          "**Don't trust retrieved content.** Label ingested documents as untrusted data in the prompt, apply access control to your vector store (LLM08), and consider architectural patterns like Simon Willison's dual-LLM approach for high-risk flows ([references](https://wtit.com/blog/2025-04-17/owasp-top-10-for-llm-applications-2025/)).",
          "**Log everything the agent does.** Actions, tools, arguments, approvals. If you cannot reconstruct what happened, you cannot respond to an incident (AG07).",
        ],
      },
      {
        type: "quote",
        text: "The model is a new kind of input parser. Everything you already knew about untrusted input still applies — it just arrives wearing a conversational interface.",
      },
      { type: "h2", text: "Where to practice" },
      {
        type: "p",
        text: "None of this should stay theoretical. The [PortSwigger Web Security Academy](https://portswigger.net/web-security) has free, legal, hands-on labs for the classic web vulnerabilities that LLM05 resurrects — and a growing set of LLM-attack labs. It is already wired into the [LearnPath security roadmap](/roadmaps/junior-cybersecurity) as a primary resource. Learn the classics first: an XSS payload that flows through a model is still an XSS payload.",
      },
      {
        type: "sources",
        items: [
          { label: "OWASP Top 10 for LLM Applications 2025 — risks and mitigations (Invicti)", url: "https://www.invicti.com/blog/web-security/owasp-top-10-risks-llm-security-2025" },
          { label: "OWASP LLM Top 10 + Agentic AI Top 10 with pentester checklist (BSG)", url: "https://bsg.tech/blog/owasp-llm-top-10/" },
          { label: "OWASP Top 10 for LLM Applications (2025), explained simply (Aembit)", url: "https://aembit.io/blog/owasp-top-10-llm-risks-explained/" },
          { label: "OWASP LLM Top 10 detailed attack scenarios and references", url: "https://wtit.com/blog/2025-04-17/owasp-top-10-for-llm-applications-2025/" },
        ],
      },
    ],
  },
  {
    id: "typescript-vs-python-2026",
    slug: "typescript-vs-python-2026-reading-the-ecosystem-honestly",
    title: "TypeScript vs Python in 2026: how to read the ecosystem honestly",
    excerpt:
      "Four major indexes disagree about the most popular language — and they are all measuring something real. What Octoverse, Stack Overflow, TIOBE and RedMonk each count, and how to actually choose your next language.",
    category: "ecosystem",
    author: "RRRTX Labs",
    publishedAt: "2026-09-13",
    readingMinutes: 8,
    cover: "/blog/covers/typescript-vs-python-2026.png",
    relatedSkillIds: ["typescript-fundamentals", "python-syntax"],
    relatedRoadmapIds: ["python-developer", "full-stack-developer"],
    body: [
      {
        type: "p",
        text: "Ask \"what is the most popular programming language in 2026?\" and you will get four confident, contradictory answers. That is not because the indexes are broken. It is because \"popularity\" is at least four different quantities, and each index measures one of them ([side-by-side comparison](https://rockstardeveloperuniversity.com/programming-language-statistics/)).",
      },
      { type: "h2", text: "What each source actually counts" },
      {
        type: "list",
        items: [
          "**GitHub Octoverse** counts contributor activity on the platform. The 2025 edition's headline: TypeScript overtook Python and JavaScript to become the most-used language on GitHub by activity — a genuine shift in where new code is being written ([analysis](https://tech-insider.org/python-vs-javascript-2026/)).",
          "**Stack Overflow's Developer Survey** (2025, ~31,800 respondents) counts what working developers say they use. JavaScript still leads at 66%; Python sits near 58%; TypeScript at roughly 44% and climbing.",
          "**TIOBE** weights search-engine chatter about languages. By that measure Python has held #1, with a record rating share.",
          "**RedMonk** blends GitHub pull-request activity with Stack Overflow question volume. Its January 2026 edition puts JavaScript and Python in a statistical tie at the top, with TypeScript at #6 ([roundup](https://tech-insider.org/python-vs-javascript-2026/)).",
        ],
      },
      {
        type: "p",
        text: "Read together, the four indexes tell one coherent story: JavaScript still has the largest installed base, Python dominates AI/data and what beginners start with, and TypeScript is the biggest momentum winner — the language new production code is most likely to be written in on the world's largest code-hosting platform.",
      },
      { type: "h2", text: "TypeScript: what the momentum is really about" },
      {
        type: "p",
        text: "TypeScript did not win by being fashionable. It won because large JavaScript codebases without types become unreadable at scale, and because the AI-tooling wave raised the premium on machine-checkable code: an agent that can run tsc gets a feedback loop; an agent guessing at dynamic types gets vibes. Type signatures are documentation the compiler enforces — for humans and for agents alike.",
      },
      {
        type: "p",
        text: "The ceiling on TypeScript is ecosystem, not language: it owns the web platform end-to-end (frontend, Node/Bun/Deno backends, serverless) but has no serious claim on data science, ML research, or scientific computing.",
      },
      { type: "h2", text: "Python: what the dominance is really about" },
      {
        type: "p",
        text: "Python is the native language of AI. Training, fine-tuning, evaluation, data pipelines, the reference implementations of nearly every model — Python. It is also still the gentlest on-ramp for first-time programmers, and the TIOBE/RedMonk numbers reflect a language being learned everywhere at once. Its ceiling: the browser. Python on the frontend remains a niche despite real progress in WASM runtimes.",
      },
      { type: "h2", text: "So which do you learn?" },
      {
        type: "list",
        ordered: true,
        items: [
          "If you want to build products people use in a browser — interfaces, full-stack apps, SaaS: **TypeScript** (after JavaScript fundamentals). The Octoverse shift says this is where the industry's new code lives.",
          "If you want to work with data, models, or AI infrastructure: **Python**. Non-negotiable; it is the field's lingua franca.",
          "If you are a total beginner and genuinely unsure: **Python first** for the gentler floor, then TypeScript when you touch the web — or JavaScript-first if building visible things keeps you motivated. Completion beats optimization here.",
          "What you should not do: treat it as a tribal identity. Senior engineers in 2026 move between both; the concepts that transfer (data structures, HTTP, testing, git, security) are worth more than either syntax.",
        ],
      },
      {
        type: "p",
        text: "Both roads are paved here: the [Python Developer roadmap](/roadmaps/python-developer) and the [Full-Stack Developer roadmap](/roadmaps/full-stack-developer) (TypeScript end-to-end) share the same loop — learn, practice in the browser, pass challenges, ship a project.",
      },
      {
        type: "quote",
        text: "The most popular language is the one that is most popular for what you are measuring. Choose by what you want to build, not by who won a chart.",
      },
      {
        type: "sources",
        items: [
          { label: "Programming language statistics 2026 — TIOBE/GitHub/SO/RedMonk compared", url: "https://rockstardeveloperuniversity.com/programming-language-statistics/" },
          { label: "Python vs JavaScript in 2026 — Octoverse, RedMonk and survey analysis", url: "https://tech-insider.org/python-vs-javascript-2026/" },
        ],
      },
    ],
  },
  {
    id: "learning-to-code-with-ai",
    slug: "how-to-learn-programming-with-ai-without-fooling-yourself",
    title: "How to learn programming with AI without fooling yourself",
    excerpt:
      "AI tutors are real and they are free. So is the illusion of competence they can create. A working method for learning with AI — typed by you, run by you, debugged by you — and the four uses of AI that actually teach.",
    category: "learning",
    author: "RRRTX Labs",
    publishedAt: "2026-09-13",
    readingMinutes: 8,
    cover: "/blog/covers/learning-to-code-with-ai.png",
    relatedSkillIds: ["python-syntax", "python-functions", "javascript-fundamentals"],
    relatedRoadmapIds: ["python-developer"],
    body: [
      {
        type: "p",
        text: "Every generation of learner gets a shortcut that turns out to be a trap, and this generation's is the ghostwriter. An AI writes the solution, you read it, you nod, you feel understanding. Three days later you cannot reproduce any of it. Reading code produces recognition; writing, running, and breaking code produces competence. The tools changed — the cognitive science did not.",
      },
      {
        type: "p",
        text: "The 2026 guides that take learning seriously converge on one condition: AI accelerates learning when the learner still types, runs, and debugs the code themselves, and pairs the AI with a structured path rather than free-form chat ([Scrimba's 2026 review](https://scrimba.com/articles/best-ai-tools-and-courses-for-learning-to-code/)). Unstructured \"ask the chatbot anything\" feels productive and compounds badly — there is no sequence, no gaps detected, no proof anything stuck.",
      },
      { type: "h2", text: "The four uses of AI that actually teach" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Error translator.** Paste the traceback, ask what it means — then fix it yourself. Understanding failures is half of programming.",
          "**Socratic tutor.** \"Don't give me the solution; ask me what I think happens next, and tell me if I'm wrong.\" Models are genuinely good at this when you constrain them.",
          "**Practice generator.** \"Give me five variations of this exercise, slightly harder each time.\" Spaced, varied repetition is how syntax becomes reflex.",
          "**Code reviewer.** You write it; the AI critiques it. This inverts the ghostwriter pattern — the work is yours, the feedback is theirs.",
        ],
      },
      {
        type: "p",
        text: "Notice what is not on the list: \"solution writer.\" The moment the AI produces the answer before you have genuinely struggled, you have purchased speed at the price of the learning. Struggle is not friction in the process; it is the process.",
      },
      { type: "h2", text: "A working loop" },
      {
        type: "p",
        text: "Structure beats willpower. The loop we built LearnPath around is the one the evidence supports:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**LEARN** — one curated primary resource (a video lecture, a docs chapter). Not four tabs. One.",
          "**PRACTICE** — immediately write and run code against the idea. In the browser, zero setup, before the context evaporates.",
          "**CHALLENGE** — a graded test you can fail. Passing tests you wrote against a spec is retrieval practice with a scoreboard.",
          "**BUILD** — apply the skill inside a project with real requirements. This is where knowledge becomes capability.",
          "**PROVE** — record the evidence. Not XP or streaks: \"learned, practiced, challenge passed, used in a project.\" Honest states you can show someone.",
        ],
      },
      {
        type: "p",
        text: "Then repeat with the next skill. AI tools slot into every step — as translator, tutor, generator, reviewer — without ever taking the keyboard away from you.",
      },
      { type: "h2", text: "Rules that keep you honest" },
      {
        type: "list",
        items: [
          "Type every line yourself at least once. Copy-paste is for configs, not concepts.",
          "Predict before you run. Say what the code will do; being wrong is the highest-signal moment in programming.",
          "Break it on purpose. Change the loop bound, delete the return, watch the error. Fear of breaking is what keeps beginners frozen.",
          "Close the tabs. One resource, one exercise, one challenge at a time. Collection is not learning.",
          "Keep a notes file per skill, in your own words. Writing the summary is retrieval practice; re-reading it before the next session is spaced repetition.",
          "Ship something small every week. A finished 60-line program teaches more than an abandoned 600-line one.",
        ],
      },
      {
        type: "quote",
        text: "The question is never whether to learn with AI. It is whether, at the end of the month, your hands can do the thing — or only your chat history can.",
      },
      {
        type: "p",
        text: "If you want the loop pre-assembled, start with any LearnPath roadmap — [Python Developer](/roadmaps/python-developer) is the gentlest floor — and work one skill through LEARN → PRACTICE → CHALLENGE → BUILD today. One iteration, honestly done, beats a week of tabs.",
      },
      {
        type: "sources",
        items: [
          { label: "Scrimba — Best AI tools and courses for learning to code (2026)", url: "https://scrimba.com/articles/best-ai-tools-and-courses-for-learning-to-code/" },
        ],
      },
    ],
  },
];
