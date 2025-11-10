import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Logo from '../assets/logo.svg'
import { AiOutlineHome, AiOutlineWallet, AiOutlineBulb } from 'react-icons/ai'
import { FiBarChart2 } from 'react-icons/fi'
import { RiFolder3Line } from 'react-icons/ri'
import { GiBullseye } from 'react-icons/gi'
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
          <Tippy content="Inicio"><span style={{display:'inline-flex',alignItems:'center'}}><AiOutlineHome className="icon-strong" style={{verticalAlign:'middle',marginRight:10}} size={22}/> Inicio</span></Tippy>
        </NavLink>
        <NavLink to="/wallet" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Cartera"><span style={{display:'inline-flex',alignItems:'center'}}><AiOutlineWallet className="icon-strong" style={{verticalAlign:'middle',marginRight:10}} size={22}/> Cartera</span></Tippy>
        </NavLink>
        <NavLink to="/budgets" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Presupuestos"><span style={{display:'inline-flex',alignItems:'center'}}><RiFolder3Line className="icon-strong" style={{verticalAlign:'middle',marginRight:10}} size={20}/> Presupuestos</span></Tippy>
        </NavLink>
        <NavLink to="/goals" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Metas"><span style={{display:'inline-flex',alignItems:'center'}}><GiBullseye className="icon-strong" style={{verticalAlign:'middle',marginRight:10}} size={20}/> Metas</span></Tippy>
        </NavLink>
        <NavLink to="/stats" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Estadísticas"><span style={{display:'inline-flex',alignItems:'center'}}><FiBarChart2 className="icon-strong" style={{verticalAlign:'middle',marginRight:10}} size={20}/> Estadísticas</span></Tippy>
        </NavLink>
          <NavLink to="/tips" className={({isActive})=> isActive? 'active':''}>
            <Tippy content="Consejos"><span style={{display:'inline-flex',alignItems:'center'}}><AiOutlineBulb className="icon-strong" style={{verticalAlign:'middle',marginRight:10}} size={20}/> Consejos</span></Tippy>
          </NavLink>
      </nav>

      <div style={{marginTop:'auto'}}>
        <button className="btn" onClick={()=>{ logout(); window.location.href='/login' }} title="Cerrar sesión">Cerrar sesión</button>
      </div>
    </aside>
  )
}
