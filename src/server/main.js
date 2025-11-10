// TODO: Build HTTP server entry point.
// This file should bootstrap your Node.js backend, configure middleware,
// register routes, and start listening for requests.

const express = require('express');
const cors = require('cors');
const db = require('./db');
const { generateToken, verifyPassword } = require('./auth');
const app = express();
app.use(cors());
app.use(express.json({ limit: '5kb' }));

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email=?', [email], (err, user) => {
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!verifyPassword(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, role: user.role });
  });
});

// Tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => res.json(rows));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
