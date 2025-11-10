const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../..', 'database', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Failed to connect SQLite:', err.message);
});

module.exports = db;
