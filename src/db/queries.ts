export async function createTable(promiser) {
  return await promiser('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT
      );
    `,
  });
}

export async function insertNote(promiser, title, content) {
  return await promiser('exec', {
    sql: `INSERT INTO notes (title, content) VALUES (?, ?)`,
    bind: [title, content],
  });
}

export async function getNotes(promiser) {
  return await promiser('exec', {
    sql: `SELECT * FROM notes`,
  });
}
