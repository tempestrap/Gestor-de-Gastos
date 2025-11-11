import React from 'react'
import Logo from '../assets/logo.svg'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { FiCreditCard, FiPieChart } from 'react-icons/fi'

export default function WalletPanel({ balances, wallets }){
  return (
    <aside className="wallet-panel card">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <img src={Logo} alt="Fintrack" className="brand-logo brand-logo--contrast" style={{width:56,height:56,borderRadius:10}} />
        <div className="wallet-balance">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <FiCreditCard className="icon-strong" size={20} color="#07303a" />
            <div className="muted" style={{fontSize:12}}>Saldo actual</div>
          </div>
          <div className="big">${balances?.current ?? 0}</div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
        <div className="muted">Disponible</div>
        <div style={{fontWeight:700}}>${balances?.available ?? 0}</div>
      </div>

      <hr style={{border:'none',height:1,background:'rgba(10,20,30,0.04)',margin:'12px 0'}}/>

      <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>Presupuestos</div>
              <div style={{display:'grid',gap:12}}>
        {wallets && wallets.length ? wallets.map((w,i)=> {
          // Calcular porcentaje y color de barra
          const spent = Number(w.amount||0)
          const limit = Number(w.limit||0) || 0
          const pct = limit > 0 ? (spent/limit)*100 : 0
          const over = limit > 0 ? spent > limit : false
          let bar = 'linear-gradient(90deg, #22c55e, #16a34a)'
          if (pct >= 50) bar = 'linear-gradient(90deg, #facc15, #eab308)'
          if (pct >= 80) bar = 'linear-gradient(90deg, #fb923c, #f97316)'
          if (over) bar = 'linear-gradient(90deg, #ef4444, #dc2626)'
          const width = `${Math.min(100, Math.max(0, pct))}%`
          return (
          <div key={i} className="budget-item">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="budget-icon"><FiPieChart className="icon-strong" size={18} color="#072024"/></div>
                <div>
                  <div>{w.category}</div>
                  {limit > 0 && <div className="muted" style={{fontSize:11}}>Límite ${limit}</div>}
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>${spent}</div>
                {limit > 0 && <div className="muted" style={{fontSize:11}}>{Math.round(((spent||0)/(limit||1))*100)}% usado</div>}
              </div>
            </div>
            {over && (
              <div style={{
                marginTop:8,
                padding:'6px 8px',
                background:'#fdecea',
                border:'1px solid #f87171',
                color:'#7f1d1d',
                borderRadius:8,
                fontSize:12,
                fontWeight:600
              }}>
                ¡Excedido! ${spent} / ${limit}
              </div>
            )}
            <div className="budget-progress" style={{marginTop:8, background:'#eef2f7'}}>
              <Tippy content={`Presupuesto ${w.category}: ${Math.round(((spent||0)/(limit||1))*100)}% gastado`}>
                <i style={{width: width, background: bar}}></i>
              </Tippy>
            </div>
          </div>
        )}) : (
          <div className="muted">Sin presupuestos definidos. Crea uno desde Presupuestos.</div>
        )}
      </div>
    </aside>
  )
}
