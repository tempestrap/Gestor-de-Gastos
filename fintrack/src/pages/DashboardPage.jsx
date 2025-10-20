import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import KpiCard from '../components/KpiCard'
import WalletPanel from '../components/WalletPanel'
import Movements from '../components/Movements'
import StatsChart from '../components/StatsChart'
import { useAuth } from "../AuthContext";
import Logo from '../assets/logo.svg'


export default function DashboardPage() {
  const [data, setData] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchDashboard(user.id).then(setData).catch(console.error)
    }
  }, [user])


  const wallets = [
    { category: 'Vivienda', amount: 2000 },
    { category: 'Compras', amount: 600 },
    { category: 'Cine', amount: 450 }
  ]

  return (
    <div className="app">
      <Sidebar />

      <main>
        <header className="topbar" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <img src={Logo} alt="Fintrack" style={{width:56,height:56}} />
            <div>
              <h1 style={{margin:0,fontSize:24,fontWeight:800}}>Bienvenido {user?.name ?? 'Usuario'}</h1>
              <div className="muted">Resumen de tu actividad</div>
            </div>
          </div>
        </header>

        <section className="dashboard-grid">
          <div className="left">
            <div className="kpi-row">
              <KpiCard title="Ingresos" value={`$${data?.balances?.current ?? 0}`} />
              <KpiCard title="Gastos" value={`$${(data?.balances?.current ?? 0) - (data?.balances?.available ?? 0)}`} />
              <KpiCard title="Disponible" value={`$${data?.balances?.available ?? 0}`} small />
            </div>

            <div className="card subtle">
              <StatsChart monthly={data?.statistics?.monthly} />
            </div>

            <div className="card">
              <h2 style={{marginTop:0}}>Movimientos recientes</h2>
              <Movements items={data?.recent} />
            </div>
          </div>

          <aside className="right">
            <div className="card">
              <WalletPanel balances={data?.balances} wallets={wallets} />
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
