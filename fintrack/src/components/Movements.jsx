import React from 'react'

function CategoryIcon({ category }){
  const map = {
    'Vivienda': (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" fill="#fff"/></svg>),
    'Compras': (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-12z" fill="#fff"/></svg>),
    'Ingresos': (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2v20" stroke="#fff" strokeWidth="2"/></svg>),
    'Entretenimiento': (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#fff"/></svg>),
    'Transporte': (<svg width="20" height="20" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="6" fill="#fff"/></svg>),
    'Comida': (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M7 3v10" stroke="#fff" strokeWidth="2"/><path d="M17 3v10" stroke="#fff" strokeWidth="2"/></svg>)
  }
  return <div style={{width:44,height:44,display:'grid',placeItems:'center',borderRadius:10,background:'linear-gradient(90deg,var(--accent-b),var(--accent-a))',boxShadow:'var(--shadow-2)'}}>{map[category] ?? <span style={{color:'#fff'}}>•</span>}</div>
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
