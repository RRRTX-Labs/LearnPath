import type { Metadata } from "next";
import { ProfileClient } from "./ui";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-4xl">Profile</h1>
      <ProfileClient />
    </div>
  );
}
