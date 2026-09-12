"use client";

import { useCallback, useState } from "react";
import type { Challenge } from "@/lib/content";
import { Button } from "../ui";
import { EditorField } from "./editor-field";
import { runCode, runPython, runSql, type RunResult } from "./runtimes";

function Output({ result }: { result: RunResult | null }) {
  if (!result) return <p className="text-sm text-muted">Run to see output.</p>;
  return (
    <div className="space-y-3 font-mono text-sm">
      {result.error ? <pre className="whitespace-pre-wrap text-danger">{result.error}</pre> : null}
      {result.stdout ? <pre className="whitespace-pre-wrap text-fg">{result.stdout}</pre> : null}
      {result.result ? (
        <p className="text-muted">
          Result: <span className="text-fg">{result.result}</span>
        </p>
      ) : null}
      {result.tables?.map((table, i) => (
        <div key={i} className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr>
                {table.columns.map((c) => (
                  <th key={c} className="border-b border-border px-2 py-1">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.values.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border-b border-border px-2 py-1">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {result.html ? (
        <iframe
          title="Preview"
          sandbox="allow-scripts"
          className="h-64 w-full rounded-[10px] border border-border bg-white"
          srcDoc={result.html}
        />
      ) : null}
    </div>
  );
}

export function PracticeWorkspace({
  language,
  initialCode,
  prompt,
  onRan,
}: {
  language: "python" | "javascript" | "typescript" | "sql" | "html";
  initialCode: string;
  prompt?: string;
  onRan?: (result: RunResult) => void;
}) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);

  const run = useCallback(async () => {
    setBusy(true);
    const next = await runCode(language, code);
    setResult(next);
    setBusy(false);
    onRan?.(next);
  }, [code, language, onRan]);

  return (
    <div className="grid gap-4">
      {prompt ? <p className="text-sm text-muted">{prompt}</p> : null}
      <EditorField language={language} value={code} onChange={setCode} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={run} disabled={busy}>
          {busy ? "Running…" : "Run"}
        </Button>
        <p className="self-center font-mono text-[11px] uppercase tracking-wider text-muted">
          {language} · sandboxed in your browser
        </p>
      </div>
      <div className="surface min-h-32 p-4">
        <p className="eyebrow mb-2">Output</p>
        <Output result={result} />
      </div>
    </div>
  );
}

type TestResult = { id: string; description: string; ok: boolean; error?: string };

export function ChallengeWorkspace({
  challenge,
  onPass,
}: {
  challenge: Challenge;
  onPass: () => void;
}) {
  const [code, setCode] = useState(challenge.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [tests, setTests] = useState<TestResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(0);

  async function runTests() {
    setBusy(true);
    setTests(null);
    if (challenge.language === "python") {
      const harness = [
        "import json",
        "__lp = []",
        ...challenge.tests.map(
          (t) =>
            `try:\n    ${t.code.replace(/\n/g, "\n    ")}\n    __lp.append({"id": ${JSON.stringify(t.id)}, "description": ${JSON.stringify(t.description)}, "ok": True})\nexcept Exception as e:\n    __lp.append({"id": ${JSON.stringify(t.id)}, "description": ${JSON.stringify(t.description)}, "ok": False, "error": str(e)})`,
        ),
        "print('__LP_RESULTS__' + json.dumps(__lp))",
      ].join("\n");
      const out = await runPython(code, harness);
      setResult(out);
      const line = (out.stdout || "").split("\n").find((l) => l.includes("__LP_RESULTS__"));
      const parsed: TestResult[] = line ? JSON.parse(line.split("__LP_RESULTS__")[1]) : [];
      if (!parsed.length && out.error) {
        setTests([{ id: "runtime", description: "Runtime", ok: false, error: out.error }]);
      } else {
        setTests(parsed);
        if (parsed.length && parsed.every((t) => t.ok)) onPass();
      }
    } else if (challenge.language === "sql") {
      const out = await runSql(code);
      setResult(out);
      const table = out.tables?.[0];
      const results: TestResult[] = challenge.tests.map((t) => {
        if (t.code.startsWith("expectColumns:")) {
          const cols = t.code.slice("expectColumns:".length).split(",");
          const ok = !!table && cols.every((c) => table.columns.includes(c));
          return { id: t.id, description: t.description, ok, error: ok ? undefined : "Missing columns" };
        }
        return { id: t.id, description: t.description, ok: !!table, error: table ? undefined : "No result" };
      });
      setTests(results);
      if (results.every((t) => t.ok)) onPass();
    } else if (challenge.language === "html") {
      const out = await runCode("html", code);
      setResult(out);
      const doc = new DOMParser().parseFromString(code, "text/html");
      const results: TestResult[] = challenge.tests.map((t) => {
        const sel = t.code.replace("assertDocument:", "");
        const ok = !!doc.querySelector(sel);
        return { id: t.id, description: t.description, ok, error: ok ? undefined : `Missing ${sel}` };
      });
      setTests(results);
      if (results.every((t) => t.ok)) onPass();
    } else {
      const asserts = challenge.tests
        .map(
          (t) => `
            try { ${t.code}; __lp.push({id:${JSON.stringify(t.id)}, description:${JSON.stringify(t.description)}, ok:true}); }
            catch(e) { __lp.push({id:${JSON.stringify(t.id)}, description:${JSON.stringify(t.description)}, ok:false, error:String(e)}); }
          `,
        )
        .join("\n");
      const harnessed = `${code.replace(/export\s+/g, "")}
        function assertEqual(a,b){ if(JSON.stringify(a)!==JSON.stringify(b)) throw new Error('expected '+JSON.stringify(b)+' got '+JSON.stringify(a)); }
        const __lp = [];
        ${asserts}
        console.log('__LP_RESULTS__'+JSON.stringify(__lp));
      `;
      const lang = challenge.language === "typescript" ? "typescript" : "javascript";
      const out = await runCode(lang, harnessed);
      setResult(out);
      const line = (out.stdout || "").split("\n").find((l) => l.includes("__LP_RESULTS__"));
      const parsed: TestResult[] = line ? JSON.parse(line.split("__LP_RESULTS__")[1]) : [];
      setTests(parsed.length ? parsed : [{ id: "runtime", description: "Runtime", ok: false, error: out.error ?? "No results" }]);
      if (parsed.length && parsed.every((t) => t.ok)) onPass();
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-4">
      <div className="prose-lp text-sm">
        <p>{challenge.prompt}</p>
      </div>
      <EditorField language={challenge.language} value={code} onChange={setCode} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={runTests} disabled={busy}>
          {busy ? "Running tests…" : "Run tests"}
        </Button>
        {challenge.hints[hint] ? (
          <Button variant="ghost" onClick={() => setHint((h) => Math.min(h + 1, challenge.hints.length))}>
            Hint
          </Button>
        ) : null}
      </div>
      {hint > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          {challenge.hints.slice(0, hint).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}
      {tests ? (
        <ul className="space-y-2">
          {tests.map((t) => (
            <li key={t.id} className={t.ok ? "text-success" : "text-danger"}>
              {t.ok ? "Passed" : "Failed"} — {t.description}
              {t.error ? <span className="block font-mono text-xs text-muted">{t.error}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="surface min-h-24 p-4">
        <p className="eyebrow mb-2">Output</p>
        <Output result={result} />
      </div>
    </div>
  );
}
