import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

function resolveUrl() {
  return process.env.TURSO_DATABASE_URL ?? "file:./data/learnpath.db";
}

let client: Client | null = null;

export function getClient() {
  if (client) return client;
  const url = resolveUrl();
  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    const dir = dirname(filePath);
    if (dir && dir !== "." && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
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
