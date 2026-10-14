"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, Input } from "@/components/ui";

export function SignInForm({
  providers,
}: {
  providers: { google: boolean; github: boolean; discord: boolean };
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  async function emailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const fn =
        mode === "up"
          ? authClient.signUp.email({ email, password, name: name || email.split("@")[0] })
          : authClient.signIn.email({ email, password });
      const res = await fn;
      if (res.error) setError(res.error.message ?? "Could not authenticate");
      else router.push("/me");
    } catch {
      setError("An unexpected error occurred. Please check your credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-2">
        {providers.github ? (
          <Button variant="ghost" onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/me" })}>
            Continue with GitHub
          </Button>
        ) : null}
        {providers.google ? (
          <Button variant="ghost" onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/me" })}>
            Continue with Google
          </Button>
        ) : null}
        {providers.discord ? (
          <Button variant="ghost" onClick={() => authClient.signIn.social({ provider: "discord", callbackURL: "/me" })}>
            Continue with Discord
          </Button>
        ) : null}
      </div>
      {!providers.github && !providers.google && !providers.discord ? (
        <p className="text-xs text-muted">
          OAuth providers appear when client IDs are configured. Email works locally and in production.
        </p>
      ) : null}

      <form className="surface space-y-4 p-5 rounded-lg" onSubmit={emailAuth}>
        {mode === "up" ? (
          <div>
            <label htmlFor={nameId} className="block text-xs font-medium text-muted mb-1">
              Your name (or handle)
            </label>
            <Input
              id={nameId}
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        ) : null}

        <div>
          <label htmlFor={emailId} className="block text-xs font-medium text-muted mb-1">
            Email address
          </label>
          <Input
            id={emailId}
            type="email"
            required
            placeholder="learner@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="block text-xs font-medium text-muted mb-1">
            Password
          </label>
          <Input
            id={passwordId}
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "up" ? "new-password" : "current-password"}
          />
        </div>

        {mode === "up" ? (
          <p className="text-xs text-muted leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . We store your progress and notes securely and never sell your data.
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Processing…" : mode === "up" ? "Create free account" : "Sign in with email"}
        </Button>

        <div className="text-center pt-1">
          <button
            type="button"
            className="text-xs text-muted hover:text-fg underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            onClick={() => {
              setError("");
              setMode(mode === "up" ? "in" : "up");
            }}
          >
            {mode === "up" ? "Already have an account? Sign in" : "Need an account? Create one"}
          </button>
        </div>
      </form>
    </div>
  );
}
