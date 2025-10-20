import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { fetchBudgets, createBudget } from '../api'
import { useAuth } from '../AuthContext'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { FiTag } from 'react-icons/fi'

export default function BudgetsPage(){
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  useEffect(()=>{
    let mounted = true
    async function load(){
      if (user?.id) {
        const d = await fetchBudgets(user.id).catch(()=>[])
        if (mounted) setItems(d)
      }
    }
    load()
    const onData = ()=> load()
    window.addEventListener('dataUpdated', onData)
    return ()=>{ mounted = false; window.removeEventListener('dataUpdated', onData) }
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
          <form onSubmit={onAdd} className="row" style={{marginBottom:12}}>
            <input placeholder="Categoría" value={category} onChange={e=>setCategory(e.target.value)} />
            <input placeholder="Límite" value={limit} onChange={e=>setLimit(e.target.value)} type="number" />
            <button className="btn">Agregar</button>
          </form>
          {items.length ? (
            <div style={{display:'grid',gap:12}}>
              {items.map(b=> (
                <div key={b.id} className="budget-card">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:40,height:40,borderRadius:10,display:'grid',placeItems:'center',background:'linear-gradient(90deg,var(--accent-a),var(--accent-b))'}}><FiTag size={18} color="#072024"/></div>
                      <div>
                        <div style={{fontWeight:800}}>{b.category}</div>
                        <div className="muted" style={{fontSize:12}}>Límite ${b.limit}</div>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:800}}>${b.spent}</div>
                      <div className="muted" style={{fontSize:12}}>{Math.round(((b.spent||0)/(b.limit||1))*100)}% usado</div>
                    </div>
                  </div>
                  <div className="budget-progress" style={{marginTop:10}}>
                    <Tippy content={`Presupuesto ${b.category}: ${Math.round(((b.spent||0)/(b.limit||1))*100)}% gastado`}>
                      <i style={{width: `${Math.min(100, ((b.spent||0) / (b.limit||1)) * 100)}%`}}></i>
                    </Tippy>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">Aún no tienes presupuestos. Agrégalos para empezar.</div>
          )}
        </section>
      </main>
    </div>
  )
}
