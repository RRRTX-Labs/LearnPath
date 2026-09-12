import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous } from "better-auth/plugins/anonymous";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { firstNonEmptyEnv, getSiteUrl } from "./site-url";
import { enabledProviders } from "./auth-providers";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const discordId = process.env.DISCORD_CLIENT_ID;
const discordSecret = process.env.DISCORD_CLIENT_SECRET;

export { enabledProviders };

export const auth = betterAuth({
  appName: "LearnPath",
  baseURL: firstNonEmptyEnv(process.env.BETTER_AUTH_URL) ?? getSiteUrl(),
  secret: process.env.BETTER_AUTH_SECRET ?? "learnpath-dev-secret-change-me-32chars!",
  database: drizzleAdapter(getDb(), {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    ...(enabledProviders.google
      ? { google: { clientId: googleId!, clientSecret: googleSecret! } }
      : {}),
    ...(enabledProviders.github
      ? { github: { clientId: githubId!, clientSecret: githubSecret! } }
      : {}),
    ...(enabledProviders.discord
      ? { discord: { clientId: discordId!, clientSecret: discordSecret! } }
      : {}),
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: [getSiteUrl()],
  plugins: [anonymous(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
