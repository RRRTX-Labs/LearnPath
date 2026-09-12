"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui";

type Field = {
  language: string;
  value: string;
  onChange: (v: string) => void;
};

/**
 * Editor loader: Monaco arrives as its own chunk after the page is interactive.
 * If the CDN or the chunk fails (offline, blocked network), learners get a
 * fully functional monospace textarea instead of an error — practice must
 * never dead-end.
 */
export function EditorField(props: Field) {
  const [Monaco, setMonaco] = useState<null | ((p: Field) => React.ReactNode)>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    import("./monaco-field")
      .then((m) => {
        if (alive) setMonaco(() => m.MonacoField);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (failed) return <TextareaField {...props} />;
  if (!Monaco) {
    return (
      <div className="overflow-hidden rounded-md border border-line bg-bg-sunken">
        <p className="meta border-b border-line px-3 py-1.5">{props.language} editor · loading…</p>
        <div className="skeleton-shimmer h-[320px] w-full" />
      </div>
    );
  }
  return <Monaco {...props} />;
}

function TextareaField({ language, value, onChange }: Field) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-bg-sunken">
      <p className="meta border-b border-line px-3 py-1.5">{language} editor · lightweight mode</p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        aria-label={`${language} editor`}
        className="h-80 resize-y border-0 bg-transparent p-3 font-mono text-sm leading-relaxed outline-none"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const el = e.currentTarget;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            onChange(value.slice(0, start) + "  " + value.slice(end));
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = start + 2;
            });
          }
        }}
      />
    </div>
  );
}
