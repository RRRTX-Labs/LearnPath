import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { envOr, firstNonEmptyEnv } from "@/lib/env";
import * as schema from "./schema";

/**
 * Empty-string env vars (easy to create on Vercel) must fall back, not crash:
 * `createClient({ url: "" })` throws LibsqlError URL_INVALID during the build.
 */
export function resolveDbUrl(): string {
  // Vercel's runtime FS is read-only except /tmp — a file: fallback must live
  // there or every API route would 500. Data is ephemeral in that mode; real
  // deployments need TURSO_DATABASE_URL (integration or manual).
  const fallback = process.env.VERCEL ? "file:/tmp/learnpath.db" : "file:./data/learnpath.db";
  return envOr(fallback, process.env.TURSO_DATABASE_URL);
}

let client: Client | null = null;

export function getClient() {
  if (client) return client;
  const url = resolveDbUrl();
  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    const dir = dirname(filePath);
    if (dir && dir !== "." && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
  client = createClient({
    url,
    // Empty token would be sent as a blank bearer — pass undefined instead.
    authToken: firstNonEmptyEnv(process.env.TURSO_AUTH_TOKEN),
  });
  return client;
}

export function getDb() {
  return drizzle(getClient(), { schema });
}

export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
