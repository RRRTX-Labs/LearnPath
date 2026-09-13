import { InlineText } from "./blog-inline";
import { blogCategoryCopy, type BlogPost } from "@/lib/content";
import { Badge } from "./ui";

/** Server-rendered article body. Structured blocks only — validated by Zod. */
export function BlogBody({ post }: { post: BlogPost }) {
  return (
    <div className="max-w-2xl space-y-5 text-[15px] leading-relaxed text-fg/90">
      {post.body.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="pt-4 font-display text-2xl text-fg">
                {block.text}
              </h2>
            );
          case "p":
            return (
              <p key={i}>
                <InlineText text={block.text} />
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={i} className="space-y-2.5 pl-5">
                {block.items.map((item, j) => (
                  <li key={j} className="list-decimal marker:font-mono marker:text-sm marker:text-primary">
                    <InlineText text={item} />
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="space-y-2.5 pl-5">
                {block.items.map((item, j) => (
                  <li key={j} className="list-disc marker:text-primary">
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-primary pl-5 font-display text-xl leading-snug text-fg">
                “{block.text}”
                {block.cite ? <cite className="mt-2 block font-sans text-sm not-italic text-muted">— {block.cite}</cite> : null}
              </blockquote>
            );
          case "sources":
            return (
              <section key={i} aria-label="Sources" className="surface rounded-lg p-5">
                <p className="eyebrow">Sources & further reading</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {block.items.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="meta mt-3">
                  Category: {blogCategoryCopy[post.category]} · Last reviewed {post.publishedAt}
                </p>
              </section>
            );
        }
      })}
      <p className="pt-2">
        <Badge tone="accent">{post.author}</Badge>
      </p>
    </div>
  );
}
