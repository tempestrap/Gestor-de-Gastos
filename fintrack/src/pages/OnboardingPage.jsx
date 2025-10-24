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
    initialBudget: 0,
    budgetsByCategory: [],
    goals: [],
    notifications: { email: true, push: false, thresholds: { budgetPercent: 80 } }
  })

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
      // res.user is a sanitized user object with onboarding
      if (res?.user) {
        // update auth context user so the app reflects onboarding immediately
        setUser(prev => ({ ...prev, ...res.user }))
      }
      // redirect to dashboard
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
            {[1, 2, 3, 4, 5].map(s => (
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
                {s < 5 && (
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
                  Monto aproximado mensual
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

              <div>
                <label style={{
                  display: 'block',
                  color: 'black',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}>
                  Fecha de ingreso recurrente
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

        {/* Paso 3: Presupuesto */}
        {step === 3 && (
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
                onChange={e => setData({ ...data, initialBudget: Number(e.target.value) })}
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

            <div style={{ marginBottom: '30px' }}>
              {data.frequentCategories.map((c, i) => (
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
                    onChange={e => {
                      const copy = [...data.budgetsByCategory]
                      copy[i] = { category: c, limit: Number(e.target.value), spent: 0 }
                      setData({ ...data, budgetsByCategory: copy })
                    }}
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
              ))}
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

        {/* Paso 4: Objetivos */}
        {step === 4 && (
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#f9fafcff'
            }}>OBJETIVOS FINANCIEROS</h1>
            <p style={{ color: '#2c2d30ff', marginBottom: '30px' }}>
              Agrega una meta de ahorro
            </p>

            <AddGoal onAdd={g => setData({ ...data, goals: [...data.goals, g] })} />

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
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>{g.title}</div>
                    <div style={{ color: '#718096', fontSize: '14px', marginTop: '5px' }}>
                      ${g.targetAmount} — {g.targetDate}
                    </div>
                  </div>
                ))}
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

        {/* Paso 5: Notificaciones */}
        {step === 5 && (
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

function AddGoal({ onAdd }) {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title || !targetAmount || !targetDate) return
    onAdd({ title, targetAmount: Number(targetAmount), targetDate, savedAmount: 0 })
    setTitle('')
    setTargetAmount('')
    setTargetDate('')
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
          marginBottom: '15px',
          fontSize: '16px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      <button
        onClick={submit}
        type="button"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #f34d48ff 0%, #f34d48ff 100%)',
          color: '#2d3748',
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
