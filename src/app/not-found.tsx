import { ArrowRight, BookOpen, Code2, Compass, FolderGit2, Layers, Search } from "lucide-react";
import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { ButtonLink, Container } from "@/components/ui";

const QUICK_LINKS = [
  {
    href: "/roadmaps",
    title: "Learning Roadmaps",
    desc: "Structured paths across Python, Web, AI, Agents, and Cybersecurity.",
    icon: Compass,
  },
  {
    href: "/skills",
    title: "Skills Catalog",
    desc: "Browse individual skills, objectives, and FreeVerse assessments.",
    icon: Layers,
  },
  {
    href: "/resources",
    title: "Resource Library",
    desc: "Over 250 verified free courses, official docs, and videos.",
    icon: BookOpen,
  },
  {
    href: "/practice",
    title: "Practice Lab",
    desc: "In-browser sandboxed coding in Python, JavaScript, TypeScript, and SQL.",
    icon: Code2,
  },
  {
    href: "/projects",
    title: "Projects",
    desc: "Hands-on project briefs with starters and requirements.",
    icon: FolderGit2,
  },
  {
    href: "/search",
    title: "Full Catalog Search",
    desc: "Find any topic, framework, video, or exercise instantly.",
    icon: Search,
  },
];

export default function NotFound() {
  return (
    <Container className="max-w-4xl py-16">
      <div className="surface p-8 md:p-12 rounded-xl text-center space-y-4">
        <p className="eyebrow text-accent font-mono">404 · Page Not Found</p>
        <h1 className="font-display text-4xl md:text-5xl">That page is not on the path</h1>
        <p className="max-w-xl mx-auto text-muted text-base leading-relaxed">
          The link you followed may be broken, outdated, or moved. Use the search bar below or pick a section to keep learning.
        </p>

        <div className="max-w-md mx-auto pt-2">
          <SearchBox />
        </div>

        <div className="pt-2">
          <ButtonLink href="/" variant="ghost" size="sm">
            ← Return to Homepage
          </ButtonLink>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="eyebrow mb-4">Popular destinations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="surface card-hover p-5 rounded-lg flex flex-col justify-between group"
            >
              <div>
                <item.icon className="h-5 w-5 text-primary mb-2.5" aria-hidden />
                <h3 className="font-display text-lg text-fg group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
              <span className="meta mt-4 text-primary flex items-center gap-1">
                Explore <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
