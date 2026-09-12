"use client";

import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { Button, ButtonLink } from "@/components/ui";

export function ProfileClient() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  if (isPending) return <p className="mt-6 text-muted">Loading…</p>;
  if (!session?.user) {
    return (
      <div className="mt-6">
        <p className="text-muted">You are browsing anonymously.</p>
        <ButtonLink href="/sign-in" className="mt-4">
          Sign in
        </ButtonLink>
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-3">
      <p>
        <span className="text-muted">Name</span>
        <br />
        {session.user.name}
      </p>
      <p>
        <span className="text-muted">Email</span>
        <br />
        {session.user.email}
      </p>
      <Button
        variant="ghost"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
