import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchStats } from '../api'

export default function StatsPage(){
  const [stats, setStats] = useState(null)
  useEffect(()=>{ fetchStats().then(setStats).catch(()=>{}) }, [])

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar"><h1>Estadísticas</h1></header>
        <section className="card">
          <h3>Mensual</h3>
          <ul>
            {stats?.monthly?.map((m,i)=> <li key={i}>{m.month}: Ingresos ${m.income} — Gastos ${m.expenses}</li>)}
          </ul>
        </section>
        <section className="card">
          <h3>Por categoría</h3>
          <ul>
            {stats?.byCategory?.map((c,i)=> <li key={i}>{c.category}: ${c.amount}</li>)}
          </ul>
        </section>
      </main>
    </div>
  )
}
