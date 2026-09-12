export const projects = [
  {
    id: "py-cli-todo",
    slug: "py-cli-todo",
    title: "CLI task list",
    summary: "A Python command-line todo app that stores tasks in a JSON file.",
    description:
      "Build a small tool you would actually use. Support add, list, and complete. Persist to disk. Refuse to crash on a missing file.",
    skillIds: ["python-oop", "python-files", "python-errors"],
    difficulty: "beginner",
    estimatedHours: 4,
    language: "python",
    requirements: [
      "add(title) appends a task",
      "list() returns unfinished tasks first",
      "complete(id) marks a task done",
      "Missing storage file is treated as empty, not an error",
    ],
    starter: {
      "todo.py": `import json
from pathlib import Path

STORE = Path("tasks.json")

def load():
    if not STORE.exists():
        return []
    return json.loads(STORE.read_text())

def save(tasks):
    STORE.write_text(json.dumps(tasks, indent=2))

# Implement add, list_tasks, complete
`,
    },
    hints: ["Give each task an incremental id.", "Write tests for load() when the file is missing."],
  },
  {
    id: "py-mini-tokenizer",
    slug: "py-mini-tokenizer",
    title: "Mini tokenizer",
    summary: "Byte-pair-ish tokenizer on a tiny corpus — enough to feel how LLMs see text.",
    description:
      "Implement a character-level tokenizer first, then merge the most frequent adjacent pairs a few times. Encode and decode must round-trip on the training text.",
    skillIds: ["transformers-llms", "python-data-structures"],
    difficulty: "intermediate",
    estimatedHours: 6,
    language: "python",
    requirements: [
      "encode(text) -> list[int]",
      "decode(ids) -> text",
      "round-trip the training corpus",
    ],
    starter: {
      "tokenizer.py": `def encode(text: str) -> list[int]:
    return [ord(c) for c in text]

def decode(ids: list[int]) -> str:
    return "".join(chr(i) for i in ids)
`,
    },
    hints: ["Start with bytes/characters. Merges are optional extra credit."],
  },
  {
    id: "py-tool-agent",
    slug: "py-tool-agent",
    title: "Tiny tool agent",
    summary: "A loop that can call calculator and lookup tools. No hidden magic.",
    description:
      "Do not pull a framework. Write a loop: model (stubbed or API) proposes a tool, you validate arguments, execute, append the result, repeat until final answer or max steps.",
    skillIds: ["tool-use-apis", "agent-architecture", "agent-safety"],
    difficulty: "intermediate",
    estimatedHours: 8,
    language: "python",
    requirements: [
      "Tools are a dict of name -> function",
      "Arguments are validated before the call",
      "Max 5 steps",
      "Unknown tools raise a controlled error, not a crash",
    ],
    starter: {
      "agent.py": `TOOLS = {
    "add": lambda a, b: a + b,
}

def run(goal: str, max_steps: int = 5) -> str:
    # Replace with a real loop. For the playground, call add as a demo.
    return str(TOOLS["add"](2, 2))
`,
    },
    hints: ["Log every call.", "Never eval() model output."],
  },
  {
    id: "web-portfolio",
    slug: "web-portfolio",
    title: "Personal learning portfolio",
    summary: "A single-page site that presents who you are and one project you built on LearnPath.",
    description:
      "Semantic HTML, readable CSS, keyboard-accessible nav, and a deployed URL. This is your public proof of work.",
    skillIds: ["html-css", "accessibility", "deploy-basics"],
    difficulty: "beginner",
    estimatedHours: 6,
    language: "html",
    requirements: [
      "One h1 with your name",
      "A projects section with at least one link",
      "Skip link or landmark nav",
      "Works at 320px width",
    ],
    starter: {
      "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Portfolio</title>
    <style>
      body { font-family: Georgia, serif; margin: 0; padding: 2rem; }
    </style>
  </head>
  <body>
    <header>
      <h1>Your name</h1>
    </header>
  </body>
</html>
`,
    },
    hints: ["Contrast matters more than gradients.", "Ship it."],
  },
  {
    id: "js-notes-api",
    slug: "js-notes-api",
    title: "Notes API",
    summary: "HTTP JSON API for notes with in-memory storage (upgrade to SQL later).",
    description:
      "GET /notes, POST /notes, DELETE /notes/:id. Validate input. Return useful status codes.",
    skillIds: ["node-express", "javascript-fundamentals"],
    difficulty: "intermediate",
    estimatedHours: 8,
    language: "javascript",
    requirements: [
      "POST rejects empty titles with 400",
      "GET returns an array",
      "DELETE of unknown id returns 404",
    ],
    starter: {
      "server.js": `// Sketch — run locally with Node.
const notes = [];
export function createNote(title) {
  if (!title) throw new Error("title required");
  const note = { id: String(notes.length + 1), title };
  notes.push(note);
  return note;
}
`,
    },
    hints: ["Keep the handler logic testable without listening on a port."],
  },
  {
    id: "sql-library",
    slug: "sql-library",
    title: "Library queries",
    summary: "Design queries for a tiny library: authors, books, loans.",
    description:
      "Write SQL that answers: which books are on loan, which author has the most titles, which titles were published after 2015.",
    skillIds: ["sql-fundamentals"],
    difficulty: "beginner",
    estimatedHours: 3,
    language: "sql",
    requirements: [
      "Use JOIN, not nested guesswork",
      "Alias columns with readable names",
      "Order results deterministically",
    ],
    starter: {
      "queries.sql": `-- 1. Books on loan
SELECT * FROM loans;

-- 2. Author with most titles
-- 3. Titles after 2015
`,
    },
    hints: ["GROUP BY author, COUNT(*) as titles."],
  },
];
