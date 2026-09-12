# Practice Engine

All V1 execution is **in the browser**. Vercel functions never see user code.

## Languages

| Language | Runtime | Load | Notes |
|---|---|---|---|
| Python | Pyodide 0.27 (Web Worker) | CDN, lazy | CPython WASM; micropip not required for V1 exercises |
| JavaScript | Sandboxed iframe | Instant | `sandbox="allow-scripts"` |
| TypeScript | Sucrase → JS → same iframe | Lazy Sucrase | No `tsc`, no DOM lib checking |
| HTML/CSS/JS | `srcdoc` iframe | Instant | Preview + console hook |
| SQL | sql.js WASM worker | CDN, lazy | Fresh in-memory DB + seed per run |

## Why not WebContainers

COOP/COEP isolation conflicts with YouTube iframes; commercial licensing; overkill for function-level exercises.

## Why not Piston / Judge0

Public Piston is no longer free-for-all (2026). Self-hosting needs privileged Docker. Operationally out of V1.

## Editor

V1 ships a first-class monospace editor (tab insertion, language label) rather than bundling Monaco in this repository. Monaco remains the intended upgrade (`@monaco-editor/react` + CDN workers) once the deploy environment has the RAM for the extra compile. Keyboard: tab inserts spaces.

## Protocol

Parent ↔ sandbox via `postMessage` with `{ type, id, payload }` and `event.origin` checks. Timeout then abort.

## Python worker sketch

1. Import Pyodide from jsDelivr inside a worker.
2. `loadPyodide()`, cache the promise.
3. `runPythonAsync` user code.
4. Capture stdout/stderr via `sys.stdout` redirection.
5. For challenges, append assertion harness, parse `__LP_RESULTS__`.

First load can be 10MB+. UI must say so.

## Security

Treat all user code as hostile. No `allow-same-origin`. No parent DOM access. Output truncated. Infinite loops: timeout.

## Mobile

Editor stacks above output. Graph/lesson become tabs. Monaco touch: font 14px, padding, virtual keyboard aware (`visualViewport`).
