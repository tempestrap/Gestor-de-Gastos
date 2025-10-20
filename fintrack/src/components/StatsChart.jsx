import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels)

export default function StatsChart({ monthly = [] }){
  const labels = monthly.map(m => m.month)
  const income = monthly.map(m=>m.income)
  const expenses = monthly.map(m=>m.expenses)
  const totalPerMonth = monthly.map((m,i) => (income[i] || 0) + (expenses[i] || 0))
  const data = {
    labels,
    datasets: [
      { label: 'Ingresos', backgroundColor: '#8ec7b6', data: income, datalabels: { color: '#083c2d' } },
      { label: 'Gastos', backgroundColor: '#f7b267', data: expenses, datalabels: { color: '#5a2d00' } }
    ]
  }

  const options = {
    plugins: {
      datalabels: {
        display: (ctx) => {
          // show percentage only when total > 0
          const total = totalPerMonth[ctx.dataIndex] || 0
          return total > 0
        },
        formatter: (value, ctx) => {
          const total = totalPerMonth[ctx.dataIndex] || 0
          if (!total) return ''
          const pct = Math.round((value / total) * 100)
          const nf = new Intl.NumberFormat('es-ES')
          return `${nf.format(value)} · ${pct}%`
        },
        anchor: 'end',
        align: 'end',
        font: { weight: 700, size: 11 }
      }
    },
    interaction: { mode: 'index', intersect: false },
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <div className="card stats-chart" style={{height:260}}>
      <h3>Ingresos vs Gastos</h3>
      <Bar data={data} options={options} />
    </div>
  )
}
