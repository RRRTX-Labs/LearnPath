# Contributing

## Code

1. Branch from `main`.
2. `npm install && npm run test && npm run lint && npm run typecheck`
3. Open a pull request. CI must pass.

## Curriculum

Edit files under `src/lib/content/`:

- `resources.ts` — free resources only, with `lastVerified` and an honest `editorNote`
- `skills.ts` — objectives and resource slots
- `roadmaps.ts` — graphs that reference skill ids
- `challenges.ts` / `projects.ts` / `practice.ts`

Then:

```bash
npm run content:validate
npm run test
```

Do not import or paste roadmap.sh graphs, node text, or images.

Do not add paid resources as if they were free.

Do not add affiliate links.

Editorial scores are LearnPath opinions. Document the basis in `editorNote` when you change a score.

## Practice / challenges

User code is hostile. Do not add a server-side runner. Do not weaken iframe sandbox flags.
