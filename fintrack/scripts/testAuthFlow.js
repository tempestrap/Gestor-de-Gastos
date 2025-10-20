const axios = require('axios')
;(async ()=>{
  try{
    const api = axios.create({ baseURL: 'http://localhost:4000' })
    // 1) register a user (use a timestamp to avoid collisions)
    const ts = Date.now()
    const email = `testuser+${ts}@example.test`
    console.log('Registering', email)
    await api.post('/auth/register', { name: 'Test User', email, password: 'pass123' })
    console.log('Registered')

    // 2) login
    const loginRes = await api.post('/auth/login', { email, password: 'pass123' })
    console.log('Login response user:', loginRes.data.user)

    const userId = loginRes.data.user.id
    // 3) submit onboarding
    const onboarding = { frequentCategories: ['Compras','Comida'], incomeSource: 'Empleado', incomeAmount: 1500, budgetsByCategory: [{category:'Compras', limit:200}], goals: [{title:'Viaje', targetAmount:500, targetDate:'2026-06-01'}] }
    const onRes = await api.post('/auth/onboarding', { userId, onboarding })
    console.log('Onboarding response user:', onRes.data.user)

    // 4) login again
    const loginRes2 = await api.post('/auth/login', { email, password: 'pass123' })
    console.log('Login after onboarding:', loginRes2.data.user)
  }catch(err){
    if (err.response) {
      console.error('HTTP', err.response.status, err.response.data)
    } else {
      console.error('ERROR', err.message)
    }
  }
})()
