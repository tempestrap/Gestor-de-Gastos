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

export async function fetchDashboard(){
  const res = await API.get('/data/dashboard')
  return res.data
}

export async function fetchStats(){
  const res = await API.get('/data/statistics')
  return res.data
}

export async function fetchBudgets(){
  const res = await API.get('/data/budgets')
  return res.data
}

export async function createBudget(b){
  const res = await API.post('/data/budgets', b)
  return res.data
}
