import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../AuthContext'
import { fetchGoals, createGoal, updateGoal } from '../api'
import Logo from '../assets/logo.svg'

function GoalCard({ g }){
  const saved = Number(g.savedAmount || 0)
  const target = Number(g.targetAmount || 0)
  const pct = target ? Math.min(100, Math.round((saved / target) * 100)) : 0
  return (
    <div className="card budget-item">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>{g.title}</div>
          <div className="muted" style={{fontSize:12}}>Meta: ${target} • Fecha: {g.targetDate ? new Date(g.targetDate).toLocaleDateString() : '—'}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:800,fontSize:16}}>${saved}</div>
          <div className="muted" style={{fontSize:12}}>{pct}% alcanzado</div>
        </div>
      </div>
      <div className="budget-progress" style={{marginTop:12}}>
        <i style={{width:`${pct}%`}}></i>
      </div>
    </div>
  )
}

export default function GoalsPage(){
  const { user } = useAuth()
  const [goals, setGoals] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title:'', targetAmount:'', targetDate:'', savedAmount:'' })
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    let mounted = true
    if (user?.id){
      fetchGoals(user.id).then(g=>{ if (mounted) setGoals(g) }).catch(err=>{ console.error('fetchGoals', err); if (mounted) setGoals([]) })
    } else setGoals([])
    return ()=> mounted = false
  }, [user])

  function openNew(){
    setEditing(null)
    setForm({ title:'', targetAmount:'', targetDate:'', savedAmount:'' })
  }

  function openEdit(g){
    setEditing(g)
    setForm({ title:g.title||'', targetAmount:String(g.targetAmount||''), targetDate:g.targetDate||'', savedAmount:String(g.savedAmount||'') })
  }

  async function submitForm(e){
    e.preventDefault()
    if (!user?.id) return alert('No user')
    if (!form.title || !form.targetAmount) return alert('Rellena título y monto objetivo')
    setSaving(true)
    try{
      if (editing){
        const updated = await updateGoal(editing.id, { title: form.title, targetAmount: Number(form.targetAmount), targetDate: form.targetDate || null, savedAmount: Number(form.savedAmount||0) })
        setGoals(prev => prev.map(p=> p.id === updated.id ? updated : p))
      } else {
        const created = await createGoal({ ownerId: user.id, title: form.title, targetAmount: Number(form.targetAmount), targetDate: form.targetDate || null, savedAmount: Number(form.savedAmount||0) })
        setGoals(prev => ([...(prev||[]), created]))
      }
      setEditing(null)
      setForm({ title:'', targetAmount:'', targetDate:'', savedAmount:'' })
    }catch(err){
      console.error('Save goal failed', err)
      alert(err.message || 'Error al guardar')
    }finally{ setSaving(false) }
  }

  // compute totals
  const totals = (goals || []).reduce((acc,g)=>{ acc.target+= Number(g.targetAmount||0); acc.saved+= Number(g.savedAmount||0); return acc }, { target:0, saved:0 })
  const totalPct = totals.target ? Math.round((totals.saved / totals.target)*100) : 0

  return (
    <div className="app">
      <Sidebar />
      <main>
        <div className="dashboard-container">
          <header className="topbar">
            <div className="brand-row">
              <img src={Logo} alt="Fintrack" className={`brand-logo brand-logo--contrast`} style={{width:56,height:56}} />
              <div>
                <h1>Metas</h1>
                <div className="subtitle">Tus objetivos de ahorro</div>
              </div>
            </div>
          </header>

          <section className="dashboard-grid">
            <div className="left">
              <div className="card">
                <div className="card-header"><div className="card-title">Metas guardadas</div></div>
                <div style={{padding:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <div style={{fontWeight:700}}>Tus metas</div>
                    <div>
                      <button className="btn" onClick={openNew} style={{marginRight:8}}>Nueva meta</button>
                      {editing && <button className="btn" onClick={()=>{ setEditing(null); setForm({ title:'', targetAmount:'', targetDate:'', savedAmount:'' }) }}>Cancelar</button>}
                    </div>
                  </div>

                  {goals === null ? (
                    <div className="muted">Cargando metas...</div>
                  ) : (
                    <>
                      {/* form for new/edit */}
                      <div style={{marginBottom:12}}>
                        <form onSubmit={submitForm} className="form-row" style={{gap:8,alignItems:'center'}}>
                          <input placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
                          <input className="small" placeholder="Objetivo" value={form.targetAmount} onChange={e=>setForm({...form, targetAmount:e.target.value})} />
                          <input className="small" placeholder="Ahorrado" value={form.savedAmount} onChange={e=>setForm({...form, savedAmount:e.target.value})} />
                          <input className="medium" type="date" value={form.targetDate} onChange={e=>setForm({...form, targetDate:e.target.value})} />
                          <button className="btn" disabled={saving}>{saving? 'Guardando...': (editing? 'Guardar' : 'Crear')}</button>
                        </form>
                      </div>

                      { (goals.length) ? (
                        <div style={{display:'grid',gap:12}}>
                          {goals.map((g,i)=>(
                            <div key={g.id} onDoubleClick={()=>openEdit(g)}>
                              <GoalCard g={g} />
                              <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
                                <button className="btn" onClick={()=>openEdit(g)}>Editar</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state">No tienes metas aún. Crea una usando el botón "Nueva meta".</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <aside className="right">
              <div className="card">
                <div className="card-header"><div className="card-title">Resumen de metas</div></div>
                <div style={{padding:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <div className="muted">Total objetivo</div>
                    <div style={{fontWeight:700}}>${totals.target}</div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <div className="muted">Total ahorrado</div>
                    <div style={{fontWeight:700}}>${totals.saved}</div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div className="muted">Progreso</div>
                    <div style={{fontWeight:800}}>{totalPct}%</div>
                  </div>
                  <div className="budget-progress" style={{marginTop:12}}>
                    <i style={{width:`${totalPct}%`}}></i>
                  </div>
                  <hr style={{border:'none',height:1,background:'rgba(10,20,30,0.04)',margin:'12px 0'}}/>
                  <div className="muted">Comparativas</div>
                  <div style={{marginTop:8,fontSize:13}}>
                    {totals.target ? (
                      <div>Has alcanzado <strong>{totalPct}%</strong> de tu objetivo total.</div>
                    ) : (
                      <div>No hay objetivos definidos.</div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  )
}
