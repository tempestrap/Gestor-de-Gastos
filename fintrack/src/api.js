import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:4000' })

export async function login(email, password){
  const res = await API.post('/auth/login', { email, password })
  return res.data
}

export async function register(name, email, password){
  const res = await API.post('/auth/register', { name, email, password })
  return res.data
}

export async function saveOnboarding(userId, onboarding){
  const res = await API.post('/auth/onboarding', { userId, onboarding })
  return res.data
}

export async function fetchDashboard(userId) {
  const res = await API.get('/data/dashboard', { params: userId ? { userId } : {} })
  return res.data
}


export async function fetchStats(userId){
  const res = await API.get('/data/statistics', { params: userId ? { userId } : {} })
  return res.data
}

export async function fetchBudgets(userId){
  const res = await API.get('/data/budgets', { params: userId ? { userId } : {} })
  return res.data
}

// Convenience helper to fetch goals (the mock server returns goals inside /data/dashboard)
export async function fetchGoals(userId){
  const res = await API.get('/data/goals', { params: userId ? { userId } : {} })
  return res.data || []
}

export async function createGoal(goal){
  const res = await API.post('/data/goals', goal)
  return res.data
}

export async function updateGoal(id, body){
  const res = await API.put(`/data/goals/${id}`, body)
  return res.data
}

export async function createBudget(b){
  const res = await API.post('/data/budgets', b)
  return res.data
}

export async function createMovement(payload){
  try {
    // Ensure amount is numeric when sending
    const body = { ...payload, amount: typeof payload.amount === 'number' ? payload.amount : Number(String(payload.amount).replace(/[^0-9.-]+/g, '')) }
    const res = await API.post('/data/movements', body)
    return res.data
  } catch (err) {
    console.error('createMovement error', err)
    const msg = err?.response?.data?.message || err?.message || 'Error creating movement'
    throw new Error(msg)
  }
}
