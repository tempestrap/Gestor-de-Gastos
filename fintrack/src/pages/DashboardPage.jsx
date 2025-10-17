import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import KpiCard from '../components/KpiCard'
import WalletPanel from '../components/WalletPanel'
import Movements from '../components/Movements'
import StatsChart from '../components/StatsChart'

export default function DashboardPage(){
  const [data, setData] = useState(null)

  useEffect(()=>{
    fetchDashboard().then(setData).catch(()=>{})
  }, [])

  const wallets = [
    { category: 'Vivienda', amount: 2000 },
    { category: 'Compras', amount: 600 },
    { category: 'Cine', amount: 450 }
  ]

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar"><h1>Dashboard</h1></header>
        <section className="dashboard-grid">
          <div className="left">
            <div className="kpi-row">
              <KpiCard title="Ingresos" value={`$${data?.balances?.current ?? 0}`} />
              <KpiCard title="Gastos" value={`$${(data?.balances?.current ?? 0) - (data?.balances?.available ?? 0)}`} />
              <KpiCard title="Disponible" value={`$${data?.balances?.available ?? 0}`} small />
            </div>
            <StatsChart monthly={data?.statistics?.monthly} />
            <Movements items={data?.recent} />
          </div>
          <div className="right">
            <WalletPanel balances={data?.balances} wallets={wallets} />
          </div>
        </section>
      </main>
    </div>
  )
}
