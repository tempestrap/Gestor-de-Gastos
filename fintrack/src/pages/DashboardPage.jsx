import React, { useEffect, useState } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { FiArrowUpRight, FiArrowDownLeft, FiDollarSign } from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import { fetchDashboard, createMovement } from '../api'
import KpiCard from '../components/KpiCard'
import WalletPanel from '../components/WalletPanel'
import Movements from '../components/Movements'
import StatsChart from '../components/StatsChart'
import SavingsPanel from '../components/SavingsPanel'
import { useAuth } from "../AuthContext";
import Logo from '../assets/logo.svg'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const { user } = useAuth()
  const [mvTitle, setMvTitle] = useState('')
  const [mvAmount, setMvAmount] = useState('')
  const [mvCategory, setMvCategory] = useState('')
  const [mvType, setMvType] = useState('gasto')
  const [saving, setSaving] = useState(false)
  const [mvError, setMvError] = useState(null)
  const [mvSuccess, setMvSuccess] = useState(null)

  useEffect(() => {
    let mounted = true
    if (user?.id) {
      fetchDashboard(user.id).then(d => { if (mounted) setData(d) }).catch(console.error);
    } else {
      setData(null)
    }
    return () => { mounted = false }
  }, [user])

  async function submitMovement(e){
    e.preventDefault()
    setMvError(null)
    setMvSuccess(null)
  if (!mvTitle || !mvAmount) return setMvError('Rellena descripción y monto')
  // normalize possible comma or currency chars
  let amount = Number(String(mvAmount).replace(/[^0-9.-]+/g, ''))
  if (isNaN(amount)) return setMvError('Monto inválido')
  if (mvType === 'gasto' && amount > 0) amount = -Math.abs(amount)
  if (mvType === 'ingreso' && amount < 0) amount = Math.abs(amount)
  
  // Validar que no quede en negativo si es un gasto
  if (mvType === 'gasto') {
    const movements = data?.recent || []
    const incomesFromMov = movements.reduce((s,m)=> m.amount>0 ? s + Number(m.amount) : s, 0)
    const expensesFromMov = movements.reduce((s,m)=> m.amount<0 ? s + Math.abs(Number(m.amount)) : s, 0)
    const initialIncome = Number(user?.onboarding?.incomeAmount ?? user?.onboarding?.initialBudget ?? 0)
    const totalIngresos = initialIncome + incomesFromMov
    const totalGastos = expensesFromMov
    const disponibleActual = totalIngresos - totalGastos
    const disponibleDespuesDelGasto = disponibleActual + amount // amount es negativo
    
    if (disponibleDespuesDelGasto < 0) {
      return setMvError(`⚠️ No puedes realizar este gasto. Te quedarían $${disponibleDespuesDelGasto.toFixed(2)}. Solo tienes $${disponibleActual.toFixed(2)} disponibles.`)
    }
  }
  
    setSaving(true)
    try{
      // Build payload: do NOT include category for ingresos to avoid any
      // accidental budget updates on older servers or data inconsistencies.
      const payload = { userId: user.id, title: mvTitle, amount }
      if (mvType === 'gasto' && mvCategory) payload.category = mvCategory
      await createMovement(payload)
      const fresh = await fetchDashboard(user.id)
      setData(fresh)
      setMvTitle(''); setMvAmount(''); setMvCategory('')
      setMvSuccess('Movimiento guardado')
      // notify other pages to refresh data
      try { window.dispatchEvent(new Event('dataUpdated')) } catch(e){}
    }catch(err){
      console.error('Create mv failed', err)
      setMvError(err.message || 'Error al guardar movimiento')
    }finally{ setSaving(false) }
  }

  

  return (
    <div className="app">
      <Sidebar />

      <main>
        <div className="dashboard-container">
          <header className="topbar">
            <div className="brand-row">
              <img src={Logo} alt="Fintrack" className={`brand-logo brand-logo--contrast`} style={{width:56,height:56}} />
              <div>
                <h1>Bienvenido {user?.name ?? 'Usuario'}</h1>
                <div className="subtitle">Resumen de tu actividad</div>
              </div>
              
            </div>
          </header>

          <section className="dashboard-grid">
            <div className="left">
              <div className="kpi-row">
                {
                  (() => {
                    const movements = data?.recent || []
                    // sum incomes and expenses from movements
                    const incomesFromMov = movements.reduce((s,m)=> m.amount>0 ? s + Number(m.amount) : s, 0)
                    const expensesFromMov = movements.reduce((s,m)=> m.amount<0 ? s + Math.abs(Number(m.amount)) : s, 0)
                    // initial income from onboarding (incomeAmount or initialBudget)
                    const initialIncome = Number(user?.onboarding?.incomeAmount ?? user?.onboarding?.initialBudget ?? 0)
                    const totalIngresos = initialIncome + incomesFromMov
                    const totalGastos = expensesFromMov
                    const disponible = totalIngresos - totalGastos

                    return (
                      <>
                        <KpiCard title="Ingresos" value={`$${totalIngresos}`} icon={<FiArrowUpRight size={18} color="#0b69ff"/>} />
                        <KpiCard title="Gastos" value={`$${totalGastos}`} icon={<FiArrowDownLeft size={18} color="#d94600"/>} />
                        <KpiCard title="Disponible" value={`$${disponible}`} small icon={<FiDollarSign size={18} color="#065f46"/>} />
                      </>
                    )
                  })()
                }
              </div>

              {/* Alerta de bajo presupuesto */}
              {
                (() => {
                  const movements = data?.recent || []
                  const incomesFromMov = movements.reduce((s,m)=> m.amount>0 ? s + Number(m.amount) : s, 0)
                  const expensesFromMov = movements.reduce((s,m)=> m.amount<0 ? s + Math.abs(Number(m.amount)) : s, 0)
                  const initialIncome = Number(user?.onboarding?.incomeAmount ?? user?.onboarding?.initialBudget ?? 0)
                  const totalIngresos = initialIncome + incomesFromMov
                  const totalGastos = expensesFromMov
                  const disponible = totalIngresos - totalGastos
                  const porcentajeDisponible = initialIncome > 0 ? (disponible / initialIncome) * 100 : 100

                  if (porcentajeDisponible <= 10 && porcentajeDisponible > 0) {
                    return (
                      <div style={{
                        padding: '16px 20px',
                        backgroundColor: '#fff3cd',
                        border: '2px solid #ffc107',
                        borderRadius: '12px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          flexShrink: 0
                        }}>⚠️</div>
                        <div>
                          <div style={{
                            fontWeight: '700',
                            color: '#856404',
                            marginBottom: '4px',
                            fontSize: '15px'
                          }}>
                            ¡Advertencia! Te estás quedando sin dinero
                          </div>
                          <div style={{
                            color: '#856404',
                            fontSize: '14px'
                          }}>
                            Solo te queda el {porcentajeDisponible.toFixed(1)}% de tu ingreso inicial (${disponible.toFixed(2)} de ${initialIncome.toFixed(2)}). Controla tus gastos.
                          </div>
                        </div>
                      </div>
                    )
                  } else if (disponible <= 0) {
                    return (
                      <div style={{
                        padding: '16px 20px',
                        backgroundColor: '#f8d7da',
                        border: '2px solid #dc3545',
                        borderRadius: '12px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          flexShrink: 0
                        }}>🚨</div>
                        <div>
                          <div style={{
                            fontWeight: '700',
                            color: '#721c24',
                            marginBottom: '4px',
                            fontSize: '15px'
                          }}>
                            ¡Alerta! Te has quedado sin dinero
                          </div>
                          <div style={{
                            color: '#721c24',
                            fontSize: '14px'
                          }}>
                            Tu disponible es ${disponible.toFixed(2)}. No puedes realizar más gastos hasta que agregues ingresos.
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()
              }

              {/* Quick movement form placed under KPI cards for better visual hierarchy */}
              <div className="card quick-mv">
                <div className="card-header">
                  <div className="card-title">Registrar movimiento rápido</div>
                  <div className="actions" />
                </div>
                <form onSubmit={submitMovement} className="form-row form-quick">
                  <input placeholder="Descripción" value={mvTitle} onChange={e=>setMvTitle(e.target.value)} />
                  <Tippy content="Selecciona si es gasto o ingreso. Esto afecta el signo (gastos = negativo)">
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <select value={mvType} onChange={e=>setMvType(e.target.value)} style={{width:140,padding:10,borderRadius:8,border:'1px solid rgba(15,23,36,0.06)',background:'var(--card)'}}>
                        <option value="gasto">Gasto</option>
                        <option value="ingreso">Ingreso</option>
                      </select>
                      <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>Tipo: afecta el signo del monto</div>
                    </div>
                  </Tippy>
                  <input className="small" placeholder="Cantidad" value={mvAmount} onChange={e=>setMvAmount(e.target.value)} />
                  <input className="medium" placeholder="Categoría" value={mvCategory} onChange={e=>setMvCategory(e.target.value)} />
                  <button className="btn" disabled={saving}>{saving? 'Guardando...' : 'Registrar'}</button>
                </form>
                {mvError && <div className="error" style={{marginTop:8}}>{mvError}</div>}
                {mvSuccess && <div className="success" style={{marginTop:8}}>{mvSuccess}</div>}
              </div>

              {data?.savings && (
                <div style={{ marginBottom: '20px' }}>
                  <SavingsPanel savings={data.savings} />
                </div>
              )}

              <div className="card subtle">
                <div className="card-header">
                  <div className="card-title">Actividad</div>
                </div>
                {
                  (() => {
                    const recent = data?.recent || []
                    if (data?.statistics?.monthly?.length) return <StatsChart monthly={data.statistics.monthly} />
                    // aggregate by YYYY-MM
                    const byMonth = {}
                    recent.forEach(m => {
                      const d = new Date(m.date)
                      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
                      if (!byMonth[key]) byMonth[key] = { income:0, expenses:0, month: key }
                      if (m.amount > 0) byMonth[key].income += Number(m.amount)
                      else byMonth[key].expenses += Math.abs(Number(m.amount))
                    })
                    const monthly = Object.values(byMonth).sort((a,b)=> a.month.localeCompare(b.month))
                    return <StatsChart monthly={monthly} />
                  })()
                }
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">Movimientos recientes</div>
                </div>
                {data?.recent?.length ? <Movements items={data.recent} /> : <div className="empty-state">No hay movimientos todavía.</div>}
              </div>
            </div>

            <aside className="right">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Cartera</div>
                </div>
                {data ? <WalletPanel balances={data.balances} wallets={data.budgets?.map(b=>({ category: b.category, amount: b.spent, limit: b.limit }))} /> : <div className="muted">Cargando cartera...</div>}
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  )
}
