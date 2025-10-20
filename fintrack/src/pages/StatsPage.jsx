import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchStats } from '../api'
import { useAuth } from '../AuthContext'

export default function StatsPage(){
  const [stats, setStats] = useState(null)
  const { user } = useAuth()
  useEffect(()=>{
    let mounted = true
    async function load(){
      if (user?.id) {
        const d = await fetchStats(user.id).catch(()=>({}))
        if (mounted) setStats(d.stats)
      } else setStats(null)
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
        <header className="topbar"><h1>Estadísticas</h1></header>
        <section className="card">
          <h3>Mensual</h3>
          {stats?.monthly?.length ? (
            <ul>
              {stats.monthly.map((m,i)=> <li key={i}>{m.month}: Ingresos ${m.income} — Gastos ${m.expenses}</li>)}
            </ul>
          ) : <div className="muted">No hay datos mensuales disponibles.</div>}
        </section>
        <section className="card">
          <h3>Por categoría</h3>
          {stats?.byCategory?.length ? (
            <ul>
              {stats.byCategory.map((c,i)=> <li key={i}>{c.category}: ${c.amount}</li>)}
            </ul>
          ) : <div className="muted">No hay datos por categoría.</div>}
        </section>
      </main>
    </div>
  )
}
