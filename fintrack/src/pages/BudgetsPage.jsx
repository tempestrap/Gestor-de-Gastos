import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchBudgets, createBudget } from '../api'

export default function BudgetsPage(){
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  useEffect(()=>{ fetchBudgets().then(setItems).catch(()=>{}) }, [])

  async function onAdd(e){
    e.preventDefault()
    const newB = await createBudget({ category, limit: Number(limit), spent: 0 })
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
          <ul>
            {items.map(b=> <li key={b.id}>{b.category} — ${b.spent}/${b.limit}</li>)}
          </ul>
        </section>
      </main>
    </div>
  )
}
