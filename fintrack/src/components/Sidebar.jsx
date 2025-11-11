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
  
  // Estilos mejorados para mejor accesibilidad y visibilidad
  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  }

  const iconStyle = {
    flexShrink: 0,
    fontSize: '26px'
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={Logo} alt="Fintrack" className="brand-logo" />
        <div>
          <div className="title">Fintrack</div>
          <div className="tag">Controla tu dinero</div>
        </div>
      </div>

      {user && <div className="muted" style={{fontSize: '14px', marginTop: '12px', marginBottom: '20px'}}>Hola, {user.name}</div>}

      <nav style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <NavLink to="/" end className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Panel principal con resumen de actividad">
            <span style={menuItemStyle}>
              <AiOutlineHome style={iconStyle} size={26}/> 
              <span>Inicio</span>
            </span>
          </Tippy>
        </NavLink>
        
        <NavLink to="/wallet" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Ver tu cartera y movimientos">
            <span style={menuItemStyle}>
              <AiOutlineWallet style={iconStyle} size={26}/> 
              <span>Cartera</span>
            </span>
          </Tippy>
        </NavLink>
        
        <NavLink to="/budgets" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Gestiona tus presupuestos por categoría">
            <span style={menuItemStyle}>
              <RiFolder3Line style={iconStyle} size={24}/> 
              <span>Presupuestos</span>
            </span>
          </Tippy>
        </NavLink>
        
        <NavLink to="/goals" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Define y alcanza tus metas financieras">
            <span style={menuItemStyle}>
              <GiBullseye style={iconStyle} size={24}/> 
              <span>Metas</span>
            </span>
          </Tippy>
        </NavLink>
        
        <NavLink to="/stats" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Visualiza estadísticas y gráficos">
            <span style={menuItemStyle}>
              <FiBarChart2 style={iconStyle} size={24}/> 
              <span>Estadísticas</span>
            </span>
          </Tippy>
        </NavLink>
        
        <NavLink to="/tips" className={({isActive})=> isActive? 'active':''}>
          <Tippy content="Consejos personalizados para mejorar tus finanzas">
            <span style={menuItemStyle}>
              <AiOutlineBulb style={iconStyle} size={26}/> 
              <span>Consejos</span>
            </span>
          </Tippy>
        </NavLink>
      </nav>

      <div style={{marginTop:'auto', padding: '16px'}}>
        <button 
          className="btn" 
          onClick={()=>{ logout(); window.location.href='/login' }} 
          title="Cerrar sesión"
          style={{width: '100%', fontSize: '15px', padding: '12px'}}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
