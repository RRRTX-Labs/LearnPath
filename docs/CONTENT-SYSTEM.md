# Content System

Canonical educational content lives in `/content` and is validated with Zod before it can ship.

```
content/
  roadmaps/*.json
  skills.json
  resources.json
  challenges.json
  projects.json
  practice.json
```

## Contribution flow

```
fork → branch → edit JSON → npm run content:validate → PR → review → merge → deploy
```

Human review is required for new resources (license, quality, no affiliate stuffing).

## Resource model

Fields: `id`, `title`, `provider`, `url`, `type`, `youtubeId?`, `level`, `durationMinutes`, `language`, `topics[]`, `projectBased`, `editorScore` (0–100), `lastVerified`, `status`, `editorNote`, `labels[]`.

Types: `youtube-course` | `youtube-video` | `playlist` | `documentation` | `article` | `interactive` | `project` | `cheatsheet`.

Labels (not objective “best” claims): `best-overall` | `best-beginner` | `fastest` | `project-based` | `advanced` | `official-docs` | `hidden-gem`.

**Editorial score basis (documented, not marketing):** freshness, beginner clarity, cost (must be free), official-ness, project density, community reputation. Score is LearnPath’s opinion.

## Skill slots

Each skill points at resource ids:

- `best` — primary path
- `alternative` — if the primary fails or the learner wants another voice
- `quick` — short
- `project` — build-oriented
- `docs` — official documentation

Plus `practiceId`, `challengeIds[]`, `projectIds[]`.

## Roadmap graph

Nodes reference `skillId` and carry layout (`x`, `y`), `tier` (`foundation` | `core` | `practice` | `project` | `mastery`), and `requirement` (`required` | `recommended` | `optional`). Edges: `{ from, to, kind }`.

## Independence

No roadmap.sh content. Original graphs and copy. Links to third-party resources are citations, not copies of their lesson text.

## Validation

`src/lib/content/schema.ts` + `scripts/validate-content.ts`. CI fails on:

- duplicate ids
- dangling skill/resource references
- missing required fields
- editorScore out of range
- YouTube id present without a watch URL
