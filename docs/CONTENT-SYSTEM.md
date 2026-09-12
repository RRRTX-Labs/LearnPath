# Content System

**Canonical curriculum is TypeScript modules in `src/lib/content/`, validated with Zod.**
Earlier revisions of this document described JSON files under `/content`; that was never the
implementation. TypeScript won: typed, refactorable, no export step, and the Zod gate catches
dangling references at build time.

```
src/lib/content/
  schema.ts              Zod schemas (the contract)
  index.ts               parse-all + maps + validateCatalog() + slot helpers
  resources.ts           hand-curated resources (human editorial picks)
  resources.imported.ts  GENERATED from the research dataset — do not hand-edit
  skills.ts              hand-authored skills
  skills.imported.ts     GENERATED skills added by the dataset
  skill-wiring.ts        GENERATED dataset → existing-skill slot wiring
  roadmaps.ts            staged graphs (hand-authored)
  challenges.ts projects.ts practice.ts
content/research/        research inputs (build-time only, never imported by src/)
scripts/import-resources.mjs   the generator
```

## Contribution flow

```
fork → branch → edit catalog modules → npm run content:validate → npm test → PR → review → merge
```

Human review is required for new resources (license, quality, no affiliate stuffing).
Generated files change only by re-running the importer with updated research inputs.

## Resource model

Fields: `id`, `title`, `provider`, `url`, `type`, `youtubeId?`, `playlistId?`, `level`,
`durationMinutes`, `language`, `topics[]`, `projectBased`, `editorScore` (0–100), `lastVerified`,
`status`, `editorNote`, `labels[]`, plus v1.1 additions `publishedAt?`, `warnings[]` (closed
vocabulary), `learningOutcomes[]`, `playlistVideoCount?`.

Types: `youtube-course` | `youtube-video` | `playlist` | `documentation` | `article` |
`interactive` | `project` | `cheatsheet`.

Labels (editorial roles, not objective claims): `best-overall` | `best-beginner` | `fastest` |
`project-based` | `advanced` | `official-docs` | `hidden-gem`.

**Editorial score basis:** freshness, beginner clarity, cost (must be free), official-ness,
project density, community reputation. The dataset records a per-component breakdown in the
research file; the catalog stores the integer total.

## Skill slots

Each skill points at resource ids: `best` (primary), `alternative`, `quick`, `project`, `docs`,
plus `extraResourceIds` (rendered as "More curated"). Generated wiring fills only slots the
hand-authored skill left empty; humans always win.

## Roadmap graph

Nodes reference `skillId` and carry layout (`x`, `y`), `tier`
(`foundation | core | practice | project | mastery`) and `requirement`
(`required | recommended | optional`). Edges: `{ from, to, kind }`.

**Stages (v1.1):** every roadmap declares `stages[] = { id, title, summary, nodeIds[] }`. The graph
renders one band per stage; validation enforces that every node appears in exactly one stage when
stages exist. Stages are the product's answer to "what do I learn first, what comes next, and why".

## Research import pipeline

`content/research/learnpath-youtube-resources.json` (schema v5, embed-verified) and
`learnpath-resources.import.json` (repo-shaped records) are inputs, not runtime content.

```
node scripts/import-resources.mjs     # regenerates the three GENERATED modules
npm run content:validate && npm test  # tests/import.test.ts gates the result
```

Importer gates: schema semantics; `embed_status === "verified"` for every emitted record; rejected
(embed-disabled) videos can never be emitted; duplicate videos already curated by hand are skipped
with a documented reason; one `best-overall` label per repo skill (highest score wins, others
demoted). Dataset `skill_id`s map onto repo skills through an explicit table in the script; unmapped
dataset skills stay library-only (searchable, filterable) instead of creating dangling references.

## Validation

`validateCatalog()` (CI via `npm run content:validate` and `tests/content.test.ts`) fails on:
duplicate ids; dangling skill/resource/prerequisite/challenge/project references; bad edges;
stage/node mismatches; youtube-typed resources without ids; urls not containing their youtubeId.

## Independence

No roadmap.sh content — their license forbids redistribution. Original graphs and copy; links to
third-party resources are citations, not copies of lesson text. No paid resources presented as free.
No affiliate links.
