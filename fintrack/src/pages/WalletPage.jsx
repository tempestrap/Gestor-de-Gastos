import React from 'react'
import Sidebar from '../components/Sidebar'

export default function WalletPage(){
  return (
    <div className="app">
      <Sidebar />
      <main>
        <header className="topbar"><h1>Tu cartera</h1></header>
        <section className="card">
          <p>Saldo actual: <strong>$1200.00</strong></p>
          <p>Saldo disponible: <strong>$600.00</strong></p>
          <h3>Tarjetas y cuentas</h3>
          <ul>
            <li>Vivienda — $2000 — Tarjeta de débito</li>
            <li>Compras — $600 — Tarjeta de crédito</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
