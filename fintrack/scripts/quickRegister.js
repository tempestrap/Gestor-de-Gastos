const axios = require('axios')
;(async ()=>{
  try{
    const email = `autotest${Date.now()}@test.local`
    console.log('Trying register', email)
    const r = await axios.post('http://localhost:4000/auth/register', { name: 'AutoTest', email, password: 'p' })
    console.log('OK', r.status, r.data)
  }catch(e){
    if (e.response) console.error('ERR', e.response.status, e.response.data)
    else console.error('ERR', e.message)
  }
})()
