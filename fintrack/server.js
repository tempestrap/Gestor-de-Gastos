const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const DB_FILE = './db.json';

function readDB() {
  const raw = fs.readFileSync(DB_FILE);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple login endpoint (email + password) - returns user and token
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  // In a real app never return password. Here we include a fake token
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Register (simple) - returns created user
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const id = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  const user = { id, name, email, password };
  db.users.push(user);
  writeDB(db);
  res.json({ id, name, email });
});

// A few resource endpoints
app.get('/data/dashboard', (req, res) => {
  const db = readDB();
  res.json({ balances: db.balances, recent: db.movements, budgets: db.budgets });
});

app.get('/data/statistics', (req, res) => {
  const db = readDB();
  res.json({ stats: db.statistics });
});

app.get('/data/budgets', (req, res) => {
  const db = readDB();
  res.json(db.budgets);
});

app.post('/data/budgets', (req, res) => {
  const db = readDB();
  const item = req.body;
  item.id = db.budgets.length ? Math.max(...db.budgets.map(b => b.id)) + 1 : 1;
  db.budgets.push(item);
  writeDB(db);
  res.json(item);
});

// Onboarding: save collected onboarding data for a user and create budgets/goals
app.post('/auth/onboarding', (req, res) => {
  const { userId, onboarding } = req.body;
  if (!userId || !onboarding) return res.status(400).json({ message: 'Missing userId or onboarding data' });
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // attach onboarding data to user
  user.onboarding = onboarding;

  // create budgets from onboarding budgetsByCategory if provided
  if (Array.isArray(onboarding.budgetsByCategory)){
    onboarding.budgetsByCategory.forEach(b => {
      const id = db.budgets.length ? Math.max(...db.budgets.map(x => x.id)) + 1 : 1;
      db.budgets.push({ id, category: b.category, limit: b.limit, spent: b.spent || 0 });
    })
  }

  // create goals from onboarding.goals if provided
  if (Array.isArray(onboarding.goals)){
    onboarding.goals.forEach(g => {
      const id = db.goals.length ? Math.max(...db.goals.map(x => x.id)) + 1 : 1;
      db.goals.push({ id, title: g.title, targetAmount: g.targetAmount, targetDate: g.targetDate, savedAmount: g.savedAmount || 0 });
    })
  }

  writeDB(db);
  res.json({ user, budgets: db.budgets, goals: db.goals });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`));
