import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Sidebar(){
  const { user, logout } = useAuth()
  return (
    <aside className="sidebar">
      <div className="brand">Fintrack</div>
      {user && <div style={{marginBottom:8}}>Hola, {user.name}</div>}
      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/wallet">Cartera</NavLink>
        <NavLink to="/budgets">Presupuestos</NavLink>
        <NavLink to="/stats">Estadísticas</NavLink>
      </nav>
      <div style={{marginTop:16}}>
        <button className="btn" onClick={()=>{ logout(); window.location.href='/login' }}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
