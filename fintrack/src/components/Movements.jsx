import React from 'react'

export default function Movements({ items }){
  return (
    <div className="card movements">
      <h3>Movimientos recientes</h3>
      <ul>
        {items?.map(m=> (
          <li key={m.id} className={m.amount < 0 ? 'expense' : 'income'}>
            <div className="mv-left">{m.title}<div className="mv-cat">{m.category}</div></div>
            <div className="mv-right">${m.amount}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
