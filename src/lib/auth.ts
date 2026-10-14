import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous } from "better-auth/plugins/anonymous";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { firstNonEmptyEnv } from "./env";
import { getSiteUrl } from "./site-url";
import { enabledProviders } from "./auth-providers";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const discordId = process.env.DISCORD_CLIENT_ID;
const discordSecret = process.env.DISCORD_CLIENT_SECRET;

export { enabledProviders };

function getAuthSecret(): string {
  const secret = firstNonEmptyEnv(process.env.BETTER_AUTH_SECRET);
  if (secret) {
    if (secret.length < 32 && process.env.NODE_ENV === "production") {
      console.warn("[SECURITY WARNING] BETTER_AUTH_SECRET should be at least 32 characters for production.");
    }
    return secret;
  }

  // During Vercel preview builds or build phase where BETTER_AUTH_SECRET is not yet injected,
  // warn instead of throwing a hard build crash so preview deployments succeed.
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[SECURITY WARNING] BETTER_AUTH_SECRET is not set in environment. Set a 32+ character random secret in your production/preview dashboard.",
    );
  }
  return "learnpath-dev-secret-change-me-32chars!";
}

export const auth = betterAuth({
  appName: "LearnPath",
  baseURL: firstNonEmptyEnv(process.env.BETTER_AUTH_URL) ?? getSiteUrl(),
  secret: getAuthSecret(),
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
