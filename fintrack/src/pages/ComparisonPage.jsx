import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import { useAuth } from '../AuthContext'
import { FiTrendingUp, FiTrendingDown, FiArrowRight } from 'react-icons/fi'

export default function ComparisonPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (user?.id) {
        const d = await fetchDashboard(user.id).catch(() => null)
        if (mounted) setData(d)
      } else setData(null)
    }
    load()
    const onData = () => load()
    window.addEventListener('dataUpdated', onData)
    return () => { mounted = false; window.removeEventListener('dataUpdated', onData) }
  }, [user])

  // Agrupar movimientos por mes
  const getMovementsByMonth = () => {
    const movements = data?.recent || []
    const byMonth = {}

    movements.forEach(m => {
      const date = new Date(m.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!byMonth[monthKey]) {
        byMonth[monthKey] = { ingresos: 0, gastos: 0, movements: [] }
      }
      byMonth[monthKey].movements.push(m)
      if (m.amount > 0) {
        byMonth[monthKey].ingresos += Number(m.amount)
      } else {
        byMonth[monthKey].gastos += Math.abs(Number(m.amount))
      }
    })

    return byMonth
  }

  // Agrupar por categoría
  const getByCategory = (movements) => {
    const byCategory = {}
    movements.forEach(m => {
      if (m.amount < 0 && m.category) {
        if (!byCategory[m.category]) byCategory[m.category] = 0
        byCategory[m.category] += Math.abs(Number(m.amount))
      }
    })
    return byCategory
  }

  const byMonth = getMovementsByMonth()
  const monthKeys = Object.keys(byMonth).sort().reverse()
  const currentMonth = monthKeys[0]
  const previousMonth = monthKeys[1]

  const currentData = byMonth[currentMonth] || { ingresos: 0, gastos: 0, movements: [] }
  const previousData = byMonth[previousMonth] || { ingresos: 0, gastos: 0, movements: [] }

  const currentCategories = getByCategory(currentData.movements)
  const previousCategories = getByCategory(previousData.movements)

  const gastosChange = previousData.gastos > 0 
    ? ((currentData.gastos - previousData.gastos) / previousData.gastos) * 100 
    : 0

  const ingresosChange = previousData.ingresos > 0
    ? ((currentData.ingresos - previousData.ingresos) / previousData.ingresos) * 100
    : 0

  const formatMonth = (key) => {
    if (!key) return 'N/A'
    const [year, month] = key.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar">
          <h1>📊 Comparación Mensual</h1>
          <div className="subtitle">Compara tu actividad financiera mes a mes</div>
        </header>

        {/* Comparación general */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Mes actual */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', opacity: 0.9 }}>
              Mes Actual
            </h3>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              {formatMonth(currentMonth)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Ingresos</div>
                <div style={{ fontSize: '22px', fontWeight: '700' }}>${currentData.ingresos.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Gastos</div>
                <div style={{ fontSize: '22px', fontWeight: '700' }}>${currentData.gastos.toFixed(2)}</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Balance</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>
                ${(currentData.ingresos - currentData.gastos).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Mes anterior */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', opacity: 0.9 }}>
              Mes Anterior
            </h3>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              {formatMonth(previousMonth)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Ingresos</div>
                <div style={{ fontSize: '22px', fontWeight: '700' }}>${previousData.ingresos.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Gastos</div>
                <div style={{ fontSize: '22px', fontWeight: '700' }}>${previousData.gastos.toFixed(2)}</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Balance</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>
                ${(previousData.ingresos - previousData.gastos).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Variación */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', opacity: 0.9 }}>
              Cambio
            </h3>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Variación %
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Ingresos</div>
                <div style={{ fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {ingresosChange > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  {ingresosChange > 0 ? '+' : ''}{ingresosChange.toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Gastos</div>
                <div style={{ fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {gastosChange > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  {gastosChange > 0 ? '+' : ''}{gastosChange.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparación por categorías */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Comparación por Categorías</div>
          </div>
          <div style={{ padding: '20px' }}>
            {Object.keys({ ...currentCategories, ...previousCategories }).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.keys({ ...currentCategories, ...previousCategories })
                  .sort((a, b) => (currentCategories[b] || 0) - (currentCategories[a] || 0))
                  .map(category => {
                    const current = currentCategories[category] || 0
                    const previous = previousCategories[category] || 0
                    const change = previous > 0 ? ((current - previous) / previous) * 100 : (current > 0 ? 100 : 0)
                    const maxValue = Math.max(current, previous)

                    return (
                      <div key={category} style={{ padding: '16px', background: '#f8f9fa', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div style={{ fontWeight: '700', fontSize: '16px' }}>{category}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: change > 0 ? '#dc3545' : '#28a745', fontWeight: '600' }}>
                              {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Mes anterior</div>
                            <div style={{ fontWeight: '700', fontSize: '18px' }}>${previous.toFixed(2)}</div>
                            <div style={{ 
                              height: '8px', 
                              background: '#f093fb', 
                              borderRadius: '4px', 
                              width: `${maxValue > 0 ? (previous / maxValue) * 100 : 0}%`,
                              marginTop: '8px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>

                          <FiArrowRight size={20} color="#999" />

                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Mes actual</div>
                            <div style={{ fontWeight: '700', fontSize: '18px' }}>${current.toFixed(2)}</div>
                            <div style={{ 
                              height: '8px', 
                              background: '#667eea', 
                              borderRadius: '4px', 
                              width: `${maxValue > 0 ? (current / maxValue) * 100 : 0}%`,
                              marginTop: '8px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="empty-state">No hay datos suficientes para comparar</div>
            )}
          </div>
        </div>

        {/* Histórico de todos los meses */}
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <div className="card-title">Histórico Mensual</div>
          </div>
          <div style={{ padding: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Mes</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '700' }}>Ingresos</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '700' }}>Gastos</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '700' }}>Balance</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '700' }}>Movimientos</th>
                </tr>
              </thead>
              <tbody>
                {monthKeys.map(monthKey => {
                  const monthData = byMonth[monthKey]
                  const balance = monthData.ingresos - monthData.gastos
                  return (
                    <tr key={monthKey} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{formatMonth(monthKey)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#28a745' }}>
                        ${monthData.ingresos.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#dc3545' }}>
                        ${monthData.gastos.toFixed(2)}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'right', 
                        fontWeight: '700',
                        color: balance >= 0 ? '#28a745' : '#dc3545'
                      }}>
                        ${balance.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {monthData.movements.length}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
