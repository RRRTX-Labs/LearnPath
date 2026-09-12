import type { MetadataRoute } from "next";
import { challenges, projects, resources, roadmaps, skills } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();
  const urls = [
    "",
    "/roadmaps",
    "/practice",
    "/challenges",
    "/projects",
    "/resources",
    "/courses",
    "/community",
    "/open-source",
    "/search",
    ...roadmaps.map((r) => `/roadmaps/${r.slug}`),
    ...skills.map((s) => `/skills/${s.slug}`),
    ...resources.map((r) => `/resources/${r.id}`),
    ...challenges.map((c) => `/challenges/${c.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
  ];
  return urls.map((path) => ({ url: `${base}${path}`, lastModified: now }));
}
