import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchBudgets, createBudget } from '../api'
import { useAuth } from '../AuthContext'

export default function BudgetsPage(){
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  useEffect(()=>{
    if (user?.id) fetchBudgets(user.id).then(setItems).catch(()=>{})
  }, [user])

  async function onAdd(e){
    e.preventDefault()
    const payload = { category, limit: Number(limit), spent: 0 }
    if (user?.id) payload.ownerId = user.id
    const newB = await createBudget(payload)
    setItems(prev=>[...prev, newB])
    setCategory(''); setLimit('')
  }

  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar"><h1>Presupuestos</h1></header>
        <section className="card">
          <form onSubmit={onAdd} className="row">
            <input placeholder="Categoría" value={category} onChange={e=>setCategory(e.target.value)} />
            <input placeholder="Límite" value={limit} onChange={e=>setLimit(e.target.value)} type="number" />
            <button className="btn">Agregar</button>
          </form>
          {items.length ? (
            <ul>
              {items.map(b=> <li key={b.id}>{b.category} — ${b.spent}/{b.limit}</li>)}
            </ul>
          ) : (
            <div className="muted">Aún no tienes presupuestos. Agrégalos para empezar.</div>
          )}
        </section>
      </main>
    </div>
  )
}
