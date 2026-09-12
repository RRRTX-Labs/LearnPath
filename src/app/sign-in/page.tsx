import type { Metadata } from "next";
import { enabledProviders } from "@/lib/auth-providers";
import { SignInForm } from "./ui";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 font-display text-4xl">Sign in</h1>
      <p className="mt-3 text-sm text-muted">
        You can browse everything without an account. Sign in to sync progress and notes.
      </p>
      <SignInForm providers={enabledProviders} />
    </div>
  );
}
