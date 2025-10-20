import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'
import { useAuth } from '../AuthContext'
import Logo from '../assets/logo.svg'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const nav = useNavigate()
  const { login } = useAuth()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !email || !password) return setError('Rellena todos los campos')

    try {
      const user = await register(name, email, password)
      setSuccess('Cuenta creada. Iniciando sesión...')

      // Iniciar sesión automáticamente después de registrar y actualizar contexto
      try {
        await login(email, password)
      } catch (e) {
        console.warn('Auto-login failed', e)
      }

      // Redirige al onboarding
      setTimeout(() => nav('/onboarding', { state: { user } }), 700)

    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta')
    }
  }

  return (
    <div className="page center">
      <form className="auth-card" onSubmit={onSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <img src={Logo} alt="Fintrack" style={{ width: 48, height: 48 }} />
          <div>
            <h2 style={{ margin: 0 }}>Crear cuenta</h2>
            <div className="muted" style={{ fontSize: 13 }}>Regístrate en segundos</div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <label className="label">Nombre completo
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label className="label">Correo electrónico
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label className="label">Contraseña
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>

        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn">Crear cuenta</button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => nav('/login')}
          >
            Volver al login
          </button>
        </div>
      </form>
    </div>
  )
}
