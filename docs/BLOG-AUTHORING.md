# Authoring the LearnPath Journal

The journal is **Git-canonical content**, like everything else in LearnPath: typed, Zod-validated,
SSG-rendered, gated by `npm run content:validate` and CI. No CMS, no markdown files —
structured TypeScript in `src/lib/content/blog.ts`.

## Add a post

1. **Research first.** Every factual claim must have a current public source (docs, vendor
   posts, survey reports). Read the sources; do not rely on memory for anything dated.
   Third-party numbers are *estimates*: attribute them ("by one widely cited estimate…")
   and link the report. Never invent products, releases, metrics, or quotes.
2. **Draft in `src/lib/content/blog.ts`** by copying an existing entry. Fields:
   - `id`, `slug` — stable identifiers (slug = URL).
   - `title`, `excerpt` — excerpt is the hook, ≤ ~35 words.
   - `category` — `ai-tooling | security | ecosystem | learning`.
   - `author` — byline; use `RRRTX Labs` for studio pieces.
   - `publishedAt` — `YYYY-MM-DD` (the review date; the sources block prints it).
   - `readingMinutes` — honest estimate (~220 words/min).
   - `cover` — path to a brand cover PNG (see below).
   - `relatedSkillIds` / `relatedRoadmapIds` — must exist in the catalog; `content:validate`
     enforces this. Link them to keep the journal inside the learning loop.
   - `body` — blocks: `p`, `h2`, `list` (`ordered?`), `quote` (`cite?`), `sources`.
3. **Inline markup** inside `p`/`list` text: `[label](https://…)` for links (external links
   open in a new tab automatically) and `**bold**`. Nothing else — deliberately no raw HTML.
4. **Sources block is mandatory.** Every article ends with one; it renders as
   "Sources & further reading" and is also the editorial audit trail.
5. **Cover art**: render with the repo script pattern (`scripts/render-blog-covers.py`),
   1200×630 PNG into `public/blog/covers/`. Brand rules: dark `#090A0C` ground, faint grid,
   brand path/node geometry, teal `#2DD4BF` + amber `#F5B942` accents only, topic-meaningful
   glyph, small "LEARNPATH JOURNAL" eyebrow + category line. No robots, brains, stock photos,
   crypto or gaming visuals. Always open the PNG and check overlaps before committing.
6. **Verify**: `npm run content:validate && npm run test && npm run build`, then look at
   `/blog` and the article page in a preview. Check mobile width and the sources section.

## Editorial bar

- Useful enough to bookmark: the reader must be able to *do* something after reading.
- One idea per section; sections earn their `h2`.
- Opinion is welcome; unsourced confidence is not.
- Tie the ending back into the loop (a roadmap/skill link), never into a fake CTA.
- Corrections are contributions: update `publishedAt` only for substantive re-reviews;
  factual fixes land as normal PRs with a note in the PR description.
