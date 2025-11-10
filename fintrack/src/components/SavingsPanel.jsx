import React from 'react'

export default function SavingsPanel({ savings }) {
  if (!savings) return null

  const {
    totalSavings = 0,
    availableSavings = 0,
    nextDepositDate,
    frequency,
    goals = []
  } = savings

  function getNextDepositText() {
    if (!nextDepositDate) return ''
    const date = new Date(nextDepositDate)
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long'
    })
  }

  function getFrequencyText() {
    const texts = {
      diario: 'día',
      semanal: 'semana',
      quincenal: '15 días',
      mensual: 'mes'
    }
    return texts[frequency] || 'periodo'
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#1a202c'
      }}>
        Ahorro
      </h2>

      {/* Resumen de ahorro */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '8px',
          padding: '16px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Ahorro disponible</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${availableSavings.toFixed(2)}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '8px',
          padding: '16px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Ahorro total</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalSavings.toFixed(2)}</div>
        </div>
      </div>

      {/* Próximo depósito */}
      {nextDepositDate && (
        <div style={{
          background: '#f7f8fa',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4a5568',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '20px' }}>📅</span>
            <span>Próximo depósito automático</span>
          </div>
          <div style={{
            color: '#1a202c',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {getNextDepositText()}
          </div>
        </div>
      )}

      {/* Metas de ahorro */}
      {goals.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#4a5568',
            marginBottom: '12px'
          }}>
            Metas de ahorro
          </h3>
          
          {goals.map(goal => (
            <div
              key={goal.id}
              style={{
                background: '#f7f8fa',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: '600', color: '#2d3748' }}>
                  {goal.title}
                </span>
                <span style={{
                  background: '#e2e8f0',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#4a5568'
                }}>
                  ${goal.monthlyAllocation}/{getFrequencyText()}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#718096'
              }}>
                <span>Meta: ${goal.targetAmount}</span>
                <span>Ahorrado: ${goal.savedAmount}</span>
              </div>

              {/* Barra de progreso */}
              <div style={{
                width: '100%',
                height: '6px',
                background: '#e2e8f0',
                borderRadius: '3px',
                marginTop: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(goal.savedAmount / goal.targetAmount) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}