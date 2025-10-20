import React from 'react'
import Logo from '../assets/logo.svg'

export default function WalletPanel({ balances, wallets }){
  return (
    <aside className="wallet-panel card">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <img src={Logo} alt="Fintrack" style={{width:48,height:48,borderRadius:10}} />
        <div>
          <div className="muted" style={{fontSize:12}}>Saldo actual</div>
          <div style={{fontSize:20,fontWeight:800}}>${balances?.current ?? 0}</div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
        <div className="muted">Disponible</div>
        <div style={{fontWeight:700}}>${balances?.available ?? 0}</div>
      </div>

      <hr style={{border:'none',height:1,background:'rgba(10,20,30,0.04)',margin:'12px 0'}}/>

      <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>Carteras</div>
      <div style={{display:'grid',gap:8}}>
        {wallets?.map((w,i)=> (
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(90deg,var(--accent-a),var(--accent-b))',display:'grid',placeItems:'center',color:'#072024',fontWeight:800}}>{w.category?.charAt(0)}</div>
              <div>{w.category}</div>
            </div>
            <div style={{fontWeight:700}}>${w.amount}</div>
          </div>
        ))}
      </div>
    </aside>
  )
}
