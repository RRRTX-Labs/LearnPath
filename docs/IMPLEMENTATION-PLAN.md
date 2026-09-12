# Implementation Plan

| Phase | Deliverable | Verification |
|---|---|---|
| 0 | Research + docs | This folder exists and is coherent |
| 1 | Foundation: Next.js, tokens, DB, auth stub, CI | `next build`, db push |
| 2 | Content engine + six roadmaps | `content:validate` |
| 3 | Core learning UX: home, roadmaps, skills, YouTube, progress | Manual loop without auth |
| 4 | Auth + persistence merge | OAuth/email + progress survives |
| 5 | Practice engines | Five languages run a sample |
| 6 | Challenges | Tests pass/fail |
| 7 | Projects | Brief + starter + progress |
| 8 | Community + OSS pages | Discord CTA |
| 9 | Admin | Role gate + reports |
| 10 | Polish: a11y, empty/error, SEO, motion | Checklist |
| 11 | Production verification | CI + build + learner pass |

Phases are sequential in intent; implementation may batch 1–9 in this repository because the environment allows a full V1 build.

## Definition of done

See `docs/MASTER-PROJECT.md` §40 and the prompt’s quality bar: a real learner completes roadmap → skill → resource → practice → challenge/project with persistent progress.
