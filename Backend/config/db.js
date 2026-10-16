const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'biblioteca.db');
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS libros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL
    )
`);

module.exports = db;
