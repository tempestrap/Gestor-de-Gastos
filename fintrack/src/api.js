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

export async function createBudget(b){
  const res = await API.post('/data/budgets', b)
  return res.data
}
