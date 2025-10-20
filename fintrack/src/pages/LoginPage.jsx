import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Logo from '../assets/logo.svg'

export default function LoginPage(){
  const [email, setEmail] = useState('demo@fintrack.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    try{
      await login(email, password)
      nav('/')
    }catch(err){
      setError(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="page center">
      <form className="auth-card" onSubmit={onSubmit}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
          <img src={Logo} alt="Fintrack" style={{width:48,height:48}} />
          <div>
            <h2 style={{margin:0}}>Iniciar sesión</h2>
            <div className="muted" style={{fontSize:13}}>Accede a tu cuenta Fintrack</div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        <label className="label">Correo electrónico
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="label">Contraseña
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <div className="row" style={{marginTop:8}}>
          <button className="btn">Entrar</button>
          <button type="button" className="btn ghost" onClick={()=>nav('/register')}>Crear cuenta</button>
        </div>
      </form>
    </div>
  )
}
