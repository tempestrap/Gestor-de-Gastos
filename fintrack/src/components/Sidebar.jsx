import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Logo from '../assets/logo.svg'
import IconWallet from '../assets/icon-wallet.svg'
import IconBudget from '../assets/icon-budget.svg'

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
        <NavLink to="/" end className={({isActive})=> isActive? 'active':''}>
          <img src={'/src/assets/icon-home.svg'} alt="" style={{verticalAlign:'middle',marginRight:8}}/>Inicio
        </NavLink>
        <NavLink to="/wallet" className={({isActive})=> isActive? 'active':''}>
          <img src={IconWallet} alt="" style={{verticalAlign:'middle',marginRight:8}}/>Cartera
        </NavLink>
        <NavLink to="/budgets" className={({isActive})=> isActive? 'active':''}>
          <img src={IconBudget} alt="" style={{verticalAlign:'middle',marginRight:8}}/>Presupuestos
        </NavLink>
        <NavLink to="/stats" className={({isActive})=> isActive? 'active':''}>Estadísticas</NavLink>
      </nav>

      <div style={{marginTop:'auto'}}>
        <button className="btn" onClick={()=>{ logout(); window.location.href='/login' }}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
