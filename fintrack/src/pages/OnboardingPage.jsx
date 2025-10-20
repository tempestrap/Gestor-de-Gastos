import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../AuthContext'
import { saveOnboarding } from '../api'

export default function OnboardingPage(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    frequentCategories: [],
    incomeSource: '',
    incomeAmount: 0,
    budgetsByCategory: [],
    goals: [],
    notifications: { email:true, push:false, thresholds: { budgetPercent:80 } }
  })

  function toggleCategory(cat){
    setData(prev => {
      const has = prev.frequentCategories.includes(cat)
      return { ...prev, frequentCategories: has ? prev.frequentCategories.filter(c=>c!==cat) : [...prev.frequentCategories, cat] }
    })
  }

  async function finish(){
    await saveOnboarding(user.id, data)
logout() // cerrar sesión
nav('/login') // regresar al login

  }

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar"><h1>Onboarding — Paso {step} de 5</h1></header>
        <section className="card">
          {step === 1 && (
            <div>
              <h3>Gastos frecuentes</h3>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['Vivienda','Compras','Transporte','Salud','Entretenimiento','Comida'].map(c=> (
                  <button key={c} onClick={()=>toggleCategory(c)} className={data.frequentCategories.includes(c)?'btn':'card'}>{c}</button>
                ))}
              </div>
              <div style={{marginTop:12}}>
                <button className="btn" onClick={()=>setStep(2)}>Siguiente</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3>Ingresos</h3>
              <label>Fuente<input value={data.incomeSource} onChange={e=>setData({...data, incomeSource: e.target.value})} /></label>
              <label>Monto mensual<input type="number" value={data.incomeAmount} onChange={e=>setData({...data, incomeAmount: Number(e.target.value)})} /></label>
              <div style={{marginTop:12}}>
                <button className="btn" onClick={()=>setStep(1)}>Atrás</button>
                <button className="btn" onClick={()=>setStep(3)}>Siguiente</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>Presupuesto inicial</h3>
              <label>Presupuesto total mensual<input type="number" onChange={e=>setData({...data, initialBudget: Number(e.target.value)})} /></label>
              <p>También puedes establecer límites por categoría</p>
              <div>
                {data.frequentCategories.map((c,i)=> (
                  <div key={c} style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
                    <div style={{width:120}}>{c}</div>
                    <input placeholder="Límite" type="number" onChange={e=>{
                      const copy = [...data.budgetsByCategory];
                      copy[i] = { category: c, limit: Number(e.target.value), spent: 0 };
                      setData({...data, budgetsByCategory: copy})
                    }} />
                  </div>
                ))}
              </div>
              <div style={{marginTop:12}}>
                <button className="btn" onClick={()=>setStep(2)}>Atrás</button>
                <button className="btn" onClick={()=>setStep(4)}>Siguiente</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3>Objetivos financieros</h3>
              <p>Agrega una meta de ahorro</p>
              <AddGoal onAdd={g=>setData({...data, goals: [...data.goals, g]})} />
              <ul>
                {data.goals.map((g,i)=> <li key={i}>{g.title} — ${g.targetAmount} — {g.targetDate}</li>)}
              </ul>
              <div style={{marginTop:12}}>
                <button className="btn" onClick={()=>setStep(3)}>Atrás</button>
                <button className="btn" onClick={()=>setStep(5)}>Siguiente</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3>Notificaciones</h3>
              <label><input type="checkbox" checked={data.notifications.email} onChange={e=>setData({...data, notifications:{...data.notifications, email:e.target.checked}})} /> Email</label>
              <label><input type="checkbox" checked={data.notifications.push} onChange={e=>setData({...data, notifications:{...data.notifications, push:e.target.checked}})} /> Push</label>
              <div style={{marginTop:12}}>
                <button className="btn" onClick={()=>setStep(4)}>Atrás</button>
                <button className="btn" onClick={finish}>Finalizar</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function AddGoal({ onAdd }){
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  function submit(e){
    e.preventDefault();
    onAdd({ title, targetAmount: Number(targetAmount), targetDate, savedAmount: 0 })
    setTitle(''); setTargetAmount(''); setTargetDate('')
  }
  return (
    <form onSubmit={submit} style={{display:'flex',gap:8,flexDirection:'column'}}>
      <input placeholder="Nombre de la meta" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Cantidad objetivo" type="number" value={targetAmount} onChange={e=>setTargetAmount(e.target.value)} />
      <input placeholder="Fecha objetivo" type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} />
      <button className="btn">Agregar meta</button>
    </form>
  )
}
