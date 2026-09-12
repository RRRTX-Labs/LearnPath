import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  role: text("role").notNull().default("user"),
  isAnonymous: integer("is_anonymous", { mode: "boolean" }).default(false),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

export const progress = sqliteTable(
  "progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    status: text("status").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    uniqueIndex("progress_user_entity_idx").on(t.userId, t.entityType, t.entityId),
    index("progress_user_type_idx").on(t.userId, t.entityType),
  ],
);

export const notes = sqliteTable(
  "notes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    skillId: text("skill_id").notNull(),
    body: text("body").notNull().default(""),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [uniqueIndex("notes_user_skill_idx").on(t.userId, t.skillId)],
);

export const reports = sqliteTable(
  "reports",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    reason: text("reason").notNull(),
    details: text("details").notNull().default(""),
    status: text("status").notNull().default("open"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("reports_status_idx").on(t.status)],
);

export const resourceMeta = sqliteTable("resource_meta", {
  resourceId: text("resource_id").primaryKey(),
  status: text("status").notNull().default("active"),
  lastVerified: text("last_verified"),
  editorScore: integer("editor_score"),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  progress: many(progress),
  notes: many(notes),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(user, { fields: [progress.userId], references: [user.id] }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(user, { fields: [notes.userId], references: [user.id] }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  progress,
  notes,
  reports,
  resourceMeta,
};
