# Research inputs (build-time only)

These two files are the output of LearnPath's resource-research pass (2026-09-12):

- `learnpath-youtube-resources.json` — the full research dataset (schema v5): 19 categories,
  172 shipped resources, 8 rejected (embed disabled by owner), verification evidence per item.
- `learnpath-resources.import.json` — the same 172 records pre-shaped to LearnPath's
  `resourceSchema` field names.

They are **inputs**, not runtime content. Nothing in `src/` imports them. The canonical,
validated catalog is generated from them by:

```bash
node scripts/import-resources.mjs   # rewrites resources.imported.ts + skill-wiring.ts + skills.imported.ts
npm run content:validate            # must pass
npm test                            # tests/import.test.ts gates embed_status + schema
```

Rules enforced at import time:

1. Every record must satisfy `src/lib/content/schema.ts`.
2. Every record must be `embed_status: "verified"` in the research file, or it is dropped.
3. Dataset `skill_id`s are mapped onto repo skill ids by an explicit table in the script;
   unmapped topics stay as `topics` for search/filtering and never become dangling refs.
4. One `best-overall` label per repo skill (highest `editorScore` wins); other holders are
   demoted to `alternative`, per the dataset's own `curation.role_rule`.
