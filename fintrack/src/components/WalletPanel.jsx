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
        {wallets && wallets.length ? wallets.map((w,i)=> (
          <div key={i} className="budget-item">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div className="budget-icon"><FiPieChart className="icon-strong" size={18} color="#072024"/></div>
                <div>{w.category}</div>
              </div>
              <div style={{fontWeight:700}}>${w.amount}</div>
            </div>
            <div className="budget-progress" style={{marginTop:8}}>
              <Tippy content={`Presupuesto ${w.category}: ${Math.round(((w.amount||0)/(w.limit||1))*100)}% gastado`}>
                <i style={{width: `${Math.min(100, (w.amount / ( (w.limit||1) )) * 100)}%`}}></i>
              </Tippy>
            </div>
          </div>
        )) : (
          <div className="muted">Sin presupuestos definidos. Crea uno desde Presupuestos.</div>
        )}
      </div>
    </aside>
  )
}
