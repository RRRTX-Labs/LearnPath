"use client";

export function MonacoField({
  language,
  value,
  onChange,
}: {
  language: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border bg-bg-sunken">
      <p className="border-b border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
        {language} editor
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        aria-label={`${language} editor`}
        className="h-80 w-full resize-y bg-transparent p-3 font-mono text-sm leading-relaxed text-fg outline-none"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const el = e.currentTarget;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const next = value.slice(0, start) + "  " + value.slice(end);
            onChange(next);
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = start + 2;
            });
          }
        }}
      />
    </div>
  );
}
