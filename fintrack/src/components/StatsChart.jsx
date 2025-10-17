import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function StatsChart({ monthly = [] }){
  const labels = monthly.map(m => m.month)
  const data = {
    labels,
    datasets: [
      { label: 'Ingresos', backgroundColor: '#8ec7b6', data: monthly.map(m=>m.income) },
      { label: 'Gastos', backgroundColor: '#f7b267', data: monthly.map(m=>m.expenses) }
    ]
  }
  return (
    <div className="card stats-chart">
      <h3>Ingresos vs Gastos</h3>
      <Bar data={data} />
    </div>
  )
}
