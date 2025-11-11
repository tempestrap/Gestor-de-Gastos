import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchDashboard } from '../api'
import { useAuth } from '../AuthContext'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function CalendarPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

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

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  // Agrupar movimientos por día
  const getMovementsByDay = () => {
    const movements = data?.recent || []
    const byDay = {}

    movements.forEach(m => {
      const date = new Date(m.date)
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      if (!byDay[dayKey]) {
        byDay[dayKey] = { ingresos: 0, gastos: 0, movements: [] }
      }
      byDay[dayKey].movements.push(m)
      if (m.amount > 0) {
        byDay[dayKey].ingresos += Number(m.amount)
      } else {
        byDay[dayKey].gastos += Math.abs(Number(m.amount))
      }
    })

    return byDay
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
  const byDay = getMovementsByDay()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDay(null)
  }

  const getDayData = (day) => {
    const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return byDay[dayKey] || { ingresos: 0, gastos: 0, movements: [] }
  }

  const getDayIntensity = (day) => {
    const dayData = getDayData(day)
    const total = dayData.gastos
    if (total === 0) return 'none'
    if (total < 100) return 'low'
    if (total < 500) return 'medium'
    return 'high'
  }

  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const selectedDayData = selectedDay ? getDayData(selectedDay) : null

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar">
          <h1>📅 Calendario de Gastos</h1>
          <div className="subtitle">Visualiza tus gastos día a día</div>
        </header>

        <div className="card">
          {/* Navegación del mes */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '20px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <button 
              onClick={prevMonth}
              style={{
                background: 'none',
                border: '2px solid #4A90E2',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#4A90E2',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#4A90E2'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none'
                e.target.style.color = '#4A90E2'
              }}
            >
              <FiChevronLeft /> Anterior
            </button>

            <h2 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700',
              textTransform: 'capitalize'
            }}>
              {monthName}
            </h2>

            <button 
              onClick={nextMonth}
              style={{
                background: 'none',
                border: '2px solid #4A90E2',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#4A90E2',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#4A90E2'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none'
                e.target.style.color = '#4A90E2'
              }}
            >
              Siguiente <FiChevronRight />
            </button>
          </div>

          {/* Leyenda */}
          <div style={{ padding: '16px 20px', background: '#f8f9fa', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Intensidad de gastos:</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '20px', height: '20px', background: '#e8f5e9', borderRadius: '4px', border: '1px solid #a5d6a7' }}></div>
                <span style={{ fontSize: '13px' }}>Sin gastos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '20px', height: '20px', background: '#fff9c4', borderRadius: '4px', border: '1px solid #fff176' }}></div>
                <span style={{ fontSize: '13px' }}>Bajo (&lt;$100)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '20px', height: '20px', background: '#ffccbc', borderRadius: '4px', border: '1px solid #ff8a65' }}></div>
                <span style={{ fontSize: '13px' }}>Medio ($100-$500)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '20px', height: '20px', background: '#ffcdd2', borderRadius: '4px', border: '1px solid #ef5350' }}></div>
                <span style={{ fontSize: '13px' }}>Alto (&gt;$500)</span>
              </div>
            </div>
          </div>

          {/* Calendario */}
          <div style={{ padding: '20px' }}>
            {/* Días de la semana */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '8px',
              marginBottom: '8px'
            }}>
              {weekDays.map(day => (
                <div key={day} style={{ 
                  textAlign: 'center', 
                  fontWeight: '700', 
                  fontSize: '14px',
                  color: '#666',
                  padding: '8px'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '8px'
            }}>
              {/* Espacios vacíos antes del primer día */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} style={{ aspectRatio: '1', padding: '8px' }}></div>
              ))}

              {/* Días del mes */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayData = getDayData(day)
                const intensity = getDayIntensity(day)
                const isSelected = selectedDay === day
                const hasMovements = dayData.movements.length > 0

                const bgColors = {
                  none: '#e8f5e9',
                  low: '#fff9c4',
                  medium: '#ffccbc',
                  high: '#ffcdd2'
                }

                const borderColors = {
                  none: '#a5d6a7',
                  low: '#fff176',
                  medium: '#ff8a65',
                  high: '#ef5350'
                }

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      aspectRatio: '1',
                      padding: '8px',
                      background: isSelected ? '#4A90E2' : bgColors[intensity],
                      border: `2px solid ${isSelected ? '#2E5F8F' : borderColors[intensity]}`,
                      borderRadius: '10px',
                      cursor: hasMovements ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (hasMovements) e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    <div style={{ 
                      fontWeight: '700', 
                      fontSize: '18px',
                      color: isSelected ? 'white' : '#333'
                    }}>
                      {day}
                    </div>
                    {hasMovements && (
                      <>
                        <div style={{ 
                          fontSize: '10px', 
                          color: isSelected ? 'white' : '#666',
                          marginTop: '2px'
                        }}>
                          {dayData.movements.length} mov
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          fontWeight: '700',
                          color: isSelected ? 'white' : '#dc3545',
                          marginTop: '2px'
                        }}>
                          ${dayData.gastos.toFixed(0)}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Detalle del día seleccionado */}
        {selectedDay && selectedDayData && selectedDayData.movements.length > 0 && (
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <div className="card-title">
                Movimientos del {selectedDay} de {monthName}
              </div>
              <button 
                onClick={() => setSelectedDay(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Ingresos del día</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#28a745' }}>
                    ${selectedDayData.ingresos.toFixed(2)}
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#ffebee', borderRadius: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Gastos del día</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>
                    ${selectedDayData.gastos.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedDayData.movements.map((m, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '16px',
                      background: m.amount > 0 ? '#e8f5e9' : '#fff3e0',
                      borderLeft: `4px solid ${m.amount > 0 ? '#28a745' : '#ff9800'}`,
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                        {m.title}
                      </div>
                      {m.category && (
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          Categoría: {m.category}
                        </div>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: '700',
                      color: m.amount > 0 ? '#28a745' : '#dc3545'
                    }}>
                      {m.amount > 0 ? '+' : ''}${m.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
