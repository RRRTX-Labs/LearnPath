import { getClient } from "./index";

const SQL = `
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_anonymous INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS session_user_id_idx ON session(user_id);
CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at INTEGER,
  refresh_token_expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS account_user_id_idx ON account(user_id);
CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS progress_user_entity_idx ON progress(user_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS progress_user_type_idx ON progress(user_id, entity_type);
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS notes_user_skill_idx ON notes(user_id, skill_id);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES user(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status);
CREATE TABLE IF NOT EXISTS resource_meta (
  resource_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'active',
  last_verified TEXT,
  editor_score INTEGER
);
`;

let ensured = false;

export async function ensureSchema() {
  if (ensured) return;
  const client = getClient();
  await client.executeMultiple(SQL);
  ensured = true;
}
