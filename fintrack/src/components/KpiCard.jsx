import React from 'react'

export default function KpiCard({ title, value, small, icon }){
  return (
    <div className={`kpi-card ${small? 'small':''}`}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:44,height:44,display:'grid',placeItems:'center',borderRadius:10,background:'rgba(255,255,255,0.6)'}}>
          {icon ? icon : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#07303a" strokeOpacity="0.12"/></svg>}
        </div>
        <div>
          <div className="kpi-title">{title}</div>
          <div className="kpi-value">{value}</div>
        </div>
      </div>
    </div>
  )
}
