import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import { useAuth } from '../AuthContext'
import { FiTrendingUp, FiTrendingDown, FiTarget, FiAlertCircle, FiCheckCircle, FiDollarSign } from 'react-icons/fi'

export default function TipsPage() {
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

  // Calcular estadísticas
  const movements = data?.recent || []
  const incomesFromMov = movements.reduce((s, m) => m.amount > 0 ? s + Number(m.amount) : s, 0)
  const expensesFromMov = movements.reduce((s, m) => m.amount < 0 ? s + Math.abs(Number(m.amount)) : s, 0)
  const initialIncome = Number(user?.onboarding?.incomeAmount ?? user?.onboarding?.initialBudget ?? 0)
  const totalIngresos = initialIncome + incomesFromMov
  const totalGastos = expensesFromMov
  const disponible = totalIngresos - totalGastos
  const porcentajeGastado = totalIngresos > 0 ? (totalGastos / totalIngresos) * 100 : 0
  const porcentajeDisponible = totalIngresos > 0 ? (disponible / totalIngresos) * 100 : 0

  // Analizar presupuestos
  const budgets = data?.budgets || []
  const budgetsExcedidos = budgets.filter(b => (b.spent || 0) > b.limit)
  const budgetsCerca = budgets.filter(b => {
    const porcentaje = ((b.spent || 0) / b.limit) * 100
    return porcentaje >= 80 && porcentaje <= 100
  })

  // Generar consejos personalizados
  const generateTips = () => {
    const tips = []

    // Consejos basados en disponible
    if (porcentajeDisponible <= 10 && disponible > 0) {
      tips.push({
        type: 'warning',
        icon: <FiAlertCircle size={24} />,
        title: 'Dinero disponible muy bajo',
        description: `Solo te queda el ${porcentajeDisponible.toFixed(1)}% de tus ingresos ($${disponible.toFixed(2)}). Es momento de reducir gastos innecesarios y considerar fuentes adicionales de ingreso.`,
        category: 'Urgente'
      })
    } else if (disponible <= 0) {
      tips.push({
        type: 'danger',
        icon: <FiAlertCircle size={24} />,
        title: '¡Estás en números rojos!',
        description: `Tu disponible es de $${disponible.toFixed(2)}. Necesitas urgentemente agregar ingresos y dejar de hacer gastos no esenciales.`,
        category: 'Crítico'
      })
    }

    // Consejos sobre gastos altos
    if (porcentajeGastado >= 80) {
      tips.push({
        type: 'warning',
        icon: <FiTrendingDown size={24} />,
        title: 'Nivel de gastos muy alto',
        description: `Has gastado el ${porcentajeGastado.toFixed(1)}% de tus ingresos totales. Te recomendamos aplicar la regla 50/30/20: 50% necesidades, 30% deseos, 20% ahorros.`,
        category: 'Gastos'
      })
    }

    // Consejos sobre presupuestos excedidos
    if (budgetsExcedidos.length > 0) {
      tips.push({
        type: 'danger',
        icon: <FiTarget size={24} />,
        title: 'Presupuestos excedidos',
        description: `Has excedido ${budgetsExcedidos.length} presupuesto(s): ${budgetsExcedidos.map(b => b.category).join(', ')}. Revisa estos gastos y ajusta tus límites o reduce el consumo.`,
        category: 'Presupuestos'
      })
    }

    // Consejos sobre presupuestos cerca del límite
    if (budgetsCerca.length > 0) {
      tips.push({
        type: 'warning',
        icon: <FiTarget size={24} />,
        title: 'Presupuestos cerca del límite',
        description: `Estás cerca de alcanzar el límite en: ${budgetsCerca.map(b => b.category).join(', ')}. Controla estos gastos para no exceder tu presupuesto.`,
        category: 'Presupuestos'
      })
    }

    // Consejos positivos
    if (disponible > 0 && porcentajeDisponible > 30) {
      tips.push({
        type: 'success',
        icon: <FiCheckCircle size={24} />,
        title: '¡Buen manejo financiero!',
        description: `Te queda el ${porcentajeDisponible.toFixed(1)}% de tus ingresos disponibles. Considera destinar parte de este dinero a un fondo de emergencias o inversiones.`,
        category: 'Ahorro'
      })
    }

    // Consejos generales de finanzas
    tips.push({
      type: 'info',
      icon: <FiDollarSign size={24} />,
      title: 'Crea un fondo de emergencias',
      description: 'Expertos recomiendan tener ahorrado el equivalente a 3-6 meses de gastos para imprevistos. Empieza poco a poco destinando un porcentaje fijo de tus ingresos.',
      category: 'Ahorro'
    })

    tips.push({
      type: 'info',
      icon: <FiTrendingUp size={24} />,
      title: 'Diversifica tus ingresos',
      description: 'No dependas de una sola fuente de ingresos. Busca formas de generar ingresos pasivos o desarrolla una habilidad que puedas monetizar.',
      category: 'Ingresos'
    })

    tips.push({
      type: 'info',
      icon: <FiTrendingDown size={24} />,
      title: 'Reduce gastos hormiga',
      description: 'Pequeños gastos diarios como cafés, snacks o suscripciones que no usas pueden sumar cientos al mes. Revisa y elimina lo innecesario.',
      category: 'Gastos'
    })

    tips.push({
      type: 'info',
      icon: <FiTarget size={24} />,
      title: 'Establece metas claras',
      description: 'Define objetivos financieros específicos y medibles. Ya sea ahorrar para unas vacaciones, un auto o tu retiro, tener una meta te motiva a ser disciplinado.',
      category: 'Metas'
    })

    return tips
  }

  const tips = generateTips()

  // Función para obtener el color según el tipo
  const getTypeColor = (type) => {
    switch (type) {
      case 'danger': return { bg: '#fee', border: '#f88', text: '#c00' }
      case 'warning': return { bg: '#fff3cd', border: '#ffc107', text: '#856404' }
      case 'success': return { bg: '#d4edda', border: '#28a745', text: '#155724' }
      case 'info': return { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' }
      default: return { bg: '#e7f3ff', border: '#0b69ff', text: '#004085' }
    }
  }

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar">
          <h1>💡 Consejos y Recomendaciones</h1>
          <div className="subtitle">Tips personalizados según tu actividad financiera</div>
        </header>

        {/* Resumen rápido */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FiTrendingUp size={20} color="#28a745" />
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Ingresos Totales</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>${totalIngresos.toFixed(2)}</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FiTrendingDown size={20} color="#dc3545" />
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Gastos Totales</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>${totalGastos.toFixed(2)}</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              {porcentajeGastado.toFixed(1)}% de tus ingresos
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FiDollarSign size={20} color={disponible > 0 ? '#0b69ff' : '#dc3545'} />
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Disponible</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: disponible > 0 ? 'inherit' : '#dc3545' }}>
              ${disponible.toFixed(2)}
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              {porcentajeDisponible.toFixed(1)}% restante
            </div>
          </div>
        </div>

        {/* Lista de consejos */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recomendaciones para ti</div>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tips.map((tip, index) => {
              const colors = getTypeColor(tip.type)
              return (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    backgroundColor: colors.bg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '16px',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ flexShrink: 0, color: colors.text }}>
                    {tip.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: colors.text }}>
                        {tip.title}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: colors.border,
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {tip.category}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: colors.text, fontSize: '15px', lineHeight: '1.6' }}>
                      {tip.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
