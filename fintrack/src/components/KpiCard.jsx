import React from 'react'

export default function KpiCard({title, value, small}){
  return (
    <div className={`kpi-card ${small? 'small':''}`}>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  )
}
