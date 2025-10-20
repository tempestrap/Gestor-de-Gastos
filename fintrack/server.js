const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');
const DB_FILE = path.resolve(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    // If DB file missing, initialize a minimal structure
    const initial = { users: [], balances: {}, movements: [], budgets: [], goals: [], statistics: {} };
    writeDB(initial);
    return ensureDBStructure(initial);
  }
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  try {
    return ensureDBStructure(JSON.parse(raw));
  } catch (err) {
    console.error('Error parsing DB file:', err);
    // repair by returning empty structure to avoid crashing
    return ensureDBStructure({ users: [], balances: {}, movements: [], budgets: [], goals: [], statistics: {} });
  }
}

function ensureDBStructure(db){
  let changed = false
  if (!db) db = {}
  if (!Array.isArray(db.users)) { db.users = []; changed = true }
  if (!db.balances || typeof db.balances !== 'object') { db.balances = {}; changed = true }
  if (!Array.isArray(db.movements)) { db.movements = []; changed = true }
  if (!Array.isArray(db.budgets)) { db.budgets = []; changed = true }
  if (!Array.isArray(db.goals)) { db.goals = []; changed = true }
  if (!db.statistics || typeof db.statistics !== 'object') { db.statistics = {}; changed = true }
  if (changed) {
    try { writeDB(db) } catch(e){ console.error('Could not repair DB file', e) }
  }
  return db
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB file:', err);
    throw err;
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple login endpoint (email + password) - returns user and token
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email)
  const db = readDB();
  const user = (db.users || []).find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  // In a real app never return password. Here we include a fake token
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  const safeUser = { id: user.id, name: user.name, email: user.email };
  if (user.onboarding) safeUser.onboarding = user.onboarding;
  res.json({ user: safeUser, token });
});

// Register (simple) - returns created user
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register attempt:', email)
  const db = readDB();
  if ((db.users || []).find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const id = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  // create user with an empty onboarding object so later flows assume the field exists
  const user = { id, name, email, password, onboarding: null };
  db.users.push(user);
  try {
    writeDB(db);
  } catch (err) {
    console.error('Failed to write DB during register', err)
    return res.status(500).json({ message: 'Failed to save user', detail: String(err) });
  }
  res.json({ id, name, email });
});

// A few resource endpoints
app.get('/data/dashboard', (req, res) => {
  const db = readDB();
  const userId = req.query.userId ? Number(req.query.userId) : null;
  const budgets = userId ? db.budgets.filter(b => b.ownerId === userId) : db.budgets;
  const goals = userId ? db.goals.filter(g => g.ownerId === userId) : db.goals;
  // support per-user balances and movements if stored with ownerId
  const balances = userId ? (db.balances && db.balances[userId]) || {} : db.balances || {};
  const recent = userId ? (db.movements || []).filter(m => m.ownerId === userId) : db.movements || [];
  res.json({ balances, recent, budgets, goals });
});

app.get('/data/statistics', (req, res) => {
  const db = readDB();
  const userId = req.query.userId ? Number(req.query.userId) : null;
  const stats = userId ? (db.statistics?.[userId] || {}) : db.statistics || {};
  res.json({ stats });
});

app.get('/data/budgets', (req, res) => {
  const db = readDB();
  const userId = req.query.userId ? Number(req.query.userId) : null;
  const budgets = userId ? db.budgets.filter(b => b.ownerId === userId) : db.budgets;
  res.json(budgets);
});

app.post('/data/budgets', (req, res) => {
  const db = readDB();
  const item = req.body;
  item.id = db.budgets.length ? Math.max(...db.budgets.map(b => b.id)) + 1 : 1;
  // preserve ownerId if provided (from client) to associate budget with a user
  if (!item.ownerId && req.body.ownerId) item.ownerId = req.body.ownerId;
  db.budgets.push(item);
  writeDB(db);
  res.json(item);
});

// Onboarding: save collected onboarding data for a user and create budgets/goals
app.post('/auth/onboarding', (req, res) => {
  const { userId, onboarding } = req.body;
  if (!userId || !onboarding) return res.status(400).json({ message: 'Missing userId or onboarding data' });
  const db = readDB();
  const user = (db.users || []).find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // attach onboarding data to user
  user.onboarding = onboarding;

  // create budgets from onboarding budgetsByCategory if provided
  if (Array.isArray(onboarding.budgetsByCategory)){
    onboarding.budgetsByCategory.forEach(b => {
      const id = db.budgets.length ? Math.max(...db.budgets.map(x => x.id)) + 1 : 1;
      db.budgets.push({ id, category: b.category, limit: b.limit, spent: b.spent || 0, ownerId: userId });
    })
  }

  // create goals from onboarding.goals if provided
  if (Array.isArray(onboarding.goals)){
    onboarding.goals.forEach(g => {
      const id = db.goals.length ? Math.max(...db.goals.map(x => x.id)) + 1 : 1;
      db.goals.push({ id, title: g.title, targetAmount: g.targetAmount, targetDate: g.targetDate, savedAmount: g.savedAmount || 0, ownerId: userId });
    })
  }

  // create per-user balances if incomeAmount provided
  if (!db.balances) db.balances = {}
  if (onboarding.incomeAmount) {
    db.balances[userId] = { current: onboarding.incomeAmount, available: onboarding.incomeAmount }
  }

  writeDB(db);
  // Do not return password to the client. Return a sanitized user object.
  const safeUser = { id: user.id, name: user.name, email: user.email, onboarding: user.onboarding };
  res.json({ user: safeUser, budgets: db.budgets, goals: db.goals });
});

// Create a movement (expense or income)
app.post('/data/movements', (req, res) => {
  const { userId, title, amount, category, date } = req.body;
  if (!userId || typeof amount !== 'number' || !title) return res.status(400).json({ message: 'Missing fields' });
  const db = readDB();
  const id = db.movements.length ? Math.max(...db.movements.map(m => m.id)) + 1 : 1;
  const mv = { id, ownerId: userId, title, amount, category: category || 'Otros', date: date || new Date().toISOString() };
  db.movements.push(mv);

  // update balances for the user
  if (!db.balances) db.balances = {};
  if (!db.balances[userId]) db.balances[userId] = { current: 0, available: 0 };
  // if amount is negative -> expense
  if (amount < 0) {
    db.balances[userId].current = (db.balances[userId].current || 0) + amount;
    db.balances[userId].available = (db.balances[userId].available || 0) + amount;
  } else {
    db.balances[userId].current = (db.balances[userId].current || 0) + amount;
    db.balances[userId].available = (db.balances[userId].available || 0) + amount;
  }

  // If there's a budget for this category for the user, increase spent
  const budget = (db.budgets || []).find(b => b.ownerId === userId && b.category === category);
  if (budget) {
    budget.spent = (budget.spent || 0) + Math.abs(amount);
  }

  writeDB(db);
  res.json(mv);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`));
