import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Logo from '../assets/logo.svg'

export default function Sidebar(){
  const { user, logout } = useAuth()
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={Logo} alt="Fintrack" />
        <div>
          <div className="title">Fintrack</div>
          <div className="tag">Controla tu dinero</div>
        </div>
      </div>

      {user && <div className="muted">Hola, {user.name}</div>}

      <nav>
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/wallet">Cartera</NavLink>
        <NavLink to="/budgets">Presupuestos</NavLink>
        <NavLink to="/stats">Estadísticas</NavLink>
      </nav>

      <div style={{marginTop:'auto'}}>
        <button className="btn" onClick={()=>{ logout(); window.location.href='/login' }}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
