import { SQL_SEED } from "@/lib/content/practice";

export type RunResult = {
  stdout: string;
  result?: string;
  error?: string;
  tables?: { columns: string[]; values: unknown[][] }[];
  html?: string;
};

function timeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

function workerOnce(url: string, payload: unknown, ms: number): Promise<MessageEvent["data"]> {
  const worker = new Worker(url);
  const id = crypto.randomUUID();
  const promise = new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      if (event.data?.type === "status") return;
      if (event.data?.id && event.data.id !== id) return;
      worker.terminate();
      if (event.data?.type === "error") reject(new Error(event.data.error));
      else resolve(event.data);
    };
    worker.onerror = (err) => {
      worker.terminate();
      reject(err.error ?? new Error("Worker failed"));
    };
    worker.postMessage({ id, ...(payload as object) });
  });
  return timeout(promise as Promise<MessageEvent["data"]>, ms, `Timed out after ${ms / 1000}s`);
}

export async function runPython(code: string, harness = ""): Promise<RunResult> {
  try {
    const data = await workerOnce("/workers/python.js", { code, harness }, 20000);
    return { stdout: data.stdout ?? "", result: data.result };
  } catch (error) {
    return { stdout: "", error: String(error) };
  }
}

export async function runSql(sql: string, seed = SQL_SEED): Promise<RunResult> {
  try {
    const data = await workerOnce("/workers/sql.js", { sql, seed }, 8000);
    return { stdout: "", tables: data.results };
  } catch (error) {
    return { stdout: "", error: String(error) };
  }
}

export async function runJs(code: string, language: "javascript" | "typescript"): Promise<RunResult> {
  let source = code;
  if (language === "typescript") {
    const sucrase = await import("sucrase");
    source = sucrase.transform(code, { transforms: ["typescript"] }).code;
  }
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts");
  iframe.style.display = "none";
  const id = crypto.randomUUID();
  const wrapped = source.replace(/export\s+function/g, "function").replace(/export\s+const/g, "const");
  const srcdoc = `<!doctype html><html><body><script>
    const logs = [];
    const orig = console.log;
    console.log = (...a) => { logs.push(a.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ')); };
    window.onerror = (m) => parent.postMessage({ id: '${id}', error: String(m), logs }, '*');
    try {
      const __result = (function(){ ${wrapped}
        return typeof __lp_last !== 'undefined' ? __lp_last : undefined;
      })();
      parent.postMessage({ id: '${id}', result: __result, logs }, '*');
    } catch (e) {
      parent.postMessage({ id: '${id}', error: String(e), logs }, '*');
    }
  </script></body></html>`;

  return new Promise((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.id !== id) return;
      cleanup();
      resolve({
        stdout: (event.data.logs ?? []).join("\n"),
        result: event.data.result != null ? String(event.data.result) : "",
        error: event.data.error,
      });
    };
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      iframe.remove();
      clearTimeout(timer);
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve({ stdout: "", error: "Timed out after 3s" });
    }, 3000);
    window.addEventListener("message", onMessage);
    iframe.srcdoc = srcdoc;
    document.body.appendChild(iframe);
  });
}

export function runHtml(code: string): RunResult {
  return { stdout: "", html: code };
}

export async function runCode(
  language: "python" | "javascript" | "typescript" | "sql" | "html",
  code: string,
): Promise<RunResult> {
  if (language === "python") return runPython(code);
  if (language === "sql") return runSql(code);
  if (language === "html") return runHtml(code);
  return runJs(code, language);
}
