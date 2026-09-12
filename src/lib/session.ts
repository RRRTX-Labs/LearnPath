import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(session: Awaited<ReturnType<typeof getSession>>) {
  if (!session?.user) return false;
  const role = (session.user as { role?: string }).role;
  if (role === "admin") return true;
  const email = session.user.email?.toLowerCase();
  return Boolean(email && adminEmails().includes(email));
}
