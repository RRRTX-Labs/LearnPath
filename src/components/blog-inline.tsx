import type { ReactNode } from "react";

/**
 * Minimal inline markup for journal text: [label](https://…) links and
 * **bold**. Deliberately tiny — no full Markdown parser dependency.
 */
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g;
const BOLD_RE = /\*\*([^*]+)\*\*/g;

function parseBold(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(BOLD_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    out.push(<strong key={`${keyPrefix}-b${i++}`} className="font-semibold text-fg">{m[1]}</strong>);
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function InlineText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(...parseBold(text.slice(last, idx), `p${i}`));
    const href = m[2];
    const external = href.startsWith("http");
    out.push(
      <a
        key={`l${i++}`}
        href={href}
        className="text-primary underline-offset-2 hover:underline"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {m[1]}
      </a>,
    );
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(...parseBold(text.slice(last), "tail"));
  return <>{out}</>;
}
