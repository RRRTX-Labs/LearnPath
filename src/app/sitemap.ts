import type { MetadataRoute } from "next";
import { challenges, projects, resources, roadmaps, skills } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Stable lastModified dates: content pages carry the catalog's verification
 * date instead of "now", so crawlers see meaningful change signals.
 */
const CONTENT_UPDATED = new Date("2026-09-12T00:00:00.000Z");

type Entry = MetadataRoute.Sitemap[number];

function entry(
  url: string,
  changeFrequency: Entry["changeFrequency"],
  priority: number,
  lastModified: Date = CONTENT_UPDATED,
): Entry {
  return { url, lastModified, changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const urls: MetadataRoute.Sitemap = [
    entry(`${base}/`, "weekly", 1),
    ...["/roadmaps", "/practice", "/challenges", "/projects", "/resources", "/courses", "/community", "/open-source"].map(
      (path) => entry(`${base}${path}`, "weekly", 0.8),
    ),
    ...roadmaps.map((r) => entry(`${base}/roadmaps/${r.slug}`, "weekly", 0.9)),
    ...skills.map((s) => entry(`${base}/skills/${s.slug}`, "monthly", 0.7)),
    ...resources.map((r) =>
      entry(`${base}/resources/${r.id}`, "monthly", 0.6, new Date(`${r.lastVerified}T00:00:00.000Z`)),
    ),
    ...challenges.map((c) => entry(`${base}/challenges/${c.slug}`, "monthly", 0.5)),
    ...projects.map((p) => entry(`${base}/projects/${p.slug}`, "monthly", 0.5)),
  ];
  return urls;
}
