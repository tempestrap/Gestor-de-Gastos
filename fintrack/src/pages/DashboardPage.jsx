import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import KpiCard from '../components/KpiCard'
import WalletPanel from '../components/WalletPanel'
import Movements from '../components/Movements'
import StatsChart from '../components/StatsChart'
import { useAuth } from "../AuthContext";


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
    <div className="flex min-h-screen bg-[#d9e2ec] font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Bienvenido xxxx!</h1>
          <img
            src="/logo.png"
            alt="Fintrack Logo"
            className="w-12 h-12 object-contain rounded-full shadow-md"
          />
        </header>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* KPI Row */}
            <div className="grid grid-cols-3 gap-4">
              <KpiCard title="Ingresos" value={`$${data?.balances?.current ?? 0}`} color="green" />
              <KpiCard
                title="Gastos"
                value={`$${(data?.balances?.current ?? 0) - (data?.balances?.available ?? 0)}`}
                color="red"
              />
              <KpiCard
                title="Disponible"
                value={`$${data?.balances?.available ?? 0}`}
                color="blue"
                small
              />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4">
              <StatsChart monthly={data?.statistics?.monthly} />
            </div>

            {/* Movements */}
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Movimientos recientes</h2>
              <Movements items={data?.recent} />
            </div>
          </div>

          {/* RIGHT SECTION - Wallet */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-4">
              <WalletPanel balances={data?.balances} wallets={wallets} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
