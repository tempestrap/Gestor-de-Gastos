import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import { useAuth } from '../AuthContext'
import { FiTrendingUp, FiTarget, FiCalendar, FiDollarSign } from 'react-icons/fi'

export default function ProjectionsPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [savingsGoal, setSavingsGoal] = useState(1000)
  const [months, setMonths] = useState(6)

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

  // Calcular estadísticas
  const movements = data?.recent || []
  const incomesFromMov = movements.reduce((s, m) => m.amount > 0 ? s + Number(m.amount) : s, 0)
  const expensesFromMov = movements.reduce((s, m) => m.amount < 0 ? s + Math.abs(Number(m.amount)) : s, 0)
  const initialIncome = Number(user?.onboarding?.incomeAmount ?? user?.onboarding?.initialBudget ?? 0)
  const totalIngresos = initialIncome + incomesFromMov
  const totalGastos = expensesFromMov
  const disponible = totalIngresos - totalGastos

  // Calcular promedios mensuales
  const monthsWithData = Math.max(1, new Set(movements.map(m => {
    const date = new Date(m.date)
    return `${date.getFullYear()}-${date.getMonth()}`
  })).size)

  const avgIngresosMensual = totalIngresos / monthsWithData
  const avgGastosMensual = totalGastos / monthsWithData
  const avgAhorroMensual = avgIngresosMensual - avgGastosMensual

  // Proyección futura
  const proyeccionMeses = Array.from({ length: parseInt(months) + 1 }).map((_, i) => {
    const saldoProyectado = disponible + (avgAhorroMensual * i)
    return {
      mes: i,
      saldo: saldoProyectado,
      ingresos: avgIngresosMensual * i,
      gastos: avgGastosMensual * i
    }
  })

  // ¿Cuánto tiempo para alcanzar objetivo?
  const mesesParaObjetivo = avgAhorroMensual > 0 
    ? Math.ceil((savingsGoal - disponible) / avgAhorroMensual)
    : null

  // Simulador: ¿cuánto necesito ahorrar mensualmente?
  const ahorroMensualNecesario = savingsGoal > disponible
    ? (savingsGoal - disponible) / months
    : 0

  const getMonthName = (monthOffset) => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar">
          <h1>🔮 Proyecciones Financieras</h1>
          <div className="subtitle">Simula tu futuro financiero basado en tu comportamiento actual</div>
        </header>

        {/* Estadísticas actuales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FiDollarSign size={24} />
              <span style={{ fontSize: '14px', opacity: 0.9 }}>Disponible Actual</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>${disponible.toFixed(2)}</div>
          </div>

          <div className="card" style={{ padding: '20px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FiTrendingUp size={24} />
              <span style={{ fontSize: '14px', opacity: 0.9 }}>Ahorro Promedio Mensual</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>
              ${avgAhorroMensual > 0 ? '+' : ''}{avgAhorroMensual.toFixed(2)}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>
              Ingresos: ${avgIngresosMensual.toFixed(0)} | Gastos: ${avgGastosMensual.toFixed(0)}
            </div>
          </div>

          <div className="card" style={{ padding: '20px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <FiCalendar size={24} />
              <span style={{ fontSize: '14px', opacity: 0.9 }}>Meses Analizados</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{monthsWithData}</div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>
              Total movimientos: {movements.length}
            </div>
          </div>
        </div>

        {/* Proyección a futuro */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">📈 Proyección: ¿Cuánto tendré en el futuro?</div>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Ver proyección para los próximos:
              </label>
              <input 
                type="range"
                min="1"
                max="24"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                <span>1 mes</span>
                <span style={{ fontWeight: '700', fontSize: '16px', color: '#4A90E2' }}>{months} meses</span>
                <span>24 meses</span>
              </div>
            </div>

            {avgAhorroMensual > 0 ? (
              <>
                <div style={{ 
                  padding: '16px', 
                  background: '#e8f5e9', 
                  borderRadius: '10px', 
                  marginBottom: '20px',
                  border: '2px solid #4caf50'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#2e7d32', marginBottom: '8px' }}>
                    ✅ Proyección Positiva
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b5e20' }}>
                    En {months} meses tendrás: ${proyeccionMeses[proyeccionMeses.length - 1].saldo.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#2e7d32', marginTop: '8px' }}>
                    Partiendo de ${disponible.toFixed(2)} y ahorrando ${avgAhorroMensual.toFixed(2)}/mes
                  </div>
                </div>

                {/* Gráfico visual */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '12px' }}>Evolución proyectada mes a mes:</div>
                  {proyeccionMeses.map((p, idx) => {
                    const percentage = Math.min(100, (p.saldo / (proyeccionMeses[proyeccionMeses.length - 1].saldo || 1)) * 100)
                    return (
                      <div key={idx} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                          <span style={{ fontWeight: '600' }}>
                            {idx === 0 ? 'Hoy' : `Mes ${idx} (${getMonthName(idx)})`}
                          </span>
                          <span style={{ fontWeight: '700', color: '#4A90E2' }}>
                            ${p.saldo.toFixed(2)}
                          </span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '12px', 
                          background: '#e0e0e0', 
                          borderRadius: '6px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #4A90E2, #357ABD)',
                            borderRadius: '6px',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div style={{ 
                padding: '16px', 
                background: '#ffebee', 
                borderRadius: '10px',
                border: '2px solid #f44336'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#c62828', marginBottom: '8px' }}>
                  ⚠️ Proyección Negativa
                </div>
                <div style={{ fontSize: '14px', color: '#c62828' }}>
                  Actualmente gastas más de lo que ingresas. Tu saldo disminuirá ${Math.abs(avgAhorroMensual).toFixed(2)} por mes.
                  <br />En {months} meses tendrías: ${proyeccionMeses[proyeccionMeses.length - 1].saldo.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simulador de objetivos */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">🎯 Simulador: ¿Cuándo alcanzaré mi objetivo?</div>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Quiero ahorrar:
              </label>
              <input 
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  border: '2px solid #4A90E2'
                }}
                placeholder="Ej: 5000"
              />
            </div>

            {savingsGoal > disponible ? (
              <>
                {mesesParaObjetivo !== null && avgAhorroMensual > 0 ? (
                  <div style={{ 
                    padding: '20px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    borderRadius: '12px',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <FiTarget size={32} />
                      <div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Alcanzarás tu objetivo en:</div>
                        <div style={{ fontSize: '36px', fontWeight: '700' }}>{mesesParaObjetivo} meses</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      Te faltan ${(savingsGoal - disponible).toFixed(2)} y ahorras ${avgAhorroMensual.toFixed(2)}/mes
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '8px' }}>
                      Fecha estimada: {new Date(new Date().setMonth(new Date().getMonth() + mesesParaObjetivo)).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    padding: '20px', 
                    background: '#fff3e0', 
                    borderRadius: '12px',
                    border: '2px solid #ff9800'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#e65100', marginBottom: '8px' }}>
                      ⚠️ No podrás alcanzar este objetivo
                    </div>
                    <div style={{ fontSize: '14px', color: '#e65100' }}>
                      Con tu ritmo de ahorro actual (${avgAhorroMensual.toFixed(2)}/mes), no alcanzarás los ${savingsGoal.toFixed(2)}.
                      Necesitas aumentar tus ingresos o reducir tus gastos.
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ 
                padding: '20px', 
                background: '#e8f5e9', 
                borderRadius: '12px',
                border: '2px solid #4caf50'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#2e7d32', marginBottom: '8px' }}>
                  🎉 ¡Ya alcanzaste tu objetivo!
                </div>
                <div style={{ fontSize: '14px', color: '#2e7d32' }}>
                  Tu saldo actual (${disponible.toFixed(2)}) ya supera tu objetivo de ${savingsGoal.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ¿Cuánto debo ahorrar? */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">💰 ¿Cuánto debo ahorrar mensualmente?</div>
          </div>
          <div style={{ padding: '20px' }}>
            {ahorroMensualNecesario > 0 ? (
              <>
                <div style={{ 
                  padding: '20px', 
                  background: '#e3f2fd', 
                  borderRadius: '12px',
                  border: '2px solid #2196f3',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1565c0', marginBottom: '12px' }}>
                    Para alcanzar ${savingsGoal.toFixed(2)} en {months} meses:
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#0d47a1' }}>
                    Necesitas ahorrar ${ahorroMensualNecesario.toFixed(2)}/mes
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Tu ahorro actual</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>${avgAhorroMensual.toFixed(2)}/mes</div>
                  </div>
                  <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Diferencia</div>
                    <div style={{ 
                      fontSize: '22px', 
                      fontWeight: '700',
                      color: (ahorroMensualNecesario - avgAhorroMensual) > 0 ? '#dc3545' : '#28a745'
                    }}>
                      {(ahorroMensualNecesario - avgAhorroMensual) > 0 ? '+' : ''}
                      ${(ahorroMensualNecesario - avgAhorroMensual).toFixed(2)}/mes
                    </div>
                  </div>
                </div>

                {(ahorroMensualNecesario - avgAhorroMensual) > 0 && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '12px', 
                    background: '#fff9c4', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    💡 <strong>Consejo:</strong> Necesitas reducir gastos o aumentar ingresos en ${(ahorroMensualNecesario - avgAhorroMensual).toFixed(2)}/mes
                  </div>
                )}
              </>
            ) : (
              <div style={{ 
                padding: '20px', 
                background: '#e8f5e9', 
                borderRadius: '12px',
                border: '2px solid #4caf50'
              }}>
                <div style={{ fontSize: '16px', color: '#2e7d32' }}>
                  ¡Tu ritmo de ahorro actual es suficiente para alcanzar tu objetivo!
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
