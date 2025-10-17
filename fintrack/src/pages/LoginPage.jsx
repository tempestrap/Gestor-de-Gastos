import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

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
      <form className="card small" onSubmit={onSubmit}>
        <h2>Iniciar sesión</h2>
        {error && <div className="error">{error}</div>}
        <label>Correo electrónico<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label>Contraseña<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <div className="row" style={{marginTop:8}}>
          <button className="btn">Entrar</button>
          <button type="button" className="btn ghost" onClick={()=>nav('/register')}>Crear cuenta</button>
        </div>
      </form>
    </div>
  )
}
