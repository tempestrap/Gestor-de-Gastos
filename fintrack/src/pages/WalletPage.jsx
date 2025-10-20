import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import { useAuth } from '../AuthContext'
import Movements from '../components/Movements'

export default function WalletPage(){
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(()=>{
    let mounted = true
    async function load(){
      if (user?.id) {
        const d = await fetchDashboard(user.id).catch(()=>null)
        if (mounted) setData(d)
      } else setData(null)
    }
    load()
    const onData = ()=> load()
    window.addEventListener('dataUpdated', onData)
    return ()=>{ mounted = false; window.removeEventListener('dataUpdated', onData) }
  }, [user])

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar"><h1>Tu cartera</h1></header>

        <section className="wallet-grid">
          <div className="wallet-left">
            <div className="card balance-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div className="muted">Saldo actual</div>
                  <div className="wallet-large">${data?.balances?.current ?? 0}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="muted">Disponible</div>
                  <div className="wallet-small">${data?.balances?.available ?? 0}</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">Movimientos recientes</div></div>
              {data?.recent?.length ? <Movements items={data.recent} /> : <div className="empty-state">No hay movimientos aún.</div>}
            </div>
          </div>

          <aside className="wallet-right">
            <div className="card">
              <div className="card-header"><div className="card-title">Resumen de presupuestos</div></div>
              <div style={{display:'grid',gap:12}}>
                {data?.budgets?.length ? data.budgets.map(b => (
                  <div key={b.id} className="budget-card">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div className="budget-icon">{b.category?.charAt(0)}</div>
                        <div>
                          <div style={{fontWeight:700}}>{b.category}</div>
                          <div className="muted" style={{fontSize:12}}>Límite ${b.limit}</div>
                        </div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontWeight:800}}>${b.spent ?? 0}</div>
                        <div className="muted" style={{fontSize:12}}>{Math.round(((b.spent||0)/(b.limit||1))*100)}% usado</div>
                      </div>
                    </div>
                    <div className="budget-progress" style={{marginTop:10}}>
                      <i style={{width: `${Math.min(100, ((b.spent||0) / (b.limit||1)) * 100)}%`}}></i>
                    </div>
                  </div>
                )) : <div className="muted">Sin presupuestos definidos.</div>}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
