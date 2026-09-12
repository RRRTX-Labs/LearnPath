export const practiceExercises = [
  {
    id: "python-hello",
    title: "Print and return",
    language: "python",
    prompt: "Print 'ready' and define greet(name) that returns a greeting. Use the Run button.",
    starter: "print('ready')\n\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('Ada'))\n",
  },
  {
    id: "python-syntax",
    title: "Control flow",
    language: "python",
    prompt: "Write a loop that prints numbers 1 to 10, marking evens with 'even'.",
    starter: "for i in range(1, 11):\n    kind = 'even' if i % 2 == 0 else 'odd'\n    print(i, kind)\n",
  },
  {
    id: "python-functions",
    title: "Pure functions",
    language: "python",
    prompt: "Implement average(nums) that returns the mean, or None for an empty list.",
    starter: "def average(nums):\n    if not nums:\n        return None\n    return sum(nums) / len(nums)\n\nprint(average([2, 4, 6]))\n",
  },
  {
    id: "python-collections",
    title: "Collections",
    language: "python",
    prompt: "Count letters in a sentence with a dict.",
    starter: "text = 'learnpath'\ncounts = {}\nfor ch in text:\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)\n",
  },
  {
    id: "python-oop",
    title: "A tiny class",
    language: "python",
    prompt: "Make a BankAccount with deposit and withdraw (no overdraft).",
    starter: "class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError('insufficient funds')\n        self.balance -= amount\n\na = BankAccount(10)\na.withdraw(3)\nprint(a.balance)\n",
  },
  {
    id: "python-errors",
    title: "Catching errors",
    language: "python",
    prompt: "Parse integers from a list of strings, skipping junk.",
    starter: "raw = ['3', 'x', '9']\nvalues = []\nfor item in raw:\n    try:\n        values.append(int(item))\n    except ValueError:\n        print('skip', item)\nprint(values)\n",
  },
  {
    id: "python-files",
    title: "In-memory files",
    language: "python",
    prompt: "Pyodide has no real disk here — practice with io.StringIO as a file-like object.",
    starter: "import io\nbuf = io.StringIO('one\\ntwo\\nthree\\n')\nprint(buf.read())\n",
  },
  {
    id: "js-arrays",
    title: "Array transforms",
    language: "javascript",
    prompt: "Use map/filter/reduce. The last expression is shown as Result.",
    starter: `const nums = [1, 2, 3, 4, 5];
const doubled = nums.map((n) => n * 2);
const evens = doubled.filter((n) => n % 2 === 0);
const sum = evens.reduce((a, b) => a + b, 0);
console.log({ doubled, evens, sum });
sum;
`,
  },
  {
    id: "ts-types",
    title: "Typed function",
    language: "typescript",
    prompt: "Sucrase strips types then runs JS. Practice writing annotations anyway.",
    starter: `type User = { name: string; admin: boolean };

function label(user: User): string {
  return user.admin ? user.name + ' (admin)' : user.name;
}

console.log(label({ name: 'Ada', admin: true }));
`,
  },
  {
    id: "html-card",
    title: "Card layout",
    language: "html",
    prompt: "Edit markup and CSS. Preview updates on Run.",
    starter: `<section class="card">
  <h1>LearnPath</h1>
  <p>Learn anything. Build everything.</p>
  <a href="https://github.com">Open source</a>
</section>
<style>
  .card {
    font-family: Georgia, serif;
    padding: 24px;
    border: 1px solid #ccc;
    max-width: 360px;
  }
  a { color: teal; }
</style>
`,
  },
  {
    id: "sql-select",
    title: "SELECT & WHERE",
    language: "sql",
    prompt: "List books published after 2018, newest first.",
    starter: "SELECT title, year FROM books WHERE year > 2018 ORDER BY year DESC;",
    seedSql: "",
  },
  {
    id: "sql-joins",
    title: "JOIN",
    language: "sql",
    prompt: "List each book with its author name.",
    starter:
      "SELECT books.title, authors.name AS author\nFROM books\nJOIN authors ON authors.id = books.author_id\nORDER BY books.title;",
  },
];

export const SQL_SEED = `
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id)
);
CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id),
  borrower TEXT NOT NULL
);
INSERT INTO authors (id, name) VALUES
  (1, 'Ada Lovelace'),
  (2, 'Grace Hopper'),
  (3, 'Donald Knuth');
INSERT INTO books (id, title, year, author_id) VALUES
  (1, 'Notes on the Analytical Engine', 1843, 1),
  (2, 'The Education of a Computer', 1952, 2),
  (3, 'The Art of Computer Programming', 1968, 3),
  (4, 'Compiler Compiler', 2020, 2),
  (5, 'Symbolic Computation', 2021, 1);
INSERT INTO loans (id, book_id, borrower) VALUES
  (1, 3, 'Alan'),
  (2, 5, 'Katherine');
`;
