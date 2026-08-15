const express = require('express');
const Database = require('better-sqlite3');
const app = express();
app.use(express.json());

const db = new Database('game.db');
db.exec(`CREATE TABLE IF NOT EXISTS buildings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  x INTEGER,
  y INTEGER
)`);

app.get('/buildings', (req, res) => {
  const rows = db.prepare('SELECT * FROM buildings').all();
  res.json(rows);
});

app.post('/buildings', (req, res) => {
  const { name, x, y } = req.body;
  const existing = db.prepare('SELECT * FROM buildings WHERE x = ? AND y = ?').get(x, y);
  if (existing) {
    return res.status(400).json({ error: 'A building already exists at this position' });
  }
  const stmt = db.prepare('INSERT INTO buildings (name, x, y) VALUES (?, ?, ?)');
  const info = stmt.run(name, x, y);
  res.json({ id: info.lastInsertRowid, name, x, y });
});

app.delete('/buildings', (req, res) => {
  db.exec('DELETE FROM buildings');
  res.json({ cleared: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));