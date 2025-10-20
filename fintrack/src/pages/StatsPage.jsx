import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchStats } from '../api'
import { useAuth } from '../AuthContext'

export default function StatsPage(){
  const [stats, setStats] = useState(null)
  const { user } = useAuth()
  useEffect(()=>{
    if (user?.id) fetchStats(user.id).then(d=>setStats(d.stats)).catch(()=>{})
    else setStats(null)
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
