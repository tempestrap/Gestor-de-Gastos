import React, { useState, useMemo } from 'react'

export default function SavingsCalculator(){
  const [monthly, setMonthly] = useState('')
  const [months, setMonths] = useState('')
  const [initialAmount, setInitialAmount] = useState('')
  
  const projection = useMemo(() => {
    const monthlyNum = Number(monthly) || 0
    const monthsNum = Number(months) || 0
    const initialNum = Number(initialAmount) || 0
    
    if (!monthlyNum || !monthsNum) return null
    
    const total = initialNum + (monthlyNum * monthsNum)
    const timeline = Array.from({length: monthsNum}, (_, i) => ({
      month: i + 1,
      amount: initialNum + (monthlyNum * (i + 1))
    }))
    
    return { total, timeline }
  }, [monthly, months, initialAmount])

  return (
    <div>
      <h2 style={{marginBottom: 16, fontSize: 20}}>Calculadora de ahorro</h2>
      <div style={{marginBottom:16}}>
        <form className="form-row" style={{gap:8}}>
          <input
            type="number"
            className="small"
            placeholder="Ahorro mensual"
            value={monthly}
            onChange={e => setMonthly(e.target.value)}
          />
          <input
            type="number"
            className="small"
            placeholder="Meses"
            value={months}
            onChange={e => setMonths(e.target.value)}
          />
          <input
            type="number"
            className="small"
            placeholder="Monto inicial"
            value={initialAmount}
            onChange={e => setInitialAmount(e.target.value)}
          />
        </form>
      </div>

      {projection && (
        <div className="card" style={{marginTop: 16}}>
          <div style={{marginBottom:12}}>
            <div className="muted">Total proyectado</div>
            <div style={{fontSize:24,fontWeight:800}}>${projection.total.toLocaleString()}</div>
          </div>

          <div className="timeline" style={{fontSize:13}}>
            {projection.timeline.filter((_, i) => i % 3 === 2).map(point => (
              <div key={point.month} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <div className="muted">Mes {point.month}</div>
                <div style={{fontWeight:600}}>${point.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}