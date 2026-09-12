# Database

Engine: **libSQL** (Turso in production, file SQLite locally).  
ORM: **Drizzle**.

## Connection

```
TURSO_DATABASE_URL   # file:./data/learnpath.db  OR  libsql://…
TURSO_AUTH_TOKEN     # required for remote
```

Client: `@libsql/client` + `drizzle-orm/libsql`. Node runtime only.

## Schema (V1)

### Better Auth

`user`, `session`, `account`, `verification` — generated to match Better Auth’s sqlite adapter.

Extra on `user`:

- `role` text default `user` (`user` | `admin`)
- `isAnonymous` boolean

### Application

**progress**

- `id` pk
- `userId` fk user
- `entityType` (`roadmap` | `skill` | `resource` | `challenge` | `project`)
- `entityId` text
- `status` (`started` | `completed`)
- `updatedAt`
- unique `(userId, entityType, entityId)`
- index `(userId, entityType)`

**notes**

- `id` pk
- `userId` fk
- `skillId` text
- `body` text (plain text / markdown, sanitized on render)
- `updatedAt`
- unique `(userId, skillId)`

**reports**

- `id` pk
- `userId` fk nullable (anonymous reports allowed but rate-limited by IP hash later; V1 requires auth)
- `targetType` (`resource` | `challenge` | `project` | `other`)
- `targetId` text
- `reason` text
- `details` text
- `status` (`open` | `reviewed` | `dismissed`)
- `createdAt`

**resource_meta** (optional overrides; canonical data stays in Git)

- `resourceId` pk
- `status` (`active` | `unavailable` | `deprecated`)
- `lastVerified` text (ISO date)
- `editorScore` integer nullable

## Indexes

All foreign keys. Progress unique constraint is the hot path.

## Migrations

`drizzle-kit generate` / `drizzle-kit push`. Local first-run uses `push` via `npm run db:push`. Production: generate SQL, apply in CI or Turso dashboard.

## What does *not* live here

Roadmaps, skill copy, challenge prompts, project briefs. Those are Git content.
