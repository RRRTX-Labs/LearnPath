async function getDb(seed) {
  if (!self.initSqlJs) {
    importScripts("https://sql.js.org/dist/sql-wasm.js");
  }
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  const db = new SQL.Database();
  if (seed) db.run(seed);
  return db;
}

self.onmessage = async (event) => {
  const { id, sql, seed } = event.data;
  try {
    const db = await getDb(seed);
    const results = [];
    const stmts = db.exec(sql);
    for (const stmt of stmts) {
      results.push({ columns: stmt.columns, values: stmt.values });
    }
    self.postMessage({ type: "done", id, results });
  } catch (error) {
    self.postMessage({ type: "error", id, error: String(error) });
  }
};
