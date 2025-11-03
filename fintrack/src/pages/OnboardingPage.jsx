import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { saveOnboarding } from '../api'

export default function OnboardingPage() {
  const { user, setUser } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    frequentCategories: [],
    incomeSource: '',
    incomeAmount: 0,
    incomeDate: '',
    incomeFrequency: 'mensual',
    savingsAmount: 0,
    savingsPercent: 0,
    goalAllocations: [],
    initialBudget: 0,
    budgetsByCategory: [],
    goals: [],
    notifications: { email: true, push: false, thresholds: { budgetPercent: 80 } }
  })

  // Función para obtener texto de frecuencia
  function getFrequencyText() {
    const texts = {
      diario: 'diario',
      semanal: 'semanal',
      quincenal: 'quincenal',
      mensual: 'mensual'
    }
    return texts[data.incomeFrequency] || 'mensual'
  }

  const categories = [
    { name: 'Alimentación', icon: '🍽️' },
    { name: 'Entretenimiento', icon: '🎬' },
    { name: 'Suscripciones', icon: '📱' },
    { name: 'Vacaciones', icon: '✈️' },
    { name: 'Transporte', icon: '🚗' },
    { name: 'Educación', icon: '🎓' },
    { name: 'Préstamos', icon: '💰' },
    { name: 'Inversión', icon: '📈' },
    { name: 'Vivienda', icon: '🏠' },
    { name: 'Pagos', icon: '💳' },
    { name: 'Ropa', icon: '👕' },
    { name: 'Salud', icon: '⚕️' }
  ]

  function toggleCategory(cat) {
    setData(prev => {
      const has = prev.frequentCategories.includes(cat)
      return {
        ...prev,
        frequentCategories: has
          ? prev.frequentCategories.filter(c => c !== cat)
          : [...prev.frequentCategories, cat]
      }
    })
  }

  async function finish() {
    try{
      const res = await saveOnboarding(user.id, data)
      if (res?.user) {
        setUser(prev => ({ ...prev, ...res.user }))
      }
      nav('/')
    }catch(err){
      console.error('Onboarding save failed', err)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #acc2eeff 0%, #aeccf3ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(74, 93, 128, 0.95)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '700px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(252, 247, 247, 0.98)'
      }}>
        {/* Indicador de progreso */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: s <= step ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  transition: 'all 0.3s ease',
                  boxShadow: s <= step ? '0 4px 15px rgba(255, 215, 0, 0.4)' : 'none'
                }}>
                  {s}
                </div>
                {s < 6 && (
                  <div style={{
                    flex: 1,
                    height: '4px',
                    background: s < step ? 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)' : '#e0e0e0',
                    margin: '0 10px',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Paso 1: Gastos frecuentes */}
        {step === 1 && (
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#f8f8faff'
            }}>GASTOS FRECUENTES</h1>
            <p style={{ color: '#f6f7f8ff', marginBottom: '30px' }}>
              Selecciona tus categorías de gasto más comunes
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: 'none',
                    background: data.frequentCategories.includes(cat.name)
                      ? 'linear-gradient(135deg, #5bc1dbff 0%, #3aed8bff 100%)'
                      : '#2d3748',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transform: data.frequentCategories.includes(cat.name) ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={data.frequentCategories.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: data.frequentCategories.length > 0
                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                  : '#cbd5e0',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: data.frequentCategories.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Paso 2: Ingresos */}
        {step === 2 && (
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#f6f7faff'
            }}>INGRESOS</h1>
            <p style={{ color: '#f2f4f7ff', marginBottom: '30px' }}>
              Cuéntanos sobre tu fuente de ingresos
            </p>

            <div style={{
              background: 'linear-gradient(135deg, #acc2eeff 0%, #aeccf3ff 100%)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '30px'
            }}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: 'black',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  Fuente principal de ingresos
                </label>
                <input
                  value={data.incomeSource}
                  onChange={e => setData({ ...data, incomeSource: e.target.value })}
                  placeholder="Ej.Salario"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.9)',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: 'black',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  Monto 
                </label>
                <input
                  type="number"
                  value={data.incomeAmount || ''}
                  onChange={e => setData({ ...data, incomeAmount: Number(e.target.value) })}
                  placeholder="Monto"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.9)',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: 'black',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  Frecuencia de ingreso
                </label>
                <select
                  value={data.incomeFrequency}
                  onChange={e => setData({ ...data, incomeFrequency: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.9)',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: 'black',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  Fecha de próximo ingreso
                </label>
                <input
                  type="date"
                  value={data.incomeDate}
                  onChange={e => setData({ ...data, incomeDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.9)',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: AHORRO */}
        {step === 3 && (
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#f8f8faff'
            }}>AHORRO</h1>
            <p style={{ color: '#f6f7f8ff', marginBottom: '30px' }}>
              Define cuánto de tus ingresos destinarás al ahorro
            </p>

            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <span style={{ fontSize: '40px' }}>💰</span>
                <div>
                  <div style={{ color: 'white', fontSize: '14px', opacity: 0.9 }}>
                    Ingreso {getFrequencyText()}
                  </div>
                  <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>
                    ${data.incomeAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: 'white',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  Porcentaje a ahorrar ({data.savingsPercent}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={data.savingsPercent}
                  onChange={e => {
                    const percent = Number(e.target.value)
                    const amount = (data.incomeAmount * percent) / 100
                    setData({ ...data, savingsPercent: percent, savingsAmount: amount })
                  }}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '5px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: 'white',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  O ingresa una cantidad exacta {getFrequencyText()}
                </label>
                <input
                  type="number"
                  min="0"
                  max={data.incomeAmount}
                  value={data.savingsAmount || ''}
                  onChange={e => {
                    const amount = Number(e.target.value)
                    const percent = data.incomeAmount > 0 ? (amount / data.incomeAmount) * 100 : 0
                    setData({ ...data, savingsAmount: amount, savingsPercent: Math.round(percent) })
                  }}
                  placeholder={`Cantidad a ahorrar ${getFrequencyText()}`}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.9)',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <span style={{ color: 'white', fontWeight: '600' }}>Ahorro {getFrequencyText()}:</span>
                  <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                    ${data.savingsAmount.toFixed(2)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: 'white', fontWeight: '600' }}>Disponible para gastos:</span>
                  <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                    ${(data.incomeAmount - data.savingsAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '30px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '24px' }}>💡</span>
                <span style={{ color: '#f8f8faff', fontWeight: '600', fontSize: '16px' }}>
                  Consejo financiero
                </span>
              </div>
              <p style={{ color: '#e5e7ebff', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Se recomienda ahorrar entre el 10% y 20% de tus ingresos. 
                En el siguiente paso podrás asignar parte de este ahorro a tus metas financieras.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(4)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Presupuesto */}
        {step === 4 && (
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#f8fafcff'
            }}>PRESUPUESTO INICIAL</h1>
            <p style={{ color: '#28292bff', marginBottom: '30px' }}>
              También puedes establecer límites por categoría
            </p>

            {/* Resumen de dinero disponible */}
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '25px',
              color: 'white'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>
                Dinero disponible para presupuesto
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                ${(data.incomeAmount - data.savingsAmount).toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
                (Ingresos: ${data.incomeAmount} - Ahorro: ${data.savingsAmount.toFixed(2)})
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#f7f8faff',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                Presupuesto total mensual
              </label>
              <input
                type="number"
                value={data.initialBudget || ''}
                onChange={e => {
                  const value = Number(e.target.value)
                  const maxBudget = data.incomeAmount - data.savingsAmount
                  if (value <= maxBudget) {
                    setData({ ...data, initialBudget: value })
                  }
                }}
                max={data.incomeAmount - data.savingsAmount}
                placeholder={`Máximo: ${(data.incomeAmount - data.savingsAmount).toFixed(2)}`}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {data.initialBudget > (data.incomeAmount - data.savingsAmount) && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '8px',
                  fontWeight: '600'
                }}>
                  ⚠️ El presupuesto no puede superar el dinero disponible
                </div>
              )}
            </div>

            <div style={{ marginBottom: '30px' }}>
              {data.frequentCategories.map((c, i) => {
                const currentBudget = data.budgetsByCategory[i]?.limit || 0
                const totalCategoryBudget = data.budgetsByCategory.reduce((sum, b) => sum + (b?.limit || 0), 0)
                const budgetLimit = data.initialBudget || (data.incomeAmount - data.savingsAmount)
                const maxForCategory = budgetLimit - totalCategoryBudget + currentBudget
                
                return (
                  <div key={c} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      minWidth: '150px',
                      fontWeight: '600',
                      color: '#f8fafcff'
                    }}>
                      {c}
                    </div>
                    <input
                      placeholder="Límite"
                      type="number"
                      value={data.budgetsByCategory[i]?.limit || ''}
                      onChange={e => {
                        const value = Number(e.target.value)
                        if (value <= maxForCategory) {
                          const copy = [...data.budgetsByCategory]
                          copy[i] = { category: c, limit: value, spent: 0 }
                          setData({ ...data, budgetsByCategory: copy })
                        }
                      }}
                      max={maxForCategory}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        fontSize: '16px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Indicador de presupuesto asignado */}
            {data.budgetsByCategory.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ color: '#e5e7ebff', fontSize: '14px', marginBottom: '8px' }}>
                  Presupuesto asignado por categorías:
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#f8f8faff', fontSize: '18px', fontWeight: 'bold' }}>
                    ${data.budgetsByCategory.reduce((sum, b) => sum + (b?.limit || 0), 0).toFixed(2)}
                  </span>
                  <span style={{ color: '#e5e7ebff', fontSize: '14px' }}>
                    / ${(data.initialBudget || (data.incomeAmount - data.savingsAmount)).toFixed(2)} del presupuesto
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(5)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 5: Objetivos */}
        {step === 5 && (
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#f9fafcff'
            }}>OBJETIVOS FINANCIEROS</h1>
            <p style={{ color: '#2c2d30ff', marginBottom: '30px' }}>
              Agrega metas de ahorro y asigna parte de tu ahorro mensual
            </p>

            {data.savingsAmount > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '25px',
                color: 'white'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>
                  Ahorro {getFrequencyText()} disponible
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  ${data.savingsAmount.toFixed(2)}
                </div>
                {data.goals.length > 0 && (
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '10px' }}>
                    {(() => {
                      const totalAllocated = data.goals.reduce((sum, g) => sum + (g.monthlyAllocation || 0), 0)
                      return `Asignado: ${totalAllocated.toFixed(2)} | Disponible: ${(data.savingsAmount - totalAllocated).toFixed(2)}`
                    })()}
                  </div>
                )}
              </div>
            )}

            <AddGoal 
              onAdd={g => setData({ ...data, goals: [...data.goals, g] })}
              availableSavings={data.savingsAmount}
              frequencyText={getFrequencyText()}
            />

            {data.goals.length > 0 && (
              <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                {data.goals.map((g, i) => (
                  <div key={i} style={{
                    padding: '15px',
                    background: '#f7fafc',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '5px' }}>
                      {g.title}
                    </div>
                    <div style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>
                      Meta: ${g.targetAmount} — {g.targetDate}
                    </div>
                    {g.monthlyAllocation > 0 && (
                      <div style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ${g.monthlyAllocation}/periodo del ahorro
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(4)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(6)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 6: Notificaciones */}
        {step === 6 && (
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#f9fafcff'
            }}>NOTIFICACIONES</h1>
            <p style={{ color: '#303336ff', marginBottom: '30px' }}>
              Configura cómo quieres recibir alertas
            </p>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                background: '#f7fafc',
                borderRadius: '12px',
                marginBottom: '15px',
                cursor: 'pointer',
                border: '2px solid #e2e8f0'
              }}>
                <input
                  type="checkbox"
                  checked={data.notifications.email}
                  onChange={e => setData({
                    ...data,
                    notifications: { ...data.notifications, email: e.target.checked }
                  })}
                  style={{ width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600', color: '#303130ff' }}>Notificaciones por Email</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                background: '#f7fafc',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '2px solid #e2e8f0'
              }}>
                <input
                  type="checkbox"
                  checked={data.notifications.push}
                  onChange={e => setData({
                    ...data,
                    notifications: { ...data.notifications, push: e.target.checked }
                  })}
                  style={{ width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600', color: '#303130ff' }}>Notificaciones Push</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(5)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#2d3748',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Atrás
              </button>
              <button
                onClick={finish}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AddGoal({ onAdd, availableSavings = 0 }) {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [monthlyAllocation, setMonthlyAllocation] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title || !targetAmount || !targetDate) return
    onAdd({ 
      title, 
      targetAmount: Number(targetAmount), 
      targetDate, 
      savedAmount: 0,
      monthlyAllocation: Number(monthlyAllocation) || 0
    })
    setTitle('')
    setTargetAmount('')
    setTargetDate('')
    setMonthlyAllocation('')
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        placeholder="Nombre de la meta"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          marginBottom: '10px',
          fontSize: '16px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      <input
        placeholder="Cantidad objetivo"
        type="number"
        value={targetAmount}
        onChange={e => setTargetAmount(e.target.value)}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          marginBottom: '10px',
          fontSize: '16px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      <input
        placeholder="Fecha objetivo"
        type="date"
        value={targetDate}
        onChange={e => setTargetDate(e.target.value)}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          marginBottom: '10px',
          fontSize: '16px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      {availableSavings > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <label style={{
            display: 'block',
            color: '#f6f7f8ff',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            ¿Cuánto del ahorro destinar a esta meta? (Opcional)
          </label>
          <input
            placeholder={`Máximo: ${availableSavings.toFixed(2)}`}
            type="number"
            value={monthlyAllocation}
            onChange={e => setMonthlyAllocation(e.target.value)}
            max={availableSavings}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      )}
      <button
        onClick={submit}
        type="button"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #f34d48ff 0%, #f34d48ff 100%)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Agregar meta
      </button>
    </div>
  )
}
