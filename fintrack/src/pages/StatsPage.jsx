import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import { useAuth } from '../AuthContext'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement, ChartDataLabels)

export default function StatsPage(){
  const [monthly, setMonthly] = useState([])
  const [byCategory, setByCategory] = useState([])
  const { user } = useAuth()

  useEffect(()=>{
    let mounted = true
    async function load(){
      if (!user?.id) { setMonthly([]); setByCategory([]); return }
      const d = await fetchDashboard(user.id).catch(()=>({ recent: [] }))
      const recent = d.recent || []

      // aggregate by month YYYY-MM
      const byMonth = {}
      recent.forEach(m => {
        const dt = new Date(m.date)
        const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`
        if (!byMonth[key]) byMonth[key] = { month: key, income: 0, expenses: 0 }
        if (m.amount > 0) byMonth[key].income += Number(m.amount)
        else byMonth[key].expenses += Math.abs(Number(m.amount))
      })
      const monthlyArr = Object.values(byMonth).sort((a,b)=> a.month.localeCompare(b.month))

      // aggregate by category
      const byCat = {}
      recent.forEach(m => {
        const cat = m.category || 'Otros'
        byCat[cat] = (byCat[cat] || 0) + Math.abs(Number(m.amount))
      })
      const byCategoryArr = Object.keys(byCat).map(k=> ({ category: k, amount: byCat[k] }))

      if (mounted) {
        setMonthly(monthlyArr)
        setByCategory(byCategoryArr)
      }
    }
    load()
    const onData = ()=> load()
    window.addEventListener('dataUpdated', onData)
    return ()=>{ mounted = false; window.removeEventListener('dataUpdated', onData) }
  }, [user])

  const barData = {
    labels: monthly.map(m => m.month),
    datasets: [
      { label: 'Ingresos', backgroundColor: '#8ec7b6', data: monthly.map(m=>m.income) },
      { label: 'Gastos', backgroundColor: '#f7b267', data: monthly.map(m=>m.expenses) }
    ]
  }

    const pieData = {
    labels: byCategory.map(c=>c.category),
    datasets: [{ data: byCategory.map(c=>c.amount), backgroundColor: ['#8ec7b6','#f7b267','#cbb4ff','#ffd486','#fbc2eb','#9be7c4'] }]
  }

  return (
    <div className="app stats-page">
      <Sidebar />
      <main>
        <header className="topbar"><h1>Estadísticas</h1></header>
        <section className="card stats-graph">
          <div style={{flex:1}}>
            <h3>Ingresos vs Gastos</h3>
            {monthly.length ? <Bar data={barData} options={{ plugins:{ legend:{ position:'bottom' }, datalabels: { display:false } } }} /> : <div className="muted">No hay datos mensuales disponibles.</div>}
          </div>
          <div style={{width:360}}>
            <h3>Por categoría</h3>
            {byCategory.length ? <Pie data={pieData} options={{ plugins: { datalabels: { color:'#fff', formatter: (value, ctx) => {
                      const sum = ctx.chart.data.datasets[0].data.reduce((a,b)=>a+b,0)
                      const pct = sum? Math.round((value/sum)*100) : 0
                      return `${pct}%`
                    } } } }} /> : <div className="muted">No hay datos por categoría.</div>}
          </div>
        </section>

        <section className="card" style={{marginTop:18}}>
          <h3>Categorías de gasto</h3>
          {byCategory.length ? (
            <div style={{display:'grid',gap:10}}>
              {byCategory.map((c,i)=> (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{width:12,height:12,borderRadius:6,background:['#8ec7b6','#f7b267','#cbb4ff','#ffd486','#fbc2eb','#9be7c4'][i%6]}} />
                    <div>{c.category}</div>
                  </div>
                  <div style={{fontWeight:700}}>${c.amount}</div>
                </div>
              ))}
            </div>
          ) : <div className="muted">No hay categorías registradas.</div>}
        </section>
      </main>
    </div>
  )
}
