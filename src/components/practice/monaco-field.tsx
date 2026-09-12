"use client";

import Editor, { type OnChange } from "@monaco-editor/react";
import { useTheme } from "next-themes";

const LANG: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  sql: "sql",
  html: "html",
};

/**
 * The real Monaco editor, loaded as a separate client chunk (never on the
 * homepage, never in SSR). Theme follows the app; options stay humble so the
 * editor feels like a learning tool, not an IDE cockpit.
 */
export function MonacoField({
  language,
  value,
  onChange,
}: {
  language: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { resolvedTheme } = useTheme();
  const handle: OnChange = (v) => onChange(v ?? "");
  return (
    <div className="overflow-hidden rounded-md border border-line bg-bg-sunken">
      <p className="meta border-b border-line px-3 py-1.5">{language} editor</p>
      <Editor
        height="320px"
        language={LANG[language] ?? "plaintext"}
        value={value}
        onChange={handle}
        theme={resolvedTheme === "light" ? "light" : "vs-dark"}
        loading={<div className="skeleton-shimmer h-[320px] w-full" />}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "gutter",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

export default MonacoField;
