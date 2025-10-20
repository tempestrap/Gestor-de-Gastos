import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import { useAuth } from '../AuthContext'

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
        <section className="card">
          {data ? (
            <>
              <p>Saldo actual: <strong>${data.balances?.current ?? 0}</strong></p>
              <p>Saldo disponible: <strong>${data.balances?.available ?? 0}</strong></p>
              <h3>Movimientos</h3>
              {data.recent?.length ? (
                <ul>
                  {data.recent.map(m=> <li key={m.id}>{m.date} — {m.title} — ${m.amount}</li>)}
                </ul>
              ) : <div className="muted">No hay movimientos registrados.</div>}
            </>
          ) : (
            <div className="muted">Cargando cartera...</div>
          )}
        </section>
      </main>
    </div>
  )
}
