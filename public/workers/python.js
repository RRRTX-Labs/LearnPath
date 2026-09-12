/* LearnPath Python worker — Pyodide, loaded only from practice pages. */
let pyodidePromise;

async function getPyodide() {
  if (!pyodidePromise) {
    self.postMessage({ type: "status", payload: "Downloading Python runtime (first load can take a moment)…" });
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
    pyodidePromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  const { id, code, harness } = event.data;
  try {
    const pyodide = await getPyodide();
    const stdout = [];
    pyodide.setStdout({ batched: (s) => stdout.push(s) });
    pyodide.setStderr({ batched: (s) => stdout.push(s) });
    const source = harness ? `${code}\n\n${harness}` : code;
    const value = await pyodide.runPythonAsync(source);
    self.postMessage({
      type: "done",
      id,
      stdout: stdout.join("\n"),
      result: value == null ? "" : String(value),
    });
  } catch (error) {
    self.postMessage({ type: "error", id, error: String(error) });
  }
};
