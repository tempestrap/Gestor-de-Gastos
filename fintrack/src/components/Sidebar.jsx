import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Logo from '../assets/logo.svg'
import { AiOutlineHome, AiOutlineWallet } from 'react-icons/ai'
import { FiBarChart2 } from 'react-icons/fi'
import { RiFolder3Line } from 'react-icons/ri'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

export default function Sidebar(){
  const { user, logout } = useAuth()
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={Logo} alt="Fintrack" className="brand-logo" />
        <div>
          <div className="title">Fintrack</div>
          <div className="tag">Controla tu dinero</div>
        </div>
      </div>

      {user && <div className="muted">Hola, {user.name}</div>}

      <nav>
        <NavLink to="/" end className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Inicio"><span style={{display:'inline-flex',alignItems:'center'}}><AiOutlineHome style={{verticalAlign:'middle',marginRight:8}}/> Inicio</span></Tippy>
        </NavLink>
        <NavLink to="/wallet" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Cartera"><span style={{display:'inline-flex',alignItems:'center'}}><AiOutlineWallet style={{verticalAlign:'middle',marginRight:8}}/> Cartera</span></Tippy>
        </NavLink>
        <NavLink to="/budgets" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Presupuestos"><span style={{display:'inline-flex',alignItems:'center'}}><RiFolder3Line style={{verticalAlign:'middle',marginRight:8}}/> Presupuestos</span></Tippy>
        </NavLink>
        <NavLink to="/stats" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Estadísticas"><span style={{display:'inline-flex',alignItems:'center'}}><FiBarChart2 style={{verticalAlign:'middle',marginRight:8}}/> Estadísticas</span></Tippy>
        </NavLink>
      </nav>

      <div style={{marginTop:'auto'}}>
        <button className="btn" onClick={()=>{ logout(); window.location.href='/login' }} title="Cerrar sesión">Cerrar sesión</button>
      </div>
    </aside>
  )
}
