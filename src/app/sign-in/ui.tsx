"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();

  async function emailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const fn =
      mode === "up"
        ? authClient.signUp.email({ email, password, name: name || email.split("@")[0] })
        : authClient.signIn.email({ email, password });
    const res = await fn;
    if (res.error) setError(res.error.message ?? "Could not authenticate");
    else router.push("/me");
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
          OAuth providers appear when client IDs are configured. Email works locally.
        </p>
      ) : null}
      <form className="surface space-y-3 p-4" onSubmit={emailAuth}>
        {mode === "up" ? (
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        ) : null}
        <Input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <Input
          type="password"
          required
          minLength={8}
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "up" ? "new-password" : "current-password"}
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full">
          {mode === "up" ? "Create account" : "Sign in with email"}
        </Button>
        <button type="button" className="text-xs text-muted" onClick={() => setMode(mode === "up" ? "in" : "up")}>
          {mode === "up" ? "Have an account? Sign in" : "Need an account? Create one"}
        </button>
      </form>
    </div>
  );
}
