(async ()=>{
  const base = 'http://localhost:4000'
  try{
    const ts = Date.now()
    const email = `testfetch+${ts}@example.test`
    console.log('Registering', email)
    let res = await fetch(`${base}/auth/register`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name:'Fetch Test', email, password:'pass123' }) })
    console.log('register status', res.status)
    console.log(await res.text())

    console.log('Logging in...')
    res = await fetch(`${base}/auth/login`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email, password:'pass123' }) })
    console.log('login status', res.status)
    console.log(await res.text())

    const loginJson = await (await fetch(`${base}/auth/login`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email, password:'pass123' }) })).json()
    const userId = loginJson.user?.id
    console.log('userId', userId)

    const onboarding = { frequentCategories: ['Compras','Comida'], incomeSource: 'Empleado', incomeAmount: 1500, budgetsByCategory: [{category:'Compras', limit:200}], goals: [{title:'Viaje', targetAmount:500, targetDate:'2026-06-01'}] }
    res = await fetch(`${base}/auth/onboarding`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ userId, onboarding }) })
    console.log('onboarding status', res.status)
    console.log(await res.text())

    res = await fetch(`${base}/auth/login`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email, password:'pass123' }) })
    console.log('login 2 status', res.status)
    console.log(await res.text())

  }catch(err){
    console.error('ERROR', err.message)
  }
})()
