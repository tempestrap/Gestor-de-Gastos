import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Logo from '../assets/logo.svg'
import { AiOutlineHome, AiOutlineWallet } from 'react-icons/ai'
import { FiBarChart2 } from 'react-icons/fi'
import { RiFolder3Line } from 'react-icons/ri'

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
          <AiOutlineHome style={{verticalAlign:'middle',marginRight:8}}/> Inicio
        </NavLink>
        <NavLink to="/wallet" className={({isActive})=> isActive? 'active':''}>
          <AiOutlineWallet style={{verticalAlign:'middle',marginRight:8}}/> Cartera
        </NavLink>
        <NavLink to="/budgets" className={({isActive})=> isActive? 'active':''}>
          <RiFolder3Line style={{verticalAlign:'middle',marginRight:8}}/> Presupuestos
        </NavLink>
        <NavLink to="/stats" className={({isActive})=> isActive? 'active':''}>
          <FiBarChart2 style={{verticalAlign:'middle',marginRight:8}}/> Estadísticas
        </NavLink>
      </nav>

      <div style={{marginTop:'auto'}}>
        <button className="btn" onClick={()=>{ logout(); window.location.href='/login' }}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
