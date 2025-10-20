import React from 'react'

function CategoryIcon({ category }){
  // simple emoji-based icons for now
  const map = {
    'Vivienda': '🏠',
    'Compras': '🛒',
    'Ingresos': '💼',
    'Entretenimiento': '🎮',
    'Transporte': '🚗',
    'Comida': '🍔'
  }
  return <div style={{width:44,height:44,display:'grid',placeItems:'center',borderRadius:10,background:'linear-gradient(90deg,var(--accent-b),var(--accent-a))'}}>{map[category] ?? '•'}</div>
}

export default function Movements({ items }){
  return (
    <div className="movements">
      {items?.length ? (
        <ul>
          {items.map(m=> (
            <li key={m.id} className={m.amount < 0 ? 'expense' : 'income'}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <CategoryIcon category={m.category} />
                <div className="mv-left">{m.title}<div className="mv-cat">{m.category}</div></div>
              </div>
              <div className="mv-right">${Math.abs(m.amount)}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="muted">Aún no hay movimientos.</div>
      )}
    </div>
  )
}
